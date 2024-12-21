import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BashScriptRunner, BotData, BotDataManager, Command } from "dna-discord-framework";
import FactorioServerBotDataManager from "../FactorioServerBotDataManager";
import FactorioServerCommands from "../Enums/FactorioServerCommands";
import fs from "fs";

class Start extends Command {

    public CommandName: string = "start";

    public CommandDescription: string = "Starts the Factorio server";

    public IsEphemeralResponse: boolean = true;

    public IsCommandBlocking: boolean = false;

    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) =>
    {
        let dataManager = BotData.Instance(FactorioServerBotDataManager);
        let runner = new BashScriptRunner();
        let connectionInfo = `${dataManager.SERVER_HOSTNAME}:${dataManager.SERVER_PORT}`;

        this.AddToMessage(`Starting Server on Port ${dataManager.SERVER_PORT}`);

        if (!fs.existsSync(dataManager.WORLD_FILE))
            return this.AddToMessage("No World File Found. You can Generate a World using '/genworld' or Load a Backup using '/loadbackup'.");

        runner.RunLocally(`factorio ${FactorioServerCommands.StartServer} ${dataManager.WORLD_FILE} --port ${dataManager.SERVER_PORT}`, true).catch
        ((err) => {
            this.AddToMessage("Error Starting Server: ABORTING!");
            console.log("Error starting server");
            console.log(err);
            return;
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
        this.AddToMessage("Connect to the Server using the Following Connection Info:");
        this.AddToMessage(connectionInfo);

        dataManager.WORLD_CHOSEN = true;
    }
}

export = Start;