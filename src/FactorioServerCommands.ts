import { BashScriptRunner, BotData } from "dna-discord-framework";
import FactorioServerBotDataManager from "./FactorioServerBotDataManager";
import FactorioExecutableCommands from "./Enums/FactorioExecutableCommands";
import fs from "fs";
import BackupManager from "./BackupManager";

class FactorioServerCommands {

    public static WAIT_TIME = 3000;

    /**
     * Pings the Factorio Server to see if it is online
     * @returns Returns a Boolean Flag | True if the Server is Online, False if the Server is Offline
     */
    public static async IsOnline(): Promise<boolean> {
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

        if (ranIntoError || IDs.length <= 1) {
            dataManager.SERVER_IS_ALIVE = false;
            return false;
        }

        dataManager.SERVER_IS_ALIVE = true;
        return true;
    }

    /**
     * Tries to Shutdown the Factorio Server
     * @returns Returns a Boolean Flag | True if the Server was Shutdown, False if the Server was not Shutdown
     */
    public static async Shutdown(): Promise<boolean> {
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

        return new Promise(resolve => setTimeout(() => {
            if (success)
                dataManager.SERVER_IS_ALIVE = false;

            resolve(success);
        }, this.WAIT_TIME));
    }

    /**
     * Starts the Factorio Server
     * @returns Returns a Boolean Flag | True if the Server was Started, False if the Server was not Started
     */
    public static async Start(): Promise<boolean> {
        let start = new BashScriptRunner();
        let dataManager = BotData.Instance(FactorioServerBotDataManager);
        let startCommand = `factorio ${FactorioExecutableCommands.StartServer} ${dataManager.WORLD_FILE} --port ${dataManager.SERVER_PORT} > ${dataManager.SERVER_LOGS} 2>&1 &`;
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
                dataManager.SERVER_START_TIME = new Date().getTime();

            resolve(success);
        }, this.WAIT_TIME));
    }

    public static async Backup(): Promise<boolean> {
        let dataManager = BotData.Instance(FactorioServerBotDataManager);
        let backupManager = new BackupManager(dataManager.BACKUP_DIRECTORY, dataManager.EXTRA_BACKUP_DIRECTORY, dataManager.WORLD_FOLDER);
        let backupSuccess = await backupManager.CreateBackup(dataManager, "Backup");

        backupManager.ManageBackupFiles(5);

        dataManager.LAST_BACKUP_DATE = new Date().getTime();

        return backupSuccess;
    }

    //public static GetPlayers() {
    //    let dataManager = BotData.Instance(FactorioServerBotDataManager);
//
    //    const lines = fs.readFileSync(dataManager.SERVER_LOGS, 'utf8').split("\n");
    //    const joins = lines.filter((line) => line.includes("[JOIN]"));
    //    const leaves = lines.filter((line) => line.includes("[LEAVE]"));
    //    const joinedUsernames = FactorioServerCommands.GetJoinedUsernames(joins);
    //    const leftUsernames = FactorioServerCommands.GetLeftUsernames(leaves);
//
    //    let usernames = Object.keys(joinedUsernames);
    //    let onlineUsernames: string[] = [];
//
    //    usernames.forEach((username) => {
//
    //        if (!(username in leftUsernames))
    //            onlineUsernames.push(username);
    //        else {
    //            const joinTimeStamp = joinedUsernames[username];
    //            const leaveTimeStamp = leftUsernames[username];
//
    //            if (joinTimeStamp > leaveTimeStamp)
    //                onlineUsernames.push(username);
    //        }
    //    });
//
    //    return onlineUsernames;
    //}

    private static GetJoinedUsernames(joins: string[]): Record<string, number> {
        let usernames: Record<string, number> = {};

        joins.forEach((join) => {
            const joinLine = join.split("[JOIN]");
            const timeStamp = joinLine[0].replace("[JOIN]", "").trim();
            const username = joinLine[1].replace(" joined the game", "").trim();

            if (username in usernames) {
                const oldTimeStamp = new Date(usernames[username]).getTime();
                const newTimeStamp = new Date(timeStamp).getTime();

                if (newTimeStamp > oldTimeStamp)
                    usernames[username] = newTimeStamp;
            } else
                usernames[username] = new Date(timeStamp).getTime();

        });

        return usernames;
    }

    private static GetLeftUsernames(leaves: string[]): Record<string, number> {
        let usernames: Record<string, number> = {};

        leaves.forEach((leave) => {
            const leaveLine = leave.split("[LEAVE]");
            const timeStamp = leaveLine[0].replace("[LEAVE]", "").trim();
            const username = leaveLine[1].replace(" left the game", "").trim();

            if (username in usernames) {
                const oldTimeStamp = new Date(usernames[username]).getTime();
                const newTimeStamp = new Date(timeStamp).getTime();

                if (newTimeStamp > oldTimeStamp)
                    usernames[username] = newTimeStamp;
            } else
                usernames[username] = new Date(timeStamp).getTime();
        });

        return usernames;
    }
}

export default FactorioServerCommands;