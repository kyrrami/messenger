import { requireUser } from '../utils/auth'

export default defineEventHandler (async (event) => {
    const { userId } = requireUser (event)

    const result = await pool.query ('SELECT id, login, username FROM Users WHERE id != $1', [userId])
    
    const users = result.rows

    return { users }
})