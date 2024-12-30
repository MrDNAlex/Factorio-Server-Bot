"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const FactorioServerBotDataManager_1 = __importDefault(require("../FactorioServerBotDataManager"));
const FactorioServerCommands_1 = __importDefault(require("../FactorioServerCommands"));
const Time_1 = __importDefault(require("../Objects/Time"));
class Status extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = "status";
        this.CommandDescription = "Returns the Status of the Factorio Server";
        this.IsEphemeralResponse = true;
        this.IsCommandBlocking = false;
        this.RunCommand = async (client, interaction, BotDataManager) => {
            let dataManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default);
            let pingStatus = await FactorioServerCommands_1.default.IsOnline();
            let uptime = new Date().getTime() - dataManager.SERVER_START_TIME;
            let uptimeString = new Time_1.default(uptime).GetTimeAsString();
            let backupTime = new Date().getTime() - dataManager.LAST_BACKUP_DATE;
            let backupTimeString = new Time_1.default(backupTime).GetTimeAsString();
            this.AddFileToMessage(dataManager.SERVER_LOGS);
            if (!pingStatus)
                return this.AddToMessage("Server is Offline, Status cannot be retrieved.");
            dataManager.SERVER_MANAGER.PlayerDB.UpdateOnlinePlayers();
            this.AddToMessage(dataManager.SERVER_NAME);
            this.AddToMessage("\nPlayers Online: " + dataManager.SERVER_MANAGER.PlayerDB.OnlinePlayers.length);
            this.AddToMessage("Server Uptime: " + uptimeString);
            this.AddToMessage("Last Backup: " + backupTimeString);
            dataManager.SaveData();
        };
    }
}
module.exports = Status;
