const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const Genius = require("genius-lyrics");

module.exports = {
    name: "getlyrics",
    type: ApplicationCommandType.ChatInput,
    description: "Get lyrics for a song.",
    options: [
        {
            name: "song",
            description: "Song to get lyrics for.",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    run: async(client, interaction) => {
        await interaction.deferReply();
        const { GeniusClient } = require("../../../Events/Ready.js");
        const song = interaction.options.getString("song");
        const searches = (await GeniusClient.songs.search(song)).slice(0, 5);
        const embed = new EmbedBuilder()
            .setTitle(`Top 5 results for '${song}'`)
            .setDescription("Click the buttons below to view lyrics for the song.")
            .setColor("Blurple")
            .setTimestamp()
            .setThumbnail(searches[0].thumbnail)
            .addFields(...searches.map((song, index) => {
                return { name: `${index+1}. ${song.featuredTitle} - ${song.artist.name}`, value: `**Lyrics state:** ${song._raw.lyrics_state == "complete" ? "✅" : "❌"}` };
            }));
        const menu = new StringSelectMenuBuilder()
            .setCustomId("getlyricschoices")
            .setPlaceholder("Select a song to view lyrics for.")
            .addOptions(...searches.map((song, index) => {
                return new StringSelectMenuOptionBuilder()
                    .setLabel(`${index+1}. ${song.featuredTitle} - ${song.artist.name}`)
                    .setDescription(`Lyrics state: ${song._raw.lyrics_state == "complete" ? "✅" : "❌"}`)
                    .setValue(`${song.featuredTitle};${index}`);
            }));
        const actionRow = new ActionRowBuilder()
            .addComponents(menu);
        await interaction.editReply({
            embeds: [embed],
            components: [actionRow]
        });
    }
};