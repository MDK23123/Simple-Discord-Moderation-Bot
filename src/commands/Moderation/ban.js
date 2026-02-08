const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from the server')
        .addUserOption(option => option.setName('target').setDescription('The user to ban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the ban').setRequired(false)),

    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'Ingen grund angivet!';
        const logChannel = interaction.guild.channels.cache.get(process.env.MOD_LOGS);
        const bans = await interaction.guild.bans.fetch();
        const isBanned = bans.has(targetUser.id);

        // Check permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return await interaction.reply({ content: '⚠️ Du har ikke tilladelse til at bruge denne kommando! ⚠️', ephemeral: true });
        }

        if (isBanned) {
            return await interaction.reply({ content: '⚠️ Denne bruger er allerede bannet! ⚠️', ephemeral: true });
        }

        // Kan ikke banne sig selv
        if (targetUser.id === interaction.user.id) {
            return await interaction.reply({ content: '⚠️ Du kan ikke banne dig selv! ⚠️', ephemeral: true });
        }
        const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

        // Tjek rolle kun hvis medlemmet er på serveren
        if (member && member.roles.highest.position >= interaction.member.roles.highest.position) {
            return await interaction.reply({ content: '⚠️ Du kan ikke banne en bruger med samme eller højere rolle end dig! ⚠️', ephemeral: true });
        }
        // Ban embed
        const banEmbed = new EmbedBuilder()
            .setTitle('Bruger Bannet')
            .addFields(
                { name: 'Bruger:', value: `<@${targetUser.id}> (${targetUser.tag})` },
                { name: 'Bannet af:', value: `<@${interaction.user.id}> (${interaction.user.tag})` },
                { name: 'Grund:', value: reason }
            )
            .setColor('Red')
            .setTimestamp();

        // Send ephemeral besked til command-brugeren
        await interaction.reply({ content: `✅ <@${targetUser.id}> er blevet bannet! ✅`, ephemeral: true });

        // Ban brugeren
        await interaction.guild.members.ban(targetUser.id, { reason });

        // Send til logkanal
        if (logChannel) {
            await logChannel.send({ embeds: [banEmbed] });
        }
    }
}
