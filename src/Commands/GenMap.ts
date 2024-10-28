import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BashScriptRunner, BotData, BotDataManager, Command } from "dna-discord-framework";
import FactorioServerBotDataManager from "../FactorioServerBotDataManager";
import FactorioServerCommands from "../Enums/FactorioServerCommands";


class GenMap extends Command {
    public CommandName: string = "genmap";
    public CommandDescription: string = "Generate a new map";
    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) =>
    {
        let dataManager = BotData.Instance(FactorioServerBotDataManager)
        let runner = new BashScriptRunner();

        this.AddToMessage("Generating Map");

        //Documentation : https://wiki.factorio.com/Multiplayer

        //Generate the map and save to an image
        await runner.RunLocally(`./factorio ${FactorioServerCommands.GenerateMapPreview} ./World.png`, true, dataManager.SERVER_EXECUTABLE_PATH).catch((err) => {
            this.AddToMessage("Error generating map");
            this.AddToMessage(err);
        });

        await runner.RunLocally(`./factorio ${FactorioServerCommands.Create} /home/factorio/World.zip `, true, dataManager.SERVER_EXECUTABLE_PATH).catch((err) => {
            this.AddToMessage("Error generating map");
            this.AddToMessage(err);
        });
        console.log(runner.StandardOutputLogs);

        //Send the image to the user
        this.AddToMessage("Map generated:");
        this.AddFileToMessage(`${dataManager.SERVER_EXECUTABLE_PATH}/World.png`);

    }
    public IsEphemeralResponse: boolean = true;
    public IsCommandBlocking: boolean = false;
}

export = GenMap;