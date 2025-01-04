
import { Client, ChatInputCommandInteraction, CacheType, Attachment } from "discord.js";
import { BashScriptRunner, BotData, BotDataManager, Command, ICommandOption, OptionTypesEnum } from "dna-discord-framework";
import FactorioServerBotDataManager from "../FactorioServerBotDataManager";
import fs from "fs";
import path from "path";
import axios from "axios";
import FactorioServerManager from "../FactorioServer/FactorioServerManager";
import WorldGenManager from "../FactorioServer/WorldGenManager";

class LoadWorld extends Command {

    public CommandName: string = "loadworld";

    public CommandDescription: string = "Loads a World using the provided Seed or Backup File";

    public IsEphemeralResponse: boolean = true;

    public IsCommandBlocking: boolean = false;

    private MaxSeed: number = 2147483647;

    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        let dataManager = BotData.Instance(FactorioServerBotDataManager);
        let serverManager = BotData.Instance(FactorioServerBotDataManager).SERVER_MANAGER;

        const seed = interaction.options.getInteger("seed");
        const backup = interaction.options.getAttachment("backup");

        dataManager.Update();

        if (await serverManager.IsOnline())
            return this.AddToMessage("Server cannot be Running when Loading a World.");

        if (seed && backup)
            return this.AddToMessage("Cannot Load both a Seed and a Backup File.");

        if (seed)
            this.LoadSeed(seed);

