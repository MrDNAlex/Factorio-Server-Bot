import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command, ICommandOption, OptionTypesEnum } from "dna-discord-framework";
import FactorioServerBotDataManager from "../FactorioServerBotDataManager";
import fs from "fs";
import WorldInfo from "../WorldInfo";

class Worlds extends Command {

    public CommandName: string = "worlds";

    public CommandDescription: string = "Returns a List of all the Worlds Generated and Available to Load";

    public IsEphemeralResponse: boolean = true;

    public IsCommandBlocking: boolean = false;

    private MB_25 = 1024 * 1024 * 25;

    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        let dataManager = BotData.Instance(FactorioServerBotDataManager);
        let seed = interaction.options.getInteger("seed");
        let seeds = fs.readdirSync(dataManager.PREVIEWS_PATH);

        if (seed) {
            let seedDirectory = "SEED_" + seed;
            let worldInfo = new WorldInfo(seed);

            this.AddToMessage(`Uploading World: ${seed}`);

            if (!seeds.includes(seedDirectory))
                return this.AddToMessage("Seed not Found. Could not Upload Preview");

            if (!fs.existsSync(worldInfo.WorldImage))
                return this.AddToMessage("World Image is Missing. Could not Upload Preview");

            if (fs.fstatSync(fs.openSync(worldInfo.WorldImage, 'r')).size < this.MB_25)
                return this.AddFileToMessage(worldInfo.WorldImage);
            else
                this.AddToMessage("Map Image is too large to send, please download it from the server");

            if (fs.fstatSync(fs.openSync(worldInfo.WorldFile, 'r')).size < this.MB_25)
                return this.AddFileToMessage(worldInfo.WorldFile);
            else
                this.AddToMessage("Map File is too large to send, please download it from the server");

            return;
        }

        this.AddToMessage("Available Worlds to Load are:\n");

        seeds.forEach(seedDir => {
            if (!seedDir.startsWith("SEED_"))
                return;
            let seed = seedDir.replace("SEED_", "");
            this.AddToMessage(seed);
        });
    }

    public Options?: ICommandOption[] =
        [
            {
                name: "seed",
                description: "The Generated Seed to Load",
                type: OptionTypesEnum.Integer,
                required: false
            }
        ]
}

export = Worlds;