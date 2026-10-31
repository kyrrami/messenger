import { requireUser } from '../utils/auth'

export default defineEventHandler (async (event) => {
    const { userId } = requireUser (event)
    const query = getQuery(event)
    const chatId = query.chatId

    const selectResult = await pool.query ('SELECT id FROM Chats WHERE id = $1 AND (id_users_1 = $2 OR id_users_2 = $3)', [chatId, userId, userId]) 
    if (selectResult.rows.length === 0) {
        throw createError ({
            statusCode: 403
        })
    }

    const result = await pool.query ('SELECT Messages.id AS id, Messages.id_user AS id_user, Messages.message AS message, Messages.date AS date, Users.username AS username  FROM Messages JOIN Users ON Messages.id_user = Users.id WHERE id_chat = $1 ORDER BY date ASC', [chatId])

    return result.rows
})