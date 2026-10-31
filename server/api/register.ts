import { z } from 'zod'
import bcrypt from 'bcrypt'
import { generateToken } from '../utils/auth' 

const registerSchema = z.object({
    login: z.string().min(3).max(30),
    password: z.string().min(6).max(255),
    username: z.string().min(2).max(30),
    email: z.string().email()
})

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const validate = registerSchema.parse(body)
    
    const result = await pool.query('SELECT id FROM Users WHERE login = $1 OR email = $2', [validate.login, validate.email])

    if (result.rows.length > 0) {
        throw createError({
            statusCode: 409,
            statusMessage: 'Пользователь уже существует'
        })
    }

    const hashedPassword = await bcrypt.hash(validate.password, 10)
    
    const insertResult = await pool.query('INSERT INTO Users (login, password, username, email) VALUES ($1, $2, $3, $4) RETURNING id, login, username, email', [validate.login, hashedPassword, validate.username, validate.email])
    
    const user = insertResult.rows[0]
    const token = generateToken(user.id)

    return { token, user }
})