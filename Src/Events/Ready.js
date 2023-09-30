const { ActivityType } = require("discord.js");
const { bold } = require("chalk");
const { rootPath } = require("../../bot");
const { statSync } = require("node:fs");
const directorySearch = require("node-recursive-directory");
const Genius = require("genius-lyrics");
const mongoose = require("mongoose");
const dotenv = require('dotenv').config();
const SubcriptionManager = require("../Structures/Managers/SubcriptionManager.js");
module.exports = {
    name: "ready",
    runOnce: true,
    run: async (client) => {
        client.user.setActivity("Musically Inspired🎵🎶", {
            type: ActivityType.Listening
        });
        try {
            const GeniusClient = new Genius.Client(process.env.GENIUS_TOKEN);
            module.exports.GeniusClient = GeniusClient;
            console.log(bold.green("[Genius] ") + bold.blueBright("Connected to Genius API."))
        } catch (err) {
            console.log(bold.red("[Genius] ") + bold.yellowBright("Could not connect to Genius API."))
        }
        try {
            mongoose.connect(process.env.MONGODB_URL)
            console.log(bold.green("[MongoDB] ") + bold.blueBright("Connected to MongoDB."))
        } catch (err) {
            console.log(bold.red("[MongoDB] ") + bold.yellowBright("Could not connect to MongoDB."))
        }
        try {
            const subcription = new SubcriptionManager(); 
            await subcription.update(client);
            console.log(bold.green("[SubcriptionManager] ") + bold.blueBright("SubcriptionManager is running."))
        } catch (err) {
            console.log(bold.red("[SubcriptionManager] ") + bold.yellowBright("Could not run SubcriptionManager."))
            console.log(err)
        }

        let allSlashCommands = 0;
        const slashCommandsTotalFiles = await directorySearch(`${rootPath}/Src/Interactions/SlashCommands`);
        await slashCommandsTotalFiles.forEach(cmdFile => {
            if (statSync(cmdFile).isDirectory()) return;
            const slashCmd = require(cmdFile);
            if (!slashCmd.name || slashCmd.ignore || !slashCmd.run) return;
            else allSlashCommands++
        });

        console.log(bold.green("[Client] ") + bold.blue(`Logged into ${client.user.tag}`));
        if (client.messageCommands.size > 0) console.log(bold.red("[MessageCommands] ") + bold.cyanBright(`Loaded ${client.messageCommands.size} MessageCommands with ${bold.white(`${client.messageCommandsAliases.size} Aliases`)}.`));
        if (client.events.size > 0) console.log(bold.yellowBright("[Events] ") + bold.magenta(`Loaded ${client.events.size} Events.`));
        if (client.buttonCommands.size > 0) console.log(bold.whiteBright("[ButtonCommands] ") + bold.greenBright(`Loaded ${client.buttonCommands.size} Buttons.`));
        if (client.selectMenus.size > 0) console.log(bold.red("[SelectMenus] ") + bold.blueBright(`Loaded ${client.selectMenus.size} SelectMenus.`));
        if (client.modalForms.size > 0) console.log(bold.cyanBright("[ModalForms] ") + bold.yellowBright(`Loaded ${client.modalForms.size} Modals.`));
        if (allSlashCommands > 0) console.log(bold.magenta("[SlashCommands] ") + bold.white(`Loaded ${allSlashCommands} SlashCommands.`));
    }
};