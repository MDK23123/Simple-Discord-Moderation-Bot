const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user from the server')
        .addUserOption(option => option.setName('target').setDescription('The user to unban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the unban').setRequired(false)),

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

        if (!isBanned) {
            return await interaction.reply({ content: '⚠️ Denne bruger er ikke bannet! ⚠️', ephemeral: true });
        }

        // Unban embed
        const unbanEmbed = new EmbedBuilder()
            .setTitle('Bruger Unbannet')
            .addFields(
                { name: 'Bruger:', value: `<@${targetUser.id}> (${targetUser.id})` },
                { name: 'Unbannet af:', value: `<@${interaction.user.id}> (${interaction.user.id})` },
                { name: 'Grund:', value: reason }
            )
            .setColor('Green')
            .setTimestamp();
        // Send ephemeral besked til command-brugeren
        await interaction.reply({ content: `✅ <@${targetUser.id}> er blevet unbannet! ✅`, ephemeral: true });

        // Unban brugeren
        await interaction.guild.members.unban(targetUser.id);

        // Send til logkanal
        if (logChannel) {
            await logChannel.send({ embeds: [unbanEmbed] });
        }
    }
}