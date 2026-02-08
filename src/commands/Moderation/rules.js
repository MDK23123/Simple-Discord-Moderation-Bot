const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rules')
        .setDescription('Displays the server rules.'),
    async execute(interaction) {
        const channel = interaction.channel;
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({ content: '⚠️ Du har ikke tilladelse til at bruge denne kommando! ⚠️', ephemeral: true });
        }

        const rulesEmbed1 = new EmbedBuilder()
            .setTitle('📜 Server Regler 📜')
            .setDescription("Her kan du finde vores server regler. Læs dem venligst igennem og følg dem for at sikre en god oplevelse for alle medlemmer.")
        const generelRules = new EmbedBuilder()
            .setTitle('📌 Generelle Regler 📌')
            .addFields(
                { name: '1. Respekt', value: 'Vis respekt for alle medlemmer. Ingen form for diskrimination, mobning eller chikane vil blive tolereret.' },
                { name: '2. Sprog', value: 'Brug et passende sprog. Undgå bandeord og stødende udtryk.' },
                { name: '3. Spam', value: 'Undgå at spamme i kanalerne. Dette inkluderer gentagne beskeder, emojis eller links.' },
                { name: '4. Reklame', value: 'Reklame for andre servere, produkter eller tjenester er ikke tilladt uden tilladelse fra administrationen.' },
                { name: '5. Privatliv', value: 'Del ikke personlige oplysninger om dig selv eller andre medlemmer.' }
            );
        const voiceRules = new EmbedBuilder()
            .setTitle('🎤 Voice Chat Regler 🎤')
            .addFields(
                { name: '1. Mikrofon', value: 'Brug en mikrofon, der fungerer korrekt, og undgå baggrundsstøj.' },
                { name: '2. Respekt', value: 'Vis respekt for andre i voice chatten. Undgå at afbryde eller tale over andre.' },
                { name: '3. Musik', value: 'Brug musik bots ansvarligt og undgå at spille støjende eller upassende musik.' },
                { name: '4. Spam', value: 'Undgå at spamme i voice chatten, herunder gentagne lyde eller stemmeforvrængning.' }
            );
        const moderationRules = new EmbedBuilder()
            .setTitle('⚖️ Moderation Regler ⚖️')
            .addFields(
                { name: '1. Følg Moderationens Anvisninger', value: 'Følg altid instruktioner fra moderatorer og administratorer.' },
                { name: '2. Appel Processen', value: 'Hvis du mener, at en moderationsbeslutning er uretfærdig, kan du appellere ved at kontakte en administrator.' },
                { name: '3. Ingen Diskrimination', value: 'Moderation vil blive udført uden diskrimination baseret på race, køn, alder, religion eller andre personlige karakteristika.' },
                { name: '4. Transparens', value: 'Moderation beslutninger vil blive kommunikeret klart og åbent for at sikre forståelse blandt medlemmerne.' }
            )
            .setTimestamp()
            .setFooter({ text: 'Tak fordi du følger vores regler og hjælper med at skabe et positivt fællesskab!' });

        await channel.send({ embeds: [rulesEmbed1, generelRules, voiceRules, moderationRules] })
        await interaction.reply({ content: '✅ Reglerne er blevet sendt i kanalen! ✅', ephemeral: true })
        return;
    }
}