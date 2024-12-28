class Player {
    /**
     * Username of the player
     */
    Username: string;

    /**
     * Timestamps of when the Player Logged in
     */
    LoginTimeStamps: number[];

    /**
     * Timestamps of when the Player Logged out
     */
    DisconnectTimeStamps: number[];

    constructor(json: any) {
        this.Username = json.Username;
        this.LoginTimeStamps = json.OnlineTimeStamps;
        this.DisconnectTimeStamps = json.OfflineTimeStamps;
    }

    /**
     * Adds a Player Login Timestamp
     * @param loginTime The Time at which the Player Logged in
     */
    public AddLogin (loginTime: number) {
        this.LoginTimeStamps.push(loginTime);
    }

    /**
     * 
     * @param disconnectTime 
     */
    public AddDisconnect (disconnectTime: number) {
        this.DisconnectTimeStamps.push(disconnectTime);
    }

    public ToJson() {
        return {
            Username: this.Username,
            LoginTimeStamps: this.LoginTimeStamps,
            DisconnectTimeStamps: this.DisconnectTimeStamps
        }
    }

    public GetTotalPlayTime() {
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

    //public GetPlaySessionTime()
    //{
    //    return new Date().getTime() - this.TimeStamp;
    //}
}

export default Player;