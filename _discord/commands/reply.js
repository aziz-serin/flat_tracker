// This command exists if the user does not want to wait for the next update in an hour.
const {SlashCommandBuilder} = require('@discordjs/builders');
const receive_apartments = require('../../scrape/scraper');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reply')
        .setDescription("Gets text from rightMove"),
    async execute(interaction){
        // Extends the waiting time of a command from 3 seconds to 15 minutes
        await interaction.deferReply();
        const all_apartments = await receive_apartments();
        const apartments_arr = all_apartments.split("\n\n\n\n")
        let current = new Date();
        await interaction.editReply(`APARTMENTS AT: ${current.toLocaleTimeString()}:`)
        for(let apartment of apartments_arr){
            await interaction.followUp(apartment);
        }
        await interaction.followUp(`END OF THE APARTMENTS LIST FOR NOW!!!`)
    }
}