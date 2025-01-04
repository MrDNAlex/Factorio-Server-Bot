import { BashScriptRunner, BotData } from "dna-discord-framework";
import PlayerDatabase from "./PlayerDatabase";
import FactorioServerBotDataManager from "../FactorioServerBotDataManager";
import fs from "fs";
import BackupManager from "../BackupManager";
import FactorioExecutableCommands from "../Enums/FactorioExecutableCommands";

class FactorioServerManager {

    /**
     * Name of the Server
     */
    Name: string;

    /**
     * Flag to check if a World has been Chosen or World Generation to set it is still needed
     */
    WorldChosen: boolean;

    /**
     * Player Database for the Server
     */
    PlayerDB: PlayerDatabase;

    /**
     * Time to Wait for the Server to Shutdown
     */
    ActionWaitTime = 3000;

    /**
     * Time the Server was Started
     */
    StartTime: number;

    /**
     * World Generation Seed
     */
    WorldSeed: number;

    public WorldDirectory: string;

    public WorldSettings: string;

    public WorldImage: string;

    public WorldFile: string;

    public WorldImageSize: number;

    public WorldInfo: string;

    //public BackupWorldDirectory: string;
    //
    //public BackupWorldSettings: string;
    //
    //public BackupWorldImage: string;
    //
    //public BackupWorldFile: string;
    //
    //public BackupWorldInfo: string;

    // Files

    public static WorldDirectory = "/home/factorio/World";

    public static WorldImagePath = "/home/factorio/World/Preview.png";

    public static WorldFilePath = "/home/factorio/World/World.zip";

    public static WorldSettingsPath = "/home/factorio/World/MapGenSettings.json";

    public static WorldInfoPath = "/home/factorio/World/WorldInfo.json";

    constructor(data?: any) {

        if (data) {
            this.Name = data.Name;
            this.WorldChosen = data.WorldChosen;
            this.PlayerDB = new PlayerDatabase(data.PlayerDB);
            this.StartTime = data.StartTime;
            this.WorldSeed = data.WorldSeed;

            this.WorldDirectory = data.WorldDirectory;
            this.WorldSettings = data.WorldSettings;
            this.WorldImage = data.WorldImage;
            this.WorldFile = data.WorldFile;
            this.WorldImageSize = data.WorldImageSize;
            this.WorldInfo = data.WorldInfo;

            //this.BackupWorldDirectory = data.BackupWorldDirectory;
            //this.BackupWorldSettings = data.BackupWorldSettings;
            //this.BackupWorldImage = data.BackupWorldImage;
            //this.BackupWorldFile = data.BackupWorldFile;
            //this.BackupWorldInfo = data.BackupWorldInfo;

        } else {
            this.Name = "Factorio Server";
            this.StartTime = 0;
            this.WorldChosen = false;
            this.PlayerDB = new PlayerDatabase();
            this.WorldSeed = 0;

            this.WorldDirectory = "";
            this.WorldSettings = "";
            this.WorldImage = "";
            this.WorldFile = "";
            this.WorldInfo = "";
            //this.BackupWorldDirectory = "";
            //this.BackupWorldSettings = "";
            //this.BackupWorldImage = "";
            //this.BackupWorldFile = "";
            //this.BackupWorldInfo = "";
            this.WorldImageSize = 0;
        }
    }

    public AllFilesExist() {
        return fs.existsSync(this.WorldSettings) && fs.existsSync(this.WorldInfo) && fs.existsSync(this.WorldImage) && fs.existsSync(this.WorldFile);
    }

    //public AllBackupFilesExist() {
    //    return fs.existsSync(this.BackupWorldSettings) && fs.existsSync(this.BackupWorldInfo) && fs.existsSync(this.BackupWorldImage) && fs.existsSync(this.BackupWorldFile);
    //}

