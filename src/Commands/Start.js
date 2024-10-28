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
            console.log(runner.StandardOutputLogs);
            setTimeout(() => {
                console.log(runner.StandardOutputLogs);
            }, 10000);
            this.AddToMessage("Server started");
            //Documentation : https://wiki.factorio.com/Multiplayer
            //Generate the map and save to an image
            // await runner.RunLocally(`./factorio ${FactorioServerCommands.GenerateMapPreview} ./World.png`, true, dataManager.SERVER_EXECUTABLE_PATH).catch((err) => {
            //    this.AddToMessage("Error generating map");
            //   this.AddToMessage(err);
            // });
            //Send the image to the user
            // this.AddToMessage("Map generated:");
            // this.AddFileToMessage(`${dataManager.SERVER_EXECUTABLE_PATH}/World.png`);
        };
        this.IsEphemeralResponse = true;
        this.IsCommandBlocking = false;
    }
}
module.exports = Start;
