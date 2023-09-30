const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
    name: "subscription",
    type: ApplicationCommandType.ChatInput,
    description: "Manage your subscription.",
    options: [
        {
            name: "channel",
            description: "Channel to manage.",
            type: ApplicationCommandOptionType.Channel,
            required: true
        },
        {
            name: "action",
            description: "Action to do.",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "add",
                    value: "add",
                },
                {
                    name: "remove",
                    value: "remove"
                },
                {
                    name: "get",
                    value: "get"
                }
            ]
        },
        {
            name: "option",
            description: "Option to add/remove.",
            type: ApplicationCommandOptionType.String,
            required: false,
            choices: [
                {
                    name: "all",
                    value: "all"
                },
                {
                    name: "hot-100",
                    value: "hot-100"
                },
                {
                    name: "billboard-200",
                    value: "billboard-200"
                },
                {
                    name: "billboard-global-200",
                    value: "billboard-global-200"
                },
                {
                    name: "artist-100",
                    value: "artist-100"
                }
            ]
        }
    ],
    run: async(client, interaction) => {
        const SubcriptionManager = require("../../../Structures/Managers/SubcriptionManager.js")
        const manager = new SubcriptionManager();
        if (!interaction.member.permissions.has("MANAGE_CHANNEL")) return interaction.reply({ content: "You must have the `Manage Server` permission to use this command.", ephemeral: true });
        await interaction.deferReply();
        const channel = interaction.options.getChannel("channel");
        const action = interaction.options.getString("action");
        const option = interaction.options.getString("option") || null;
        if (action == "add") {
            if (!option) return await interaction.editReply({ content: "```You must provide a option to add.```", ephemeral: true });
            const data = await manager.add({ channel: channel.id, guild: interaction.guild.id, option: option });
            if (data == 1) return await interaction.editReply({ content: "```This channel is already subscribed to this option.```", ephemeral: true });
            if (data == 2) return await interaction.editReply({ content: "```An error occured.```", ephemeral: true });
            if (data == 0) return await interaction.editReply({ content: "```Successfully subscribed to this option.```", ephemeral: true });
        } else if (action == "remove") {
            if (!option) return await interaction.editReply({ content: "```You must provide a option to remove.```", ephemeral: true });
            const data = await manager.remove({ channel: channel.id, guild: interaction.guild.id, option: option });
            if (data == 1) return await interaction.editReply({ content: "```This channel is not subscribed to this option.```", ephemeral: true });
            if (data == 2) return await interaction.editReply({ content: "```An error occured.```", ephemeral: true });
            if (data == 0) return await interaction.editReply({ content: "```Successfully unsubscribed from this option.```", ephemeral: true });
        } else if (action == "get") {
            const data = await manager.get({ channel: channel.id, guild: interaction.guild.id });
            if (data == 1) return await interaction.editReply({ content: "```This channel is not subscribed to any option.```", ephemeral: true });
            const embed = new EmbedBuilder()
                .setTitle("Subscriptions")
                .setDescription(data.map((option) => `* ${option.replace("hot-100", "Billboard Top 100").replace("billboard-200", "Billboard 200").replace("billboard-global-200", "Billboard Global 200").replace("artist-100", "Billboard Artist 100")}`).join("\n") || "None")
                .setColor("Blurple")
                .setTimestamp();
            await interaction.editReply({ embeds: [embed], ephemeral: true });
        }
    }
}