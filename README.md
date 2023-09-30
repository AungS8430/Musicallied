<p align="center">
    <a href="https://discord.gg/Ete37BuAbb"><img src="https://img.shields.io/badge/discord-invite-5865f2?style=for-the-badge&logo=discord&logoColor=white"></a>
    <img src="https://img.shields.io/github/issues/AungS8430/Musicallied.svg?style=for-the-badge">
    <img src="https://img.shields.io/github/forks/AungS8430/Musicallied.svg?style=for-the-badge">
    <img src="https://img.shields.io/github/stars/AungS8430/Musicallied.svg?style=for-the-badge">
</p>

# Musicallied

Musicallied is a Discord.js bot written in Node.js, its purpose is to update users with top charts, lyrics, artists, and more coming soon!

## Changelog

- Added `/getartist`, `/getchart`, `/getlyrics` and `/subcription` command.
- Introduces a subcription manager to make maintaining subcription features easier.
- Integrates with MongoDB using Mongoose.
- Use [node-genius-lyrics](https://github.com/zyrouge/node-genius-lyrics) to fetch lyrics from Genius.
- Use [billboard-top-100](https://github.com/darthbatman/billboard-top-100) to get charts from Billboard.

## Features

- Colorful and organized logging.
- Command to get artists, charts, lyrics.
- Subcription management with MongoDB integration, brodcast chart updates to subcribed channels.

## Installation

To run Musicallied locally, follow these steps:

1. Clone the repository by downloading it as a ZIP file or running the command `git clone https://github.com/AungS8430/Musicallied`.
2. Navigate to the template's directory and run the command `npm install` (make sure npm is installed).
3. Once all the required modules are installed, open the `Src/Credentials/Config.js` file and fill in the necessary information.
4. Dublicate `.env.example` file and rename it to `.env`, then put your tokens in there. NEVER SHARE ANY OF THOSE TOKEN WITH ANYBODY
4. Run the command `node bot.js` or `node .` to start the bot.

## Contribution

Contributions are welcome. To contribute, please follow these guidelines:

1. Fork the `Development` branch. **Important: All changes must be made to the Development branch.**
2. Make your changes in your forked repository.
3. Open a pull request to the `Development` branch, and it will be reviewed promptly.
4. If everything checks out, the pull request will be merged.

## Feature requests

Feel free to request features or report bugs, just create an issue and select a corect labels, issues will be reviewed shortly.
