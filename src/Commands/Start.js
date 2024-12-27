"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const FactorioServerBotDataManager_1 = __importDefault(require("../FactorioServerBotDataManager"));
const fs_1 = __importDefault(require("fs"));
const FactorioServerCommands_1 = __importDefault(require("../FactorioServerCommands"));
class Start extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = "start";
        this.CommandDescription = "Starts the Factorio server";
        this.IsEphemeralResponse = true;
        this.IsCommandBlocking = false;
        this.RunCommand = async (client, interaction, BotDataManager) => {
            let dataManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default);
            let connectionInfo = `${dataManager.SERVER_HOSTNAME}:${dataManager.SERVER_PORT}`;
            if (!fs_1.default.existsSync(dataManager.WORLD_FILE))
                return this.AddToMessage("No World File Found. You can Generate a World using '/genworld' or Load a Backup using '/loadbackup'.");
            if (dataManager.SERVER_IS_ALIVE || await FactorioServerCommands_1.default.IsOnline())
                return this.AddToMessage("Server is already Running.");
            this.AddToMessage(`Starting Server on Port ${dataManager.SERVER_PORT}`);
            let startStatus = await FactorioServerCommands_1.default.Start();
            if (!startStatus || !(await FactorioServerCommands_1.default.IsOnline()))
                return this.AddToMessage("Error Starting Server. Please Check the Logs for more Information.");
            this.AddToMessage("Server Started!");
            this.AddToMessage("Connect to the Server using the Following Connection Info:");
            this.AddToMessage("```" + connectionInfo + "```");
            dataManager.SERVER_IS_ALIVE = true;
            dataManager.WORLD_CHOSEN = true;
        };
    }
}
module.exports = Start;
