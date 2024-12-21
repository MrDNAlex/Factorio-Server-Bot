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
            let genMapCommand = "'/genworld'";
            let createServerCommand = "'/start'";
            let setupCommand = "`/setup`";
            let message = `Hello! I am the Engineers Assistant! I am here to help you, the Engineer, set up a Factorio Server.`;
            this.AddToMessage(message);
            let createServer = `To create a server, you will need to do the following steps:
        1. Start by setting up the Servers Hostname/IP Address and Port using ${setupCommand}. Hostname/IP Address must be specified, is Port is not specified it will use the Default (8213).
2. Generate a World using ${genMapCommand}, you can modify World Generation Settings by adding a modified MapGenTemplate.json file. Repeat this step until you're satisfied with the World.
3. Now Start the Server using the command ${createServerCommand}.
        `;
            this.AddToMessage(createServer);
            this.AddFileToMessage(dataManager.MAP_GEN_TEMPLATE);
        };
        this.IsEphemeralResponse = true;
        this.IsCommandBlocking = false;
    }
}
module.exports = Help;
