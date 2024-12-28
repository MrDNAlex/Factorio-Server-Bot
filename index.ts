import { BotData, DiscordBot } from "dna-discord-framework";
import FactorioServerBotDataManager from "./src/FactorioServerBotDataManager";
    
const Bot = new DiscordBot(FactorioServerBotDataManager);

Bot.StartBot();

let dataManager = BotData.Instance(FactorioServerBotDataManager);

dataManager.CreateDirectories();

console.log("Bot Started");