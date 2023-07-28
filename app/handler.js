const { nanoid } = require('nanoid')
const bookSelft = require('./books')


//Handle for create data
const createBookHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload

    const id = nanoid(16)
    
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt

    if(!name || name === '') {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        })
        response.code(400)
        return response
    }

    if(readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400)
        return response
    }

    const isFinished = (readPage, pageCount) => {
        if (readPage === pageCount) {
            return true
        }
        if (readPage < pageCount) {
            return false
        }
    }

    const finished = isFinished(readPage, pageCount)

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt
    }

    bookSelft.push(newBook)

    const isSuccess = bookSelft.filter((book) => book.id === id).length > 0

    if(isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id
            }
        })
        response.code(201)
        return response
    }

    const response = h.response({
        status: 'Error',
        message: 'Buku gagal ditambahkan'
    })
    response.code(500)
    return response
}

//Handle for read data

const getAllBookHandler = (request, h) => {
    const { name, reading, finished} = request.query

    let filteredBooks = bookSelft

    if(name) {
        filteredBooks = bookSelft.filter((bn) => bn.name.toLowerCase().includes(name.toLowerCase()))
    }

    if (reading) {
        filteredBooks = bookSelft.filter((book) => Number(book.reading) === Number(reading))
    }

    if (finished) {
        filteredBooks = bookSelft.filter((book) => Number(book.finished) === Number(finished))
    }

    const response = h.response({
        status: 'success',
        data: {
            books: filteredBooks.map((m) => ({
                id: m.id,
                name: m.name,
                publisher: m.publisher
            }))
        }
    })
    response.code(200)
    return response
}

//Handle for read data by id

const getByIdBooksHandler = (request, h) => {
    const { bookId } = request.params

    const book = bookSelft.filter((book) => book.id === bookId)[0]
    
    if(book !== undefined){
        return {
            status: 'success',
            data: {
                book
            }
        }
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    })
    response.code(404)
    return response
}

//Handle for edit data
const editBooksHandler = (request, h) => {
    const { bookId } = request.params

    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload ?? {}

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        })
        response.code(400)
        return response
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 
            'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400)
        return response
    }

    const updatedAt = new Date().toISOString()

    const index = bookSelft.findIndex((book) => book.id === bookId)

    if (index != -1) {
        bookSelft[index] = {
            ...bookSelft[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt
        }
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        })
        response.code(200)
        return response
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })
    response.code(404)
    return response
}

//Handle for delete data
const deleteBookHandler = (request, h) => {
    const { bookId } = request.params

    const index = bookSelft.findIndex((book) => book.id === bookId)

    if (index !== -1) {
        bookSelft.splice(index, 1)

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        })
        response.code(200)
        return response
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    })
    response.code(404)
    return response
}

module.exports = { 
    createBookHandler, 
    getAllBookHandler, 
    getByIdBooksHandler,
    editBooksHandler,
    deleteBookHandler 
}