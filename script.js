(function() {
    const container = document.querySelector('.site-container');
    const filterButtons = container.querySelectorAll('.filter-btn');
    const contentSections = {
        home: container.querySelector('#home-content'),
        post: container.querySelector('#post-content'),
        nostalgia: container.querySelector('#nostalgia-content'),
        kiut: container.querySelector('#kiut-content')
    };
    const blogLinks = container.querySelectorAll('.blog-link');
    const searchToggleBtn = container.querySelector('#searchToggle');
    const pageSearchInput = container.querySelector('#pageSearchInput');
    const searchWidget = container.querySelector('#search-widget');
    const searchResultsContainer = container.querySelector('#searchResults');
    const popupToggle = container.querySelector('#popup-toggle');
    const popupContent = container.querySelector('.popup-content');

    function updateDisplay(targetFilter, postId = null) {
        filterButtons.forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-filter') === targetFilter));
        Object.values(contentSections).forEach(section => {
            section.classList.add('hidden');
            section.style.display = 'none';
        });

        if (postId) {
            const postContent = document.getElementById(`${postId}-content`);
            if (postContent) {
                contentSections.post.innerHTML = '';
                const clonedContent = postContent.cloneNode(true);
                clonedContent.classList.remove('hidden');
                contentSections.post.appendChild(clonedContent);
                contentSections.post.classList.remove('hidden');
                contentSections.post.style.display = 'block';
                const backBtn = contentSections.post.querySelector('.back-btn');
                if (backBtn) {
                    backBtn.addEventListener('click', () => updateDisplay('home'));
                }
                window.history.pushState({ filter: 'home', postId: postId }, '', `/post/${postId}`);
            }
        } else {
            contentSections[targetFilter].classList.remove('hidden');
            contentSections[targetFilter].style.display = targetFilter === 'home' ? 'block' : 'grid';
            window.history.pushState({ filter: targetFilter }, '', `/${targetFilter}`);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => updateDisplay(btn.getAttribute('data-filter')));
    });

    blogLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const postId = link.getAttribute('data-post-id');
            updateDisplay('home', postId);
        });
    });

    searchToggleBtn.addEventListener('click', () => {
        searchWidget.classList.toggle('expanded');
        if (searchWidget.classList.contains('expanded')) pageSearchInput.focus();
        else {
            pageSearchInput.value = '';
            searchResultsContainer.classList.remove('visible');
        }
    });

    pageSearchInput.addEventListener('input', () => {
        const term = pageSearchInput.value.toLowerCase();
        searchResultsContainer.innerHTML = '';
        if (term.length < 2) return;
        Object.entries(contentSections).forEach(([key, section]) => {
            if (key === 'post') return;
            section.querySelectorAll('h3, p').forEach(el => {
                if (el.textContent.toLowerCase().includes(term)) {
                    const item = document.createElement('div');
                    item.className = 'search-result-item';
                    item.textContent = el.textContent;
                    item.addEventListener('click', () => updateDisplay(key));
                    searchResultsContainer.appendChild(item);
                    searchResultsContainer.classList.add('visible');
                }
            });
        });
        document.querySelectorAll('[id$="-content"]').forEach(post => {
            const postId = post.id.replace('-content', '');
            post.querySelectorAll('h1, p').forEach(el => {
                if (el.textContent.toLowerCase().includes(term)) {
                    const item = document.createElement('div');
                    item.className = 'search-result-item';
                    item.textContent = el.textContent;
                    item.addEventListener('click', () => updateDisplay('home', postId));
                    searchResultsContainer.appendChild(item);
                    searchResultsContainer.classList.add('visible');
                }
            });
        });
    });

    popupToggle.addEventListener('click', () => {
        popupContent.classList.toggle('hidden');
    });

    window.addEventListener('popstate', (e) => {
        const state = e.state || { filter: 'home' };
        updateDisplay(state.filter, state.postId);
    });

    updateDisplay('home');

    // Random function for sparks (since CSS doesn't support random())
    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
})();
