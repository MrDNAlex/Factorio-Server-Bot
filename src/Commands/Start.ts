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

        runner.RunLocally(`./factorio ${FactorioServerCommands.StartServer} ${dataManager.WORLD_PREVIEW_FILE} --port 8213`, true, dataManager.SERVER_EXECUTABLE_PATH).catch
        ((err) => {
            console.log("Error starting server");
            console.log(err);
        });

        setTimeout(() => {
            console.log(runner.StandardOutputLogs);
            setTimeout(() => {
                console.log(runner.StandardOutputLogs);
                setTimeout(() => {
                    console.log(runner.StandardOutputLogs);
                }, 20000);
            }, 20000);
        }, 20000);

        this.AddToMessage("Server started");

    }
    public IsEphemeralResponse: boolean = true;
    public IsCommandBlocking: boolean = false;
}

export = Start;