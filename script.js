document.addEventListener('DOMContentLoaded', function() {
    // We'll store fetched news here
    let newsData = [];
    
    // Fetch news from API when page loads
    fetchNewsFromAPI('general');

    function fetchNewsFromAPI(category = 'general') {
        // Show loading state
        const newsContainer = document.getElementById('news-container');
        newsContainer.innerHTML = '<div class="loading">Loading news...</div>';
        
        // API URL with category parameter
        const apiUrl = `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=136cef8718984499a18771d56b327550`;
        
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.articles) {
                    // Transform API data directly here
                    newsData = data.articles.map(article => ({
                        title: article.title || 'No title available',
                        description: article.description || 'No description available',
                        image: article.urlToImage || 'https://via.placeholder.com/600x400?text=No+Image',
                        source: article.source?.name || 'Unknown Source',
                        date: article.publishedAt || new Date().toISOString(),
                        url: article.url || '#',
                        category: category
                    }));
                    
                    displayNews(newsData);
                    updateActiveCategoryButton(category);
                } else {
                    newsContainer.innerHTML = '<div class="no-results">No news articles found</div>';
                }
            })
            .catch(error => {
                console.error('Error fetching news:', error);
                newsContainer.innerHTML = '<div class="error">Failed to load news. Please try again later.</div>';
            });
    }

    function updateActiveCategoryButton(category) {
        // Remove 'active' class from all category buttons
        const categories = document.querySelectorAll('.category');
        categories.forEach(cat => cat.classList.remove('active'));
        
        // Add 'active' class to the matching category button
        const activeButton = document.querySelector(`.category[data-category="${category}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }

    function displayNews(articles) {
        const newsContainer = document.getElementById('news-container');
        newsContainer.innerHTML = '';

        if (articles.length === 0) {
            newsContainer.innerHTML = '<div class="no-results">No news articles found</div>';
            return;
        }

        articles.forEach(article => {
            const newsCard = document.createElement('div');
            newsCard.className = 'news-card';

            newsCard.innerHTML = `
                <div class="news-image">
                    <img src="${article.image}" alt="${article.title}" onerror="this.src='https://via.placeholder.com/600x400?text=Image+Not+Available'">
                </div>
                <div class="news-content">
                    <div class="news-source">
                        <span class="source-name">${article.source}</span>
                        <span class="news-date">${formatDate(article.date)}</span>
                    </div>
                    <h3 class="news-title">${article.title}</h3>
                    <p class="news-description">${article.description}</p>
                    <a href="${article.url}" class="read-more" target="_blank">Read More</a>
                </div>
            `;

            newsContainer.appendChild(newsCard);
        });
    }

    function formatDate(dateStr) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        try {
            return new Date(dateStr).toLocaleDateString('en-US', options);
        } catch (e) {
            return 'Unknown Date';
        }
    }

    // Category filter functionality
    const categories = document.querySelectorAll('.category');
    categories.forEach(category => {
        category.addEventListener('click', function() {
            const selectedCategory = this.dataset.category;
            fetchNewsFromAPI(selectedCategory);
        });
    });

    // Search functionality
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm === '') {
            displayNews(newsData);
            return;
        }

        const filteredNews = newsData.filter(article => {
            return article.title.toLowerCase().includes(searchTerm) || 
                   article.description.toLowerCase().includes(searchTerm) ||
                   article.source.toLowerCase().includes(searchTerm);
        });

        displayNews(filteredNews);
    }

    // Add refresh button functionality
    const refreshButton = document.getElementById('refresh-button');
    if (refreshButton) {
        refreshButton.addEventListener('click', () => fetchNewsFromAPI('general'));
    }
});