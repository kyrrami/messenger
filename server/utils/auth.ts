import jwt from 'jsonwebtoken';
import { createError, getHeader } from 'h3'

interface TokenPayload {
    userId: number;
}

export const generateToken = (userId: number) => { 
    const secretKey = process.env.JWT_SECRET!
    const payload = {userId}

    const token = jwt.sign (payload, secretKey, {expiresIn: '7d'})

    return token;
 }

 export const requireUser = (event: any): TokenPayload  => {

    const authHeader = getHeader(event, 'authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw createError ({ statusCode: 401, statusMessage: 'Unauthorized'})
    }

    const token = authHeader.replace('Bearer ', '')

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload

        return decoded
    } catch (error) {
        throw createError ({statusCode: 401, statusMessage: 'Invalid Token'})
    }
 }