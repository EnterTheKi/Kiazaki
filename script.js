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
    const neonText = document.querySelector(".neon-text");
    const letters = Array.from(document.querySelectorAll(".letter"));
    const customCursor = document.getElementById('customCursor');

    // Custom cursor implementation
    document.addEventListener('mousemove', (e) => {
        customCursor.style.display = 'block';
        customCursor.style.left = `${e.clientX}px`;
        customCursor.style.top = `${e.clientY}px`;
    });

    document.addEventListener('mouseleave', () => {
        customCursor.style.display = 'none';
    });

    // Update interactive elements for custom cursor
    document.querySelectorAll('a, button, .clickable-image, .gallery-card').forEach(el => {
        el.style.cursor = 'none';
        el.addEventListener('mouseenter', () => {
            customCursor.style.transform = 'translate(-50%, -50%) scale(2)';
        });
        el.addEventListener('mouseleave', () => {
            customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    // Neon sign animation for header
    if (neonText && letters.length === 7) {
        letters.forEach(letter => {
            letter.style.opacity = "1";
            letter.style.color = "#fff";
        });

        function updateLetters() {
            const kFirst = Math.random() < 0.5 ? 0 : 5;
            const iFirst = Math.random() < 0.5 ? 1 : 6;
            const aFirst = Math.random() < 0.5 ? 2 : 4;
            const zIndex = 3;
            const aSecond = aFirst === 2 ? 4 : 2;
            const kSecond = kFirst === 0 ? 5 : 0;
            const iSecond = iFirst === 1 ? 6 : 1;

            const sequence = [
                letters[kFirst],
                letters[iFirst],
                letters[aFirst],
                letters[zIndex],
                letters[aSecond],
                letters[kSecond],
                letters[iSecond]
            ];

            sequence.forEach((letter, index) => {
                setTimeout(() => {
                    letters.forEach(l => {
                        l.style.opacity = "0.2";
                        l.style.textShadow = "none";
                        l.style.animation = "none";
                    });
                    letter.style.opacity = "1";
                    letter.style.animation = "neon-flicker 0.5s forwards";
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
                    backBtn.onclick = () => updateDisplay(backBtn.textContent.includes('Nostalgia') ? 'nostalgia' : 'home');
                }
                window.history.pushState({ filter: targetFilter, postId }, '', `/post/${postId}`);
            }
        } else {
            contentSections[targetFilter].classList.remove('hidden');
            contentSections[targetFilter].style.display = targetFilter === 'home' ? 'block' : 'grid';
            window.history.pushState({ filter: targetFilter }, '', `/${targetFilter}`);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Handle initial URL on page load
    function handleInitialUrl() {
    const path = window.location.pathname;
    
    // Remove trailing slash if present
    const cleanPath = path.replace(/\/$/, '');
    
    // Handle direct access to /nostalgia or /kiut
    if (cleanPath === '/nostalgia') {
        updateDisplay('nostalgia');
        return;
    }
    if (cleanPath === '/kiut') {
        updateDisplay('kiut');
        return;
    }

    // Handle post URLs
    const postMatch = path.match(/^\/post\/(post-\d+|nostalgia-[a-z0-9-]+)$/);
    if (postMatch) {
        const postId = postMatch[1];
        updateDisplay(postId.startsWith('nostalgia-') ? 'nostalgia' : 'home', postId);
        return;
    }

    // Default to home
    updateDisplay('home');
}

    // Enhanced fullscreen function
    function openFullScreen(src) {
        const overlay = document.createElement('div');
        overlay.className = 'fullscreen-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Fullscreen image view');

        const img = document.createElement('img');
        img.src = src;
        img.className = 'fullscreen-image';
        img.setAttribute('alt', 'Fullscreen view');
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

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeOverlay();
            else if (e.key === 'Enter' && e.target === img) img.classList.toggle('zoomed');
        };

        const closeOverlay = () => {
            overlay.classList.remove('active');
            setTimeout(() => {
                overlay.remove();
                document.body.style.overflow = '';
                document.removeEventListener('keydown', handleKeyDown);
            }, 300);
        };

        img.addEventListener('click', () => img.classList.toggle('zoomed'));
        closeButton.addEventListener('click', closeOverlay);
        overlay.addEventListener('click', (e) => e.target === overlay && closeOverlay());
        document.addEventListener('keydown', handleKeyDown);
        img.focus();
    }

    // Lazy loading for images
    const lazyLoadImages = () => {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            if (img.getBoundingClientRect().top < window.innerHeight + 500) {
                img.src = img.dataset.src;
                img.onload = () => img.style.opacity = '1';
                img.removeAttribute('data-src');
            }
        });
    };

    // Initialize lazy loading
    window.addEventListener('load', lazyLoadImages);
    window.addEventListener('scroll', lazyLoadImages);
    window.addEventListener('resize', lazyLoadImages);

    // Event listeners
    filterButtons.forEach(btn => btn.addEventListener('click', () => updateDisplay(btn.getAttribute('data-filter'))));
    blogLinks.forEach(link => link.addEventListener('click', (e) => {
        e.preventDefault();
        const postId = link.getAttribute('data-post-id');
        updateDisplay('home', postId);
    }));
    galleryCards.forEach(card => card.addEventListener('click', (e) => {
        e.preventDefault();
        const postId = card.getAttribute('data-post-id');
        if (postId) updateDisplay('nostalgia', postId);
    }));
    searchToggleBtn.addEventListener('click', () => {
        searchWidget.classList.toggle('expanded');
        if (searchWidget.classList.contains('expanded')) {
            pageSearchInput.focus();
        } else {
            pageSearchInput.value = '';
            searchResultsContainer.classList.remove('visible');
        }
    });
    pageSearchInput.addEventListener('input', () => {
        const searchTerm = pageSearchInput.value.toLowerCase();
        searchResultsContainer.innerHTML = '';
        if (searchTerm.length < 2) {
            searchResultsContainer.classList.remove('visible');
            return;
        }
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
        if (hasResults) {
            searchResultsContainer.classList.add('visible');
        } else {
            searchResultsContainer.classList.remove('visible');
        }
    });
    popupToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        popupContent.classList.toggle('hidden');
        const neonLogo = popupContent.querySelector('.neon-logo');
        if (popupContent.classList.contains('hidden')) {
            neonLogo.style.animation = 'none';
            neonLogo.style.filter = 'brightness(1) drop-shadow(0 0 0 #fff)';
        }
    });
    document.addEventListener('click', (event) => {
        if (!popupContent.contains(event.target) && !popupToggle.contains(event.target)) {
            popupContent.classList.add('hidden');
            const neonLogo = popupContent.querySelector('.neon-logo');
            neonLogo.style.animation = 'none';
            neonLogo.style.filter = 'brightness(1) drop-shadow(0 0 0 #fff)';
        }
    });
    popupContent.addEventListener('click', (event) => event.stopPropagation());

    window.addEventListener('popstate', (e) => {
        const state = e.state || { filter: 'home' };
        updateDisplay(state.filter, state.postId);
    });

    // Set up clickable images
    document.querySelectorAll('.card-image-placeholder img, .clickable-image').forEach(img => {
        img.addEventListener('click', () => openFullScreen(img.src));
    });

    handleInitialUrl();
});
