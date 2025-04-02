document.addEventListener('DOMContentLoaded', function() {
    const newsData = [
        {
            title: "Scientists Discover New Species in Amazon Rainforest",
            description: "A team of international scientists has discovered five new species of animals during an expedition to the Amazon rainforest.",
            image: "https://via.placeholder.com/600x400?text=Amazon+Discovery",
            source: "Science Daily",
            date: "2025-04-01",
            url: "#",
            category: "science"
        },
        {
            title: "Tech Giant Unveils Revolutionary AI Assistant",
            description: "The latest AI assistant can understand and respond to complex human emotions, setting a new standard for human-computer interaction.",
            image: "https://via.placeholder.com/600x400?text=AI+Assistant",
            source: "Tech Insider",
            date: "2025-04-01",
            url: "#",
            category: "technology"
        }
    ];

    function displayNews(articles) {
        const newsContainer = document.getElementById('news-container');
        newsContainer.innerHTML = '';

        articles.forEach(article => {
            const newsCard = document.createElement('div');
            newsCard.className = 'news-card';

            newsCard.innerHTML = `
                <div class="news-image">
                    <img src="${article.image}" alt="${article.title}">
                </div>
                <div class="news-content">
                    <div class="news-source">
                        <span class="source-name">${article.source}</span>
                        <span class="news-date">${formatDate(article.date)}</span>
                    </div>
                    <h3 class="news-title">${article.title}</h3>
                    <p class="news-description">${article.description}</p>
                    <a href="${article.url}" class="read-more">Read More</a>
                </div>
            `;

            newsContainer.appendChild(newsCard);
        });
    }

    function formatDate(dateStr) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString('en-US', options);
    }

    displayNews(newsData);

    const categories = document.querySelectorAll('.category');
    categories.forEach(category => {
        category.addEventListener('click', function() {
            categories.forEach(cat => cat.classList.remove('active'));
            this.classList.add('active');

            const selectedCategory = this.dataset.category;
            let filteredNews = selectedCategory === 'general' ? newsData : newsData.filter(article => article.category === selectedCategory);
            displayNews(filteredNews);
        });
    });

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
});

