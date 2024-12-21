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
        this.IsCommandBlocking = false;
        this.MaxSeed = 2147483647;
        this.MB_25 = 1024 * 1024 * 25;
        this.RunCommand = async (client, interaction, BotDataManager) => {
            const previewSize = interaction.options.getInteger("previewsize");
            const mapGenSettings = interaction.options.getAttachment("mapgensettings");
            const userSeed = interaction.options.getInteger("seed");
            let previewImageSize = 1024;
            let seed = Math.floor(Math.random() * this.MaxSeed);
            let dataManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default);
            let runner = new dna_discord_framework_1.BashScriptRunner();
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
            //let imageCommand = worldInfo.GenImageCommand(previewImageSize);
            //let worldCommand = worldInfo.GenWorldCommand();
            //Generate The Map Preview and Save it as an image 
            await runner.RunLocally(worldInfo.GenImageCommand(previewImageSize), true).catch((err) => {
                this.AddToMessage("Error Generating World Image: ABORTING!");
                //console.log(imageCommand);
                console.log("Error generating map");
                console.log(err);
                return;
            });
            // Generate the World and Save to a ZIP file
            await runner.RunLocally(worldInfo.GenWorldCommand(), true).catch((err) => {
                this.AddToMessage("Error Generating World File: ABORTING!");
                //console.log(worldCommand);
                console.log("Error generating map");
                console.log(err);
                return;
            });
            // Log the outputs
            console.log(runner.StandardOutputLogs);
            if (!(fs_1.default.existsSync(worldInfo.WorldImage) && fs_1.default.existsSync(worldInfo.WorldFile)))
                return this.AddToMessage("Error generating map");
            if (!(fs_1.default.fstatSync(fs_1.default.openSync(worldInfo.WorldImage, 'r')).size < this.MB_25))
                return this.AddToMessage("Map preview is too large to send, please download it from the server");
            this.AddFileToMessage(worldInfo.WorldImage);
            if (dataManager.WORLD_CHOSEN)
                return this.AddToMessage("A World has already been Loaded. You can replace the world with what was generated using '/loadworld'");
            this.DeletePreviousWorldData();
            fs_1.default.cpSync(worldInfo.WorldImage, dataManager.WORLD_PREVIEW_IMAGE);
            fs_1.default.cpSync(worldInfo.WorldFile, dataManager.WORLD_FILE);
            fs_1.default.cpSync(worldInfo.WorldSettings, dataManager.WORLD_MAPGEN_SETTINGS);
            fs_1.default.cpSync(worldInfo.WorldInfo, dataManager.WORLD_INFO);
        };
        this.Options = [
            {
                name: "previewsize",
                description: "Size of the map preview PNG in pixels",
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
    DeletePreviousWorldData() {
        let dataManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default);
        const files = fs_1.default.readdirSync(dataManager.WORLD_FOLDER);
        for (const file of files) {
            const fullPath = path_1.default.join(dataManager.WORLD_FOLDER, file);
            const stat = fs_1.default.statSync(fullPath);
            if (stat.isDirectory())
                fs_1.default.rmSync(fullPath, { recursive: true, force: true });
            else
                fs_1.default.unlinkSync(fullPath);
        }
    }
}
module.exports = GenWorld;
