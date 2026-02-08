const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
        const logChannel = member.guild.channels.cache.get(process.env.MOD_LOGS);
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setTitle('📤 Medlem forlod serveren')
            .addFields(
                { name: 'Bruger', value: `${member.user.tag} (<@${member.id}>)` },
                { name: 'ID', value: member.id }
            )
            .setColor('Red')
            .setTimestamp();

        await logChannel.send({ embeds: [embed] });
    }
};
