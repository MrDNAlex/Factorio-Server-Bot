"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dna_discord_framework_1 = require("dna-discord-framework");
const PlayerDatabase_1 = __importDefault(require("./PlayerDatabase"));
const FactorioServerBotDataManager_1 = __importDefault(require("../FactorioServerBotDataManager"));
const fs_1 = __importDefault(require("fs"));
class FactorioServerManager {
    constructor(data) {
        if (data) {
            this.Name = data.Name;
            this.Online = data.Online;
            this.OnlinePlayers = data.OnlinePlayers;
            this.WorldChosen = data.WorldChosen;
            this.PlayerDB = new PlayerDatabase_1.default(data.PlayerDB);
        }
        else {
            this.Name = "Factorio Server";
            this.Online = false;
            this.OnlinePlayers = [];
            this.WorldChosen = false;
            this.PlayerDB = new PlayerDatabase_1.default();
        }
    }
    GetPlayers() {
        let dataManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default);
        const lines = fs_1.default.readFileSync(dataManager.SERVER_LOGS, 'utf8').split("\n");
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
        this.PlayerDB.UpdateOnlinePlayers();
        //const joinedUsernames = this.GetJoinedUsernames(joins);
        //const leftUsernames = this.GetLeftUsernames(leaves);
        //const allPlayers = Object.keys(joinedUsernames).concat(Object.keys(leftUsernames));
        //
        //// Add all Players to the Database in case there are new Ones
        //allPlayers.forEach((player) => this.PlayerDB.AddNewPlayer(player));
        //
        //let usernames = Object.keys(joinedUsernames);
        //let onlineUsernames: string[] = [];
        //
        //usernames.forEach((username) => {
        //
        //    if (!(username in leftUsernames))
        //        onlineUsernames.push(username);
        //    else {
        //        const joinTimeStamp = joinedUsernames[username];
        //        const leaveTimeStamp = leftUsernames[username];
        //
        //        if (joinTimeStamp > leaveTimeStamp)
        //            onlineUsernames.push(username);
        //    }
        //});
        return this.PlayerDB.OnlinePlayers;
    }
    GetJoinedUsernames(joins) {
        let usernames = {};
        joins.forEach((join) => {
            const joinLine = join.split("[JOIN]");
            const timeStamp = joinLine[0].replace("[JOIN]", "").trim();
            const username = joinLine[1].replace(" joined the game", "").trim();
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
    GetLeftUsernames(leaves) {
        let usernames = {};
        leaves.forEach((leave) => {
            const leaveLine = leave.split("[LEAVE]");
            const timeStamp = leaveLine[0].replace("[LEAVE]", "").trim();
            const username = leaveLine[1].replace(" left the game", "").trim();
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
// Files
FactorioServerManager.WorldDirectory = "/home/factorio/World";
FactorioServerManager.WorldImagePath = "/home/factorio/World/Preview.png";
FactorioServerManager.WorldFilePath = "/home/factorio/World/World.zip";
FactorioServerManager.WorldSettingsPath = "/home/factorio/World/MapGenSettings.json";
FactorioServerManager.WorldInfoPath = "/home/factorio/World/WorldInfo.json";
exports.default = FactorioServerManager;
