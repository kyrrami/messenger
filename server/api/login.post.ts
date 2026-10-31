import { z } from 'zod'
import bcrypt from 'bcrypt'
import { generateToken } from '../utils/auth' //

const loginSchema = z.object ({
    login : z.string(),
    password : z.string()
})

export default defineEventHandler (async (event) => {
    const body = await readBody (event)
    const validate = loginSchema.parse(body)
    
    const result = await pool.query('SELECT * FROM Users WHERE login = $1', [validate.login])

    if (result.rows.length === 0) {
        throw createError ({
            statusCode: 401,
            statusMessage: 'Неверный логин или пароль'
        })
    } 
    
    const user = result.rows[0]
    const isPasswordValid = await bcrypt.compare(validate.password, user.password)
    
    if (!isPasswordValid) {
        throw createError ({
            status: 401,
            statusMessage: 'Неверный логин или пароль'
        })
    }
    
    delete user.password

    const token = generateToken(user.id)

    return {token, user}
})