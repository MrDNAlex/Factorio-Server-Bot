import { BotData } from "dna-discord-framework";
import PlayerDatabase from "./PlayerDatabase";
import FactorioServerBotDataManager from "../FactorioServerBotDataManager";
import fs from "fs";

class FactorioServerManager {
    /**
     * Name of the Server
     */
    Name: string;

    /**
     * Online Status of the Server
     */
    Online: boolean;

    /**
     * Flag to check if a World has been Chosen or World Generation to set it is still needed
     */
    WorldChosen: boolean;

    /**
     * Player Database for the Server
     */
    PlayerDB: PlayerDatabase;

    /**
     * List of Online Players in the Server
     */
    OnlinePlayers: string[];

    // Files

    public static WorldDirectory = "/home/factorio/World";

    public static WorldImagePath = "/home/factorio/World/Preview.png";

    public static WorldFilePath = "/home/factorio/World/World.zip";

    public static WorldSettingsPath = "/home/factorio/World/MapGenSettings.json";

    public static WorldInfoPath = "/home/factorio/World/WorldInfo.json";


    constructor(data?: any) {

        if (data) {
            this.Name = data.Name;
            this.Online = data.Online;
            this.OnlinePlayers = data.OnlinePlayers;
            this.WorldChosen = data.WorldChosen;
            this.PlayerDB = new PlayerDatabase(data.PlayerDB);
        } else {
            this.Name = "Factorio Server";
            this.Online = false;
            this.OnlinePlayers = [];
            this.WorldChosen = false;
            this.PlayerDB = new PlayerDatabase();
        }
    }

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

        return this.PlayerDB.GetOnlinePlayers();
    }

    private GetJoinedUsernames(joins: string[]): Record<string, number> {
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

    private GetLeftUsernames(leaves: string[]): Record<string, number> {
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

export default FactorioServerManager;