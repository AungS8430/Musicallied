const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const Genius = require("genius-lyrics");

module.exports = {
    name: "getartist",
    type: ApplicationCommandType.ChatInput,
    description: "Get an artist info.",
    options: [
        {
            name: "artist",
            description: "Artist to get.",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    run: async(client, interaction) => {
        interaction.deferReply();
        const { GeniusClient } = require("../../../Events/Ready.js");
        const searches = await GeniusClient.songs.search(interaction.options.getString("artist"));
        const firstSong = searches[0];
        const artist = firstSong.artist;
        const embed = new EmbedBuilder()
            .setTitle(`${artist.name} ${artist.verified.normal ? "✅" : ""}`)
            .setColor("Blurple")
            .setThumbnail(artist.image)
            .addFields(
                { name: "Popular Songs", value: (await artist.songs({sort: "popularity"})).slice(0, 5).map((song) => `[${song.featuredTitle}](${song.url})`).join("\n") },
            )
            .setTimestamp();
        const button = new ButtonBuilder()
            .setLabel("Open in browser")
            .setStyle(ButtonStyle.Link)
            .setURL(artist.url);
        const actionRow = new ActionRowBuilder()
            .addComponents(button);
        interaction.editReply({
            embeds: [embed],
            components: [actionRow]
        });
    }
};