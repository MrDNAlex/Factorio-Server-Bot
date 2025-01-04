import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command } from "dna-discord-framework";
import FactorioServerBotDataManager from "../FactorioServerBotDataManager";
import FactorioServerManager from "../FactorioServer/FactorioServerManager";

class Help extends Command {
    public CommandName: string = "help";

    public CommandDescription: string = "Displays helpful information about the bot and how to set up a Factorio Server";

    //Documentation : https://wiki.factorio.com/Multiplayer

    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) =>
    {
        let dataManager = BotData.Instance(FactorioServerBotDataManager)
    
        let genMapCommand = "'/genworld'";
        let createServerCommand = "'/start'";
        let setupCommand = "`/setup`";

        dataManager.Update();

        let message = `Hello! I am the Engineers Assistant! I am here to help you, the Engineer, set up a Factorio Server.`;

        this.AddToMessage(message);

        let createServer = `To create a server, you will need to do the following steps:
        1. Start by setting up the Servers Hostname/IP Address and Port using ${setupCommand}. Hostname/IP Address must be specified, is Port is not specified it will use the Default (8213).
2. Generate a World using ${genMapCommand}, you can modify World Generation Settings by adding a modified MapGenTemplate.json file. Repeat this step until you're satisfied with the World.
3. Now Start the Server using the command ${createServerCommand}.
        `;

        this.AddToMessage(createServer);

        this.AddFileToMessage(FactorioServerManager.MapGenTemplate);
    }

    public IsEphemeralResponse: boolean = true;
    public IsCommandBlocking: boolean = false;
}

export = Help;