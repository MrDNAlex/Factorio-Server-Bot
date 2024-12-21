"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dna_discord_framework_1 = require("dna-discord-framework");
const axios_1 = __importDefault(require("axios"));
const FactorioServerCommands_1 = __importDefault(require("./Enums/FactorioServerCommands"));
const FactorioServerBotDataManager_1 = __importDefault(require("./FactorioServerBotDataManager"));
const fs_1 = __importDefault(require("fs"));
class WorldInfo {
    constructor(seed) {
        let dataManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default);
        this.WorldImageSize = 1024;
        this.WorldSeed = seed;
        this.WorldDirectory = `${dataManager.PREVIEWS_PATH}/SEED_${seed}`;
        this.WorldSettings = `${this.WorldDirectory}/MapGenSettings.json`;
        this.WorldInfo = `${this.WorldDirectory}/WorldInfo.json`;
        this.WorldImage = `${this.WorldDirectory}/Preview.png`;
        this.WorldFile = `${this.WorldDirectory}/World.zip`;
    }
    CreateFolder() {
        if (!fs_1.default.existsSync(this.WorldDirectory))
            fs_1.default.mkdirSync(this.WorldDirectory);
    }
    async DownloadMapSettings(mapGenSettings) {
        let dataManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default);
        if (mapGenSettings)
            await this.DownloadFile(mapGenSettings, this.WorldSettings);
        else
            fs_1.default.cpSync(dataManager.MAP_GEN_TEMPLATE, this.WorldSettings);
    }
    SaveWorldInfo() {
        fs_1.default.writeFileSync(this.WorldInfo, JSON.stringify(this, null, 4));
    }
    GenImageCommand(imageSize) {
        this.WorldImageSize = imageSize;
        return `factorio ${FactorioServerCommands_1.default.GenerateMapPreview} ${this.WorldImage} ${FactorioServerCommands_1.default.MapGenSettings} ${this.WorldSettings}  ${FactorioServerCommands_1.default.MapPreviewSize} ${this.WorldImageSize} ${FactorioServerCommands_1.default.MapGenSeed} ${this.WorldSeed}`;
    }
    GenWorldCommand() {
        return `factorio ${FactorioServerCommands_1.default.Create} ${this.WorldFile}  ${FactorioServerCommands_1.default.MapGenSettings} ${this.WorldSettings} ${FactorioServerCommands_1.default.MapGenSeed} ${this.WorldSeed}`;
    }
    /**
     * Donwloads the Map Generation Settings file
     * @param attachement The File to download
     * @param downloadPath The Path and File Name to Download as
     * @returns Nothing
     */
    async DownloadFile(attachement, downloadPath) {
        if (!attachement)
            return;
        try {
            const response = await (0, axios_1.default)({
                method: 'GET',
                url: attachement.url,
                responseType: 'stream',
            });
            let writer = fs_1.default.createWriteStream(downloadPath);
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
exports.default = WorldInfo;
