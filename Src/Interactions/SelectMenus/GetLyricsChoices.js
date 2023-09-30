const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Genius = require("genius-lyrics");

module.exports = {
    name: "getlyricschoices",
    run: async(client, interaction) => {
        const { GeniusClient } = require("../../Events/Ready.js");
        const value = interaction.values[0];
        const song = value.split(";")[0];
        const index = value.split(";")[1];
        const searches = await GeniusClient.songs.search(song);
        const firstSong = searches[index];
        const lyrics = await firstSong.lyrics();
        const embed = new EmbedBuilder()
            .setTitle(`${firstSong.featuredTitle} - ${firstSong.artist.name}`)
            .setDescription(lyrics)
            .setColor("Blurple")
            .setThumbnail(firstSong.thumbnail)
            .setTimestamp();
        const button = new ButtonBuilder()
            .setLabel("Open in browser")
            .setStyle(ButtonStyle.Link)
            .setURL(firstSong.url);
        const actionRow = new ActionRowBuilder()
            .addComponents(button);
        interaction.reply({
            embeds: [embed],
            components: [actionRow]
        });
    }
};