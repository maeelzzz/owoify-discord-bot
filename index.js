import { config } from 'dotenv';
config();

import {
    Client,
    GatewayIntentBits,
    Routes,
    REST,
    Events,
    ActivityType,
  } from 'discord.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

import OwoifyCommand from './commands/owoify.js';

import XMLHttpRequest from "xhr2";
const xhr = new XMLHttpRequest();

client.once(Events.ClientReady, c => {
    c.user.setPresence({
        activities: [{ name: `owo.vc`, type: ActivityType.Watching }],
        status: 'online',
      });
    console.log("", `Ready as '${c.user.tag}' (${c.user.id}) - @maeelzzz`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'owoify') {
        const url = interaction.options.getString('url')
        if (!isValidUrl(url))
        {
            interaction.reply({ content: 'Bad URL ❌', ephemeral: true });
            return
        }
        const response = await owoify(url)
        console.log(`${url} - ${response}`)
        interaction.reply({content: `URL: ` + response});
	}
});

function isValidUrl(userInput) {
    var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if(res == null)
       return false;
    else
       return true;
}

async function owoify(url)
{
    const owoUrl = "https://owo.vc/generate"
    return new Promise(resolve => {
        xhr.open("POST", owoUrl, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const response = this.responseText
                const jsonResponse = JSON.parse(response)
                resolve(jsonResponse.result)
            }
        };
        var data = JSON.stringify({ "link": url, "generator": "owo", "preventScrape": true, "owoify": false});
        xhr.send(data);
    })
}

async function main() {
    const commands = [
        OwoifyCommand
    ];
    try {
      console.log('Started refreshing application (/) commands.');
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: commands
      });
      client.login(process.env.TOKEN);
    } catch (err) {
      console.log(err);
    }
  }
  
  main();