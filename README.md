# Factorio Server Bot

Hello, I am the Engineers Assistant, a Discord Bot that you can Invite to your Discord Server to Host a Factorio Server to Play in Factorio in a Interactive Way. I also facilitate the Sharing of Factorio Worlds Between Players.

Another Version of Myself can be found [Factorio World Gen Bot](https://github.com/MrDNAlex/Factorio-World-Gen-Bot). This Version has less Capabilities than I do, I can only Generate Factorio Worlds for Sharing

I am a Discord Bot that is Self Hosted, therefor you must host me on your personal Machine and Invite me to the Discord Server.

## Requirements
I require very little to host, you will need:

- A Linux Machine (Can be a Virtual Machine on Windows or Mac, although a cloud or local machine is ideal, does not need to be powerful)
- Docker to be Installed in Linux
- Access to Port Forwarding

## Setup

### Discord Bot Setup

First step is to create an instance of me that you can invite to your server. Head to [Discord Developer Applications](https://discord.com/developers/applications), and Create a New Application, Name me whatever you like

![image](https://github.com/user-attachments/assets/8b590def-e777-48f5-80e9-da08e63e5f1f)

![image](https://github.com/user-attachments/assets/c80e969e-483f-4088-a3aa-68b3728e3505)

Now Click on my app to edit my info.

Your Webview should look like the following, you can upload an Icon and give me an optional Description if you want. Default Icons and Banners can be found [here](https://github.com/MrDNAlex/Factorio-World-Gen-Bot/tree/main/src/Files)

Once Complete go to the Bot Tab

![image](https://github.com/user-attachments/assets/09ce4cfa-18b9-4958-89e9-b254aa18512b)

Scroll down slightly and make sure the following Settings are applied, then go to the OAuth2 Tab.

![image](https://github.com/user-attachments/assets/d241c9fd-2ecf-43f0-9f43-efea15149f49)

Apply the Following Settings in OAuth2 and then Copy and Paste the Link below and click it inside the Server, go through the invite process

![image](https://github.com/user-attachments/assets/1f22c600-de30-4c4c-97da-01ccf7382fc3)

![image](https://github.com/user-attachments/assets/fd0bcec3-9dad-463f-9c39-5d90fb144fbf)

![image](https://github.com/user-attachments/assets/ef88d8be-1baf-41d5-957a-4f85f34b8616)

![image](https://github.com/user-attachments/assets/426297c9-ccdc-4ead-a9d4-cb32cef80a49)

Now I should Appear Offline

![image](https://github.com/user-attachments/assets/43aee0b7-7b32-4cfd-912e-fc2b8efa533e)

Now go back to Bot Tab and we will come back to this Later

### Discord Bot Docker Setup

I will assume you have Docker already installed on your Machine, if not you can find YouTube videos to help.

Logon to your Linux Machine, and CD into the directory you want to Host the Bots Resources.

![image](https://github.com/user-attachments/assets/70a3a2c1-acfb-4ade-8147-a7bbf7e1264f)

Run the Folowing Commands to make the Appropriate Folder Structure and give it necessary Permissions

```
mkdir Resources
sudo chown -R $USER:docker Resources
sudo chmod -R 775 Resources
mkdir Settings
sudo chown -R $USER:docker Settings
sudo chmod -R 775 Settings
```

Now create a new File to Run the Discord Bot and Paste the Following Info inside it. (Replace the {path/to/project} with the Appropriate Path)

Example Name : RunWorldGen.sh

```
#!/bin/bash

docker pull mrdnalex/factorioserverbot

docker kill factorioserver

docker rm factorioserver

docker run -it --name factorioserver --restart=always --network="host" -v "{path/to/project}/Settings":"/FactorioBot/Resources" -v "{path/to/project}/Resources":"/home/factorio" mrdnalex/factorioserverbot
```

Save the File and then make it executable using the following

```
sudo chmod +x RunServer.sh
```

You should get the following Structure

![image](https://github.com/user-attachments/assets/fe417bf8-7087-4e58-985b-885600c8ba11)

And Now run the Shell Script to Launch the Bot

```
./RunServer.sh
```

You should receive something somewhat similar to the Following, Downloading and Extracting may take a few minutes. You should be Prompted for a Discord Token.

![image](https://github.com/user-attachments/assets/fd624c25-2d48-4298-a68e-32dafe2d418a)

Now we go back to the Bot Tab and Click the "Reset Token" Button.

![image](https://github.com/user-attachments/assets/a4703836-ce70-47f3-8dd1-54a22925ec9a)

Don't reveal the Token to Anyone, and now copy and paste it as the Input

![image](https://github.com/user-attachments/assets/bbc81b71-6a79-4555-a0b6-f5831295613a)

If the Final Message you get is Commands Registered then you are Done!

![image](https://github.com/user-attachments/assets/e84250cc-2fd6-46d0-ba94-b53346a4088a)

Now you can go Interact with me on Discord, using /help may be a good start

## Commands
All Commands can be used using /name, must be all lower case, some additional optional or mandatory info can be provided to commands. Discord will specify when needed.

---

### Help
Provides some Helpful Info about Setting me up and Using other Commands. Also Uploads a MapGenSettings.json Template File

---

### Setup 
Sets me up with all Files and Info I need, you can optinally set a Text Channel where World Gen Announcements will be Sent

---

### GenWorld
Generates a World Preview Image and File, these files are Uploaded to an Ephemeral Message, this is only visible to you and Disappears after a few Minutes. If a Text Channel was Specified the Image and World File will be Uploaded and Publicly Announced in the Channel

#### Options
Name - A Name for the World **Must** be Specified

PreviewSize - Size of the World Preview (In Pixels) (Max Size that Can be Uploaded is 25 MB or about 8000) (Default is 1024)

Seed - A Seed Can be specified for the World Gen, if not specified a Random Seed will be used


MapGenSettings - A Json File that can be uploaded specifying World Gen Settings, such as Frequency, Size and Richness of Ore Patches and More. Download the File Template from the /help command

---

### World
Lists all the World Seeds that I've Generated, if a Seed is specified, I will upload the Preview Image, World ZIP File and a Server_Package.tar.gz, the Server Package can be Uploaded to my Server Hosting Counterpart in the /loadworld Command

#### Options
Seed - Seed can be Specified if you want to Download a Worlds Preview, World ZIP File or Server_Package.tar.gz

---

## Contact
If you have further questions or would like to discuss custom Discord Bot Developement or Paid Dedicated Hosting you can message me on Discord @ MyTyranosaur
