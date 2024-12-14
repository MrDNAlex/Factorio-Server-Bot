"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const FactorioServerBotDataManager_1 = __importDefault(require("../FactorioServerBotDataManager"));
class Help extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = "help";
        this.CommandDescription = "Displays helpful information about the bot and how to set up a Factorio Server";
        //Documentation : https://wiki.factorio.com/Multiplayer
        this.RunCommand = async (client, interaction, BotDataManager) => {
            let dataManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default);
            let genMapCommand = "'/genmap'";
            let createServerCommand = "'/start'";
            let message = `Hello! I am the Engineers Assistant! I am here to help you, the Engineer, set up a Factorio Server.`;
            this.AddToMessage(message);
            let createServer = `To create a server, you will need to do the following steps:
        1. Generate a Map Preview using the command ${genMapCommand}, you can add additional parameters to the command to customize the map, and use the MapGenTemplate.json file to customize the map further.
2. Then you can Start the Server using the command ${createServerCommand}.
3. The Server will be created and you will be given the IP and Port to connect.
        `;
            this.AddToMessage(createServer);
            this.AddFileToMessage(dataManager.MAP_GEN_TEMPLATE);
        };
        this.IsEphemeralResponse = true;
        this.IsCommandBlocking = false;
    }
}
module.exports = Help;
