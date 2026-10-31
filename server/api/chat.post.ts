import { requireUser } from '../utils/auth'

export default defineEventHandler (async (event) => {
    const { userId } = requireUser(event)
    const body = await readBody (event)
    const targetUserId = Number(body.targetUserId)

    if (!targetUserId) {
        throw createError ({
            statusCode: 400,
            statusMessage: 'Bad request'
        })
    } else if (userId === targetUserId) {
        throw createError ({
            statusCode: 400,
            statusMessage: 'Нельзя создать чат с самим собой'
        })
    }
    const user1 = Math.min(userId, targetUserId)
    const user2 = Math.max(userId, targetUserId)
    const result = await pool.query ('SELECT id FROM Chats WHERE id_users_1 = $1 AND id_users_2 = $2', [user1, user2])

    if (result.rows.length > 0) {
        return {chatId: result.rows[0].id}
    } else {
        const insertResult =await pool.query ('INSERT INTO Chats (id_users_1, id_users_2) VALUES ($1, $2) RETURNING id', [user1, user2])
        return {chatId: insertResult.rows[0].id}
    }
    
})