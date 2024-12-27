import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command } from "dna-discord-framework";
import FactorioServerBotDataManager from "../FactorioServerBotDataManager";
import FactorioServerCommands from "../FactorioServerCommands";

class Status extends Command {

    public CommandName: string = "status";

    public CommandDescription: string = "Returns the Status of the Factorio Server";

    public IsEphemeralResponse: boolean = true;

    public IsCommandBlocking: boolean = false;

    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        let dataManager = BotData.Instance(FactorioServerBotDataManager);
        let pingStatus = await FactorioServerCommands.IsOnline();

        dataManager.SERVER_IS_ALIVE = pingStatus;

        if (!pingStatus) 
            return this.AddToMessage("Server is Offline, status cannot be retrieved.");

        this.AddToMessage(dataManager.SERVER_NAME);
        this.AddToMessage("\nPlayers Online: " + FactorioServerCommands.GetPlayerCount());
        
        this.AddFileToMessage(dataManager.SERVER_LOGS);
    }
}

export = Status;