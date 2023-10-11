const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { getChart } = require("billboard-top-100");
const schema = require("../Schemas/Subscription.js");

class SubscriptionManager {
    constructor() { 
        this.charts = ["hot-100", "billboard-200", "billboard-global-200", "artist-100"];
    }
    async add(options) {
        let { channel, guild, option } = options;
        if (!channel) throw new Error("You must provide a channel");
        if (!guild) throw new Error("You must provide a guild");
        if (!option) throw new Error("You must provide a option");
        if (option != "all" && option != "hot-100" && option != "billboard-200" && option != "billboard-global-200" && option != "artist-100") throw new Error("Invalid option");
        const data = await schema.findOne({ guild: guild, channel: channel });
        if (!data || data == {} || data === null || data === undefined) {
            if (option == "all") {
                option = this.charts;
            }
            const newData = new schema({
                guild: guild,
                channel: channel,
                options: option
            });
            try {
                await newData.save();
                return 0;
            } catch (err) {
                return 2;
            }
        }
        if (data.channel == channel) {
            if (data.options.includes(option)) return 1;
            if (option == "all") {
                const newOptions = this.charts.filter((opt) => !data.options.includes(opt));
                await schema.findOneAndUpdate(
                    { guild: guild, channel: channel },
                    { $push: { options: { $each: newOptions } } },
                    { runValidators: true }
                )
                    .then(() => { return 0; })
                    .catch((err) => { return 2; })
            }
            try {
                await schema.findOneAndUpdate(
                    { guild: guild , channel: channel },
                    { options: data.options.push(option) },
                    { runValidators: true }
                )
                return 0;
            } catch (err) {
                return 2;
            }
        }
    }
    async remove(options) {
        const { channel, guild, option } = options;
        if (!channel) throw new Error("You must provide a channel");
        if (!guild) throw new Error("You must provide a guild");
        if (!option) throw new Error("You must provide a option");
        if (option != "all" && option != "hot-100" && option != "billboard-200" && option != "billboard-global-200" && option != "artist-100") throw new Error("Invalid option");
        const data = await schema.findOne({ guild: guild, channel: channel });
        if (!data || data == {} || data === null || data === undefined) return 1;
        if (data.channel == channel) {
            if (option == "all") {
                try {
                    await schema.findOneAndDelete({ guild: guild, channel: channel });
                    return 0;
                } catch (err) {
                    return 2;
                }
            }
            if (!data.options.includes(option)) return 1;
            if (data.options.length == 1) {
                try {
                    await schema.findOneAndDelete({ guild: guild, channel: channel });
                    return 0;
                } catch (err) {
                    return 2;
                }
            }
            try {
                await schema.findOneAndUpdate(
                    { guild: guild , channel: channel },
                    { options: data.options.filter((opt) => opt != option) },
                    { runValidators: true }
                )
                return 0;
            } catch (err) {
                return 2;
            }
        }
    }
    async get(options) {
        const { channel, guild } = options;
        if (!channel) throw new Error("You must provide a channel");
        if (!guild) throw new Error("You must provide a guild");
        const data = await schema.findOne({ guild: guild, channel: channel });
        if (!data || data == {} || data === null || data === undefined) return 1;
        return data.options;
    }
    async brodcast(client) {
        const data = await schema.find({});
        if (!data || data == {} || data === null || data === undefined) return 1;
        for (const i = 0; i < data.length; i++) {
            const channel = data[i].channel;
            const options = data[i].options;
            for (const j = 0; j < options.length; j++) {
                const option = options[j];
                const charts = this.charts;
                for (const k = 0; k < charts.length; k++) {
                    if (option == charts[k]) {
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
                        const embed = new MessageEmbed()
                            .setTitle(`❗Chart Updated❗ Top 5 Songs in ${option.replace("hot-100", "Billboard Top 100").replace("billboard-200", "Billboard 200").replace("billboard-global-200", "Billboard Global 200").replace("artist-100", "Billboard Artist 100")}`)
                            .setDescription(`Previous week: ${previousWeek}`)
                            .setColor("RANDOM")
                            .setTimestamp()
                            .setFooter(`Week of ${week}`)
                            .addFields(...top.map((song) => {
                                return { name: `${song.title} - ${song.artist}`, value: `**Position last week:** ${song.position.positionLastWeek}\n**Peak position:** ${song.position.peakPosition}\n**Week(s) on chart:** ${song.position.weeksOnChart}` };
                            }));
                        const button1 = new ButtonBuilder()
                            .setLabel('See more')
                            .setURL(`https://www.billboard.com/charts/${options}/${week}`)
                            .setStyle(ButtonStyle.Link);
                        const button2 = new ButtonBuilder()
                            .setLabel('Last week\'s chart')
                            .setURL(`https://www.billboard.com/charts/${options}/${previousWeek}`)
                            .setStyle(ButtonStyle.Link);
                        const actionRow = new ActionRowBuilder()
                            .addComponents(button1, button2);
                        await client.channels.cache.get(channel).send({ embeds: [embed], components: [actionRow] });
                        setTimeout(() => {}, 50);
                    }
                }
            }
        }
    }
    async update(client) {
        var weekof;
        getChart((err, chart) => {
            if (err) console.log(err);
            weekof = chart.week;
        });
        setInterval(()=> {
            getChart((err, chart) => {
                if (err) console.log(err);
                if (chart.week != weekof) {
                    weekof = chart.week;
                    this.brodcast(client);
                }
            })
        }, 3600000);
    }
}

module.exports = SubscriptionManager;