"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dna_discord_framework_1 = require("dna-discord-framework");
const Player_1 = __importDefault(require("./Player"));
const FactorioServerBotDataManager_1 = __importDefault(require("../FactorioServerBotDataManager"));
const fs_1 = __importDefault(require("fs"));
class PlayerDatabase {
    constructor(data) {
        this.Players = {};
        this.OnlinePlayers = [];
        if (data && data.Players && typeof data.Players === "object") {
            for (const username in data.Players) {
                if (data.Players.hasOwnProperty(username)) {
                    this.Players[username] = new Player_1.default(data.Players[username]);
                }
            }
        }
        else
            this.Players = {};
    }
    AddNewPlayer(username) {
        const newPlayer = {
            Username: username,
            LoginTimeStamps: [],
            DisconnectTimeStamps: []
        };
        if (!(username in this.Players))
            this.Players[username] = new Player_1.default(newPlayer);
    }
    AddLogin(username, loginTime) {
        if (username in this.Players)
            this.Players[username].AddLogin(loginTime);
    }
    AddDisconnect(username, disconnectTime) {
        if (username in this.Players)
            this.Players[username].AddDisconnect(disconnectTime);
    }
    UpdateOnlinePlayers() {
        let dataManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default);
        const lines = fs_1.default.readFileSync(dataManager.SERVER_LOGS, 'utf8').split("\n");
        const joins = lines.filter((line) => line.includes("[JOIN]"));
        const leaves = lines.filter((line) => line.includes("[LEAVE]"));
        joins.forEach((join) => {
            const joinLine = join.split("[JOIN]");
            const timeStamp = joinLine[0].replace("[JOIN]", "").trim();
            const username = joinLine[1].replace(" joined the game", "").trim();
            this.AddNewPlayer(username);
            this.AddLogin(username, new Date(timeStamp).getTime());
        });
        leaves.forEach((leave) => {
            const leaveLine = leave.split("[LEAVE]");
            const timeStamp = leaveLine[0].replace("[LEAVE]", "").trim();
            const username = leaveLine[1].replace(" left the game", "").trim();
            this.AddDisconnect(username, new Date(timeStamp).getTime());
        });
        this.OnlinePlayers = [];
        for (const player in this.Players) {
            if (this.Players[player].IsOnline())
                this.OnlinePlayers.push(player);
        }
    }
    ResetDB() {
        this.Players = {};
        this.OnlinePlayers = [];
    }
}
exports.default = PlayerDatabase;
