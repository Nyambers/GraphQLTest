export function cors(options) {
    const opts = Object.assign({
        origin: '*',
        credentials: true,
        headers: ['authorization', 'content-type']
    }, options)
    return async (ctx, next) => {
        const { origin } = ctx.req.headers
        const allowedMethods = ['GET', 'POST']
        const allowOrigin = origin
            && origin.endsWith('.amagiacademy.com')
            ? origin
            : opts.origin
        ctx.set('Access-Control-Allow-Origin', allowOrigin)
        ctx.set('Access-Control-Allow-Credentials', opts.credentials)
        ctx.set('Access-Control-Allow-Headers', opts.headers.join(', '))
        ctx.set('Access-Control-Allow-Methods', allowedMethods.join(', '))
        if (ctx.method === 'OPTIONS') {
            ctx.status = 200
        }
        return await next()
    }
}