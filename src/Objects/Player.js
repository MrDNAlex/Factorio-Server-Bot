"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Player {
    constructor(json) {
        this.Username = json.Username;
        this.LoginTimeStamps = json.OnlineTimeStamps;
        this.DisconnectTimeStamps = json.OfflineTimeStamps;
    }
    /**
     * Adds a Player Login Timestamp
     * @param loginTime The Time at which the Player Logged in
     */
    AddLogin(loginTime) {
        this.LoginTimeStamps.push(loginTime);
    }
    /**
     *
     * @param disconnectTime
     */
    AddDisconnect(disconnectTime) {
        this.DisconnectTimeStamps.push(disconnectTime);
    }
    ToJson() {
        return {
            Username: this.Username,
            LoginTimeStamps: this.LoginTimeStamps,
            DisconnectTimeStamps: this.DisconnectTimeStamps
        };
    }
    GetTotalPlayTime() {
        let totalPlayTime = 0;
        let length = this.LoginTimeStamps.length - 1;
        for (let i = 0; i < length; i++)
            totalPlayTime += this.DisconnectTimeStamps[i] - this.LoginTimeStamps[i];
        if (this.LoginTimeStamps.length != this.DisconnectTimeStamps.length)
            totalPlayTime += new Date().getTime() - this.LoginTimeStamps[length];
        else
            totalPlayTime += this.DisconnectTimeStamps[length] - this.LoginTimeStamps[length];
        return totalPlayTime;
    }
}
exports.default = Player;
