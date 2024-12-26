"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const FactorioServerBotDataManager_1 = __importDefault(require("../FactorioServerBotDataManager"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const WorldInfo_1 = __importDefault(require("../WorldInfo"));
class GenWorld extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = "genworld";
        this.CommandDescription = "Creates a new World with a Preview Image.";
        this.IsEphemeralResponse = true;
        this.IsCommandBlocking = true;
        this.MaxSeed = 2147483647;
        this.MB_25 = 1024 * 1024 * 25;
        this.RunCommand = async (client, interaction, BotDataManager) => {
            const previewSize = interaction.options.getInteger("previewsize");
            const mapGenSettings = interaction.options.getAttachment("mapgensettings");
            const userSeed = interaction.options.getInteger("seed");
            let previewImageSize = 1024;
            let seed = Math.floor(Math.random() * this.MaxSeed);
            let dataManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default);
            if (userSeed)
                seed = userSeed;
            if (previewSize)
                previewImageSize = previewSize;
            let worldInfo = new WorldInfo_1.default(seed);
            worldInfo.CreateFolder();
            await worldInfo.DownloadMapSettings(mapGenSettings);
            worldInfo.SaveWorldInfo();
            this.AddToMessage("Generating Map...");
            this.AddToMessage(`Seed: ${worldInfo.WorldSeed}`);
            this.AddToMessage("Generating World Image...");
            let worldImageStatus = await this.GenerateWorldPreview(worldInfo, previewImageSize);
            if (!worldImageStatus || !(fs_1.default.existsSync(worldInfo.WorldImage)))
                return this.AddToMessage("Error Generatting World Image : Try Again");
            if (!(fs_1.default.fstatSync(fs_1.default.openSync(worldInfo.WorldImage, 'r')).size < this.MB_25))
                this.AddToMessage("Map Image is too large to send, please download it from the server");
            else
                this.AddFileToMessage(worldInfo.WorldImage);
            this.AddToMessage("Generating World File...");
            let worldFileStatus = await this.GenerateWorldFile(worldInfo);
            if (!worldFileStatus || !(fs_1.default.existsSync(worldInfo.WorldFile)))
                return this.AddToMessage("Error Generatting World File : Try Again");
            this.AddToMessage("World Generation Complete!");
            if (dataManager.WORLD_CHANNEL_SET)
                this.UploadWorldInfo(client, worldInfo);
            if (dataManager.WORLD_CHOSEN)
                return this.AddToMessage("A World has already been Loaded. You can replace the world with what was generated using '/loadworld'");
            this.ReplaceWorldData(worldInfo);
        };
        this.Options = [
            {
                name: "previewsize",
                description: "Size of the map preview PNG in pixels (Default is 1024)",
                required: false,
                type: dna_discord_framework_1.OptionTypesEnum.Integer,
            },
            {
                name: "mapgensettings",
                description: "Settings file for the Map Generation, get the template from /help",
                required: false,
                type: dna_discord_framework_1.OptionTypesEnum.Attachment,
            },
            {
                name: "seed",
                description: "The seed for the map generation",
                required: false,
                type: dna_discord_framework_1.OptionTypesEnum.Integer,
            }
        ];
    }
    /**
     * Deletes the Previous Data associated with the Seed
     */
    DeleteFolder(directoryPath) {
        const files = fs_1.default.readdirSync(directoryPath);
        for (const file of files) {
            const fullPath = path_1.default.join(directoryPath, file);
            const stat = fs_1.default.statSync(fullPath);
            if (stat.isDirectory())
                fs_1.default.rmSync(fullPath, { recursive: true, force: true });
            else
                fs_1.default.unlinkSync(fullPath);
        }
    }
    async UploadWorldInfo(client, worldInfo) {
        let dataManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default);
        let worldChannel = await client.channels.fetch(dataManager.WORLD_CHANNEL_ID);
        let worldUploadMessage = new dna_discord_framework_1.BotMessage(worldChannel);
        worldUploadMessage.AddMessage("New World Generated!");
        worldUploadMessage.AddMessage(`Seed: ${worldInfo.WorldSeed}`);
        if (fs_1.default.existsSync(worldInfo.WorldImage) && fs_1.default.fstatSync(fs_1.default.openSync(worldInfo.WorldImage, 'r')).size < this.MB_25)
            worldUploadMessage.AddFile(worldInfo.WorldImage);
        if (fs_1.default.existsSync(worldInfo.WorldFile) && fs_1.default.fstatSync(fs_1.default.openSync(worldInfo.WorldFile, 'r')).size < this.MB_25)
            worldUploadMessage.AddFile(worldInfo.WorldFile);
        if (fs_1.default.existsSync(worldInfo.WorldSettings) && fs_1.default.fstatSync(fs_1.default.openSync(worldInfo.WorldSettings, 'r')).size < this.MB_25)
            worldUploadMessage.AddFile(worldInfo.WorldSettings);
        if (fs_1.default.existsSync(worldInfo.WorldInfo) && fs_1.default.fstatSync(fs_1.default.openSync(worldInfo.WorldInfo, 'r')).size < this.MB_25)
            worldUploadMessage.AddFile(worldInfo.WorldInfo);
    }
    /**
     * Replaces the World Data that is loaded with the
     * @param worldInfo
     */
    ReplaceWorldData(worldInfo) {
        let dataManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default);
        this.DeleteFolder(dataManager.WORLD_FOLDER);
        fs_1.default.cpSync(worldInfo.WorldImage, dataManager.WORLD_PREVIEW_IMAGE);
        fs_1.default.cpSync(worldInfo.WorldFile, dataManager.WORLD_FILE);
        fs_1.default.cpSync(worldInfo.WorldSettings, dataManager.WORLD_MAPGEN_SETTINGS);
        fs_1.default.cpSync(worldInfo.WorldInfo, dataManager.WORLD_INFO);
    }
    /**
     * Generates a an Image of the World with the given Preview Size
     * @param worldInfo The World Info that needs to be generated
     * @param previewImageSize The Size of the World Image in Pixels (Width and Height)
     * @returns A Boolean Flag to indicate a successful generation of the World Image
     */
    async GenerateWorldPreview(worldInfo, previewImageSize) {
        let worldImageRunner = new dna_discord_framework_1.BashScriptRunner();
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
    async GenerateWorldFile(worldInfo) {
        let worldFileRunner = new dna_discord_framework_1.BashScriptRunner();
        let success = true;
        await worldFileRunner.RunLocally(worldInfo.GenWorldCommand(), true).catch((err) => {
            console.log("Error Generating World File");
            console.log(err);
            success = false;
            return;
        });
        return success;
    }
}
module.exports = GenWorld;
