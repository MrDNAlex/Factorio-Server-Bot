"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dna_discord_framework_1 = require("dna-discord-framework");
class FactorioServerBotDataManager extends dna_discord_framework_1.BotDataManager {
    constructor() {
        super(...arguments);
        this.SERVER_PATH = "/home/factorio/factorio";
        this.SERVER_EXECUTABLE_PATH = "/home/factorio/factorio/bin/x64";
        this.SERVER_EXECUTABLE = "/home/factorio/factorio/bin/x64/factorio";
    }
}
exports.default = FactorioServerBotDataManager;
