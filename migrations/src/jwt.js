import jwt from 'jsonwebtoke'
import { AuthenticationError } from 'apollo-server-koa'

export function verifyToken(ctx) {
    const auth = ctx.request.header.authorization

    if (auth === undefined) {
        return
    }

    const [prefix, raw] = auth.split(' ')

    if (prefix !== 'Bearer') {
        return
    }

    try {
        return jwt.verify(raw, 'secret')
    } catch (error) {
        throw new AuthenticationError('Unauthenticated')
    }
}

export function parseScopes(token) {
    return token.scopes
}