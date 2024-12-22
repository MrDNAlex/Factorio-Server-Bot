import { Client, ChatInputCommandInteraction, CacheType, underline } from "discord.js";
import { BashScriptRunner, BotData, BotDataManager, Command } from "dna-discord-framework";
import FactorioServerBotDataManager from "../FactorioServerBotDataManager";
import FactorioServerCommands from "../Enums/FactorioServerCommands";
import fs from "fs";

class Shutdown extends Command {

    public CommandName: string = "shutdown";

    public CommandDescription: string = "Shutsdown the Server that is running";

    public IsEphemeralResponse: boolean = true;

    public IsCommandBlocking: boolean = false;

    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) =>
    {
        let dataManager = BotData.Instance(FactorioServerBotDataManager);
        let runner = new BashScriptRunner();
        let errorCode = 0;

        this.AddToMessage(`Shutting Down Server`);

        if (!dataManager.SERVER_IS_ALIVE)
            return this.AddToMessage("Server is not Running, Nothing to Shutdown");

        await runner.RunLocally(`pgrep -f "factorio --start-server"`, true).catch((err) => {
            errorCode = err.code;

            if (err.code === undefined)
                return;

            this.AddToMessage("Error Checking Server Status: ABORTING!");
            dataManager.AddErrorLog(err);
            console.log("Error Checking Server Status");
            console.log(err);
        });

        if (errorCode != 0)
        {
            dataManager.SERVER_IS_ALIVE = false;
            return this.AddToMessage("Server is not Running or an Error Occurred");
        }
            
        await runner.RunLocally(`pkill -f "factorio --start-server" || true`, true).catch
        ((err) => {
            errorCode = err.code;

            if (err.code === undefined)
                return;

            this.AddToMessage("Error Shutting Down: ABORTING!");

            dataManager.AddErrorLog(err);
        });

        console.log(`Error Code: ${errorCode}`);

        if (errorCode == undefined)
        {
            dataManager.SERVER_IS_ALIVE = false;
            return this.AddToMessage("Server has been Shutdown Successfully");
        }

        dataManager.SERVER_IS_ALIVE = true;
        return this.AddToMessage("Server is still Running");
    }
}

export = Shutdown;