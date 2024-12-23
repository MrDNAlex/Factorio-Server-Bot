"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const FactorioServerBotDataManager_1 = __importDefault(require("../FactorioServerBotDataManager"));
class Shutdown extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = "shutdown";
        this.CommandDescription = "Shutsdown the Server that is running";
        this.IsEphemeralResponse = true;
        this.IsCommandBlocking = true;
        this.RunCommand = async (client, interaction, BotDataManager) => {
            let dataManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default);
            if (!dataManager.SERVER_IS_ALIVE || !(await this.IsServerOnline())) {
                dataManager.SERVER_IS_ALIVE = false;
                return this.AddToMessage("Server is not Running, Nothing to Shutdown");
            }
            await this.ShutdownServer();
            if (!(await this.IsServerOnline())) {
                dataManager.SERVER_IS_ALIVE = false;
                return this.AddToMessage("Server has been Shutdown Successfully");
            }
            dataManager.SERVER_IS_ALIVE = true;
            this.AddToMessage("Server is still Running");
        };
    }
    async IsServerOnline() {
        let dataManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default);
        let serverStatus = new dna_discord_framework_1.BashScriptRunner();
        let ranIntoError = false;
        let isServerRunningCommand = `pgrep -f "factorio --start-server /home/factorio/World/World.zip"`;
        await serverStatus.RunLocally(isServerRunningCommand, true).catch((err) => {
            ranIntoError = true;
            this.AddToMessage("Error Checking Server Status: ABORTING!");
            dataManager.AddErrorLog(err);
            console.log(`Error Checking Server Status : ${err}`);
        });
        let IDs = serverStatus.StandardOutputLogs.split("\n");
        IDs.forEach((id) => {
            id = id.trim();
        });
        IDs = IDs.filter((id) => id != " " && id != "");
        if (ranIntoError || IDs.length <= 1)
            return false;
        return true;
    }
    async ShutdownServer() {
        let shutdown = new dna_discord_framework_1.BashScriptRunner();
        let shutdownCommand = `pkill -f "factorio --start-server" || true`;
        let dataManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default);
        this.AddToMessage("Shutting Down Server");
        await shutdown.RunLocally(shutdownCommand, true).catch((err) => {
            if (err.code === undefined)
                return;
            this.AddToMessage("Error Shutting Down: ABORTING!");
            dataManager.AddErrorLog(err);
        });
        return new Promise(resolve => setTimeout(resolve, 3000));
    }
}
module.exports = Shutdown;
