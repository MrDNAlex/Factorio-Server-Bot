"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dna_discord_framework_1 = require("dna-discord-framework");
const fs_1 = __importDefault(require("fs"));
class FactorioServerBotDataManager extends dna_discord_framework_1.BotDataManager {
    constructor() {
        //Current World Files
        super(...arguments);
        this.BACKUP_DIRECTORY = "/home/factorio/Backups";
        this.BACKUP_FILE = "/home/factorio/Backups/WorldBackup.tar.gz";
        this.EXTRA_BACKUP_DIRECTORY = "/home/factorio/Backups/Extras";
        this.WORLD_FOLDER = "/home/factorio/World";
        this.WORLD_PREVIEW_IMAGE = "/home/factorio/World/Preview.png";
        this.WORLD_FILE = "/home/factorio/World/World.zip";
        this.WORLD_MAPGEN_SETTINGS = "/home/factorio/World/MapGenSettings.json";
        this.WORLD_INFO = "/home/factorio/World/WorldInfo.json";
        this.WORLD_CHOSEN = false;
        this.SERVER_LOGS = "/home/factorio/World/WORLD_LOG.txt";
        this.MAP_GEN_TEMPLATE = "/FactorioBot/src/Files/MapGenTemplate.json";
        this.SERVER_EXECUTABLE_PATH = "/Factorio/factorio/bin/x64";
        this.PREVIEWS_PATH = "/home/factorio/Previews";
        // The Default Port to Expose
        this.SERVER_PORT = 8213;
        //Server Host name / IP Address
        this.SERVER_HOSTNAME = "";
        this.SERVER_NAME = "Factorio Server";
        this.SERVER_IS_ALIVE = false;
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
}
exports.default = FactorioServerBotDataManager;
