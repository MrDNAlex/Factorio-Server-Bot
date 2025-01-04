import { BotData, DiscordBot } from "dna-discord-framework";
import FactorioServerBotDataManager from "./src/FactorioServerBotDataManager";
import FactorioServerManager from "./src/FactorioServer/FactorioServerManager";
    
const Bot = new DiscordBot(FactorioServerBotDataManager);

Bot.StartBot();

let dataManager = BotData.Instance(FactorioServerBotDataManager);

dataManager.CreateDirectories();
dataManager.SERVER_MANAGER = new FactorioServerManager(dataManager.SERVER_MANAGER);
FactorioServerManager.AutoBackup();

console.log("Bot Started");