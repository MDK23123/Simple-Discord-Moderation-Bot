const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase = null;

if (!supabaseUrl || !supabaseKey) {
    console.warn('[WARN COMMAND] Supabase environment variables are missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY.');
} else {
    supabase = createClient(supabaseUrl, supabaseKey);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Administrer bruger advarsler')
        .addSubcommand(sub =>
            sub
                .setName('add')
                .setDescription('Giv en advarsel til en bruger')
                .addUserOption(option =>
                    option
                        .setName('target')
                        .setDescription('Brugeren der skal advares')
                        .setRequired(true),
                )
                .addStringOption(option =>
                    option
                        .setName('reason')
                        .setDescription('Grunden til advarslen')
                        .setRequired(true),
                ),
        )
        .addSubcommand(sub =>
            sub
                .setName('remove')
                .setDescription('Fjern en advarsel fra en bruger')
                .addUserOption(option =>
                    option
                        .setName('target')
                        .setDescription('Brugeren advarslen tilhører')
                        .setRequired(true),
                )
                .addStringOption(option =>
                    option
                        .setName('warning_id')
                        .setDescription('ID på den advarsel du vil fjerne')
                        .setRequired(true),
                ),
        )
        .addSubcommand(sub =>
            sub
                .setName('list')
                .setDescription('Se alle advarsler for en bruger')
                .addUserOption(option =>
                    option
                        .setName('target')
                        .setDescription('Brugeren du vil se advarsler for')
                        .setRequired(true),
                ),
        ),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return await interaction.reply({
                content: '⚠️ Du har ikke tilladelse til at bruge denne kommando! ⚠️',
                ephemeral: true,
            });
        }

        if (!supabase) {
            return await interaction.reply({
                content: '⚠️ Supabase er ikke konfigureret korrekt på botten. Kontakt en administrator. ⚠️',
                ephemeral: true,
            });
        }

        const sub = interaction.options.getSubcommand();
        const targetUser = interaction.options.getUser('target');
        const guildId = interaction.guildId;
        const moderatorId = interaction.user.id;
        const logChannel = interaction.guild.channels.cache.get(process.env.MOD_LOGS);

        try {
            if (sub === 'add') {
                const reason = interaction.options.getString('reason');

                const { data, error } = await supabase
                    .from('warnings')
                    .insert({
                        user_id: targetUser.id,
                        guild_id: guildId,
                        moderator_id: moderatorId,
                        reason,
                    })
                    .select()
                    .single();

                if (error) {
                    console.error('[WARN COMMAND] Supabase insert error:', error);
                    return await interaction.reply({
                        content: '⚠️ Kunne ikke gemme advarslen i databasen. Prøv igen senere. ⚠️',
                        ephemeral: true,
                    });
                }

                const warnEmbed = new EmbedBuilder()
                    .setTitle('Bruger Advaret')
                    .setColor('Yellow')
                    .addFields(
                        { name: 'Bruger:', value: `<@${targetUser.id}> (${targetUser.tag})` },
                        { name: 'Advaret af:', value: `<@${moderatorId}> (${interaction.user.tag})` },
                        { name: 'Grund:', value: reason },
                        { name: 'Advarsels ID:', value: data.id ? `\`${data.id}\`` : 'Ukendt' },
                    )
                    .setTimestamp();

                await interaction.reply({
                    content: `✅ <@${targetUser.id}> har fået en advarsel. ✅`,
                    ephemeral: true,
                });

                if (logChannel) {
                    await logChannel.send({ embeds: [warnEmbed] });
                }
            } else if (sub === 'remove') {
                const warningId = interaction.options.getString('warning_id');

                const { data, error } = await supabase
                    .from('warnings')
                    .delete()
                    .eq('id', warningId)
                    .eq('user_id', targetUser.id)
                    .eq('guild_id', guildId)
                    .select()
                    .single();

                if (error || !data) {
                    console.error('[WARN COMMAND] Supabase delete error or no row:', error);
                    return await interaction.reply({
                        content: '⚠️ Kunne ikke finde eller fjerne den angivne advarsel. ⚠️',
                        ephemeral: true,
                    });
                }

                await interaction.reply({
                    content: `✅ Advarsel med ID \`${warningId}\` for <@${targetUser.id}> er blevet fjernet. ✅`,
                    ephemeral: true,
                });
            } else if (sub === 'list') {
                const { data, error } = await supabase
                    .from('warnings')
                    .select('id, reason, created_at, moderator_id')
                    .eq('user_id', targetUser.id)
                    .eq('guild_id', guildId)
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error('[WARN COMMAND] Supabase select error:', error);
                    return await interaction.reply({
                        content: '⚠️ Kunne ikke hente advarsler fra databasen. ⚠️',
                        ephemeral: true,
                    });
                }

                if (!data || data.length === 0) {
                    return await interaction.reply({
                        content: `✅ <@${targetUser.id}> har ingen registrerede advarsler. ✅`,
                        ephemeral: true,
                    });
                }

                const description = data
                    .map((w, index) => {
                        const date = w.created_at ? new Date(w.created_at).toLocaleString('da-DK') : 'Ukendt dato';
                        return `\`${index + 1}.\` ID: \`${w.id}\`\n• Grund: ${w.reason}\n• Givet af: <@${w.moderator_id}>\n• Dato: ${date}`;
                    })
                    .join('\n\n');

                const listEmbed = new EmbedBuilder()
                    .setTitle(`Advarsler for ${targetUser.tag}`)
                    .setColor('Yellow')
                    .setDescription(description.length > 4000 ? `${description.slice(0, 3990)}…` : description)
                    .setFooter({ text: `Total advarsler: ${data.length}` })
                    .setTimestamp();

                await interaction.reply({
                    embeds: [listEmbed],
                    ephemeral: true,
                });
            }
        } catch (err) {
            console.error('[WARN COMMAND] Uventet fejl:', err);
            return await interaction.reply({
                content: '⚠️ Der opstod en uventet fejl under håndtering af kommandoen. ⚠️',
                ephemeral: true,
            });
        }
    },
};