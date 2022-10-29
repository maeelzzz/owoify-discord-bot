import { SlashCommandBuilder } from 'discord.js';

const owoify = new SlashCommandBuilder()
.setName('owoify')
.setDescription("Owoify l'url demandé.")
.addStringOption(option =>
    option
        .setName('url')
        .setDescription('URL')
        .setRequired(true),
    )

export default owoify.toJSON();