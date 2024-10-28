"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const FactorioServerBotDataManager_1 = __importDefault(require("../FactorioServerBotDataManager"));
const FactorioServerCommands_1 = __importDefault(require("../Enums/FactorioServerCommands"));
class GenMap extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = "genmap";
        this.CommandDescription = "Generate a new map";
        this.RunCommand = async (client, interaction, BotDataManager) => {
            let dataManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default);
            let runner = new dna_discord_framework_1.BashScriptRunner();
            this.AddToMessage("Generating Map");
            //Documentation : https://wiki.factorio.com/Multiplayer
            //Generate the map and save to an image
            await runner.RunLocally(`./factorio ${FactorioServerCommands_1.default.GenerateMapPreview} ./World.png`, true, dataManager.SERVER_EXECUTABLE_PATH).catch((err) => {
                this.AddToMessage("Error generating map");
                this.AddToMessage(err);
            });
            await runner.RunLocally(`./factorio ${FactorioServerCommands_1.default.Create} /home/factorio/World.zip `, true, dataManager.SERVER_EXECUTABLE_PATH).catch((err) => {
                this.AddToMessage("Error generating map");
                this.AddToMessage(err);
            });
            console.log(runner.StandardOutputLogs);
            //Send the image to the user
            this.AddToMessage("Map generated:");
            this.AddFileToMessage(`${dataManager.SERVER_EXECUTABLE_PATH}/World.png`);
        };
        this.IsEphemeralResponse = true;
        this.IsCommandBlocking = false;
    }
}
module.exports = GenMap;
