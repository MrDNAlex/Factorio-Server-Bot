"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const FactorioServerBotDataManager_1 = __importDefault(require("../FactorioServerBotDataManager"));
const FactorioServerCommands_1 = __importDefault(require("../Enums/FactorioServerCommands"));
class Start extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = "start";
        this.CommandDescription = "Starts the Factorio server";
        this.RunCommand = async (client, interaction, BotDataManager) => {
            let dataManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default);
            let runner = new dna_discord_framework_1.BashScriptRunner();
            this.AddToMessage("Starting Server");
            runner.RunLocally(`./factorio ${FactorioServerCommands_1.default.StartServer} /home/factorio/World.zip`, true, dataManager.SERVER_EXECUTABLE_PATH);
            setTimeout(() => {
                console.log(runner.StandardOutputLogs);
            }, 10000);
            this.AddToMessage("Server started");
        };
        this.IsEphemeralResponse = true;
        this.IsCommandBlocking = false;
    }
}
module.exports = Start;
