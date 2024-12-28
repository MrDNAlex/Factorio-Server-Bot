import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command } from "dna-discord-framework";
import FactorioServerBotDataManager from "../FactorioServerBotDataManager";
import FactorioServerCommands from "../FactorioServerCommands";

class Players extends Command {

    public CommandName: string = "players";

    public CommandDescription: string = "Returns the List of Online Players in the Factorio Server";

    public IsEphemeralResponse: boolean = true;

    public IsCommandBlocking: boolean = false;

    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        let dataManager = BotData.Instance(FactorioServerBotDataManager);

        let pingStatus = await FactorioServerCommands.IsOnline();
        dataManager.SERVER_IS_ALIVE = pingStatus;

        if (!pingStatus) 
            return this.AddToMessage("Server is Offline, Players cannot be retrieved.");
    
        let players = FactorioServerCommands.GetPlayers();

        this.AddToMessage(`${dataManager.SERVER_NAME} Players :`);
        this.AddToMessage("Players Online: ");

        if (players.length == 0)
            this.AddToMessage("No Players Online.");
        else
        {
            players.forEach(player => {
                this.AddToMessage(player);
            });
        }


        // Add a Offline Section
    }
}

export = Players;