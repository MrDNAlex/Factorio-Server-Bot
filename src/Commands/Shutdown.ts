import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command } from "dna-discord-framework";
import FactorioServerBotDataManager from "../FactorioServerBotDataManager";
import FactorioServerCommand from "../FactorioServerCommands";

class Shutdown extends Command {

    public CommandName: string = "shutdown";

    public CommandDescription: string = "Shutsdown the Server that is running";

    public IsEphemeralResponse: boolean = true;

    public IsCommandBlocking: boolean = true;

    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        let dataManager = BotData.Instance(FactorioServerBotDataManager);

        if (!dataManager.SERVER_IS_ALIVE || !(await FactorioServerCommand.IsOnline())) {
            dataManager.SERVER_IS_ALIVE = false;
            return this.AddToMessage("Server is not Running, Nothing to Shutdown");
        }

        this.AddToMessage("Shutting Down Server...");

        await FactorioServerCommand.Shutdown();

        if (!(await FactorioServerCommand.IsOnline())) {
            dataManager.SERVER_IS_ALIVE = false;
            return this.AddToMessage("Server is Offline.");
        }

        dataManager.SERVER_IS_ALIVE = true;
        this.AddToMessage("Error Shutting Down Server.");
        this.AddToMessage("Server is still Online.");
    }

}

export = Shutdown;