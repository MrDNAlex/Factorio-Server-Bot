"use strict";
class FactorioServer {
    constructor(data) {
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
