const { 
    createBookHandler, 
    getAllBookHandler, 
    getByIdBooksHandler,
    editBooksHandler,
    deleteBookHandler 
} = require('./handler')

const routes = [
    {
        method: 'GET',
        path: '/',
        handler: () => {
            return 'Ini page home'
        }
    },
    {
        method: 'POST',
        path: '/books',
        handler: createBookHandler
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBookHandler
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getByIdBooksHandler
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: editBooksHandler
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBookHandler
    }
]

module.exports = routes