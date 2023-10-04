let books = [];
const newBook = {
  id: "",
  title: "",
  author: "",
  year: "",
  isCompleted: false,
};

const isStorageExist = typeof Storage === "undefined" ? false : true;

const btnSubmit = document.getElementById("bookSubmit");
const formBook = document.getElementById("inputBook");
const txtTitle = document.getElementById("inputBookTitle");
const txtAuthor = document.getElementById("inputBookAuthor");
const txtYear = document.getElementById("inputBookYear");
const checkCompleted = document.getElementById("inputBookIsComplete");

const incompletedBookshelf = document.getElementById("incompleteBookshelfList");
const completedBookshelf = document.getElementById("completeBookshelfList");

const STORAGE_KEY = "BookShelfList";

txtTitle.addEventListener("keyup", (e) => (newBook.title = e.target.value));
txtAuthor.addEventListener("keyup", (e) => (newBook.author = e.target.value));
txtYear.addEventListener(
  "keyup",
  (e) => (newBook.year = Number(e.target.value))
);
checkCompleted.addEventListener(
  "change",
  (e) => (newBook.isCompleted = e.target.checked)
);

const clearForm = () => {
  newBook.title = "";
  newBook.author = "";
  newBook.year = "";
  newBook.isCompleted = false;

  txtTitle.value = "";
  txtAuthor.value = "";
  txtYear.value = "";
  checkCompleted.checked = false;
};

const saveData = () => {
  if (isStorageExist) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);

    loadBooks();
  }
};

const findBook = (bookId) => books.filter((e) => e.id === bookId);

const changeCompletedHandler = (book) => {
  const temp = { ...book };
  temp.isCompleted = !temp.isCompleted;

  const temp1 = [];
  books.forEach((e, i) => {
    if (e.id !== temp.id) {
      temp1.push(e);
    }
  });
  temp1.unshift(temp);

  return temp1;
};

const removeItemHandler = (book) => {
  return books.filter((e) => e.id !== book.id);
};

const addBook = (book) => {
  const lastBook = { ...book };
  lastBook.id = Number(new Date());
  books.unshift(lastBook);

  saveData();
  clearForm();
};

const bookItem = (book) => {
  const articleBook = document.createElement("article");
  const titleBook = document.createElement("h3");
  const authorBook = document.createElement("p");
  const yearBook = document.createElement("p");

  const actionContainer = document.createElement("div");
  const buttonCompleted = document.createElement("button");
  const buttonRemove = document.createElement("button");

  articleBook.classList.add("book_item");
  actionContainer.classList.add("action");
  buttonCompleted.classList.add("green");
  buttonRemove.classList.add("red");

  titleBook.innerText = book.title;
  authorBook.innerText = `Penulis: ${book.author}`;
  yearBook.innerText = `Tahun: ${book.year}`;

  buttonCompleted.innerText = book.isCompleted
    ? "Belum selesai di Baca"
    : "Selesai dibaca";
  buttonRemove.innerText = "Hapus buku";

  actionContainer.append(buttonCompleted, buttonRemove);
  articleBook.append(titleBook, authorBook, yearBook, actionContainer);
  articleBook.setAttribute("id", `book-${book.id}`);

  buttonCompleted.addEventListener("click", () => {
    const target = findBook(book.id);
    const newData = changeCompletedHandler(target[0]);

    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    loadBooks();
  });

  buttonRemove.addEventListener("click", () => {
    const target = findBook(book.id);
    const newData = removeItemHandler(target[0]);

    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    loadBooks();
  });

  return articleBook;
};

const loadBooks = () => {
  const items = JSON.parse(localStorage.getItem(STORAGE_KEY));
  //   console.log(items);

  completedBookshelf.innerHTML = "";
  incompletedBookshelf.innerHTML = "";

  if (items) {
    books = items;

    items.forEach((item) => {
      if (item.isCompleted == true) {
        completedBookshelf.append(bookItem(item));
      } else {
        incompletedBookshelf.append(bookItem(item));
      }
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (!isStorageExist) return alert("Browser kamu tidak mendukung web storage");
  loadBooks();

  formBook.addEventListener("submit", (e) => {
    e.preventDefault();

    addBook(newBook);
  });
});
