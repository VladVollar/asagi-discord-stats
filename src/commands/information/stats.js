import { SlashCommandBuilder } from 'discord.js'
import { createCanvasImage } from '../../utils/createCanvasImageStats.js'

export const data = new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Статистика пользователей.')

export async function execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true })

    const guild = await client.guilds.fetch(interaction.guildId)
    await guild.members.fetch() // получить актуальные данные о пользователях

    const onlineUsers = Array.from(guild.members.cache.filter(m => m.presence?.status === 'online')).length
    const idleUsers = Array.from(guild.members.cache.filter(m => m.presence?.status === 'idle')).length
    const offlineUsers = Array.from(guild.members.cache.filter(m => !m.presence?.status || m.presence.status === 'offline')).length
    const dndUsers = Array.from(guild.members.cache.filter(m => m.presence?.status === 'dnd')).length

    let options = {
        content: '',
    }

    const filename = await createCanvasImage(interaction.user, `${onlineUsers}`, `${idleUsers}`, `${dndUsers}`, `${offlineUsers}`)
    options.files = [filename]
    await interaction.editReply(options).catch(async () => {
        await interaction.editReply(options)
    })
    
}
