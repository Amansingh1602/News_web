// script.js
const apiKey = 'Please enter your API key here'; // Enter your News API key here
const blogContainer = document.querySelector('#blog-container');
const searchField = document.querySelector('#search-input');
const searchButton = document.querySelector('#search-button');

// Add debug logging
console.log('Initial elements:', {
    blogContainer,
    searchField,
    searchButton
});

searchButton.addEventListener('click', async () => {
    console.log('Search button clicked');
    const searchQuery = searchField.value.trim();
    if(searchQuery !== ''){
        try{
            const articles = await fetchSearchNews(searchQuery);
            displayBlogs(articles);
        }catch(error){
            console.error('Error fetching search news:', error);
            displayError('Failed to fetch search results');
        }
    }
});

async function fetchRandomNews(){
    try{
        console.log('Fetching random news...');
        const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&pageSize=25&apiKey=${apiKey}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Received random news data:', data);
        return data.articles;
    }catch(error){
        console.error('Error fetching random news:', error);
        throw error; // Propagate error to handle it in the calling function
    }
}

async function fetchSearchNews(searchQuery){
    try{
        console.log('Fetching search results for:', searchQuery);
        const apiUrl = `https://newsapi.org/v2/everything?q=${searchQuery}&pageSize=10&apiKey=${apiKey}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Received search data:', data);
        return data.articles;
    }catch(error){
        console.error('Error fetching search news:', error);
        throw error;
    }
}

function displayBlogs(articles){
    if (!articles || articles.length === 0) {
        displayError('No articles found');
        return;
    }

    console.log('Displaying articles:', articles);
    blogContainer.innerHTML = "";
    
    articles.forEach((article) => {
        try {
            const blogCard = document.createElement('div');
            blogCard.classList.add('blog-card');
            
            const img = document.createElement('img');
            img.src = article.urlToImage || 'https://via.placeholder.com/280x180';
            img.alt = article.title || 'News image';
            img.onerror = function() {
                this.src = 'https://via.placeholder.com/280x180';
            };
            
            const title = document.createElement('h2');
            const truncatedTitle = article.title?.length > 30 ? 
                article.title.slice(0, 30) + '...' : 
                article.title || 'No title available';
            title.textContent = truncatedTitle;
            
            const description = document.createElement('p');
            const truncatedDescription = article.description?.length > 100 ? 
                article.description.slice(0, 100) + '...' : 
                article.description || 'No description available';
            description.textContent = truncatedDescription;
            
            blogCard.appendChild(img);
            blogCard.appendChild(title);
            blogCard.appendChild(description);
            
            if (article.url) {
                blogCard.addEventListener('click', () => {
                    window.open(article.url, '_blank');
                });
            }
            
            blogContainer.appendChild(blogCard);
        } catch (error) {
            console.error('Error creating blog card:', error);
        }
    });
}

function displayError(message) {
    blogContainer.innerHTML = `
        <div class="error-message" style="text-align: center; padding: 20px; color: #ff4444;">
            <h3>${message}</h3>
            <p>Please try again later.</p>
        </div>
    `;
}

// Initialize the page with random news
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, initializing...');
    try {
        const articles = await fetchRandomNews();
        displayBlogs(articles);
    } catch (error) {
        console.error('Error during initialization:', error);
        displayError('Failed to load news');
    }
});
