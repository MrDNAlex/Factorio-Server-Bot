"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const FactorioServerBotDataManager_1 = __importDefault(require("../FactorioServerBotDataManager"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
const FactorioServerManager_1 = __importDefault(require("../FactorioServer/FactorioServerManager"));
const WorldGenManager_1 = __importDefault(require("../FactorioServer/WorldGenManager"));
class LoadWorld extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = "loadworld";
        this.CommandDescription = "Loads a World using the provided Seed or Backup File";
        this.IsEphemeralResponse = true;
        this.IsCommandBlocking = false;
        this.MaxSeed = 2147483647;
        this.RunCommand = async (client, interaction, BotDataManager) => {
            let dataManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default);
            let serverManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default).SERVER_MANAGER;
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
                if (!fs_1.default.existsSync(loadDir))
                    fs_1.default.mkdirSync(loadDir, { recursive: true });
                if (backup.name.endsWith(".zip"))
                    await this.LoadZipBackup(loadDir, backup);
                else
                    await this.LoadBackup(loadDir, backup);
                this.AddToMessage("World Loaded Successfully!");
            }
        };
        this.Options = [
            {
                name: "seed",
                description: "The Generated Seed to Load",
                type: dna_discord_framework_1.OptionTypesEnum.Integer,
                required: false
            },
            {
                name: "backup",
                description: "The Backup File to Load",
                type: dna_discord_framework_1.OptionTypesEnum.Attachment,
                required: false
            }
        ];
    }
    LoadSeed(seed) {
        let dataManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default);
        let seedDirectory = "SEED_" + seed;
        let worldInfoPath = `${dataManager.PREVIEWS_PATH}/${seedDirectory}/WorldInfo.json`;
        let seeds = fs_1.default.readdirSync(dataManager.PREVIEWS_PATH);
        if (!seeds.includes(seedDirectory))
            return this.AddToMessage("Seed not Found. Could not Load World");
        if (!fs_1.default.existsSync(worldInfoPath))
            return this.AddToMessage("World Info is Missing. Could not Load World");
        const jsonData = JSON.parse(fs_1.default.readFileSync(worldInfoPath, 'utf8'));
        let worldManager = new FactorioServerManager_1.default(jsonData);
        this.AddToMessage(`Loading Seed: ${seed}`);
        if (!worldManager.AllFilesExist())
            return this.AddToMessage("World Files are Missing. Could not Load World");
        this, this.BackupCurrentWorld();
        this.ReplaceWorldData(worldManager);
        this.AddToMessage("World Loaded Successfully!");
    }
    async LoadBackup(loadDir, backup) {
        let dataManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default);
        let runner = new dna_discord_framework_1.BashScriptRunner();
        let mapGen = path_1.default.join(loadDir, "MapGenSettings.json");
        let preview = path_1.default.join(loadDir, "Preview.png");
        let world = path_1.default.join(loadDir, "World.zip");
        let worldInfo = path_1.default.join(loadDir, "WorldInfo.json");
        await this.DownloadFile(backup, path_1.default.join(loadDir, "Load.tar.gz"));
        await runner.RunLocally(`tar -xzf Load.tar.gz`, true, loadDir).catch((error) => {
            console.error(`Error Loading Backup: ${error}`);
            this.AddToMessage("Error Loading Backup. Please Check the Logs for more Information.");
        });
        this.AddToMessage("Checking File Format...");
        if (!(fs_1.default.existsSync(mapGen) && fs_1.default.existsSync(preview) && fs_1.default.existsSync(world) && fs_1.default.existsSync(worldInfo)))
            return this.AddToMessage("Unrecognizable Backup File Format. Files are Missing, Cannot Load World");
        const jsonData = JSON.parse(fs_1.default.readFileSync("/home/factorio/Backups/Load/WorldInfo.json", 'utf8'));
        let worldManager = new FactorioServerManager_1.default(jsonData);
        fs_1.default.cpSync(preview, worldManager.WorldImage);
        fs_1.default.cpSync(world, worldManager.WorldFile);
        fs_1.default.cpSync(mapGen, worldManager.WorldSettings);
        fs_1.default.cpSync(worldInfo, worldManager.WorldInfo);
        this.BackupCurrentWorld();
        this.ReplaceWorldData(worldManager);
        this.DeleteFolder(loadDir);
        dataManager.SERVER_MANAGER = worldManager;
    }
    async LoadZipBackup(loadDir, backup) {
        let dataManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default);
        let runner = new dna_discord_framework_1.BashScriptRunner();
        let control = path_1.default.join(loadDir, "World", "control.lua");
        let description = path_1.default.join(loadDir, "World", "description.json");
        let freeplay = path_1.default.join(loadDir, "World", "freeplay.lua");
        let info = path_1.default.join(loadDir, "World", "info.json");
        let level = path_1.default.join(loadDir, "World", "level.dat0");
        let levelMetaData = path_1.default.join(loadDir, "World", "level.datmetadata");
        let levelInit = path_1.default.join(loadDir, "World", "level-init.dat");
        let script = path_1.default.join(loadDir, "World", "script.dat");
        let locale = path_1.default.join(loadDir, "World", "locale");
        let worldGenManager = new WorldGenManager_1.default();
        let seed = Math.floor(Math.random() * this.MaxSeed);
        ;
        this.AddToMessage("Assigning Seed to World...");
        while (fs_1.default.existsSync(path_1.default.join(dataManager.PREVIEWS_PATH, `SEED_${seed}`)))
            seed = Math.floor(Math.random() * this.MaxSeed);
        worldGenManager.GenWorld(seed, backup);
        this.AddToMessage(`Seed: ${worldGenManager.ServerManager.WorldSeed}`);
        await this.DownloadFile(backup, path_1.default.join(loadDir, "Load.zip"));
        await runner.RunLocally(`unzip Load.zip`, true, loadDir).catch((error) => {
            console.error(`Error Loading Backup: ${error}`);
            this.AddToMessage("Error Loading Backup. Please Check the Logs for more Information.");
        });
        this.AddToMessage("Checking File Format...");
        if (!(fs_1.default.existsSync(control) && fs_1.default.existsSync(description) && fs_1.default.existsSync(freeplay) && fs_1.default.existsSync(info) && fs_1.default.existsSync(level) && fs_1.default.existsSync(levelMetaData) && fs_1.default.existsSync(levelInit) && fs_1.default.existsSync(script) && fs_1.default.existsSync(locale)))
            return this.AddToMessage("Unrecognizable Backup File Format. Files are Missing, Cannot Load World");
        this.BackupCurrentWorld();
        this.DeleteFolder(dataManager.WORLD_FOLDER);
        worldGenManager.ServerManager.SaveWorldInfo(false);
        worldGenManager.ServerManager.SaveWorldInfo(true);
        fs_1.default.cpSync(path_1.default.join(loadDir, "Load.zip"), path_1.default.join(dataManager.WORLD_FOLDER, "World.zip"));
        fs_1.default.cpSync("/FactorioBot/src/Files/Factorio.png", path_1.default.join(dataManager.WORLD_FOLDER, "Preview.png"));
        fs_1.default.cpSync("/FactorioBot/src/Files/MapGenTemplate.json", path_1.default.join(dataManager.WORLD_FOLDER, "MapGenSettings.json"));
        fs_1.default.cpSync(path_1.default.join(dataManager.PREVIEWS_PATH, `SEED_${seed}`, "WorldInfo.json"), path_1.default.join(dataManager.WORLD_FOLDER, "WorldInfo.json"));
        this.DeleteFolder(loadDir);
        dataManager.SERVER_MANAGER = worldGenManager.ServerManager;
    }
    /**
         * Deletes the Previous Data associated with the Seed
         */
    DeleteFolder(directoryPath) {
        const files = fs_1.default.readdirSync(directoryPath);
        for (const file of files) {
            const fullPath = path_1.default.join(directoryPath, file);
            const stat = fs_1.default.statSync(fullPath);
            if (stat.isDirectory())
                fs_1.default.rmSync(fullPath, { recursive: true, force: true });
            else
                fs_1.default.unlinkSync(fullPath);
        }
    }
    /**
     * Replaces the World Data that is loaded with the
     * @param worldInfo
     */
    ReplaceWorldData(worldInfo) {
        let dataManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default);
        this.DeleteFolder(dataManager.WORLD_FOLDER);
        fs_1.default.cpSync(worldInfo.WorldImage, FactorioServerManager_1.default.WorldImagePath);
        fs_1.default.cpSync(worldInfo.WorldFile, FactorioServerManager_1.default.WorldFilePath);
        fs_1.default.cpSync(worldInfo.WorldSettings, FactorioServerManager_1.default.WorldSettingsPath);
        fs_1.default.cpSync(worldInfo.WorldInfo, FactorioServerManager_1.default.WorldInfoPath);
        dataManager.SERVER_MANAGER = worldInfo;
    }
    BackupCurrentWorld() {
        let serverManager = dna_discord_framework_1.BotData.Instance(FactorioServerBotDataManager_1.default).SERVER_MANAGER;
        this.DeleteFolder(serverManager.WorldDirectory);
        fs_1.default.cpSync(FactorioServerManager_1.default.WorldFilePath, serverManager.WorldFile);
        fs_1.default.cpSync(FactorioServerManager_1.default.WorldSettingsPath, serverManager.WorldSettings);
        fs_1.default.cpSync(FactorioServerManager_1.default.WorldInfoPath, serverManager.WorldInfo);
        fs_1.default.cpSync(FactorioServerManager_1.default.WorldImagePath, serverManager.WorldImage);
    }
    /**
     * Donwloads the Map Generation Settings file
     * @param attachement The File to download
     * @param downloadPath The Path and File Name to Download as
     * @returns Nothing
     */
    async DownloadFile(attachement, downloadPath) {
        if (!attachement)
            return;
        try {
            const response = await (0, axios_1.default)({
                method: 'GET',
                url: attachement.url,
                responseType: 'stream',
            });
            let writer = fs_1.default.createWriteStream(downloadPath);
            await response.data.pipe(writer);
            return new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
        }
        catch (error) {
            console.error(`Failed to download the file: ${error}`);
        }
    }
}
module.exports = LoadWorld;
