"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dna_discord_framework_1 = require("dna-discord-framework");
const fs_1 = __importDefault(require("fs"));
const FactorioServerManager_1 = __importDefault(require("./FactorioServer/FactorioServerManager"));
class FactorioServerBotDataManager extends dna_discord_framework_1.BotDataManager {
    constructor() {
        //Current World Files
        super(...arguments);
        this.SERVER_MANAGER = new FactorioServerManager_1.default();
        //BACKUP_DIRECTORY: string = "/home/factorio/Backups";
        //BACKUP_FILE: string = "/home/factorio/Backups/Backup.tar.gz";
        //EXTRA_BACKUP_DIRECTORY: string = "/home/factorio/Backups/Extras";
        //WORLD_FOLDER: string = "/home/factorio/World"
        //WORLD_PREVIEW_IMAGE: string = "/home/factorio/World/Preview.png";
        //WORLD_FILE: string = "/home/factorio/World/World.zip";
        //WORLD_MAPGEN_SETTINGS: string = "/home/factorio/World/MapGenSettings.json";
        //WORLD_INFO: string = "/home/factorio/World/WorldInfo.json";
        this.WORLD_CHOSEN = false;
        //SERVER_LOGS: string = "/home/factorio/World/WORLD_LOG.txt";
        //MAP_GEN_TEMPLATE: string = "/FactorioBot/src/Files/MapGenTemplate.json";
        //SERVER_EXECUTABLE_PATH: string = "/Factorio/factorio/bin/x64";
        //PREVIEWS_PATH: string = "/home/factorio/Previews";
        // The Default Port to Expose
        this.SERVER_PORT = 8213;
        //Server Host name / IP Address
        this.SERVER_HOSTNAME = "";
        this.SERVER_NAME = "Factorio Server";
        //SERVER_IS_ALIVE: boolean = false;
        this.SERVER_START_TIME = 0;
        this.WORLD_CHANNEL_SET = false;
        this.WORLD_CHANNEL_ID = "";
        this.LAST_BACKUP_DATE = 0;
    }
    CreateDirectories() {
        const world = "/home/factorio/World";
        const previews = "/home/factorio/Previews";
        const backups = "/home/factorio/Backups";
        const extras = "/home/factorio/Backups/Extras";
        if (!fs_1.default.existsSync(world))
            fs_1.default.mkdirSync(world, { recursive: true });
        if (!fs_1.default.existsSync(previews))
            fs_1.default.mkdirSync(previews, { recursive: true });
        if (!fs_1.default.existsSync(backups))
            fs_1.default.mkdirSync(backups, { recursive: true });
        if (!fs_1.default.existsSync(extras))
            fs_1.default.mkdirSync(extras, { recursive: true });
    }
    Update() {
        this.SERVER_MANAGER.PlayerDB.Update();
        this.SERVER_MANAGER.SaveWorldInfo(true);
        this.SaveData();
    }
}
exports.default = FactorioServerBotDataManager;
