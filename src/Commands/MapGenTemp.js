"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const FactorioServerBotDataManager_1 = __importDefault(require("../FactorioServerBotDataManager"));
class MapGenTemp extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = "mapgentemp";
        this.CommandDescription = "Uploads the Map Generation Settings File";
        //Documentation : https://wiki.factorio.com/Multiplayer
        this.RunCommand = async (client, interaction, BotDataManager) => {
            let dataManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default);
            this.AddToMessage("Uploading Map Generation Settings...");
            this.AddFileToMessage(dataManager.MAP_GEN_TEMPLATE);
        };
        this.IsEphemeralResponse = true;
        this.IsCommandBlocking = false;
    }
}
module.exports = MapGenTemp;
