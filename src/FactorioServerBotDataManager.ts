import { BotDataManager } from "dna-discord-framework";

class FactorioServerBotDataManager extends BotDataManager
{
    FACTORIO_HOME_DIR: string = "/home/factorio";

    MAP_GEN_TEMPLATE: string = "/FactorioBot/src/Files/MapGenTemplate.json";

    SERVER_PATH: string = `/home/factorio/factorio`;

    SERVER_EXECUTABLE_PATH:string = "/home/factorio/factorio/bin/x64";

    SERVER_EXECUTABLE:string = "/home/factorio/factorio/bin/x64/factorio";

    WORLD_PREVIEW_IMAGE:string = "/home/factorio/Preview.png";

    WORLD_PREVIEW_FILE:string = "/home/factorio/Preview.zip";

    WORLD_MAPGEN_SETTINGS:string = "/home/factorio/MapGenTemplate.json";

}
    
export default FactorioServerBotDataManager;