
class FactorioServer {
    /**
     * Name of the Server
     */
    Name: string;

    /**
     * Online Status of the Server
     */
    Online: boolean;

    /**
     * List of Online Players in the Server
     */
    OnlinePlayers: string[];


    constructor(data?: any) {

        if (data) {
            this.Name = data.Name;
            this.Online = data.Online;
            this.OnlinePlayers = data.OnlinePlayers;
        }

        this.Name = "Factorio Server";
        this.Online = false;
        this.OnlinePlayers = [];
    }





}