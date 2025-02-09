import { fetchBooks, fetchQuote } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
    const quoteContainer = document.getElementById("quoteContainer");

    const quoteData = await fetchQuote();
    if (quoteContainer) {
        quoteContainer.innerHTML = `
            <p>"${quoteData.text}"</p>
            <small>- ${quoteData.author}</small>
        `;
    }
});


const bookList = document.getElementById("bookList");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const genreSelect = document.getElementById("genreSelect");
const readingListContainer = document.getElementById("readingList");
const toggleReadingListBtn = document.getElementById("toggleReadingList");
const readingListSection = document.getElementById("readingListContainer");


// Reading List Toggle
toggleReadingListBtn.addEventListener("click", () => {
    readingListSection.classList.toggle("visible");
});

// Search Books
searchBtn.addEventListener("click", async () => {
    let query = searchInput.value.trim();
    if (query) loadBooks(query);
});

// Genre Selection
genreSelect.addEventListener("change", async () => {
    let genre = genreSelect.value;
    if (genre) loadBooks(genre);
});

// Load Books
async function loadBooks(query) {
    bookList.innerHTML = "<p>Loading...</p>";
    let books = await fetchBooks(query);
    displayBooks(books);
}

// Display Books
function displayBooks(books) {
    bookList.innerHTML = "";
    books.forEach(book => {
        let bookDiv = document.createElement("div");
        bookDiv.classList.add("book");

        bookDiv.innerHTML = `
            <h3>${book.title}</h3>
            <img src="${book.cover}" alt="Book Cover">
            <p><strong>Author:</strong> ${book.author}</p>
            <a href="${book.readLink}" target="_blank" class="read-btn">Read Now</a>
            <button class="add-btn" data-title="${book.title}" data-readLink="${book.readLink}">Add to Reading List</button>
        `;

        bookList.appendChild(bookDiv);
    });

    document.querySelectorAll(".add-btn").forEach(button => {
        button.addEventListener("click", addToReadingList);
    });
}

// Add to Reading List
function addToReadingList(event) {
    let button = event.target;
    let book = {
        title: button.getAttribute("data-title"),
        readLink: button.getAttribute("data-readLink")
    };

    let listItem = document.createElement("li");
    listItem.innerHTML = `<a href="${book.readLink}" target="_blank">${book.title}</a>`;
    readingListContainer.appendChild(listItem);
}
