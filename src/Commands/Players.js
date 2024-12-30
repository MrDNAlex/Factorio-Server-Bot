"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const FactorioServerBotDataManager_1 = __importDefault(require("../FactorioServerBotDataManager"));
const FactorioServerCommands_1 = __importDefault(require("../FactorioServerCommands"));
class Players extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = "players";
        this.CommandDescription = "Returns the List of Online Players in the Factorio Server";
        this.IsEphemeralResponse = true;
        this.IsCommandBlocking = false;
        this.RunCommand = async (client, interaction, BotDataManager) => {
            let dataManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default);
            let pingStatus = await FactorioServerCommands_1.default.IsOnline();
            let playerDB = dataManager.SERVER_MANAGER.PlayerDB;
            dataManager.SERVER_IS_ALIVE = pingStatus;
            if (!pingStatus)
                return this.AddToMessage("Server is Offline, Players cannot be retrieved.");
            playerDB.UpdateOnlinePlayers();
            this.AddToMessage(`${dataManager.SERVER_NAME} Players :`);
            this.AddToMessage("Players Online: ");
            if (playerDB.OnlinePlayers.length == 0)
                this.AddToMessage("No Players Online.");
            else {
                playerDB.OnlinePlayers.forEach(player => {
                    this.AddToMessage(player);
                });
            }
            // Add a Offline Section
        };
    }
}
module.exports = Players;
