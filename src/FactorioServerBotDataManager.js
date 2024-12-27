"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dna_discord_framework_1 = require("dna-discord-framework");
class FactorioServerBotDataManager extends dna_discord_framework_1.BotDataManager {
    constructor() {
        super(...arguments);
        //Current World Files
        this.WORLD_FOLDER = "/home/factorio/World";
        this.WORLD_PREVIEW_IMAGE = "/home/factorio/World/Preview.png";
        this.WORLD_FILE = "/home/factorio/World/World.zip";
        this.WORLD_MAPGEN_SETTINGS = "/home/factorio/World/MapGenSettings.json";
        this.WORLD_INFO = "/home/factorio/World/WorldInfo.json";
        this.WORLD_CHOSEN = false;
        this.SERVER_LOGS = "/home/factorio/World/WORLD_LOG.txt";
        //FACTORIO_HOME_DIR: string = "/home/factorio";
        this.MAP_GEN_TEMPLATE = "/FactorioBot/src/Files/MapGenTemplate.json";
        //SERVER_PATH: string = `/Factorio/factorio`;
        this.SERVER_EXECUTABLE_PATH = "/Factorio/factorio/bin/x64";
        //SERVER_EXECUTABLE_PATH:string = "/home/factorio/factorio/bin/x64";
        //SERVER_EXECUTABLE:string = "/Factorio/factorio/bin/x64/factorio";
        this.PREVIEWS_PATH = "/home/factorio/Previews";
        // The Default Port to Expose
        this.SERVER_PORT = 8213;
        //Server Host name / IP Address
        this.SERVER_HOSTNAME = "";
        this.SERVER_NAME = "Factorio Server";
        this.SERVER_IS_ALIVE = false;
        this.WORLD_CHANNEL_SET = false;
        this.WORLD_CHANNEL_ID = "";
    }
}
exports.default = FactorioServerBotDataManager;
