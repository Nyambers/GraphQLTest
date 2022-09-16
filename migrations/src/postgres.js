import PgAsync from 'pg-async'
import once from 'once'
import dotenv from 'dotenv-safe'
dotenv.load()

async function setup(pg, schema) {
    await pg.transaction(async (tx) => {
        const {drop, create} = schema
        if (drop) {
            for (const q of drop) {
                await tx.query(q)
            }
        }
        if (create) {
            for (const q of create) {
                await tx.query(q)
            }
        }
    })
}

export function postgresMiddleware(uri, schemas = []) {
    const pg = new PgAsync({ connectionString: uri })
    const setupSchema = once(setup)
    return async (ctx, next) => {
        await setupSchema(pg, schemas)
        ctx._postgres = pg
        return await next()
    }
}

export function postgres(ctx) {
    return ctx._postgres
}