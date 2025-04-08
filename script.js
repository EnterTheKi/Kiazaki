document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector('.site-container');
    const filterButtons = container.querySelectorAll('.filter-btn');
    const contentSections = {
        home: container.querySelector('#home-content'),
        post: container.querySelector('#post-content'),
        nostalgia: container.querySelector('#nostalgia-content'),
        kiut: container.querySelector('#kiut-content')
    };
    const blogLinks = container.querySelectorAll('.blog-link');
    const galleryCards = container.querySelectorAll('.gallery-card');
    const searchToggleBtn = container.querySelector('#searchToggle');
    const pageSearchInput = container.querySelector('#pageSearchInput');
    const searchWidget = container.querySelector('#search-widget');
    const searchResultsContainer = container.querySelector('#searchResults');
    const popupToggle = container.querySelector('#popup-toggle');
    const popupContent = container.querySelector('.popup-content');
    const letters = document.querySelectorAll(".letter");
    const customCursor = document.getElementById('customCursor');

    // Custom cursor
    document.addEventListener('mousemove', (e) => {
        customCursor.style.display = 'block';
        customCursor.style.left = `${e.clientX}px`;
        customCursor.style.top = `${e.clientY}px`;
    });
    document.addEventListener('mouseleave', () => customCursor.style.display = 'none');
    document.querySelectorAll('a, button, .clickable-image, .gallery-card').forEach(el => {
        el.addEventListener('mouseenter', () => customCursor.style.transform = 'translate(-50%, -50%) scale(2)');
        el.addEventListener('mouseleave', () => customCursor.style.transform = 'translate(-50%, -50%) scale(1)');
    });

    // Neon sign animation
    if (letters.length === 7) {
        function updateLetters() {
            const sequence = [0, 1, 2, 3, 4, 5, 6].sort(() => Math.random() - 0.5);
            sequence.forEach((idx, index) => {
                setTimeout(() => {
                    letters.forEach(l => {
                        l.style.opacity = "0.2";
                        l.style.textShadow = "none";
                        l.style.animation = "none";
                    });
                    letters[idx].style.opacity = "1";
                    letters[idx].style.animation = "neon-flicker 0.5s forwards";
                }, index * 1000);
            });
            setTimeout(() => {
                letters.forEach(letter => {
                    letter.style.opacity = "1";
                    letter.style.textShadow = "0 0 10px #fff, 0 0 20px #fff, 0 0 40px #ffdddd";
                    letter.style.animation = "neon-buzz 1.5s infinite alternate";
                });
            }, sequence.length * 1000);
        }
        updateLetters();
        setInterval(updateLetters, 9000);
    }

    // Navigation and content display
    function updateDisplay(targetFilter, postId = null) {
        filterButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === targetFilter));
        Object.values(contentSections).forEach(section => section.classList.add('hidden'));
        
        if (postId) {
            const postContent = document.getElementById(`${postId}-content`);
            if (postContent) {
                contentSections.post.innerHTML = '';
                const clonedContent = postContent.cloneNode(true);
                clonedContent.classList.remove('hidden');
                contentSections.post.appendChild(clonedContent);
                contentSections.post.classList.remove('hidden');
                const backBtn = contentSections.post.querySelector('.back-btn');
                if (backBtn) backBtn.onclick = () => updateDisplay(backBtn.textContent.includes('Nostalgia') ? 'nostalgia' : 'home');
                window.history.pushState({ filter: targetFilter, postId }, '', `/post/${postId}`);
            }
        } else {
            contentSections[targetFilter].classList.remove('hidden');
            window.history.pushState({ filter: targetFilter }, '', `/${targetFilter === 'home' ? '' : targetFilter}`);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Handle initial URL
    function handleInitialUrl() {
    // Check sessionStorage.redirect first (from 404), fallback to current pathname
    const redirectPath = sessionStorage.redirect || window.location.pathname.replace(/\/$/, '');
    sessionStorage.removeItem('redirect'); // Clear it after use
    const postMatch = redirectPath.match(/^\/post\/(post-\d+|nostalgia-[a-z0-9-]+)$/);
    if (postMatch) {
        const postId = postMatch[1];
        updateDisplay(postId.startsWith('nostalgia-') ? 'nostalgia' : 'home', postId);
    } else if (redirectPath === '/nostalgia') {
        updateDisplay('nostalgia');
    } else if (redirectPath === '/kiut') {
        updateDisplay('kiut');
    } else {
        updateDisplay('home');
    }
}

    // Fullscreen image
    function openFullScreen(src) {
        const overlay = document.createElement('div');
        overlay.className = 'fullscreen-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Fullscreen image view');

        const img = document.createElement('img');
        img.src = src;
        img.className = 'fullscreen-image';
        img.alt = 'Fullscreen view';
        img.tabIndex = 0;
        overlay.appendChild(img);

        const closeButton = document.createElement('button');
        closeButton.className = 'fullscreen-close';
        closeButton.innerHTML = '&times;';
        closeButton.setAttribute('aria-label', 'Close');
        overlay.appendChild(closeButton);

        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
        setTimeout(() => overlay.classList.add('active'), 10);

        const closeOverlay = () => {
            overlay.classList.remove('active');
            setTimeout(() => {
                overlay.remove();
                document.body.style.overflow = '';
            }, 300);
        };

        img.addEventListener('click', () => img.classList.toggle('zoomed'));
        closeButton.addEventListener('click', closeOverlay);
        overlay.addEventListener('click', (e) => e.target === overlay && closeOverlay());
        document.addEventListener('keydown', (e) => e.key === 'Escape' && closeOverlay());
        img.focus();
    }

    // Event listeners
    filterButtons.forEach(btn => btn.addEventListener('click', () => updateDisplay(btn.dataset.filter)));
    blogLinks.forEach(link => link.addEventListener('click', (e) => {
        e.preventDefault();
        updateDisplay('home', link.dataset.postId);
    }));
    galleryCards.forEach(card => card.addEventListener('click', () => {
        const postId = card.dataset.postId;
        if (postId) updateDisplay('nostalgia', postId);
    }));
    searchToggleBtn.addEventListener('click', () => {
        searchWidget.classList.toggle('expanded');
        searchWidget.classList.contains('expanded') ? pageSearchInput.focus() : (pageSearchInput.value = '', searchResultsContainer.classList.remove('visible'));
    });
    pageSearchInput.addEventListener('input', () => {
        const searchTerm = pageSearchInput.value.toLowerCase();
        searchResultsContainer.innerHTML = '';
        if (searchTerm.length < 2) return searchResultsContainer.classList.remove('visible');
        
        let hasResults = false;
        Object.entries(contentSections).forEach(([key, section]) => {
            if (key === 'post') return;
            section.querySelectorAll('h3, p').forEach(el => {
                if (el.textContent.toLowerCase().includes(searchTerm)) {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'search-result-item';
                    resultItem.innerHTML = el.textContent.replace(new RegExp(`(${searchTerm})`, 'gi'), '<span class="search-highlight">$1</span>');
                    resultItem.addEventListener('click', () => {
                        updateDisplay(key);
                        pageSearchInput.value = '';
                        searchResultsContainer.classList.remove('visible');
                    });
                    searchResultsContainer.appendChild(resultItem);
                    hasResults = true;
                }
            });
        });
        document.querySelectorAll('[id$="-content"]').forEach(post => {
            const postId = post.id.replace('-content', '');
            post.querySelectorAll('h1, p').forEach(el => {
                if (el.textContent.toLowerCase().includes(searchTerm)) {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'search-result-item';
                    resultItem.innerHTML = el.textContent.replace(new RegExp(`(${searchTerm})`, 'gi'), '<span class="search-highlight">$1</span>');
                    resultItem.addEventListener('click', () => {
                        updateDisplay(postId.startsWith('nostalgia-') ? 'nostalgia' : 'home', postId);
                        pageSearchInput.value = '';
                        searchResultsContainer.classList.remove('visible');
                    });
                    searchResultsContainer.appendChild(resultItem);
                    hasResults = true;
                }
            });
        });
        searchResultsContainer.classList.toggle('visible', hasResults);
    });
    popupToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        popupContent.classList.toggle('hidden');
    });
    document.addEventListener('click', (e) => {
        if (!popupContent.contains(e.target) && !popupToggle.contains(e.target)) popupContent.classList.add('hidden');
    });
    document.querySelectorAll('.card-image-placeholder img, .clickable-image').forEach(img => img.addEventListener('click', () => openFullScreen(img.src)));
    window.addEventListener('popstate', (e) => updateDisplay(e.state?.filter || 'home', e.state?.postId));

    handleInitialUrl();
});
