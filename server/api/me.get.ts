import { requireUser } from '../utils/auth'

export default defineEventHandler (async (event) => {
    const { userId } = requireUser (event) 

    const result = await pool.query ('SELECT id, login, username, email FROM Users WHERE id =$1', [userId])

    if (result.rows.length === 0 ) {
        throw createError ({
            statusCode : 404,
            statusMessage: 'Пользователь не найден'
        })
    }

    const user = result.rows[0]
    return { user }
})