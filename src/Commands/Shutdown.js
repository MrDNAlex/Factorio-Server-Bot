"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const FactorioServerBotDataManager_1 = __importDefault(require("../FactorioServerBotDataManager"));
const FactorioServerCommands_1 = __importDefault(require("../FactorioServerCommands"));
class Shutdown extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = "shutdown";
        this.CommandDescription = "Shutsdown the Server that is running";
        this.IsEphemeralResponse = true;
        this.IsCommandBlocking = true;
        this.RunCommand = async (client, interaction, BotDataManager) => {
            let dataManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default);
            if (!dataManager.SERVER_IS_ALIVE || !(await FactorioServerCommands_1.default.IsOnline())) {
                dataManager.SERVER_IS_ALIVE = false;
                return this.AddToMessage("Server is not Running, Nothing to Shutdown");
            }
            this.AddToMessage("Shutting Down Server...");
            await FactorioServerCommands_1.default.Shutdown();
            if (!(await FactorioServerCommands_1.default.IsOnline())) {
                dataManager.SERVER_IS_ALIVE = false;
                return this.AddToMessage("Server is Offline.");
            }
            dataManager.SERVER_IS_ALIVE = true;
            this.AddToMessage("Error Shutting Down Server.");
            this.AddToMessage("Server is still Online.");
        };
    }
}
module.exports = Shutdown;
