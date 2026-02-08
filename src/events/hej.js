module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.content === 'hej' || message.content === 'Hej') {
            message.reply('Hejsa!');
        }
    }
}