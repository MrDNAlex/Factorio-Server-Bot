"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const FactorioServerBotDataManager_1 = __importDefault(require("../FactorioServerBotDataManager"));
const FactorioServerCommands_1 = __importDefault(require("../FactorioServerCommands"));
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
            dataManager.SERVER_IS_ALIVE = pingStatus;
            if (!pingStatus)
                return this.AddToMessage("Server is Offline, status cannot be retrieved.");
            this.AddToMessage(dataManager.SERVER_NAME);
            this.AddToMessage("\nPlayers Online: " + FactorioServerCommands_1.default.GetPlayerCount());
            this.AddFileToMessage(dataManager.SERVER_LOGS);
        };
    }
}
module.exports = Status;
