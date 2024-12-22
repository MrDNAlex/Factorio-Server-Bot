"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const FactorioServerBotDataManager_1 = __importDefault(require("../FactorioServerBotDataManager"));
const FactorioServerCommands_1 = __importDefault(require("../Enums/FactorioServerCommands"));
const fs_1 = __importDefault(require("fs"));
class Start extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = "start";
        this.CommandDescription = "Starts the Factorio server";
        this.IsEphemeralResponse = true;
        this.IsCommandBlocking = false;
        this.RunCommand = async (client, interaction, BotDataManager) => {
            let dataManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default);
            let runner = new dna_discord_framework_1.BashScriptRunner();
            let connectionInfo = `${dataManager.SERVER_HOSTNAME}:${dataManager.SERVER_PORT}`;
            this.AddToMessage(`Starting Server on Port ${dataManager.SERVER_PORT}`);
            if (!fs_1.default.existsSync(dataManager.WORLD_FILE))
                return this.AddToMessage("No World File Found. You can Generate a World using '/genworld' or Load a Backup using '/loadbackup'.");
            runner.RunLocally(`factorio ${FactorioServerCommands_1.default.StartServer} ${dataManager.WORLD_FILE} --port ${dataManager.SERVER_PORT}`, true).catch((err) => {
                this.AddToMessage("Error Starting Server: ABORTING!");
                console.log("Error starting server");
                console.log(err);
                return;
            });
            //setTimeout(() => {
            //    console.log(runner.StandardOutputLogs);
            //    setTimeout(() => {
            //        console.log(runner.StandardOutputLogs);
            //        setTimeout(() => {
            //            console.log(runner.StandardOutputLogs);
            //        }, 20000);
            //    }, 20000);
            //}, 20000);
            this.AddToMessage("Server started");
            this.AddToMessage("Connect to the Server using the Following Connection Info:");
            this.AddToMessage(connectionInfo);
            dataManager.SERVER_IS_ALIVE = true;
            dataManager.WORLD_CHOSEN = true;
        };
    }
}
module.exports = Start;