    /**
     * Pings the Factorio Server to see if it is online
     * @returns Returns a Boolean Flag | True if the Server is Online, False if the Server is Offline
     */
    public async IsOnline(): Promise<boolean> {
        let dataManager = BotData.Instance(FactorioServerBotDataManager);
        let serverStatus = new BashScriptRunner();
        let ranIntoError = false;
        let isServerRunningCommand = `pgrep -f "factorio ${FactorioExecutableCommands.StartServer} ${FactorioServerManager.WorldFilePath}"`;

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

    /**
     * Starts the Factorio Server
     * @returns Returns a Boolean Flag | True if the Server was Started, False if the Server was not Started
     */
    public async Start(): Promise<boolean> {
        let start = new BashScriptRunner();
        let dataManager = BotData.Instance(FactorioServerBotDataManager);
        let startCommand = `factorio ${FactorioExecutableCommands.StartServer} ${FactorioServerManager.WorldFilePath} --port ${dataManager.SERVER_PORT} > ${dataManager.SERVER_LOGS} 2>&1 &`;
        let success = true;

        start.RunLocally(startCommand, true).catch((err) => {
            if (err.code === undefined)
                return;

            success = false;
            console.log("Error starting server");
            console.log(err);
        });

        return new Promise(resolve => setTimeout(() => {
            if (success)
                this.StartTime = new Date().getTime();

            resolve(success);
        }, this.ActionWaitTime));
    }

    /**
     * Tries to Shutdown the Factorio Server
     * @returns Returns a Boolean Flag | True if the Server was Shutdown, False if the Server was not Shutdown
     */
    public async Shutdown(): Promise<boolean> {
        let shutdown = new BashScriptRunner();
        let shutdownCommand = `pkill -f "factorio --start-server" || true`;
        let dataManager = BotData.Instance(FactorioServerBotDataManager);
        let success = true;

        await shutdown.RunLocally(shutdownCommand, true).catch((err) => {
            if (err.code === undefined)
                return;

            success = false;
            dataManager.AddErrorLog(err);
        });

        return new Promise(resolve => setTimeout(() => resolve(success), this.ActionWaitTime));
    }

    /**
     * Gets the List of Online Players in the Factorio Server
     */
    public GetPlayers() {
        let dataManager = BotData.Instance(FactorioServerBotDataManager);
        const lines = fs.readFileSync(dataManager.SERVER_LOGS, 'utf8').split("\n");
        const joins = lines.filter((line) => line.includes("[JOIN]"));
        const leaves = lines.filter((line) => line.includes("[LEAVE]"));

        joins.forEach((join) => {
            const joinLine = join.split("[JOIN]");
            const timeStamp = joinLine[0].replace("[JOIN]", "").trim();
            const username = joinLine[1].replace(" joined the game", "").trim();

            this.PlayerDB.AddNewPlayer(username);
            this.PlayerDB.AddLogin(username, new Date(timeStamp).getTime());
        });

        leaves.forEach((leave) => {
            const leaveLine = leave.split("[LEAVE]");
            const timeStamp = leaveLine[0].replace("[LEAVE]", "").trim();
            const username = leaveLine[1].replace(" left the game", "").trim();

            this.PlayerDB.AddDisconnect(username, new Date(timeStamp).getTime());
        });

        this.PlayerDB.Update();

        return this.PlayerDB.GetOnlinePlayers();
    }

    /**
     * Copies the World Files to the Backup Directory
     * @returns Returns a Boolean Flag | True if the Backup was Successful, False if the Backup was Unsuccessful
     */
    public async Backup(): Promise<boolean> {
        let dataManager = BotData.Instance(FactorioServerBotDataManager);
        let backupManager = new BackupManager(dataManager.BACKUP_DIRECTORY, dataManager.EXTRA_BACKUP_DIRECTORY, dataManager.WORLD_FOLDER);
        let backupSuccess = await backupManager.CreateBackup(dataManager, "Backup");

        backupManager.ManageBackupFiles(5);

        dataManager.LAST_BACKUP_DATE = new Date().getTime();

        return backupSuccess;
    }

    public SaveWorldInfo(isGlobal: boolean) {
        if (isGlobal)
            fs.writeFileSync(FactorioServerManager.WorldInfoPath, JSON.stringify(this, null, 4));
        else
            fs.writeFileSync(this.WorldInfo, JSON.stringify(this, null, 4));
    }
}

export default FactorioServerManager;