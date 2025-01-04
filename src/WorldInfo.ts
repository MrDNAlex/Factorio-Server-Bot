import { BotData } from "dna-discord-framework";
import { Attachment } from "discord.js";
import axios from "axios";
import FactorioExecutableCommands from "./Enums/FactorioExecutableCommands";
import FactorioServerBotDataManager from "./FactorioServerBotDataManager";
import fs from "fs";
import PlayerDatabase from "./FactorioServer/PlayerDatabase";

class WorldInfo
{
    public WorldDirectory: string;

    public WorldSettings: string;

    public WorldImage: string;

    public WorldFile: string;

    public WorldImageSize: number;

    public WorldSeed: number;

    public WorldInfo: string;


    constructor (seed: number)
    {
        let dataManager = BotData.Instance(FactorioServerBotDataManager)

        this.WorldImageSize = 1024;
        this.WorldSeed = seed;

        this.WorldDirectory = `${dataManager.PREVIEWS_PATH}/SEED_${seed}`;
        this.WorldSettings = `${this.WorldDirectory}/MapGenSettings.json`;
        this.WorldInfo = `${this.WorldDirectory}/WorldInfo.json`;
        this.WorldImage = `${this.WorldDirectory}/Preview.png`;
        this.WorldFile = `${this.WorldDirectory}/World.zip`;
    }

    public CreateFolder ()
    {
        if (!fs.existsSync(this.WorldDirectory))
            fs.mkdirSync(this.WorldDirectory, {recursive: true});
    }

    public async DownloadMapSettings (mapGenSettings : Attachment | null)
    {
        let dataManager = BotData.Instance(FactorioServerBotDataManager)
        
        if (mapGenSettings) 
            await this.DownloadFile(mapGenSettings, this.WorldSettings);
        else
            fs.cpSync(dataManager.MAP_GEN_TEMPLATE, this.WorldSettings);
    }

    public SaveWorldInfo ()
    {
        fs.writeFileSync(this.WorldInfo, JSON.stringify(this, null, 4));
    }

    public GenImageCommand (imageSize: number)
    {
        this.WorldImageSize = imageSize;

        return `factorio ${FactorioExecutableCommands.GenerateMapPreview} ${this.WorldImage} ${FactorioExecutableCommands.MapGenSettings} ${this.WorldSettings}  ${FactorioExecutableCommands.MapPreviewSize} ${this.WorldImageSize} ${FactorioExecutableCommands.MapGenSeed} ${this.WorldSeed}`;
    }

    public GenWorldCommand ()
    {
        return `factorio ${FactorioExecutableCommands.Create} ${this.WorldFile}  ${FactorioExecutableCommands.MapGenSettings} ${this.WorldSettings} ${FactorioExecutableCommands.MapGenSeed} ${this.WorldSeed}`;
    }

    public AllFilesExist ()
    {
        return fs.existsSync(this.WorldSettings) && fs.existsSync(this.WorldInfo) && fs.existsSync(this.WorldImage) && fs.existsSync(this.WorldFile);
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