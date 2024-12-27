"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dna_discord_framework_1 = require("dna-discord-framework");
const FactorioServerBotDataManager_1 = __importDefault(require("./FactorioServerBotDataManager"));
const FactorioExecutableCommands_1 = __importDefault(require("./Enums/FactorioExecutableCommands"));
const fs_1 = __importDefault(require("fs"));
class FactorioServerCommands {
    /**
     * Pings the Factorio Server to see if it is online
     * @returns Returns a Boolean Flag | True if the Server is Online, False if the Server is Offline
     */
    static async IsOnline() {
        let dataManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default);
        let serverStatus = new dna_discord_framework_1.BashScriptRunner();
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
    /**
     * Tries to Shutdown the Factorio Server
     * @returns Returns a Boolean Flag | True if the Server was Shutdown, False if the Server was not Shutdown
     */
    static async Shutdown() {
        let shutdown = new dna_discord_framework_1.BashScriptRunner();
        let shutdownCommand = `pkill -f "factorio --start-server" || true`;
        let dataManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default);
        let success = true;
        await shutdown.RunLocally(shutdownCommand, true).catch((err) => {
            if (err.code === undefined)
                return;
            success = false;
            dataManager.AddErrorLog(err);
        });
        return new Promise(resolve => setTimeout(() => resolve(success), 3000));
    }
    /**
     * Starts the Factorio Server
     * @returns Returns a Boolean Flag | True if the Server was Started, False if the Server was not Started
     */
    static async Start() {
        let start = new dna_discord_framework_1.BashScriptRunner();
        let dataManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default);
        let startCommand = `factorio ${FactorioExecutableCommands_1.default.StartServer} ${dataManager.WORLD_FILE} --port ${dataManager.SERVER_PORT} > ${dataManager.SERVER_LOGS} 2>&1 &`;
        let success = true;
        start.RunLocally(startCommand, true).catch((err) => {
            if (err.code === undefined)
                return;
            success = false;
            console.log("Error starting server");
            console.log(err);
        });
        return new Promise(resolve => setTimeout(() => resolve(success), 3000));
    }
    static GetPlayerCount() {
        let dataManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default);
        const lines = fs_1.default.readFileSync(dataManager.SERVER_LOGS, 'utf8').split("\n");
        const joins = lines.filter((line) => line.includes("[JOIN]"));
        const leaves = lines.filter((line) => line.includes("[LEAVE]"));
        console.log("Joins : ");
        const joinedUsernames = FactorioServerCommands.GetJoinedUsernames(joins);
        console.log("Leaves : ");
        const leftUsernames = FactorioServerCommands.GetLeftUsernames(leaves);
        let usernames = Object.keys(joinedUsernames);
        let onlineUsernames = [];
        usernames.forEach((username) => {
            if (!(username in leftUsernames))
                onlineUsernames.push(username);
            else {
                const joinTimeStamp = joinedUsernames[username];
                const leaveTimeStamp = leftUsernames[username];
                if (joinTimeStamp > leaveTimeStamp)
                    onlineUsernames.push(username);
            }
        });
        return onlineUsernames.length;
    }
    static GetJoinedUsernames(joins) {
        let usernames = {};
        joins.forEach((join) => {
            const joinLine = join.split("[JOIN]");
            const timeStamp = joinLine[0].replace("[JOIN]", "").trim();
            const username = joinLine[1].replace(" joined the game", "").trim();
            console.log("Time Stamp : ", timeStamp);
            console.log("Username : ", username);
            if (username in usernames) {
                const oldTimeStamp = new Date(usernames[username]).getTime();
                const newTimeStamp = new Date(timeStamp).getTime();
                if (newTimeStamp > oldTimeStamp)
                    usernames[username] = newTimeStamp;
            }
            else
                usernames[username] = new Date(timeStamp).getTime();
        });
        return usernames;
    }
    static GetLeftUsernames(leaves) {
        let usernames = {};
        leaves.forEach((leave) => {
            const leaveLine = leave.split("[LEAVE]");
            const timeStamp = leaveLine[0].replace("[LEAVE]", "").trim();
            const username = leaveLine[1].replace(" left the game", "").trim();
            console.log("Time Stamp : ", timeStamp);
            console.log("Username : ", username);
            if (username in usernames) {
                const oldTimeStamp = new Date(usernames[username]).getTime();
                const newTimeStamp = new Date(timeStamp).getTime();
                if (newTimeStamp > oldTimeStamp)
                    usernames[username] = newTimeStamp;
            }
            else
                usernames[username] = new Date(timeStamp).getTime();
        });
        return usernames;
    }
}
exports.default = FactorioServerCommands;
