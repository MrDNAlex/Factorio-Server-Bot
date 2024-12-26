"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const discord_js_1 = require("discord.js");
const dna_discord_framework_1 = require("dna-discord-framework");
const FactorioServerBotDataManager_1 = __importDefault(require("../FactorioServerBotDataManager"));
class Start extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = "setup";
        this.CommandDescription = "Sets up the Server with the Appropriate Connection Info.";
        this.IsEphemeralResponse = true;
        this.IsCommandBlocking = false;
        this.RunCommand = async (client, interaction, BotDataManager) => {
            const port = interaction.options.getInteger("port");
            const hostname = interaction.options.getString("hostname");
            const worldChannel = interaction.options.getChannel("worldchannel");
            let dataManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default);
            if (!hostname)
                return this.AddToMessage("Server Hostname not specified, a Hostname/IP Address must be specified for connection.");
            dataManager.SERVER_HOSTNAME = hostname;
            if (port)
                dataManager.SERVER_PORT = port;
            if (worldChannel) {
                if (worldChannel.type != discord_js_1.ChannelType.GuildText)
                    return this.AddToMessage("World Channel must be a Text Channel");
                dataManager.WORLD_CHANNEL_ID = worldChannel.id;
                dataManager.WORLD_CHANNEL_SET = true;
            }
            let connectionInfo = `${dataManager.SERVER_HOSTNAME}:${dataManager.SERVER_PORT}`;
            let connectionMessage = "```" + connectionInfo + "```";
            this.AddToMessage("Server has Setup Successfully!");
            this.AddToMessage("Once Server is Started Connect using the following Address:");
            this.AddToMessage(connectionMessage);
            dataManager.SaveData();
        };
        this.Options = [
            {
                name: "hostname",
                description: "The HostName or IP Address of the Server",
                required: true,
                type: dna_discord_framework_1.OptionTypesEnum.String,
            },
            {
                name: "port",
                description: "The Port the Server will be Exposed on",
                required: false,
                type: dna_discord_framework_1.OptionTypesEnum.Integer,
            },
            {
                name: "worldchannel",
                description: "The Channel where Generated Worlds will be Sent and Shared",
                required: false,
                type: dna_discord_framework_1.OptionTypesEnum.Channel,
            }
        ];
    }
}
module.exports = Start;
