"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dna_discord_framework_1 = require("dna-discord-framework");
class FactorioServerBotDataManager extends dna_discord_framework_1.BotDataManager {
    constructor() {
        super(...arguments);
        this.MAP_GEN_TEMPLATE = "/FactorioBot/src/Files/map-gen-settings.json";
        this.SERVER_PATH = "/home/factorio/factorio";
        this.SERVER_EXECUTABLE_PATH = "/home/factorio/factorio/bin/x64";
        this.SERVER_EXECUTABLE = "/home/factorio/factorio/bin/x64/factorio";
        this.WORLD_PREVIEW_IMAGE = "/home/factorio/Preview.png";
        this.WORLD_PREVIEW_FILE = "/home/factorio/Preview.zip";
        this.WORLD_MAPGEN_SETTINGS = "/home/factorio/map-gen-settings.json";
    }
}
exports.default = FactorioServerBotDataManager;
