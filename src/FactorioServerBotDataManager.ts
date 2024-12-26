import { BotDataManager } from "dna-discord-framework";

class FactorioServerBotDataManager extends BotDataManager
{
    //Current World Files
    WORLD_FOLDER:string = "/home/factorio/World"

    WORLD_PREVIEW_IMAGE:string = "/home/factorio/World/Preview.png";

    WORLD_FILE:string = "/home/factorio/World/World.zip";

    WORLD_MAPGEN_SETTINGS:string = "/home/factorio/World/MapGenSettings.json";

    WORLD_INFO: string = "/home/factorio/World/WorldInfo.json";

    WORLD_CHOSEN: boolean = false;


    //FACTORIO_HOME_DIR: string = "/home/factorio";

    MAP_GEN_TEMPLATE: string = "/FactorioBot/src/Files/MapGenTemplate.json";

    //SERVER_PATH: string = `/Factorio/factorio`;

    SERVER_EXECUTABLE_PATH:string = "/Factorio/factorio/bin/x64";

    //SERVER_EXECUTABLE_PATH:string = "/home/factorio/factorio/bin/x64";

    //SERVER_EXECUTABLE:string = "/Factorio/factorio/bin/x64/factorio";

    PREVIEWS_PATH: string = "/home/factorio/Previews";

    // The Default Port to Expose
    SERVER_PORT: number = 8213

    //Server Host name / IP Address
    SERVER_HOSTNAME: string = ""

    SERVER_IS_ALIVE: boolean = false;

    WORLD_CHANNEL_SET: boolean = false;

    WORLD_CHANNEL_ID: string = "";

}
    
export default FactorioServerBotDataManager;