import Books from '~/models/books'
import { postgres } from '~/postgres'

const Book = Books()

export default {
    Query: {
        book: async (_, {id}, ctx) => {
            const book = await Book.retrieve(postgres(ctx), id)
            return book
        },
        books: async (_, __, ctx) => {
            const books = await Book.retrieveAll(postgres(ctx))
            return books
        }
    },
    Mutation: {
        createBook: async (_, {book}, ctx) => {
            const id = await Book.create(postgres(ctx), book)
            return {id}
        },
        updateBook: async (_, {id, book}, ctx) => {
            await Book.update(postgres(ctx), book, id)
        },
        deleteBook: async (_, {id}, ctx) => {
            await Book.del(postgres(ctx), id)
            return {id}
        }
    },
    CreateBookPayload: {
        __resolveType(obj) {
            if (obj.id) {
                return 'CreateBookSuccess'
            }
            if (obj.message) {
                return 'CreateBookError'
            }
            return null
        }
    }
}