import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BashScriptRunner, BotData, BotDataManager, Command } from "dna-discord-framework";
import FactorioServerBotDataManager from "../FactorioServerBotDataManager";
import FactorioServerCommands from "../Enums/FactorioServerCommands";


class Start extends Command {
    public CommandName: string = "start";
    public CommandDescription: string = "Starts the Factorio server";
    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) =>
    {
        let dataManager = BotData.Instance(FactorioServerBotDataManager)
        let runner = new BashScriptRunner();

        this.AddToMessage("Starting Server");

        runner.RunLocally(`./factorio ${FactorioServerCommands.StartServer} /home/factorio/World.zip`, true, dataManager.SERVER_EXECUTABLE_PATH)

        setTimeout(() => {
            console.log(runner.StandardOutputLogs);
        }, 10000);

        this.AddToMessage("Server started");

    }
    public IsEphemeralResponse: boolean = true;
    public IsCommandBlocking: boolean = false;
}

export = Start;