        if (backup) {
            let loadDir = "/home/factorio/Backups/Load";

            this.AddToMessage("Loading Backup...");

            if (!fs.existsSync(loadDir))
                fs.mkdirSync(loadDir, { recursive: true });

            if (backup.name.endsWith(".zip"))
                await this.LoadZipBackup(loadDir, backup);
            else
                await this.LoadBackup(loadDir, backup);

            this.AddToMessage("World Loaded Successfully!");
        }
    }

    public LoadSeed(seed: number) {
        let dataManager = BotData.Instance(FactorioServerBotDataManager);
        let seedDirectory = "SEED_" + seed;
        let worldInfoPath = `${dataManager.PREVIEWS_PATH}/${seedDirectory}/WorldInfo.json`;
        let seeds = fs.readdirSync(dataManager.PREVIEWS_PATH);

        if (!seeds.includes(seedDirectory))
            return this.AddToMessage("Seed not Found. Could not Load World");

        if (!fs.existsSync(worldInfoPath))
            return this.AddToMessage("World Info is Missing. Could not Load World");

        const jsonData = JSON.parse(fs.readFileSync(worldInfoPath, 'utf8'));
        let worldManager = new FactorioServerManager(jsonData);

        this.AddToMessage(`Loading Seed: ${seed}`);

        if (!worldManager.AllFilesExist())
            return this.AddToMessage("World Files are Missing. Could not Load World");

        this,this.BackupCurrentWorld();
        this.ReplaceWorldData(worldManager);
        this.AddToMessage("World Loaded Successfully!");
    }

    public async LoadBackup(loadDir: string, backup: Attachment) {
        let dataManager = BotData.Instance(FactorioServerBotDataManager);
        let runner = new BashScriptRunner();
        let mapGen = path.join(loadDir, "MapGenSettings.json");
        let preview = path.join(loadDir, "Preview.png");
        let world = path.join(loadDir, "World.zip");
        let worldInfo = path.join(loadDir, "WorldInfo.json");

        await this.DownloadFile(backup, path.join(loadDir, "Load.tar.gz"));

        await runner.RunLocally(`tar -xzf Load.tar.gz`, true, loadDir).catch((error) => {
            console.error(`Error Loading Backup: ${error}`);
            this.AddToMessage("Error Loading Backup. Please Check the Logs for more Information.");
        });

        this.AddToMessage("Checking File Format...");

        if (!(fs.existsSync(mapGen) && fs.existsSync(preview) && fs.existsSync(world) && fs.existsSync(worldInfo)))
            return this.AddToMessage("Unrecognizable Backup File Format. Files are Missing, Cannot Load World");

        const jsonData = JSON.parse(fs.readFileSync("/home/factorio/Backups/Load/WorldInfo.json", 'utf8'));
        let worldManager = new FactorioServerManager(jsonData);

        fs.cpSync(preview, worldManager.WorldImage);
        fs.cpSync(world, worldManager.WorldFile);
        fs.cpSync(mapGen, worldManager.WorldSettings);
        fs.cpSync(worldInfo, worldManager.WorldInfo);

        this.BackupCurrentWorld();
        this.ReplaceWorldData(worldManager);
        this.DeleteFolder(loadDir);

        dataManager.SERVER_MANAGER = worldManager;
    }

    public async LoadZipBackup(loadDir: string, backup: Attachment) {
        let dataManager = BotData.Instance(FactorioServerBotDataManager);
        let runner = new BashScriptRunner();
        let control = path.join(loadDir, "World", "control.lua");
        let description = path.join(loadDir, "World", "description.json");
        let freeplay = path.join(loadDir, "World", "freeplay.lua");
        let info = path.join(loadDir, "World", "info.json");
        let level = path.join(loadDir, "World", "level.dat0");
        let levelMetaData = path.join(loadDir, "World", "level.datmetadata");
        let levelInit = path.join(loadDir, "World", "level-init.dat");
        let script = path.join(loadDir, "World", "script.dat");
        let locale = path.join(loadDir, "World", "locale");
        let worldGenManager = new WorldGenManager();
        let seed = Math.floor(Math.random() * this.MaxSeed);;

        this.AddToMessage("Assigning Seed to World...");

        while (fs.existsSync(path.join(dataManager.PREVIEWS_PATH, `SEED_${seed}`)))
            seed = Math.floor(Math.random() * this.MaxSeed);

        worldGenManager.GenWorld(seed, backup);

        this.AddToMessage(`Seed: ${worldGenManager.ServerManager.WorldSeed}`);

        await this.DownloadFile(backup, path.join(loadDir, "Load.zip"));

        await runner.RunLocally(`unzip Load.zip`, true, loadDir).catch((error) => {
            console.error(`Error Loading Backup: ${error}`);
            this.AddToMessage("Error Loading Backup. Please Check the Logs for more Information.");
        });

        this.AddToMessage("Checking File Format...");

        if (!(fs.existsSync(control) && fs.existsSync(description) && fs.existsSync(freeplay) && fs.existsSync(info) && fs.existsSync(level) && fs.existsSync(levelMetaData) && fs.existsSync(levelInit) && fs.existsSync(script) && fs.existsSync(locale)))
            return this.AddToMessage("Unrecognizable Backup File Format. Files are Missing, Cannot Load World");

        this.BackupCurrentWorld();
        this.DeleteFolder(dataManager.WORLD_FOLDER);

        worldGenManager.ServerManager.SaveWorldInfo(false);
        worldGenManager.ServerManager.SaveWorldInfo(true);

        fs.cpSync(path.join(loadDir, "Load.zip"), path.join(dataManager.WORLD_FOLDER, "World.zip"));
        fs.cpSync("/FactorioBot/src/Files/Factorio.png", path.join(dataManager.WORLD_FOLDER, "Preview.png"));
        fs.cpSync("/FactorioBot/src/Files/MapGenTemplate.json", path.join(dataManager.WORLD_FOLDER, "MapGenSettings.json"));
        fs.cpSync(path.join(dataManager.PREVIEWS_PATH, `SEED_${seed}`, "WorldInfo.json"), path.join(dataManager.WORLD_FOLDER, "WorldInfo.json"));

        this.DeleteFolder(loadDir);

        dataManager.SERVER_MANAGER = worldGenManager.ServerManager;
    }

    /**
         * Deletes the Previous Data associated with the Seed
         */
    public DeleteFolder(directoryPath: string) {
        const files = fs.readdirSync(directoryPath);

        for (const file of files) {
            const fullPath = path.join(directoryPath, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory())
                fs.rmSync(fullPath, { recursive: true, force: true });
            else
                fs.unlinkSync(fullPath);
        }
    }

    /**
     * Replaces the World Data that is loaded with the 
     * @param worldInfo 
     */
    public ReplaceWorldData(worldInfo: FactorioServerManager) {
        let dataManager = BotData.Instance(FactorioServerBotDataManager);

        this.DeleteFolder(dataManager.WORLD_FOLDER);

        fs.cpSync(worldInfo.WorldImage, FactorioServerManager.WorldImagePath);
        fs.cpSync(worldInfo.WorldFile, FactorioServerManager.WorldFilePath);
        fs.cpSync(worldInfo.WorldSettings, FactorioServerManager.WorldSettingsPath);
        fs.cpSync(worldInfo.WorldInfo, FactorioServerManager.WorldInfoPath);

        dataManager.SERVER_MANAGER = worldInfo;
    }

    public BackupCurrentWorld() {
        let serverManager = BotData.Instance(FactorioServerBotDataManager).SERVER_MANAGER;

        this.DeleteFolder(serverManager.WorldDirectory);

        fs.cpSync(FactorioServerManager.WorldFilePath, serverManager.WorldFile);
        fs.cpSync(FactorioServerManager.WorldSettingsPath, serverManager.WorldSettings);
        fs.cpSync(FactorioServerManager.WorldInfoPath, serverManager.WorldInfo);
        fs.cpSync(FactorioServerManager.WorldImagePath, serverManager.WorldImage);
    }

    /**
     * Donwloads the Map Generation Settings file
     * @param attachement The File to download
     * @param downloadPath The Path and File Name to Download as
     * @returns Nothing
     */
    public async DownloadFile(attachement: Attachment | null, downloadPath: string) {

        if (!attachement)
            return

        try {
            const response = await axios({
                method: 'GET',
                url: attachement.url,
                responseType: 'stream',
            });

            let writer = fs.createWriteStream(downloadPath);

            await response.data.pipe(writer);

            return new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
        } catch (error) {
            console.error(`Failed to download the file: ${error}`);
        }
    }

    public Options?: ICommandOption[] =
        [
            {
                name: "seed",
                description: "The Generated Seed to Load",
                type: OptionTypesEnum.Integer,
                required: false
            },
            {
                name: "backup",
                description: "The Backup File to Load",
                type: OptionTypesEnum.Attachment,
                required: false
            }
        ]
}

export = LoadWorld;