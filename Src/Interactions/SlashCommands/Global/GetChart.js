const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { getChart } = require('billboard-top-100');

module.exports = {
    name: "getchart",
    type: ApplicationCommandType.ChatInput,
    description: "Get the top 5 songs in a chart.",
    options: [
            {
                    name: "chart",
                    description: "The chart to get. (Default: Hot 100)",
                    type: ApplicationCommandOptionType.String,
                    required: false,
                    choices: [
                            {
                                    name: "Billboard Hot 100",
                                    value: "hot-100"
                            },
                            {
                                    name: "Billboard 200",
                                    value: "billboard-200"
                            },
                            {
                                    name: "Billboard Global 200",
                                    value: "billboard-global-200"
                            },
                            {
                                    name: "Billboard Artist 100",
                                    value: "artist-100"
                            }
                    ]
            },
            {
                    name: "week",
                    description: "The week to get, such as 2016-08-27. (Default: Current week)",
                    type: ApplicationCommandOptionType.String,
                    required: false
            }
    ],
    run: async (client, interaction) => {
        await interaction.deferReply();
        const options = interaction.options.getString("chart") || "hot-100";
        const date = interaction.options.getString("week") || null;
        async function getResult(options, date) {
            return new Promise((resolve, reject) => {
                if (date) {
                    getChart(options, date, (err, chart) => {
                        if (err) {
                            reject(err);
                        } else {
                            const top = chart.songs.slice(0, 5);
                            const week = chart.week;
                            const previousWeek = chart.previousWeek.date;
                            resolve({ top, week, previousWeek });
                        }
                    });
                } else {
                    getChart(options, (err, chart) => {
                        if (err) {
                            reject(err);
                        } else {
                            const top = chart.songs.slice(0, 5);
                            const week = chart.week;
                            const previousWeek = chart.previousWeek.date;
                            resolve({ top, week, previousWeek });
                        }
                    });
                }
            });
        }
        const { top, week, previousWeek } = await getResult(options, date);
        const embed = new EmbedBuilder()
            .setTitle(`Top 5 Songs in ${options.replace("hot-100", "Billboard Top 100").replace("billboard-200", "Billboard 200").replace("billboard-global-200", "Billboard Global 200").replace("artist-100", "Billboard Artist 100")}`)
            .setColor("Blurple")
            .setTimestamp()
            .setFooter({ text: `Week of ${week}` })
            .setThumbnail(top[0].cover)
            .addFields(
                ...top.map((song, index) => {
                    return {
                        name: `${index + 1} ${typeof song.title !== "undefined" ? `${song.title} - ` : ""}${song.artist}`,
                        value: `**Position last week:** ${song.position.positionLastWeek}\n**Peak position:** ${song.position.peakPosition}\n**Week(s) on chart:** ${song.position.weeksOnChart}`,
                    };
                })
            );
        const button1 = new ButtonBuilder()
            .setLabel("See more")
            .setURL(`https://www.billboard.com/charts/${options}/${week}`)
            .setStyle(ButtonStyle.Link);
        const button2 = new ButtonBuilder()
            .setLabel("Last week's chart")
            .setURL(`https://www.billboard.com/charts/${options}/${previousWeek}`)
            .setStyle(ButtonStyle.Link);
        const actionRow = new ActionRowBuilder()
            .addComponents(button1, button2);
        await interaction.editReply({
            embeds: [embed],
            components: [actionRow],
        });
    }
};