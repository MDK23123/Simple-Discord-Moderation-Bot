const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'messageDelete',
    async execute(message) {
        if (!message.guild || message.author?.bot) return;

        const logChannel = message.guild.channels.cache.get(process.env.MOD_LOGS);
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setTitle('🗑 Besked slettet')
            .addFields(
                { name: 'Bruger', value: `<@${message.author.id}> (${message.author.tag})` },
                { name: 'Kanal', value: `<#${message.channel.id}>` },
                { name: 'Besked', value: message.content || '*Ingen tekst (embed/billede)*' },
            )
            .setColor('DarkRed')
            .setTimestamp();

        await logChannel.send({ embeds: [embed] });
    }
};
