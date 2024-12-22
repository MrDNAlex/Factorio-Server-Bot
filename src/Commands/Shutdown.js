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
        this.IsCommandBlocking = false;
        this.RunCommand = async (client, interaction, BotDataManager) => {
            let dataManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default);
            let runner = new dna_discord_framework_1.BashScriptRunner();
            let connectionInfo = `${dataManager.SERVER_HOSTNAME}:${dataManager.SERVER_PORT}`;
            let errorCode = 0;
            this.AddToMessage(`Shutting Down Server`);
            if (!dataManager.SERVER_IS_ALIVE)
                return this.AddToMessage("Server is not Running, Nothing to Shutdown");
            await runner.RunLocally(`pgrep -f "factorio --start-server"`, true).catch((err) => {
                errorCode = err.code;
                if (err.code === undefined)
                    return;
                this.AddToMessage("Error Checking Server Status: ABORTING!");
                console.log("Error Checking Server Status");
                console.log(err);
            });
            console.log(`Error Code1 : ${errorCode}`);
            //if (!fs.existsSync(dataManager.WORLD_FILE))
            //    return this.AddToMessage("No World File Found. You can Generate a World using '/genworld' or Load a Backup using '/loadbackup'.");
            //kill $(pgrep -f "factorio --start-server")
            //pkill -f "factorio --start-server" || true
            await runner.RunLocally(`pkill -f "factorio --start-server" || true`, true).catch((err) => {
                errorCode = err.code;
                if (err.code === undefined)
                    return;
                this.AddToMessage("Error Shutting Down: ABORTING!");
                console.log("Error Shutting Down server");
                console.log(err);
            });
            console.log(`Error Code: ${errorCode}`);
            if (errorCode == undefined) {
                dataManager.SERVER_IS_ALIVE = false;
                return this.AddToMessage("Server has been Shutdown Successfully");
            }
            dataManager.SERVER_IS_ALIVE = true;
            return this.AddToMessage("Server is still Running");
        };
    }
}
module.exports = Shutdown;
