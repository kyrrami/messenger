import { requireUser } from '../utils/auth'

export default defineEventHandler (async (event) => {
    const { userId } = requireUser (event)
    const body = await readBody (event) 
    const chatId = body.chatId
    const text = body.text
    
    if (!chatId || !text) {
        throw createError ({
            statusCode: 400
        })
    }

    const selectResult = await pool.query ('SELECT id FROM Chats WHERE id = $1 AND (id_users_1 = $2 OR id_users_2 = $3)', [chatId, userId, userId]) 
    if (selectResult.rows.length === 0) {
        throw createError ({
            statusCode: 403
        })
    }

    const insertResult = await pool.query ('INSERT INTO Messages (id_user, id_chat, message) VALUES ($1, $2, $3) RETURNING id, message, date', [userId, chatId, text])

    return insertResult.rows[0]
})