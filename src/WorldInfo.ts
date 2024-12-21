import { BotData } from "dna-discord-framework";
import { Attachment } from "discord.js";
import axios from "axios";
import FactorioServerCommands from "./Enums/FactorioServerCommands";
import FactorioServerBotDataManager from "./FactorioServerBotDataManager";
import fs from "fs";

class WorldInfo
{
    public WorldDirectory;

    public WorldSettings;

    public WorldImage;

    public WorldFile;

    public WorldImageSize;

    public WorldSeed;

    public WorldInfo;

    constructor (seed: Number)
    {
        let dataManager = BotData.Instance(FactorioServerBotDataManager)

        this.WorldImageSize = 1024;
        this.WorldSeed = seed

        this.WorldDirectory = `${dataManager.PREVIEWS_PATH}/SEED_${seed}`;
        this.WorldSettings = `${this.WorldDirectory}/MapGenSettings.json`;
        this.WorldInfo = `${this.WorldDirectory}/WorldInfo.json`;
        this.WorldImage = `${this.WorldDirectory}/Preview.png`;
        this.WorldFile = `${this.WorldDirectory}/World.zip`;
    }

    public CreateFolder ()
    {
        if (!fs.existsSync(this.WorldDirectory))
            fs.mkdirSync(this.WorldDirectory);
    }

    public async DownloadMapSettings (mapGenSettings : Attachment | null)
    {
        let dataManager = BotData.Instance(FactorioServerBotDataManager)
        
        if (mapGenSettings) 
            await this.DownloadFile(mapGenSettings, this.WorldSettings);
        else
            fs.cpSync(dataManager.MAP_GEN_TEMPLATE, this.WorldSettings)
    }

    public SaveWorldInfo ()
    {
        fs.writeFileSync(this.WorldInfo, JSON.stringify(this, null, 4));
    }

    public GenImageCommand (imageSize: number)
    {
        this.WorldImageSize = imageSize;

        return `factorio ${FactorioServerCommands.GenerateMapPreview} ${this.WorldImage} ${FactorioServerCommands.MapGenSettings} ${this.WorldSettings}  ${FactorioServerCommands.MapPreviewSize} ${this.WorldImageSize} ${FactorioServerCommands.MapGenSeed} ${this.WorldSeed}`;
    }

    public GenWorldCommand ()
    {
        return `factorio ${FactorioServerCommands.Create} ${this.WorldFile}  ${FactorioServerCommands.MapGenSettings} ${this.WorldSettings} ${FactorioServerCommands.MapGenSeed} ${this.WorldSeed}`;
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
}

export default WorldInfo;