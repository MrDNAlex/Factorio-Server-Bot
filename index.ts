import { DiscordBot } from "dna-discord-framework";
import FactorioServerBotDataManager from "./src/FactorioServerBotDataManager";
    
const Bot = new DiscordBot(FactorioServerBotDataManager);

Bot.StartBot();

console.log("Bot Started");