import { Client, ChatInputCommandInteraction, CacheType, Attachment } from "discord.js";
import { BashScriptRunner, BotData, BotDataManager, Command, ICommandOption, OptionTypesEnum } from "dna-discord-framework";
import FactorioServerBotDataManager from "../FactorioServerBotDataManager";
import FactorioServerCommands from "../Enums/FactorioServerCommands";
import fs from "fs";
import axios from "axios";


class GenMap extends Command {
    public CommandName: string = "genmap";

    public CommandDescription: string = "Generate a new map";

    //Documentation : https://wiki.factorio.com/Multiplayer

    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) =>
    {
        let dataManager = BotData.Instance(FactorioServerBotDataManager)
        let runner = new BashScriptRunner();
    
        // Extract the Optional Settings
        const previewSize = interaction.options.getNumber("previewsize");
        const mapGenSettings = interaction.options.getAttachment("mapgensettings");

        // Define additional settings that will be added
        let additionalSettings = "";

        if (previewSize) 
            additionalSettings += ` ${FactorioServerCommands.MapPreviewSize} ${previewSize}`;

        if (mapGenSettings)
        {
            await this.DownloadFile(mapGenSettings);
            additionalSettings += ` ${FactorioServerCommands.MapGenSettings} ${dataManager.WORLD_MAPGEN_SETTINGS}`;
        }

        this.AddToMessage("Generating Map...");

        //Generate the map and save to an image
        await runner.RunLocally(`./factorio ${additionalSettings} ${FactorioServerCommands.GenerateMapPreview} ${dataManager.WORLD_PREVIEW_IMAGE}`, true, dataManager.SERVER_EXECUTABLE_PATH).catch((err) => {
            console.log("Error generating map");
            console.log(err);
        });

        // Generate the World and Save to a zip file
        await runner.RunLocally(`./factorio ${FactorioServerCommands.Create} ${dataManager.WORLD_PREVIEW_FILE} `, true, dataManager.SERVER_EXECUTABLE_PATH).catch((err) => {
            console.log("Error generating map");
            console.log(err);
        });

        console.log(runner.StandardOutputLogs);

        if (fs.existsSync(dataManager.WORLD_PREVIEW_IMAGE) && fs.existsSync(dataManager.WORLD_PREVIEW_FILE))
        {
            if (fs.fstatSync(fs.openSync(dataManager.WORLD_PREVIEW_IMAGE, 'r')).size < 1024*1024*25)
            {
                //Send the image to the user 
                this.AddToMessage("Map generated:");
                this.AddFileToMessage(dataManager.WORLD_PREVIEW_IMAGE);
                return;
            }

            this.AddToMessage("Map preview is too large to send, please download it from the server");
            return;
        }

        this.AddToMessage("Error generating map");
    }

    public async DownloadFile(attachement: Attachment | null) {
        let dataManager = BotData.Instance(FactorioServerBotDataManager)
        
        if (!attachement)
            return

        try {
            const response = await axios({
                method: 'GET',
                url: attachement.url,
                responseType: 'stream',
            });

            let writer = fs.createWriteStream(dataManager.WORLD_MAPGEN_SETTINGS);

            await response.data.pipe(writer);

            return new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
        } catch (error) {
            console.error(`Failed to download the file: ${error}`);
        }
    }

    public IsEphemeralResponse: boolean = true;
    public IsCommandBlocking: boolean = false;

    Options: ICommandOption[] = [
        {
            name: "previewsize",
            description: "Size of the map preview in pixels",
            required: false,
            type: OptionTypesEnum.Number,
        },
        {
            name: "mapgensettings",
            description: "Settings file for the Map Generation",
            required: false,
            type: OptionTypesEnum.Attachment,
        }
    ]
}

export = GenMap;