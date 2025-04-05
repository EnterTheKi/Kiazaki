(function() {
    const container = document.querySelector('.site-container');
    const filterButtons = container.querySelectorAll('.filter-btn');
    const contentSections = {
        home: container.querySelector('#home-content'),
        nostalgia: container.querySelector('#nostalgia-content'),
        kiut: container.querySelector('#kiut-content')
    };
    const searchToggleBtn = container.querySelector('#searchToggle');
    const pageSearchInput = container.querySelector('#pageSearchInput');
    const searchWidget = container.querySelector('#search-widget');
    const searchResultsContainer = container.querySelector('#searchResults');
    const popupToggle = container.querySelector('#popup-toggle');
    const popupContent = container.querySelector('.popup-content');

    function updateDisplay(targetFilter) {
        filterButtons.forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-filter') === targetFilter));
        Object.values(contentSections).forEach(section => {
            section.classList.toggle('hidden', section.id !== `${targetFilter}-content`);
            section.style.display = section.id === `${targetFilter}-content` ? (targetFilter === 'home' ? 'block' : 'grid') : 'none';
        });
        window.history.pushState({ filter: targetFilter }, '', `/${targetFilter}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => updateDisplay(btn.getAttribute('data-filter')));
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
    });

    popupToggle.addEventListener('click', () => {
        popupContent.classList.toggle('hidden');
    });

    updateDisplay('home');
})();
