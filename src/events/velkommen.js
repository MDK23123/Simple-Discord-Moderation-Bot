const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        const channel = member.guild.channels.cache.get(process.env.WELCOME_CHANNEL_ID);
        const logChannel = member.guild.channels.cache.get(process.env.MOD_LOGS);

        const velkomstRoller = [
            '1470050596638949416',
            '1470052917829439700',
            '1470052280224190525',
            '1470052635347521577',
            '1470052954882048256'
        ];

        // Giv roller
        await member.roles.add(velkomstRoller).catch(() => null);

        // Lav rolle mention liste
        const roleMentions = velkomstRoller
            .map(id => `<@&${id}>`)
            .join(', ');

        // Velkomst embed (server)
        const embed = new EmbedBuilder()
            .setTitle(`Velkommen til ${member.guild.name}!`)
            .setDescription(`<@${member.id}> joinede serveren!`)
            .addFields(
                { name: 'Regler', value: 'Læs reglerne i <#1470049860357980200>!' },
                { name: 'Support', value: 'Opret en ticket i <#1470051006938218720>!' },
                { name: 'Rolle', value: 'Få din rolle i <#1470051228028370944>!' },
            )
            .setThumbnail(member.user.displayAvatarURL())
            .setColor('Green')
            .setTimestamp();

        // DM embed
        const dmEmbed = new EmbedBuilder()
            .setTitle(`Velkommen til ${member.guild.name}!`)
            .setDescription(`Hej <@${member.id}>, velkommen!`)
            .setColor('Green')
            .setTimestamp();

        // Log embed
        const logEmbed = new EmbedBuilder()
            .setTitle('📥 Nyt medlem joinet')
            .addFields(
                { name: 'Bruger', value: `<@${member.id}> (${member.user.tag})` },
                { name: 'Roller givet', value: roleMentions || 'Ingen' }
            )
            .setColor('Blue')
            .setTimestamp();

        // Send beskeder
        if (channel) await channel.send({ embeds: [embed] });
        await member.send({ embeds: [dmEmbed] }).catch(() => null);
        if (logChannel) await logChannel.send({ embeds: [logEmbed] });

        console.log(`${member.user.tag} joinede og fik roller`);
    }
};
