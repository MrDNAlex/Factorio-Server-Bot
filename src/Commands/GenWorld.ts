import { Client, ChatInputCommandInteraction, CacheType, Attachment } from "discord.js";
import { BashScriptRunner, BotData, BotDataManager, Command, ICommandOption, OptionTypesEnum } from "dna-discord-framework";
import FactorioServerBotDataManager from "../FactorioServerBotDataManager";
import FactorioServerCommands from "../Enums/FactorioServerCommands";
import fs from "fs";
import axios from "axios";
import path from "path";
import WorldInfo from "../WorldInfo";

class GenWorld extends Command {

    public CommandName: string = "genworld";

    public CommandDescription: string = "Creates a new World with a Preview Image.";

    public IsEphemeralResponse: boolean = true;

    public IsCommandBlocking: boolean = false;

    private MaxSeed: number = 2147483647;

    private MB_25 = 1024 * 1024 * 25;

    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        const previewSize = interaction.options.getInteger("previewsize");
        const mapGenSettings = interaction.options.getAttachment("mapgensettings");
        const userSeed = interaction.options.getInteger("seed");

        let previewImageSize = 1024;
        let seed = Math.floor(Math.random() * this.MaxSeed);
        let dataManager = BotData.Instance(FactorioServerBotDataManager);
        let runner = new BashScriptRunner();

        if (userSeed)
            seed = userSeed;

        if (previewSize)
            previewImageSize = previewSize;

        let worldInfo = new WorldInfo(seed);

        worldInfo.CreateFolder();
        await worldInfo.DownloadMapSettings(mapGenSettings);
        worldInfo.SaveWorldInfo();

        this.AddToMessage("Generating Map...");
        this.AddToMessage(`Seed: ${worldInfo.WorldSeed}`);

        //Generate The Map Preview and Save it as an image 
        await runner.RunLocally(worldInfo.GenImageCommand(previewImageSize), true).catch((err) => {
            this.AddToMessage("Error Generating World Image: ABORTING!");
            console.log("Error generating map");
            console.log(err);
            return;
        });

        // Generate the World and Save to a ZIP file
        await runner.RunLocally(worldInfo.GenWorldCommand(), true).catch((err) => {
            this.AddToMessage("Error Generating World File: ABORTING!");
            console.log("Error generating map");
            console.log(err);
            return;
        });

        // Log the outputs
        console.log(runner.StandardOutputLogs);

        if (!(fs.existsSync(worldInfo.WorldImage) && fs.existsSync(worldInfo.WorldFile)))
            return this.AddToMessage("Error generating map");

        if (!(fs.fstatSync(fs.openSync(worldInfo.WorldImage, 'r')).size < this.MB_25))
            return this.AddToMessage("Map preview is too large to send, please download it from the server");

        this.AddFileToMessage(worldInfo.WorldImage);

        if (dataManager.WORLD_CHOSEN)
            return this.AddToMessage("A World has already been Loaded. You can replace the world with what was generated using '/loadworld'")

        this.DeletePreviousWorldData();

        fs.cpSync(worldInfo.WorldImage, dataManager.WORLD_PREVIEW_IMAGE);
        fs.cpSync(worldInfo.WorldFile, dataManager.WORLD_FILE);
        fs.cpSync(worldInfo.WorldSettings, dataManager.WORLD_MAPGEN_SETTINGS);
        fs.cpSync(worldInfo.WorldInfo, dataManager.WORLD_INFO);
    }

    public DeletePreviousWorldData() {
        let dataManager = BotData.Instance(FactorioServerBotDataManager)

        const files = fs.readdirSync(dataManager.WORLD_FOLDER);

        for (const file of files) {
            const fullPath = path.join(dataManager.WORLD_FOLDER, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory())
                fs.rmSync(fullPath, { recursive: true, force: true }); 
            else
                fs.unlinkSync(fullPath);
        }
    }

    Options: ICommandOption[] = [
        {
            name: "previewsize",
            description: "Size of the map preview PNG in pixels",
            required: false,
            type: OptionTypesEnum.Integer,
        },
        {
            name: "mapgensettings",
            description: "Settings file for the Map Generation, get the template from /help",
            required: false,
            type: OptionTypesEnum.Attachment,
        },
        {
            name: "seed",
            description: "The seed for the map generation",
            required: false,
            type: OptionTypesEnum.Integer,
        }
    ]
}

export = GenWorld;