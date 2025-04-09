document.addEventListener('DOMContentLoaded', function() {
    // We'll store fetched news here
    let newsData = [];
    let searchTimeout = null;
    
    // Fetch news from API when page loads
    fetchNewsFromAPI('general');

    function fetchNewsFromAPI(category = 'general') {
        // Show loading state
        const newsContainer = document.getElementById('news-container');
        newsContainer.innerHTML = '<div class="loading">Loading news...</div>';
        
        // GNews API URL with category parameter
        const apiUrl = `https://gnews.io/api/v4/top-headlines?category=${encodeURIComponent(category)}&apikey=58ef7f580b9503e995f5247a3dfa6f3b&lang=en`;
        
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.articles && Array.isArray(data.articles)) {
                    // Transform GNews API data to our format
                    newsData = data.articles.map(article => ({
                        title: article.title || 'No title available',
                        description: article.description || 'No description available',
                        image: article.image || 'https://via.placeholder.com/600x400?text=No+Image',
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

    function escapeHTML(str) {
        if (!str || typeof str !== 'string') return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function displayNews(articles) {
        const newsContainer = document.getElementById('news-container');
        newsContainer.innerHTML = '';

        if (!articles || articles.length === 0) {
            newsContainer.innerHTML = '<div class="no-results">No news articles found</div>';
            return;
        }

        articles.forEach(article => {
            const newsCard = document.createElement('div');
            newsCard.className = 'news-card';

            const safeTitle = escapeHTML(article.title);
            const safeDesc = escapeHTML(article.description);
            const safeSource = escapeHTML(article.source);
            const safeUrl = article.url && article.url.startsWith('http') ? article.url : '#';
            const safeImage = article.image && article.image.startsWith('http') ? article.image : 'https://via.placeholder.com/600x400?text=No+Image';

            newsCard.innerHTML = `
                <div class="news-image">
                    <img src="${safeImage}" alt="${safeTitle}" onerror="this.src='https://via.placeholder.com/600x400?text=Image+Not+Available'">
                </div>
                <div class="news-content">
                    <div class="news-source">
                        <span class="source-name">${safeSource}</span>
                        <span class="news-date">${formatDate(article.date)}</span>
                    </div>
                    <h3 class="news-title">${safeTitle}</h3>
                    <p class="news-description">${safeDesc}</p>
                    <a href="${safeUrl}" class="read-more" target="_blank" rel="noopener noreferrer">Read More</a>
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
            if (selectedCategory) {
                fetchNewsFromAPI(selectedCategory);
            }
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
    
    // Add debounce to search input
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(performSearch, 300);
    });

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm === '') {
            displayNews(newsData);
            return;
        }

        const filteredNews = newsData.filter(article => {
            const title = article.title?.toLowerCase() || '';
            const description = article.description?.toLowerCase() || '';
            const source = article.source?.toLowerCase() || '';
            
            return title.includes(searchTerm) || 
                   description.includes(searchTerm) ||
                   source.includes(searchTerm);
        });

        displayNews(filteredNews);
    }

    // Add refresh button functionality
    const refreshButton = document.getElementById('refresh-button');
    if (refreshButton) {
        refreshButton.addEventListener('click', () => fetchNewsFromAPI('general'));
    }
});
