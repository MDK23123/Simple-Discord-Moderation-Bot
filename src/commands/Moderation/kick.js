const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick en bruger fra serveren')
        .addUserOption(option => option.setName('target').setDescription('Brugeren der skal kickes').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Grunden til kick').setRequired(false)),

    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'Ingen grund angivet!';
        const logChannel = interaction.guild.channels.cache.get(process.env.MOD_LOGS);
        const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

        // Check permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return await interaction.reply({ content: '⚠️ Du har ikke tilladelse til at bruge denne kommando! ⚠️', ephemeral: true });
        }

        // Tjek rolle kun hvis medlemmet er på serveren
        if (member && member.roles.highest.position >= interaction.member.roles.highest.position) {
            return await interaction.reply({ content: '⚠️ Du kan ikke kick en bruger med samme eller højere rolle end dig! ⚠️', ephemeral: true });
        }

        // Tjek om brugeren er på serveren
        if (!member) {
            return await interaction.reply({ content: '⚠️ Denne bruger er ikke på serveren! ⚠️', ephemeral: true });
        }

        // Kick brugeren
        await member.kick(reason);

        // Kick embed
        const kickEmbed = new EmbedBuilder()
            .setTitle('Bruger Kicket')
            .addFields(
                { name: 'Bruger:', value: `<@${targetUser.id}> (${targetUser.id})` },
                { name: 'Kicket af:', value: `<@${interaction.user.id}> (${interaction.user.id})` },
                { name: 'Grund:', value: reason }
            )
            .setColor('Orange')
            .setTimestamp();

        // Send ephemeral besked til command-brugeren
        await interaction.reply({ content: `✅ <@${targetUser.id}> er blevet kicket! ✅`, ephemeral: true });

        // Send til logkanal
        if (logChannel) {
            await logChannel.send({ embeds: [kickEmbed] });
        }
    }
}
