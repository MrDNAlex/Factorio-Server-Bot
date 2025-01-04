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
        const name = interaction.options.getString("name");
        const port = interaction.options.getInteger("port");
        const hostname = interaction.options.getString("hostname");
        const worldChannel = interaction.options.getChannel("worldchannel");

        let dataManager = BotData.Instance(FactorioServerBotDataManager);

        dataManager.Update();

        if (!name)
            return this.AddToMessage("Server Name not specified, a Name must be specified for the Server.");

        if (!hostname)
            return this.AddToMessage("Server Hostname not specified, a Hostname/IP Address must be specified for connection.");
        
        if (port)
            dataManager.SERVER_PORT = port;

        if (worldChannel)
        {
            if (worldChannel.type != ChannelType.GuildText)
                return this.AddToMessage("World Channel must be a Text Channel");

            dataManager.WORLD_CHANNEL_ID = worldChannel.id;
            dataManager.WORLD_CHANNEL_SET = true;
        }

        dataManager.SERVER_NAME = name;
        dataManager.SERVER_HOSTNAME = hostname;

        let connectionInfo = `${dataManager.SERVER_HOSTNAME}:${dataManager.SERVER_PORT}`;
        let connectionMessage = "```" + connectionInfo + "```";

        this.AddToMessage("Server has been Setup with the Following Connection Info:");
        this.AddToMessage(`Name: ${dataManager.SERVER_NAME}`);
        this.AddToMessage(`Hostname: ${dataManager.SERVER_HOSTNAME}`);

        if (port)
            this.AddToMessage(`Port: ${dataManager.SERVER_PORT}`);

        if (worldChannel)
            this.AddToMessage(`World Channel: ${worldChannel}`);

        this.AddToMessage("\nOnce Server is Started you can Connect to the Server using the Following Connection Info:");
        this.AddToMessage(connectionMessage);

        dataManager.SaveData();
    }

    Options: ICommandOption[] = [
        {
            name: "name",
            description: "Name of the Server being Hosted",
            required: true,
            type: OptionTypesEnum.String,
        },
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