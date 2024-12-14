import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command } from "dna-discord-framework";
import FactorioServerBotDataManager from "../FactorioServerBotDataManager";

class Help extends Command {
    public CommandName: string = "help";

    public CommandDescription: string = "Displays helpful information about the bot and how to set up a Factorio Server";

    //Documentation : https://wiki.factorio.com/Multiplayer

    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) =>
    {
        let dataManager = BotData.Instance(FactorioServerBotDataManager)
    
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
    }

    public IsEphemeralResponse: boolean = true;
    public IsCommandBlocking: boolean = false;
}

export = Help;