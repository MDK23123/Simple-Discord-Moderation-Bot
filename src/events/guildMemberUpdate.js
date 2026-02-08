const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildMemberUpdate',
    async execute(oldMember, newMember) {
        const logChannel = newMember.guild.channels.cache.get(process.env.MOD_LOGS);
        if (!logChannel) return;

        // -----------------------------
        // 🔹 Nickname ændring
        // -----------------------------
        if (oldMember.nickname !== newMember.nickname) {
            const embed = new EmbedBuilder()
                .setTitle('✏️ Nickname ændret')
                .addFields(
                    { name: 'Bruger', value: `<@${newMember.id}> (${newMember.user.tag})` },
                    { name: 'Før', value: oldMember.nickname || 'Ingen', inline: true },
                    { name: 'Efter', value: newMember.nickname || 'Ingen', inline: true }
                )
                .setColor('Yellow')
                .setTimestamp();

            await logChannel.send({ embeds: [embed] });
        }

        // -----------------------------
        // 🔹 Roller ændret
        // -----------------------------
        const oldRoles = oldMember.roles.cache;
        const newRoles = newMember.roles.cache;

        const addedRoles = newRoles.filter(role => !oldRoles.has(role.id));
        const removedRoles = oldRoles.filter(role => !newRoles.has(role.id));

        if (addedRoles.size > 0 || removedRoles.size > 0) {
            const embed = new EmbedBuilder()
                .setTitle('🎭 Roller opdateret')
                .addFields(
                    { name: 'Bruger', value: `<@${newMember.id}> (${newMember.user.tag})` },
                    { name: 'Tilføjet', value: addedRoles.map(r => `<@&${r.id}>`).join(', ') || 'Ingen' },
                    { name: 'Fjernet', value: removedRoles.map(r => `<@&${r.id}>`).join(', ') || 'Ingen' }
                )
                .setColor('Blue')
                .setTimestamp();

            await logChannel.send({ embeds: [embed] });
        }

        // -----------------------------
        // 🔹 Timeout / Untimeout
        // -----------------------------
        if (oldMember.communicationDisabledUntil !== newMember.communicationDisabledUntil) {
            const timedOut = newMember.communicationDisabledUntil;

            const embed = new EmbedBuilder()
                .setTitle(timedOut ? '⏳ Bruger timeoutet' : '✅ Timeout fjernet')
                .addFields(
                    { name: 'Bruger', value: `<@${newMember.id}> (${newMember.user.tag})` },
                    { name: 'Status', value: timedOut
                        ? `Timeout indtil: <t:${Math.floor(timedOut.getTime() / 1000)}:F>`
                        : 'Brugeren kan skrive igen'
                    }
                )
                .setColor(timedOut ? 'Red' : 'Green')
                .setTimestamp();

            await logChannel.send({ embeds: [embed] });
        }
    }
};
