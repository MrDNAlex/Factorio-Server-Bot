import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BashScriptRunner, BotData, BotDataManager, Command } from "dna-discord-framework";
import FactorioServerBotDataManager from "../FactorioServerBotDataManager";

class Shutdown extends Command {

    public CommandName: string = "shutdown";

    public CommandDescription: string = "Shutsdown the Server that is running";

    public IsEphemeralResponse: boolean = true;

    public IsCommandBlocking: boolean = true;

    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        let dataManager = BotData.Instance(FactorioServerBotDataManager);

        if (!dataManager.SERVER_IS_ALIVE || !(await this.IsServerOnline())) {
            dataManager.SERVER_IS_ALIVE = false;
            return this.AddToMessage("Server is not Running, Nothing to Shutdown");
        }

        this.AddToMessage("Shutting Down Server...");

        await this.ShutdownServer();

        if (!(await this.IsServerOnline())) {
            dataManager.SERVER_IS_ALIVE = false;
            return this.AddToMessage("Server is Offline.");
        }

        dataManager.SERVER_IS_ALIVE = true;
        this.AddToMessage("Error Shutting Down Server.");
        this.AddToMessage("Server is still Online.");
    }

    public async IsServerOnline() {
        let dataManager = BotData.Instance(FactorioServerBotDataManager);
        let serverStatus = new BashScriptRunner();
        let ranIntoError = false;
        let isServerRunningCommand = `pgrep -f "factorio --start-server /home/factorio/World/World.zip"`;

        await serverStatus.RunLocally(isServerRunningCommand, true).catch((err) => {
            ranIntoError = true;
            dataManager.AddErrorLog(err);
            console.log(`Error Checking Server Status : ${err}`);
        });

        let IDs = serverStatus.StandardOutputLogs.split("\n");

        IDs.forEach((id) => {
            id = id.trim();
        });

        IDs = IDs.filter((id) => id != " " && id != "");

        if (ranIntoError || IDs.length <= 1)
            return false;

        return true;
    }

    public async ShutdownServer() {
        let shutdown = new BashScriptRunner();
        let shutdownCommand = `pkill -f "factorio --start-server" || true`;
        let dataManager = BotData.Instance(FactorioServerBotDataManager);

        await shutdown.RunLocally(shutdownCommand, true).catch((err) => {
            if (err.code === undefined)
                return;

            dataManager.AddErrorLog(err);
        });

        return new Promise(resolve => setTimeout(resolve, 3000));
    }

}

export = Shutdown;