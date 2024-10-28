import { DiscordBot } from "dna-discord-framework";
import FactorioServerBotDataManager from "./FactorioServerBotDataManager";

const Bot = new DiscordBot(FactorioServerBotDataManager);

Bot.StartBot();
