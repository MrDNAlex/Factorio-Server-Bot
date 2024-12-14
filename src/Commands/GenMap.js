"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const FactorioServerBotDataManager_1 = __importDefault(require("../FactorioServerBotDataManager"));
const FactorioServerCommands_1 = __importDefault(require("../Enums/FactorioServerCommands"));
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
class GenMap extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = "genmap";
        this.CommandDescription = "Generate a new map";
        //Documentation : https://wiki.factorio.com/Multiplayer
        this.RunCommand = async (client, interaction, BotDataManager) => {
            let dataManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default);
            let runner = new dna_discord_framework_1.BashScriptRunner();
            // Extract the Optional Settings
            const previewSize = interaction.options.getNumber("previewsize");
            const mapGenSettings = interaction.options.getAttachment("mapgensettings");
            // Define additional settings that will be added
            let additionalSettings = "";
            if (previewSize)
                additionalSettings += ` ${FactorioServerCommands_1.default.MapPreviewSize} ${previewSize}`;
            if (mapGenSettings) {
                await this.DownloadFile(mapGenSettings);
                additionalSettings += ` ${FactorioServerCommands_1.default.MapGenSettings} ${dataManager.WORLD_MAPGEN_SETTINGS}`;
            }
            this.AddToMessage("Generating Map...");
            //Generate the map and save to an image
            await runner.RunLocally(`./factorio ${additionalSettings} ${FactorioServerCommands_1.default.GenerateMapPreview} ${dataManager.WORLD_PREVIEW_IMAGE}`, true, dataManager.SERVER_EXECUTABLE_PATH).catch((err) => {
                console.log("Error generating map");
                console.log(err);
            });
            // Generate the World and Save to a zip file
            await runner.RunLocally(`./factorio ${FactorioServerCommands_1.default.Create} ${dataManager.WORLD_PREVIEW_FILE} `, true, dataManager.SERVER_EXECUTABLE_PATH).catch((err) => {
                console.log("Error generating map");
                console.log(err);
            });
            console.log(runner.StandardOutputLogs);
            // Check if the image was generated and the World file was created
            if (fs_1.default.existsSync(dataManager.WORLD_PREVIEW_IMAGE) && fs_1.default.existsSync(dataManager.WORLD_PREVIEW_FILE)) {
                // Check if the image is less than 25MB
                if (fs_1.default.fstatSync(fs_1.default.openSync(dataManager.WORLD_PREVIEW_IMAGE, 'r')).size < 1024 * 1024 * 25) {
                    //Send the image to the user 
                    this.AddToMessage("Map generated:");
                    this.AddFileToMessage(dataManager.WORLD_PREVIEW_IMAGE);
                    return;
                }
                this.AddToMessage("Map preview is too large to send, please download it from the server");
                return;
            }
            this.AddToMessage("Error generating map");
        };
        this.IsEphemeralResponse = true;
        this.IsCommandBlocking = false;
        this.Options = [
            {
                name: "previewsize",
                description: "Size of the map preview in pixels",
                required: false,
                type: dna_discord_framework_1.OptionTypesEnum.Number,
            },
            {
                name: "mapgensettings",
                description: "Settings file for the Map Generation, get the template from /help",
                required: false,
                type: dna_discord_framework_1.OptionTypesEnum.Attachment,
            }
        ];
    }
    /**
     * Donwloads the Map Generation Settings file
     * @param attachement The File to download
     * @returns Nothing
     */
    async DownloadFile(attachement) {
        let dataManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default);
        if (!attachement)
            return;
        try {
            const response = await (0, axios_1.default)({
                method: 'GET',
                url: attachement.url,
                responseType: 'stream',
            });
            let writer = fs_1.default.createWriteStream(dataManager.WORLD_MAPGEN_SETTINGS);
            await response.data.pipe(writer);
            return new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
        }
        catch (error) {
            console.error(`Failed to download the file: ${error}`);
        }
    }
}
module.exports = GenMap;
