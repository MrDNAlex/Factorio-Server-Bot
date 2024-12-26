import { Client, ChatInputCommandInteraction, CacheType, ChannelType } from "discord.js";
import { BotData, BotDataManager, Command, ICommandOption, OptionTypesEnum } from "dna-discord-framework";
import FactorioServerBotDataManager from "../FactorioServerBotDataManager";

class Start extends Command {

    public CommandName: string = "setup";

    public CommandDescription: string = "Sets up the Server with the Appropriate Connection Info.";

    public IsEphemeralResponse: boolean = true;

    public IsCommandBlocking: boolean = false;

    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) =>
    {
        const port = interaction.options.getInteger("port");
        const hostname = interaction.options.getString("hostname");
        const worldChannel = interaction.options.getChannel("worldchannel");

        let dataManager = BotData.Instance(FactorioServerBotDataManager);

        if (!hostname)
            return this.AddToMessage("Server Hostname not specified, a Hostname/IP Address must be specified for connection.");
        
        dataManager.SERVER_HOSTNAME = hostname

        if (port)
            dataManager.SERVER_PORT = port;

        if (worldChannel)
        {
            if (worldChannel.type != ChannelType.GuildText)
                return this.AddToMessage("World Channel must be a Text Channel");
            
            dataManager.WORLD_CHANNEL_ID = worldChannel.id;
            dataManager.WORLD_CHANNEL_SET = true;
        }

        let connectionInfo = `${dataManager.SERVER_HOSTNAME}:${dataManager.SERVER_PORT}`;
        let connectionMessage = "```" + connectionInfo + "```";

        this.AddToMessage("Server has Setup Successfully!");
        this.AddToMessage("Once Server is Started Connect using the following Address:");
        this.AddToMessage(connectionMessage);

        dataManager.SaveData();
    }

    Options: ICommandOption[] = [
        {
            name: "hostname",
            description: "The HostName or IP Address of the Server",
            required: true,
            type: OptionTypesEnum.String,
        },
        {
            name: "port",
            description: "The Port the Server will be Exposed on",
            required: false,
            type: OptionTypesEnum.Integer,
        },
        {
            name: "worldchannel",
            description: "The Channel where Generated Worlds will be Sent and Shared",
            required: false,
            type: OptionTypesEnum.Channel,
        }
    ]
}

export = Start;