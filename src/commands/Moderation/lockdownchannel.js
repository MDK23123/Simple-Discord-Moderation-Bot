const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Locks the current channel"),
  async execute(interaction) {
    const channel = interaction.channel;
    const embed = new EmbedBuilder()
      .setTitle("Channel Locked")
      .setDescription(`Channel ${channel.name} has been locked.`)
      .setColor("#FF0000");

    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SendMessages: false,
    });

    await interaction.reply({ embeds: [embed] });
    return;
  },
};
