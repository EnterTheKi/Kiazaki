// Kiazaki Script

(function() {
    const container = document.querySelector('.site-container'); // Use the new wrapper class
    if (!container) {
        console.error("Site container '.site-container' not found! Script cannot run.");
        return;
    }

    // --- Element Declarations ---
    const searchWidget = container.querySelector('#search-widget');
    const searchToggleBtn = container.querySelector('#searchToggle');
    const pageSearchInput = container.querySelector('#pageSearchInput');
    const searchResultsContainer = container.querySelector('#searchResults');
    const yearSpan = container.querySelector('#copyright-year');
    const clickableImages = container.querySelectorAll('.post-image'); // Target blog post images

    // --- Fullscreen Image Functionality (from Distracted WORLD) ---
    function setupFullscreenImages() {
        clickableImages.forEach(img => {
            // Check if listener already added to prevent duplicates
            if (!img.dataset.fullscreenListenerAdded) {
                img.style.cursor = 'pointer'; // Ensure pointer cursor
                img.addEventListener('click', handleImageClick);
                img.dataset.fullscreenListenerAdded = 'true'; // Mark as added
            }
        });
    }

    function handleImageClick(e) {
        // Prevent triggering if clicking a link containing an image (though less likely here)
        if (e.target.closest('a')) return;
        e.stopPropagation();
        showFullscreenImage(this.src, this.alt);
    }

    function showFullscreenImage(src, alt) {
        // Remove existing overlay if any
        const existingOverlay = document.querySelector('.fullscreen-overlay');
        if (existingOverlay && existingOverlay.parentNode) {
            existingOverlay.parentNode.removeChild(existingOverlay);
        }
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'fullscreen-overlay';
        // Create image element
        const fullscreenImg = document.createElement('img');
        fullscreenImg.className = 'fullscreen-image';
        fullscreenImg.src = src;
        fullscreenImg.alt = alt || "Fullscreen Image";
        // Append image to overlay
        overlay.appendChild(fullscreenImg);
        // Add click listener to overlay to close it
        overlay.addEventListener('click', () => {
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        });
        // Append overlay to body
        document.body.appendChild(overlay);
    }

    // --- Text Highlighting Functions (from Distracted WORLD) ---
    function highlightTextInElement(element, searchTerm) {
        if (!element || !element.textContent || typeof element.textContent !== 'string' || searchTerm.length < 1) return;

        // Store original HTML if not already stored
        if (!element.dataset.originalHtml) {
            element.dataset.originalHtml = element.innerHTML;
        } else {
            // Restore original before re-highlighting to prevent nested spans
            element.innerHTML = element.dataset.originalHtml;
        }

        const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');

        // Use TreeWalker for robust text node traversal
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        let node;
        const nodesToReplace = [];

        while (node = walker.nextNode()) {
            // Avoid highlighting within scripts, styles, buttons, links
            let parent = node.parentNode;
            let allowHighlight = true;
            while (parent && parent !== element) {
                if (['SCRIPT', 'STYLE', 'BUTTON', 'A'].includes(parent.tagName)) {
                    allowHighlight = false;
                    break;
                }
                parent = parent.parentNode;
            }

            if (allowHighlight) {
                const nodeValue = node.nodeValue;
                // Need a local regex because global regex maintains state
                const localRegex = new RegExp(regex.source, regex.flags);
                if (localRegex.test(nodeValue)) {
                    nodesToReplace.push({ node: node, value: nodeValue });
                }
            }
        }

        // Perform replacements after traversal
        nodesToReplace.forEach(item => {
            const localRegex = new RegExp(regex.source, regex.flags);
            // Use the '.search-highlight' class from CSS
            const newNodeValue = item.value.replace(localRegex, '<span class="search-highlight">$1</span>');

            // Replace the text node with the new HTML fragment
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = newNodeValue;
            const fragment = document.createDocumentFragment();
            while (tempDiv.firstChild) {
                fragment.appendChild(tempDiv.firstChild);
            }
            if (item.node.parentNode) {
                item.node.parentNode.replaceChild(fragment, item.node);
            }
        });
    }

    function removeHighlights() {
        // Restore original HTML using data attribute
        const highlightedElements = container.querySelectorAll('[data-original-html]');
        highlightedElements.forEach(element => {
            if (typeof element.dataset.originalHtml === 'string') {
                element.innerHTML = element.dataset.originalHtml;
            }
            delete element.dataset.originalHtml; // Clean up data attribute
        });

        // Fallback: Remove highlight spans directly if data attribute method fails
        const spans = container.querySelectorAll('span.search-highlight');
        spans.forEach(span => {
            if (span.parentNode) {
                const textNode = document.createTextNode(span.textContent);
                span.parentNode.replaceChild(textNode, span);
                span.parentNode.normalize(); // Merge adjacent text nodes
            }
        });
        document.removeEventListener('click', clickAwayListenerForHighlights);
    }

    function clickAwayListenerForHighlights(event) {
        // If click is outside the search widget, remove highlights
        if (searchWidget && !searchWidget.contains(event.target)) {
            removeHighlights();
        }
    }

    // --- Site Search Function (Adapted from Distracted WORLD) ---
    function executeSiteSearch(term) {
        if (!searchResultsContainer) return;
        searchResultsContainer.innerHTML = ''; // Clear previous results
        if (!term || term.length < 2) {
            searchResultsContainer.classList.remove('visible');
            return;
        }

        const results = [];
        const searchTerm = term.toLowerCase();
        const searchRegex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');

        // Define searchable areas in Kiazaki structure
        const searchableConfig = [
            // Search Blog Post Titles and Bodies
            { name: 'Posts', selectors: ['.blog-post .post-title a', '.blog-post .post-body p', '.blog-post .post-body h3', '.blog-post blockquote'], linkSelector: '.post-title a' },
            // Search Sidebar Widget Titles and Content (example for categories)
            { name: 'Sidebar', selectors: ['.sidebar .widget-title', '.sidebar .categories-widget li a'], linkSelector: null }, // No specific link, just show match
            // Add more sections if needed (e.g., About page content if loaded dynamically, or specific static pages)
        ];

        // Helper to create snippet and add result
        const addResult = (config, element, textContent) => {
            searchRegex.lastIndex = 0; // Reset regex state
            if (searchRegex.test(textContent)) {
                searchRegex.lastIndex = 0; // Reset again for exec
                const match = searchRegex.exec(textContent);
                if (match) {
                    const index = match.index;
                    const start = Math.max(0, index - 30);
                    const end = Math.min(textContent.length, index + term.length + 50);
                    let snippet = textContent.substring(start, end).trim();
                    if (start > 0) snippet = '...' + snippet;
                    if (end < textContent.length) snippet = snippet + '...';

                    // Use the CSS class '.search-highlight'
                    snippet = snippet.replace(searchRegex, match => `<span class="search-highlight">${match}</span>`);

                    // Try to find a relevant link for the result item
                    let targetUrl = '#'; // Default anchor
                    let resultTitle = element.textContent.substring(0, 50) + '...'; // Default title is snippet start

                    if (config.linkSelector) {
                        const linkElement = element.closest('.blog-post')?.querySelector(config.linkSelector);
                        if (linkElement) {
                            targetUrl = linkElement.getAttribute('href') || '#';
                            resultTitle = linkElement.textContent; // Use post title
                        }
                    } else if (element.tagName === 'A') { // If the element itself is a link (e.g., category)
                        targetUrl = element.getAttribute('href') || '#';
                        resultTitle = element.textContent;
                    } else if (element.classList.contains('widget-title')) {
                         resultTitle = element.textContent; // Use widget title
                         targetUrl = '#'; // No specific link for widget title match
                    }

                    // Action: Navigate or scroll to the element (simplified here)
                    const action = () => {
                        // For a real site, you'd navigate to targetUrl
                        console.log("Navigate or scroll to:", targetUrl);
                        // On a static page, scroll to the element containing the match
                        const targetElement = element.closest('.blog-post') || element.closest('.widget') || element;
                        targetElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        // Highlight the term on the page after scrolling/navigating
                         setTimeout(() => highlightTextOnPage(term, targetElement), 300);
                    };

                    // Avoid simple duplicates
                    if (!results.some(r => r.title === resultTitle && r.text.substring(0, 30) === snippet.substring(0, 30))) {
                        results.push({
                            section: config.name, // Group by config name
                            title: resultTitle,   // Store a title for the result
                            text: snippet,
                            action: action
                        });
                    }
                }
            }
        };

        // Search through configured sections
        searchableConfig.forEach(config => {
            container.querySelectorAll(config.selectors.join(', ')).forEach(el => {
                 // Ensure element is visible before searching its content
                 if (el.offsetParent !== null) {
                     addResult(config, el, el.textContent || '');
                 }
            });
        });

        // Display results
        if (results.length > 0) {
            // Group results by section
            const groupedResults = {};
            results.forEach(result => {
                if (!groupedResults[result.section]) groupedResults[result.section] = [];
                if (groupedResults[result.section].length < 5) { // Limit per section
                    groupedResults[result.section].push(result);
                }
            });

            // Build the results list
            Object.entries(groupedResults).forEach(([sectionName, sectionResults]) => {
                const sectionHeader = document.createElement('div');
                sectionHeader.className = 'search-result-section';
                sectionHeader.textContent = sectionName;
                searchResultsContainer.appendChild(sectionHeader);
                sectionResults.forEach(result => {
                    const item = document.createElement('div');
                    item.className = 'search-result-item';
                     // Display title and snippet
                     item.innerHTML = `<em>${result.title}:</em> ${result.text}`;
                    item.addEventListener('click', () => {
                        result.action();
                        if (searchWidget) searchWidget.classList.remove('expanded');
                        if (pageSearchInput) pageSearchInput.value = '';
                        searchResultsContainer.classList.remove('visible');
                    });
                    searchResultsContainer.appendChild(item);
                });
            });
            searchResultsContainer.classList.add('visible');
        } else {
            const noResults = document.createElement('div');
            noResults.className = 'search-result-item';
            noResults.textContent = 'No results found for "' + term + '"';
            searchResultsContainer.appendChild(noResults);
            searchResultsContainer.classList.add('visible');
        }
    }

    // Helper function to highlight text within a specific area after navigation/scroll
    function highlightTextOnPage(searchTerm, searchArea = document.body) {
         removeHighlights(); // Clear previous first
         if (!searchTerm || searchTerm.trim().length === 0) return;

         const elementsToSearch = searchArea.querySelectorAll(
             '.post-title a, .post-body p, .post-body h3, blockquote, .widget-title, .categories-widget li a' // Selectors relevant to Kiazaki
         );
         let foundHighlight = false;
         elementsToSearch.forEach(el => {
             if (el.offsetParent !== null) { // Check visibility
                 highlightTextInElement(el, searchTerm);
                 if (el.querySelector('.search-highlight')) {
                     foundHighlight = true;
                 }
             }
         });

         // Add listener to remove highlights on click outside search
         if (foundHighlight) {
             document.removeEventListener('click', clickAwayListenerForHighlights);
             document.addEventListener('click', clickAwayListenerForHighlights);
         }
     }


    // --- Search Widget Interactions ---
    if (searchToggleBtn && pageSearchInput && searchWidget && searchResultsContainer) {
        searchToggleBtn.addEventListener('click', e => {
            e.stopPropagation();
            const isNowExpanded = searchWidget.classList.toggle('expanded');
            if (isNowExpanded) {
                pageSearchInput.focus();
                pageSearchInput.placeholder = 'Search Site...'; // Static placeholder
            } else {
                pageSearchInput.value = '';
                searchResultsContainer.innerHTML = '';
                searchResultsContainer.classList.remove('visible');
                removeHighlights(); // Clear highlights on close
            }
        });

        let searchTimeout;
        pageSearchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            const currentTerm = pageSearchInput.value;
            // Trigger search only if widget is expanded
            if (searchWidget.classList.contains('expanded')) {
                searchTimeout = setTimeout(() => executeSiteSearch(currentTerm), 300);
            } else {
                 // If user types while collapsed, clear results but don't search
                 searchResultsContainer.innerHTML = '';
                 searchResultsContainer.classList.remove('visible');
            }
        });

        // Prevent blur when clicking results
        searchResultsContainer.addEventListener('mousedown', e => e.preventDefault());

        // Close search when clicking outside
        document.addEventListener('click', event => {
            if (searchWidget && !searchWidget.contains(event.target) && searchWidget.classList.contains('expanded')) {
                searchToggleBtn.click(); // Use toggle button's logic to close
            }
        });

        // Keyboard navigation (Enter/Escape)
        pageSearchInput.addEventListener('keydown', e => {
            if (e.key === 'Enter' && searchWidget.classList.contains('expanded')) {
                e.preventDefault();
                const firstResult = searchResultsContainer.querySelector('.search-result-item');
                if (firstResult && !firstResult.textContent.toLowerCase().includes('no results')) {
                    firstResult.click(); // Trigger the action of the first result
                } else {
                    searchResultsContainer.classList.remove('visible'); // Hide if no valid results
                }
            } else if (e.key === 'Escape' && searchWidget.classList.contains('expanded')) {
                searchToggleBtn.click(); // Collapse on Escape
            }
        });
    } else {
        console.warn("Search widget elements not fully found. Search functionality may be limited.");
    }

    // --- Initial Setup Calls ---
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear(); // Set copyright year
    }
    setupFullscreenImages(); // Initial setup for images present on page load

})(); // End IIFE
