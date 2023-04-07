window.onload = () => {
	console.log('App started')
	bookList.init()
}

class Book {
	constructor(title, author) {
		this.title = title
		this.author = author
		this.id = Date.now()
	}
}

class BooksList {
	constructor() {
		this.books = []
	}
	init() {
		document.getElementById('saveButton').addEventListener('click', e => this.saveButton(e))
		this.loadDataFromStorage()
	}

	loadDataFromStorage() {
		const data = storage.getItems()
		if (data === null || data === undefined) return

		this.books = data

		data.forEach(data => ui.addBookToTable(data))
	}

	saveButton(e) {
		const title = document.getElementById('bookTitle').value
		const author = document.getElementById('bookAuthor').value

		if (title === '' || author === '') {
			console.log('blank data')
			return
		}

		e.preventDefault()

		const book = new Book(title, author)
		this.addBook(book)
	}

	addBook(book) {
		this.books.push(book)
		ui.addBookToTable(book)
		this.saveData()
	}

	removeBookById(id) {
		this.books.forEach((book, index) => {
			if (book.id == id) this.books.splice(index, 1)
		})
		this.saveData()
	}

	moveBookUp(bookId) {
		let array = this.books

		for (let i = 0; i < array.length; i++) {
			let element = array[i]

			if (element.id == bookId) {
				if (i >= 1) {
					let temp = array[i - 1]
					array[i - 1] = array[i]
					array[i] = temp
					break
				}
			}
		}

		this.saveData()
		ui.deleteAllBookRows()
		this.loadDataFromStorage()
	}

	moveBookDown(bookId) {
		let array = this.books

		for (let i = 0; i < array.length; i++) {
			let element = array[i]

			if (element.id == bookId) {
				if (i <= array.length - 2) {
					let temp = array[i + 1]
					array[i + 1] = array[i]
					array[i] = temp
					break
				}
			}
		}

		this.saveData()
		ui.deleteAllBookRows()
		this.loadDataFromStorage()
	}

	saveData() {
		storage.saveItems(this.books)
	}
}

const bookList = new BooksList()

class UI {
	deleteBook(e) {
		const bookId = e.target.getAttribute('data-book-id')
		e.target.parentElement.parentElement.remove()
		bookList.removeBookById(bookId)
	}

	arrowUp(e) {
		const bookId = e.target.getAttribute('data-book-id')

		bookList.moveBookUp(bookId)
	}

	arrowDown(e) {
		const bookId = e.target.getAttribute('data-book-id')

		bookList.moveBookDown(bookId)
	}

	deleteAllBookRows() {
		const tbodyRows = document.querySelectorAll('#booksTable tbody tr')

		tbodyRows.forEach(element => element.remove())
	}

	addBookToTable(book) {
		const tbody = document.querySelector('#booksTable tbody')
		const tr = document.createElement('tr')

		tr.innerHTML = `
			<td>${book.title}</td>
			<td>${book.author}</td>
			<td>
				<button type="button" class="btn btn-danger btn-sm delete" data-book-id="${book.id}">Delete</button>
				<button type="button" class="btn btn-secondary btn-sm up-arrow" data-book-id="${book.id}">⯅</button>
				<button type="button" class="btn btn-secondary btn-sm down-arrow" data-book-id="${book.id}">⯆</button>
			</td>
		`
		tbody.appendChild(tr)

		const deleteButton = document.querySelector(`button.delete[data-book-id='${book.id}']`)
		deleteButton.addEventListener('click', e => this.deleteBook(e))

		const upButton = document.querySelector(`button.up-arrow[data-book-id='${book.id}']`)
		upButton.addEventListener('click', e => this.arrowUp(e))

		const downButton = document.querySelector(`button.down-arrow[data-book-id='${book.id}']`)
		downButton.addEventListener('click', e => this.arrowDown(e))

		this.clearForm()
	}

	clearForm() {
		document.getElementById('bookTitle').value = ''
		document.getElementById('bookAuthor').value = ''

		document.getElementById('bookForm').classList.remove('was-validated')
	}
}

const ui = new UI()

class Storage {
	getItems() {
		let books = null
		if (localStorage.getItem('books') !== null) {
			books = JSON.parse(localStorage.getItem('books'))
		} else {
			books = []
		}
		return books
	}

	saveItems(books) {
		localStorage.setItem('books', JSON.stringify(books))
	}
}

const storage = new Storage()
