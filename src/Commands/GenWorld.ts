import { Client, ChatInputCommandInteraction, CacheType, TextChannel} from "discord.js";
import { BashScriptRunner, BotData, BotDataManager, BotMessage, Command, ICommandOption, OptionTypesEnum } from "dna-discord-framework";
import FactorioServerBotDataManager from "../FactorioServerBotDataManager";
import fs from "fs";
import path from "path";
import WorldInfo from "../WorldInfo";
import FactorioServerCommands from "../FactorioServerCommands";

class GenWorld extends Command {

    public CommandName: string = "genworld";

    public CommandDescription: string = "Creates a new World with a Preview Image.";

    public IsEphemeralResponse: boolean = true;

    public IsCommandBlocking: boolean = true;

    private MaxSeed: number = 2147483647;

    private MB_25 = 1024 * 1024 * 25;

    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        const previewSize = interaction.options.getInteger("previewsize");
        const mapGenSettings = interaction.options.getAttachment("mapgensettings");
        const userSeed = interaction.options.getInteger("seed");

        let previewImageSize = 1024;
        let seed = Math.floor(Math.random() * this.MaxSeed);
        let dataManager = BotData.Instance(FactorioServerBotDataManager);

        if (await FactorioServerCommands.IsOnline())
            return this.AddToMessage("Server cannot be Running when Generating a World.");

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
        this.AddToMessage("Generating World Image...");

        let worldImageStatus =  await this.GenerateWorldPreview(worldInfo, previewImageSize);

        if (!worldImageStatus || !(fs.existsSync(worldInfo.WorldImage)))
            return this.AddToMessage("Error Generatting World Image : Try Again");

        if (!(fs.fstatSync(fs.openSync(worldInfo.WorldImage, 'r')).size < this.MB_25))
            this.AddToMessage("Map Image is too large to send, please download it from the server");
        else
            this.AddFileToMessage(worldInfo.WorldImage);

        this.AddToMessage("Generating World File...");

        let worldFileStatus = await this.GenerateWorldFile(worldInfo);

        if (!worldFileStatus || !(fs.existsSync(worldInfo.WorldFile)))
            return this.AddToMessage("Error Generatting World File : Try Again");

        this.AddToMessage("World Generation Complete!");

        if (dataManager.WORLD_CHANNEL_SET)
            this.UploadWorldInfo(client, worldInfo);

        if (dataManager.WORLD_CHOSEN)
            return this.AddToMessage("A World has already been Loaded. You can replace the world with what was generated using '/loadworld'")

        this.ReplaceWorldData(worldInfo);       
    }

    /**
     * Deletes the Previous Data associated with the Seed
     */
    public DeleteFolder(directoryPath: string) {
        const files = fs.readdirSync(directoryPath);

        for (const file of files) {
            const fullPath = path.join(directoryPath, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory())
                fs.rmSync(fullPath, { recursive: true, force: true }); 
            else
                fs.unlinkSync(fullPath);
        }
    }

    public async UploadWorldInfo (client: Client, worldInfo: WorldInfo)
    {
        let dataManager = BotData.Instance(FactorioServerBotDataManager);
        let worldChannel = await client.channels.fetch(dataManager.WORLD_CHANNEL_ID) as TextChannel;
        let worldUploadMessage = new BotMessage(worldChannel);

        worldUploadMessage.AddMessage("New World Generated!");
        worldUploadMessage.AddMessage(`Seed: ${worldInfo.WorldSeed}`);

        if (fs.existsSync(worldInfo.WorldImage) && fs.fstatSync(fs.openSync(worldInfo.WorldImage, 'r')).size < this.MB_25)
            worldUploadMessage.AddFile(worldInfo.WorldImage);

        if (fs.existsSync(worldInfo.WorldFile) && fs.fstatSync(fs.openSync(worldInfo.WorldFile, 'r')).size < this.MB_25)
            worldUploadMessage.AddFile(worldInfo.WorldFile);

        if (fs.existsSync(worldInfo.WorldSettings) && fs.fstatSync(fs.openSync(worldInfo.WorldSettings, 'r')).size < this.MB_25)
            worldUploadMessage.AddFile(worldInfo.WorldSettings);

        if (fs.existsSync(worldInfo.WorldInfo) && fs.fstatSync(fs.openSync(worldInfo.WorldInfo, 'r')).size < this.MB_25)
            worldUploadMessage.AddFile(worldInfo.WorldInfo);
    }

    /**
     * Replaces the World Data that is loaded with the 
     * @param worldInfo 
     */
    public ReplaceWorldData (worldInfo: WorldInfo)
    {
        let dataManager = BotData.Instance(FactorioServerBotDataManager);

        this.DeleteFolder(dataManager.WORLD_FOLDER);

        fs.cpSync(worldInfo.WorldImage, dataManager.WORLD_PREVIEW_IMAGE);
        fs.cpSync(worldInfo.WorldFile, dataManager.WORLD_FILE);
        fs.cpSync(worldInfo.WorldSettings, dataManager.WORLD_MAPGEN_SETTINGS);
        fs.cpSync(worldInfo.WorldInfo, dataManager.WORLD_INFO);
    }

    /**
     * Generates a an Image of the World with the given Preview Size
     * @param worldInfo The World Info that needs to be generated
     * @param previewImageSize The Size of the World Image in Pixels (Width and Height)
     * @returns A Boolean Flag to indicate a successful generation of the World Image
     */
    public async GenerateWorldPreview (worldInfo: WorldInfo, previewImageSize: number)
    {
        let worldImageRunner = new BashScriptRunner();
        let success = true;

        await worldImageRunner.RunLocally(worldInfo.GenImageCommand(previewImageSize), true).catch((err) => {
            console.log("Error Generating World Image");
            console.log(err);
            success = false;
        });

        return success;
    }

    /**
     * Generates the World File for the Factorio Server (ZIP File)
     * @param worldInfo The World Info that needs to be generated
     * @returns A Boolean Flag to indicate a successful generation of the World Image
     */
    public async GenerateWorldFile (worldInfo: WorldInfo)
    {
        let worldFileRunner = new BashScriptRunner();
        let success = true;

        await worldFileRunner.RunLocally(worldInfo.GenWorldCommand(), true).catch((err) => {
            console.log("Error Generating World File");
            console.log(err);
            success = false;
            return;
        });

        return success;
    }

    Options: ICommandOption[] = [
        {
            name: "previewsize",
            description: "Size of the map preview PNG in pixels (Default is 1024)",
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