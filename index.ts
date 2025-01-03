import { BotData, DiscordBot } from "dna-discord-framework";
import FactorioServerBotDataManager from "./src/FactorioServerBotDataManager";
import FactorioServerManager from "./src/FactorioServer/FactorioServerManager";
    
const Bot = new DiscordBot(FactorioServerBotDataManager);

Bot.StartBot();

let dataManager = BotData.Instance(FactorioServerBotDataManager);

dataManager.SERVER_IS_ALIVE = false;
dataManager.CreateDirectories();
dataManager.SERVER_MANAGER = new FactorioServerManager(dataManager.SERVER_MANAGER);

console.log("Bot Started");