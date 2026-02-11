const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Unlocks a locked channel.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to unlock.")
        .setRequired(true),
    ),
  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");
    if (!channel) return interaction.reply("Invalid channel.");

    await channel.permissionOverwrites.edit(interaction.guild.id, {
      SEND_MESSAGES: true,
      VIEW_CHANNEL: true,
    });

    await interaction.reply(`Channel ${channel} has been unlocked.`);
  },
};
