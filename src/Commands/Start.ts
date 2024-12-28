import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command } from "dna-discord-framework";
import FactorioServerBotDataManager from "../FactorioServerBotDataManager";
import fs from "fs";
import FactorioServerCommands from "../FactorioServerCommands";

class Start extends Command {

    public CommandName: string = "start";

    public CommandDescription: string = "Starts the Factorio server";

    public IsEphemeralResponse: boolean = true;

    public IsCommandBlocking: boolean = false;

    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) =>
    {
        let dataManager = BotData.Instance(FactorioServerBotDataManager);
        let connectionInfo = `${dataManager.SERVER_HOSTNAME}:${dataManager.SERVER_PORT}`;

        if (!fs.existsSync(dataManager.WORLD_FILE))
            return this.AddToMessage("No World File Found. You can Generate a World using '/genworld' or Load a Backup using '/loadbackup'.");

        if (dataManager.SERVER_IS_ALIVE || await FactorioServerCommands.IsOnline())
            return this.AddToMessage("Server is already Running.");

        this.AddToMessage(`Starting Server...`);

        let startStatus = await FactorioServerCommands.Start();

        if (!startStatus || !(await FactorioServerCommands.IsOnline()))
            return this.AddToMessage("Error Starting Server. Please Check the Logs for more Information.");

        this.AddToMessage("Server Started!");
        this.AddToMessage("Connect to the Server using the Following Connection Info:");
        this.AddToMessage("```" + connectionInfo + "```");

        dataManager.WORLD_CHOSEN = true;
        dataManager.SERVER_START_TIME = new Date().getTime();
    }
}

export = Start;