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
        let playerDB = dataManager.SERVER_MANAGER.PlayerDB;


        dataManager.SERVER_IS_ALIVE = pingStatus;

        if (!pingStatus) 
            return this.AddToMessage("Server is Offline, Players cannot be retrieved.");
    
        playerDB.UpdateOnlinePlayers();

        this.AddToMessage(`${dataManager.SERVER_NAME} Players :`);
        this.AddToMessage("Players Online: ");

        if (playerDB.OnlinePlayers.length == 0)
            this.AddToMessage("No Players Online.");
        else
        {
            playerDB.OnlinePlayers.forEach(player => {
                this.AddToMessage(player);
            });
        }

        // Add a Offline Section
    }
}

export = Players;