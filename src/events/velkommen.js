const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, Embed } = require('discord.js');


module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        const channel = member.guild.channels.cache.get(process.env.WELCOME_CHANNEL_ID);
        const velkomstRoller = ['1470050596638949416', '1470052917829439700', '1470052280224190525', '1470052635347521577', '1470052954882048256'];
        const embed = new EmbedBuilder()
            .setTitle(`Velkommen til ${member.guild.name}!`)
            .setDescription(`<@${member.id}> Joinede serveren!`)
            .addFields(
                { name: 'Regler', value: 'Læs reglerne i <#1470049860357980200>!' },
                { name: 'Support', value: 'Har du brug for hjælp? opret en ticket i <#1470051006938218720>!' },
                { name: 'Rolle', value: 'Få din rolle i <#1470051228028370944>!' },
            )
            .setThumbnail(member.user.displayAvatarURL())
            .setColor('Green')
            .setTimestamp()
        const dmEmbed = new EmbedBuilder()
            .setTitle(`Velkommen til ${member.guild.name}!`)
            .setDescription(`Hej <@${member.id}>, og velkommen til ${member.guild.name}! Vi er glade for at have dig her. `)
            .addFields(
                { name: 'Regler', value: 'Læs reglerne i <#1470049860357980200>!' },
                { name: 'Support', value: 'Har du brug for hjælp? opret en ticket i <#1470051006938218720>!' },
                { name: 'Rolle', value: 'Få din rolle i <#1470051228028370944>!' },
            )
            .setThumbnail(member.user.displayAvatarURL())
            .setColor('Green')
            .setTimestamp()
        await member.send({ embeds: [dmEmbed] });
        return await channel.send({ embeds: [embed] }),
        await member.roles.add(velkomstRoller)
    }
}