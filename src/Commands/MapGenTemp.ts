import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command } from "dna-discord-framework";
import FactorioServerBotDataManager from "../FactorioServerBotDataManager";



class MapGenTemp extends Command {
    public CommandName: string = "mapgentemp";

    public CommandDescription: string = "Uploads the Map Generation Settings File";

    //Documentation : https://wiki.factorio.com/Multiplayer

    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) =>
    {
        let dataManager = BotData.Instance(FactorioServerBotDataManager)
    
        this.AddToMessage("Uploading Map Generation Settings...");

        this.AddFileToMessage(dataManager.MAP_GEN_TEMPLATE);
    }

    public IsEphemeralResponse: boolean = true;
    public IsCommandBlocking: boolean = false;
}

export = MapGenTemp;