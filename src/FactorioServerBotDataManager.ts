import { BotDataManager } from "dna-discord-framework";
import fs from "fs";

class FactorioServerBotDataManager extends BotDataManager {
    //Current World Files

    BACKUP_DIRECTORY: string = "/home/factorio/Backups";

    BACKUP_FILE: string = "/home/factorio/Backups/WorldBackup.tar.gz";

    EXTRA_BACKUP_DIRECTORY: string = "/home/factorio/Backups/Extras";

    WORLD_FOLDER: string = "/home/factorio/World"

    WORLD_PREVIEW_IMAGE: string = "/home/factorio/World/Preview.png";

    WORLD_FILE: string = "/home/factorio/World/World.zip";

    WORLD_MAPGEN_SETTINGS: string = "/home/factorio/World/MapGenSettings.json";

    WORLD_INFO: string = "/home/factorio/World/WorldInfo.json";

    WORLD_CHOSEN: boolean = false;

    SERVER_LOGS: string = "/home/factorio/World/WORLD_LOG.txt";

    MAP_GEN_TEMPLATE: string = "/FactorioBot/src/Files/MapGenTemplate.json";

    SERVER_EXECUTABLE_PATH: string = "/Factorio/factorio/bin/x64";

    PREVIEWS_PATH: string = "/home/factorio/Previews";

    // The Default Port to Expose
    SERVER_PORT: number = 8213

    //Server Host name / IP Address
    SERVER_HOSTNAME: string = ""

    SERVER_NAME: string = "Factorio Server"

    SERVER_IS_ALIVE: boolean = false;

    SERVER_START_TIME: number = 0;

    WORLD_CHANNEL_SET: boolean = false;

    WORLD_CHANNEL_ID: string = "";

    LAST_BACKUP_DATE: number = 0;

    public CreateDirectories() {
        const world = "/home/factorio/World";
        const previews = "/home/factorio/Previews";
        const backups = "/home/factorio/Backups";
        const extras = "/home/factorio/Backups/Extras";

        if (!fs.existsSync(world))
            fs.mkdirSync(world, { recursive: true });

        if (!fs.existsSync(previews))
            fs.mkdirSync(previews, { recursive: true });

        if (!fs.existsSync(backups))
            fs.mkdirSync(backups, { recursive: true });

        if (!fs.existsSync(extras))
            fs.mkdirSync(extras, { recursive: true });
    }

}

export default FactorioServerBotDataManager;