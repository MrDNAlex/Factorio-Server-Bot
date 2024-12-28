"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const FactorioServerBotDataManager_1 = __importDefault(require("../FactorioServerBotDataManager"));
const FactorioServerCommands_1 = __importDefault(require("../FactorioServerCommands"));
const promises_1 = __importDefault(require("fs/promises"));
class Backup extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = "backup";
        this.CommandDescription = "Creates a Backup of the Server";
        this.IsEphemeralResponse = true;
        this.IsCommandBlocking = false;
        this.MB_25 = 1024 * 1024 * 25;
        this.RunCommand = async (client, interaction, BotDataManager) => {
            let dataManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default);
            this.AddToMessage("Creating Backup of World...");
            let backupSuccess = await FactorioServerCommands_1.default.Backup();
            if (!backupSuccess)
                return this.AddToMessage("Error creating backup");
            this.AddToMessage("Backup Created Successfully!");
            const fileStats = await promises_1.default.stat(dataManager.BACKUP_FILE);
            if (fileStats.size < this.MB_25)
                this.AddFileToMessage(dataManager.BACKUP_FILE);
            else
                this.AddToMessage("Backup File is too large to send, please download it from the server");
        };
    }
    GetFileSize(fileStats) {
        let realsize;
        let sizeFormat;
        if (fileStats.size / (1024 * 1024) >= 1) {
            realsize = Math.floor(100 * fileStats.size / (1024 * 1024)) / 100;
            sizeFormat = "MB";
        }
        else if (fileStats.size / (1024) >= 1) {
            realsize = Math.floor(100 * fileStats.size / (1024)) / 100;
            sizeFormat = "KB";
        }
        else {
            realsize = fileStats.size;
            sizeFormat = "B";
        }
        return [realsize, sizeFormat];
    }
}
module.exports = Backup;
