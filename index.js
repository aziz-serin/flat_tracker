// Require the necessary discord.js classes
const { Client, GatewayIntentBits, Collection} = require('discord.js');
const { token, channel_id } = require('./config.json');
const receive_apartments = require('./scrape/scraper');
const fs = require('node:fs');
const path = require('node:path');
const cron = require('cron');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// edit if you change the file structure
client.commands = new Collection();
const commandsPath = path.join(__dirname, '_discord' ,'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

// This project does not need this part, since there is only one slash command, but if you have multiple slash commands it helps
for (const file of commandFiles){
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// set a new item in the collection
	client.commands.set(command.data.name, command);
}


client.on('interactionCreate', async interaction =>{
	// recognise the slash command and execute it
	if (interaction.isChatInputCommand()) {
		const command = client.commands.get(interaction.commandName);

		if(!command) return;
		try{
			await command.execute(interaction);
		} catch (error){
			console.error(error);
			await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
		}
	}
});

client.once("ready", async () => {
      console.log(`Online as ${client.user.tag}`);
	  // every hour from 9am to 5pm, monday to saturday
      let scheduledMessage = new cron.CronJob('00 9-17/2 * * 1-6', async () => {
         const channel = client.channels.cache.get(channel_id);
         const all_apartments = await receive_apartments();
         const apartments_arr = all_apartments.split("\n\n\n\n")
         let current = new Date();
		 await channel.send(`APARTMENTS AT: ${current.toLocaleTimeString()}:`)
         for(let apartment of apartments_arr){
             await channel.send(apartment);
         }
	  },{
		  // this is optional but idk what the default one is, so to make sure specify your timezone
		  timezone: "Europe/London"
	  });

        // When you want to start it, use:
        scheduledMessage.start()
    });
// Login to Discord with your client's token
client.login(token);