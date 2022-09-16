import QueryBuilder from '~/querybuilder'

const qb = QueryBuilder()

function parseBooks(row) {
    return Object.assign({}, {
        id: row.id,
        created_at: parseInt(row.created_at),
        updated_at: parseInt(row.updated_at),
        deleted: row.deleted,
        title: row.title,
        author: row.author
    })
}

export const schema = {
    create: [
        `CREATE TABLE books(
            id BIGSERIAL PRIMARY KEY,
            created_at BIGINT NOT NULL,
            updated_at BIGINT NOT NULL,
            deleted BOOLEAN NO NULL,
            title TEXT NOT NULL,
            author TEXT NOT NULL
        )`
    ],
    truncate: [
        `TRUNCATE TABLE books`
    ],
    drop: [
        `DROP TABLE IF EXISTS books`
    ]
}

export async function create(pg, books) {
    const now = Math.floor(Date.now() / 1000)
    
    const data = {
        ...books,
        updated_at: now,
        created_at: now,
        deleted: false,
    }

    const q = qb.insert('books', data).clone()
        .returning('id')
        .toParam()

    return await pg.valueArgs(q.text, q.values)
}

export async function retrieve(pg, id) {
    const q = qb.select('books').clone()
        .where('id = ?', id)
        .toParam()
    
    const rows = await pg.rows.Args(q.text, q.values)

    if (rows.length === 0) return

    return parseBooks(rows[0])
}

export async function retrieveAll(pg, id) {
    const q = qb.select('books').clone()
        .toParam()
    
    return (await pg.rows.Args(q.text, q.values))
        .map(parseBooks)
}

export async function update(pg, books) {
    const { author, title } = books
    const q = qb.edit('books', books, id).clone()
        .returning('id')
        .set('title = ?', title)
        .set('author = ?', author)
        .toParam()
    const rows = await pg.queryArgs(q.text, q.values)
    return rows.rowCount !== 0
}

export async function del(pg, id) {
    const q = qb.softDelete('books', id).clone()
        .returning('id')
        .toParam()
    const rows = await pg.queryArgs(q.text, q.values)
    return rows.rowCount !== 0
}

const proto = {
    del,
    create,
    retrieve,
    retrieveAll,
    update
}

export default () => {
    return Object.assign({}, proto)
}