import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
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

        let dataManager = BotData.Instance(FactorioServerBotDataManager);

        if (!hostname)
            return this.AddToMessage("Server Hostname not specified, a Hostname/IP Address must be specified for connection.");
        
        dataManager.SERVER_HOSTNAME = hostname

        if (port)
            dataManager.SERVER_PORT = port;

        let connectionInfo = `${dataManager.SERVER_HOSTNAME}:${dataManager.SERVER_PORT}`;
        let connectionMessage = "```" + connectionInfo + "```";

        this.AddToMessage("Server has Setup Successfully!");
        this.AddToMessage("Once Server is Started Connect using the following Address:");
        this.AddToMessage(connectionMessage);
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
        }
    ]
}

export = Start;