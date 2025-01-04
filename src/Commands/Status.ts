import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command } from "dna-discord-framework";
import FactorioServerBotDataManager from "../FactorioServerBotDataManager";
import FactorioServerManager from "../FactorioServer/FactorioServerManager";
import Time from "../Objects/Time";
import { server } from "typescript";

class Status extends Command {

    public CommandName: string = "status";

    public CommandDescription: string = "Returns the Status of the Factorio Server";

    public IsEphemeralResponse: boolean = true;

    public IsCommandBlocking: boolean = false;

    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        let dataManager = BotData.Instance(FactorioServerBotDataManager);
        let serverManager = dataManager.SERVER_MANAGER;
        let pingStatus = await serverManager.IsOnline();
        let uptime = new Date().getTime() - serverManager.StartTime;
        let uptimeString = new Time(uptime).GetTimeAsString();
        let backupTime = new Date().getTime() - dataManager.LAST_BACKUP_DATE;
        let backupTimeString = new Time(backupTime).GetTimeAsString();

        this.AddFileToMessage(dataManager.SERVER_LOGS);

        if (!pingStatus) 
            return this.AddToMessage("Server is Offline, Status cannot be retrieved.");

        dataManager.SERVER_MANAGER.PlayerDB.Update();

        this.AddToMessage(dataManager.SERVER_NAME);
        this.AddToMessage("\nPlayers Online: " + dataManager.SERVER_MANAGER.PlayerDB.GetOnlinePlayers().length);
        this.AddToMessage("Server Uptime: " + uptimeString);
        this.AddToMessage("Last Backup: " + backupTimeString);

        dataManager.SaveData();
    }
}

export = Status;