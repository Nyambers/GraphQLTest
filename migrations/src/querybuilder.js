import squel from 'safe-squel'
const sq = squel.useFlavour('postgres')

export function select(table) {
    return sq
        .select()
        .field('id')
        .field('created_at')
        .field('updated_at')
        .field('author')
        .field('deleted')
        .field('title')
        .from(table)
        .where(`NOT ${table}.deleted`)
}

export function insert(table, values) {
    return sq
        .insert()
        .into(table)
        .setFields(values)
}

export function edit(table, data, id) {
    return sq
        .update()
        .table(table)
        .where('id = ?', id)
}

export function softDelete(table, id) {
    return sq
        .update()
        .table(table)
        .set('deleted', true)
        .where('id = ?', id)
        .where(`NOT ${table}.deleted`)
}

const proto = {
    edit,
    insert,
    select,
    softDelete
}

export default function() {
    return Object.assign({}, proto)
}