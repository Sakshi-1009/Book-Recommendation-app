const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes?q=";

const PAPERQUOTES_API = "https://api.paperquotes.com/apiv1/quotes/?tags=inspiration&order=-likes";

async function fetchQuote() {
    try {
        const response = await fetch(PAPERQUOTES_API);
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            throw new Error("No quotes found.");
        }

        let randomQuote = data.results[Math.floor(Math.random() * data.results.length)];

        return {
            text: randomQuote.quote,
            author: randomQuote.author || "Unknown"
        };
    } catch (error) {
        console.error("Error fetching quote:", error);
        return { text: "Could not load a quote.", author: "Unknown" };
    }
}

// Fetch books from Google Books API
async function fetchBooks(query) {
    try {
        let response = await fetch(GOOGLE_BOOKS_API + encodeURIComponent(query));
        let data = await response.json();

        if (!data.items) {
            return [];
        }

        return data.items.map(book => ({
            title: book.volumeInfo.title,
            author: book.volumeInfo.authors?.join(", ") || "Unknown",
            cover: book.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/150",
            readLink: book.volumeInfo.infoLink
        }));
    } catch (error) {
        console.error("Error fetching books:", error);
        return [];
    }
}

// Save reading list to LocalStorage
function saveReadingList(readingList) {
    localStorage.setItem("readingList", JSON.stringify(readingList));
}

// Load reading list from LocalStorage
function loadReadingList() {
    return JSON.parse(localStorage.getItem("readingList")) || [];
}

export { fetchBooks, fetchQuote, saveReadingList, loadReadingList };
