document.addEventListener("DOMContentLoaded", () => {
    // Force all quote dots to be perfect circles
    document.querySelectorAll('.quote-dot').forEach(dot => {
        dot.style.borderRadius = '9999px';
        dot.style.width = '1.2em';
        dot.style.height = '1.2em';
        dot.style.boxSizing = 'border-box';
        dot.style.appearance = 'none';
        dot.style.webkitAppearance = 'none';
        dot.style.padding = '0';
        dot.style.margin = '0';
        dot.style.border = '2px solid rgba(255, 184, 50, 0.6)';
        dot.style.background = 'transparent';
        dot.style.cursor = 'pointer';
        dot.style.outline = 'none';
        dot.style.display = 'inline-block';
        
        // Force active state styles if dot has 'active' class
        if (dot.classList.contains('active')) {
            dot.style.background = 'linear-gradient(135deg, #ffb832 0%, #d4952a 100%)';
            dot.style.borderColor = '#ffb832';
            dot.style.boxShadow = '0 0 15px rgba(255, 184, 50, 0.6)';
            dot.style.transform = 'scale(1.2)';
            dot.style.animation = 'dotBounce 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite';
        }
    });
    const container = document.querySelector('.site-container');
    const filterButtons = container.querySelectorAll('.filter-btn');
    const contentSections = {
        home: container.querySelector('#home-content'),
        post: container.querySelector('#post-content'),
        blog: container.querySelector('#blog-content'),
        journal: container.querySelector('#post-content'),
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
    const ukiMessages = {
        intro: "Hi, I'm Uki, your companion. I wander the Kiazaki realm. Click the navigation arrows to explore, or tap me for wisdom from the twilight.",
        nav: {
            home: "Home is where the journey begins. The neon sign flickers with ancient secrets.",
            blog: "The Owl's Journal holds wisdom older than memory. Tread carefully—these truths transform.",
            nostalgia: "Memories drift like autumn leaves. Some bring warmth, others—pain. Both are teachers.",
            kiut: "The inner child knows the way. Pure, uncorrupted, eternal."
        },
        wisdom: [
            "The owl sees in darkness because it has made peace with it.",
            "What you seek is already within you.",
            "The path of the owl is solitary. Walk your path alone.",
            "Results do not chase effort—effort creates results.",
            "Time is an illusion. Only now is real.",
            "Your thoughts become your world.",
            "Wisdom is not knowledge—it is living understanding.",
            "Desire is the seed of manifestation.",
            "The universe is mental.",
            "You have great powers within."
        ]
    };
    
    function ukiSpeak() {
        const bubble = document.getElementById('uki-bubble');
        const message = document.getElementById('uki-message');
        if (!bubble || !message) return;
        
        const isRandom = Math.random() > 0.5;
        if (isRandom && currentFilter) {
            message.innerHTML = ukiMessages.nav[currentFilter] || ukiMessages.intro;
        } else {
            const wisdom = ukiMessages.wisdom[Math.floor(Math.random() * ukiMessages.wisdom.length)];
            message.innerHTML = wisdom;
        }
        
        bubble.classList.remove('hidden');
        
        setTimeout(() => {
            bubble.classList.add('hidden');
        }, 5000);
    }
    window.ukiSpeak = ukiSpeak;
    let currentFilter = 'home';
    

    // Neon sign animation
    if (letters.length === 7) {
    function updateLetters() {
        // Randomly pick pairs respecting rules
        const firstK = Math.random() < 0.5 ? 0 : 5;  // K(0) or k(5)
        const firstI = Math.random() < 0.5 ? 1 : 6;  // i(1) or i(6)
        const firstA = Math.random() < 0.5 ? 2 : 4;  // a(2) or a(4)
        const z = 3;                                 // z(3)
        const secondA = firstA === 2 ? 4 : 2;       // Other a
        const secondK = firstK === 0 ? 5 : 0;       // Other k
        const secondI = firstI === 1 ? 6 : 1;       // Other i

        const sequence = [firstK, firstI, firstA, z, secondA, secondK, secondI];
        
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
        currentFilter = targetFilter;
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
                if (backBtn) backBtn.onclick = () => updateDisplay(backBtn.textContent.includes('Imaginary Nostalgia') ? 'nostalgia' : 'home');
                if (window.location.protocol !== 'file:') {
                    window.history.pushState({ filter: targetFilter, postId }, '', `/post/${postId}`);
                }
            }
        } else {
            contentSections[targetFilter].classList.remove('hidden');
            if (window.location.protocol !== 'file:') {
                window.history.pushState({ filter: targetFilter }, '', `/${targetFilter === 'home' ? '' : targetFilter}`);
            }
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
    } else if (redirectPath === '/blog') {
        updateDisplay('blog');
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
    
    // Journal entry click handlers
    const journalEntries = container.querySelectorAll('.journal-entry');
    journalEntries.forEach(entry => {
        entry.addEventListener('click', () => {
            const entryId = entry.dataset.entryId;
            if (entryId) {
                const journalContent = document.getElementById(`${entryId}-content`);
                if (journalContent) {
                    contentSections.post.innerHTML = '';
                    const clonedContent = journalContent.cloneNode(true);
                    clonedContent.classList.remove('hidden');
                    contentSections.post.appendChild(clonedContent);
                    contentSections.post.classList.remove('hidden');
                    
                    const backBtn = contentSections.post.querySelector('.back-btn');
                    if (backBtn) {
                        backBtn.onclick = () => {
                            contentSections.post.classList.add('hidden');
                            contentSections.post.innerHTML = '';
                            contentSections.blog.classList.remove('hidden');
                        };
                    }
                    
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        });
    });
    
    galleryCards.forEach(card => card.addEventListener('click', () => {
        const postId = card.dataset.postId;
        if (postId) updateDisplay('nostalgia', postId);
    }));
    
    // Design card click handlers
    document.addEventListener('click', (e) => {
        const designCard = e.target.closest('.design-card');
        if (designCard && designCard.dataset.postId) {
            e.preventDefault();
            updateDisplay('nostalgia', designCard.dataset.postId);
        }
    });
    

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
    document.querySelectorAll('.card-image-placeholder img, .clickable-image').forEach(img => {
        img.addEventListener('click', (e) => {
            // Don't open fullscreen if clicking on design card images (they navigate to gallery instead)
            if (!e.target.closest('.design-card')) {
                openFullScreen(img.src);
            }
        });
    });
    window.addEventListener('popstate', (e) => updateDisplay(e.state?.filter || 'home', e.state?.postId));

    handleInitialUrl();
    
    // Vimeo video glow effect
    const videoContainer = document.querySelector('.video-container');
    const videoIframe = document.querySelector('.video-container iframe');
    
    if (videoContainer && videoIframe) {
        // Listen for Vimeo player events
        window.addEventListener('message', (event) => {
            if (event.origin !== 'https://player.vimeo.com') return;
            
            try {
                const data = JSON.parse(event.data);
                
                // Handle different Vimeo event types
                if (data.event === 'ready') {
                    console.log('Vimeo player ready');
                }
                
                if (data.event === 'play') {
                    videoContainer.classList.add('playing');
                    console.log('Video playing - glow ON');
                }
                
                if (data.event === 'pause' || data.event === 'ended') {
                    videoContainer.classList.remove('playing');
                    console.log('Video paused/ended - glow OFF');
                }
                
                // Also handle the old event format
                if (data.method === 'ready') {
                    console.log('Vimeo player ready (legacy)');
                }
                
                if (data.method === 'play') {
                    videoContainer.classList.add('playing');
                    console.log('Video playing - glow ON (legacy)');
                }
                
                if (data.method === 'pause') {
                    videoContainer.classList.remove('playing');
                    console.log('Video paused - glow OFF (legacy)');
                }
                
            } catch (e) {
                // Ignore non-JSON messages
            }
        });
        
        // Fallback: Add click listener to detect user interaction
        videoContainer.addEventListener('click', () => {
            // Add a small delay to let the video start playing
            setTimeout(() => {
                if (!videoContainer.classList.contains('playing')) {
                    videoContainer.classList.add('playing');
                    console.log('Video clicked - glow ON (fallback)');
                }
            }, 500);
        });
    }
});

// Radio Player Logic
const radioToggle = document.getElementById('radioToggle');
const radioStream = document.getElementById('radioStream');
let isPlaying = false;

radioToggle.addEventListener('click', () => {
  isPlaying = !isPlaying;
  radioToggle.setAttribute('aria-pressed', isPlaying);
  radioToggle.innerHTML = isPlaying 
    ? '<i class="fa-solid fa-stop"></i><span class="sr-only">Stop Radio</span>'
    : '<i class="fa-solid fa-play"></i><span class="sr-only">Play Radio</span>';

  if (isPlaying) {
    radioStream.play().catch(e => console.error('Radio error:', e));
    radioToggle.classList.add('radio-active');
  } else {
    radioStream.pause();
    radioToggle.classList.remove('radio-active');
  }
});

// Theme Toggle - Light/Dark Mode
const themeToggle = document.getElementById('themeToggle');
const themeToggleIcon = themeToggle ? themeToggle.querySelector('i') : null;

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    if (themeToggleIcon) {
        themeToggleIcon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    }
}

// Load saved theme or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
}

// Companion JavaScript - follows you with delay
(function() {
    const companion = document.getElementById('companion');
    if (!companion) return;
    
const wisdom = [
        // Helpful site tips (Clippy-style)
        "Hi! I'm Uki, your assistant. Click the filter buttons above to explore projects!",
        "Need to go back? Click the Back button below the content.",
        "Looking for music? Click the Bandcamp button in the popup menu!",
        "Want to change themes? Click the sun/moon icon in the popup menu.",
        "Stuck? Click me twice to toggle follow mode, and I'll follow your scroll!",
        
        // R.H. Jarrett - It Works
        "The secret of success is constancy to purpose. — R.H. Jarrett",
        "You must be absolutely honest with yourself. — R.H. Jarrett",
        "Success comes to those who want it most and are willing to pay the price. — R.H. Jarrett",
        "Every cause produces its own effect. — R.H. Jarrett",
        "There is no difficulty but what you can overcome. — R.H. Jarrett",
        
        // James Allen - As a Man Thinketh
        "As a man thinketh in his heart, so is he. — James Allen",
        "Men are not paid for what they know—they are paid for what they do. — James Allen",
        "You will become as much greater as you will think greater thoughts. — James Allen",
        
        // Napoleon Hill - Think and Grow Rich
        "Whatever the mind can conceive and believe, it can achieve. — Napoleon Hill",
        "The starting point of all achievement is desire. — Napoleon Hill",
        "Every failure brings with it the seed of an equal success. — Napoleon Hill",
        
        // Earl Nightingale - The Strangest Secret
        "We become what we think about most of the time. — Earl Nightingale",
        "The strangest secret of success is to see what everyone else sees and think what no one else has thought. — Earl Nightingale",
        "You are where you are because that's exactly where you want to be. — Earl Nightingale",
        "Our lives change when our habits change. — Earl Nightingale",
        "The greatest discovery anyone can make is that this world is exactly what we believe it to be. — Earl Nightingale",
        "Never underestimate the power of gratitude. — Earl Nightingale",
        "A magnet does not attract because it is a magnet—it attracts because it is a magnet. — Earl Nightingale",
        
        // Dale Carnegie - How to Win Friends
        "Become genuinely interested in other people. — Dale Carnegie",
        "A person's name is to that person the sweetest sound. — Dale Carnegie",
        "The only way to get the best of an argument is to avoid it. — Dale Carnegie",
        "Show respect for other person's opinions—never tell anyone they're wrong. — Dale Carnegie",
        "If you are wrong, admit it quickly and emphatically. — Dale Carnegie",
        "Begin with praise and honest appreciation. — Dale Carnegie",
        "Talk in terms of the other person's interests. — Dale Carnegie",
        "Make the other person feel important—and do it sincerely. — Dale Carnegie",
        
        // Charles F. Haanel - The Master Key System
        "The mind that is analytical is the discriminating quality. — Charles F. Haanel",
        "Thought is creative energy—the connecting link between the Finite and the Infinite. — Charles F. Haanel",
        "All power is from within—but surely it will not come to us until we are passive. — Charles F. Haanel",
        "We must learn to be still—to do nothing, to think nothing, and want nothing. — Charles F. Haanel",
        "The ability to reduce great things to small will be worth far more than wealth. — Charles F. Haanel",
        "The spirit of truth knows only the present—past is only memory, future is only imagination. — Charles F. Haanel",
        "More cause than effect—the effect is the child of the cause. — Charles F. Haanel",
        
        // Florence Scovel Shinn - The Game of Life
        "The game of life is the game of再生. — Florence Scovel Shinn",
        "Your perfect partner is visualized, felt, and known. — Florence Scovel Shinn",
        "The divinely attracted person or thing is always magnetically linked to you. — Florence Scovel Shinn",
        "I give what I wish to receive—the law of compensation. — Florence Scovel Shinn",
        "Your word is your wand—it has magical power. — Florence Scovel Shinn",
        "Divine right action releases perfect supply. — Florence Scovel Shinn",
        "Perfect love casts out all fear. — Florence Scovel Shinn",
        
        // Wallace D. Wattles - The Science of Getting Rich
        "There is a thinking stuff from which all things are made. — Wallace D. Wattles",
        "The growth of life is a process of creative synthesis. — Wallace D. Wattles",
        "You must become a creator, not a competitor. — Wallace D. Wattles",
        "Riches come through the use of creative ability. — Wallace D. Wattles",
        "Do not try to get rich by saving—save by getting. — Wallace D. Wattles",
        "The desire for riches is a spiritual force. — Wallace D. Wattles",
        "Creative thought is the highest form of prayer. — Wallace D. Wattles",
        
        // Claude M. Bristol - The Magic of Believing
        "Thinking creates a pattern in the subconscious mind. — Claude M. Bristol",
        "The subconscious mind is the connecting link between Finite and Infinite. — Claude M. Bristol",
        "Believe what you want to happen and it will respond. — Claude M. Bristol",
        "The mind must believe what it must accept. — Claude M. Bristol",
        "Hold the mental image continuously—act as if it already exists. — Claude M. Bristol",
        "Believing is the secret to achievement. — Claude M. Bristol",
        "The magic is in the believing—not in the thing believed in. — Claude M. Bristol",
        
        // Norman Vincent Peale - Power of Positive Thinking
        "Change your thoughts and you change your world. — Norman Vincent Peale",
        "Stand up to the difficulties that are attacking your mind. — Norman Vincent Peale",
        "To what the mind can conceive, the body can achieve. — Norman Vincent Peale",
        "Expect the best and you will get the best. — Norman Vincent Peale",
        "When there is no way to think positively, think rightly. — Norman Vincent Peale",
        "Towel your mental attitude in the direction of optimism and faith. — Norman Vincent Peale",
        "Believe in yourself—believe that you have the ability to achieve. — Norman Vincent Peale",
        
        // Russell Conwell - Acres of Diamonds
        "You are under no obligation to remain what you are. — Russell Conwell",
        "Opportunity is everywhere—the mistake is not seeing it. — Russell Conwell",
        "The only way to find yourself is to lose yourself in service. — Russell Conwell",
        "The world is full of diamonds that lie in the acres we already own. — Russell Conwell",
        "Every person has a hidden talent—dig for it. — Russell Conwell",
        "If you want to be happy, be. — Russell Conwell",
        
        // P.T. Barnum - The Art of Money Getting
        "The way to become rich is to save while you earn. — P.T. Barnum",
        "Any person who declares they will never be in debt is determined not to be rich. — P.T. Barnum",
        "Tricks and swindles are poor reliance—they are but small temporary gains. — P.T. Barnum",
        "The honest man who saves has a sure compass to wealth. — P.T. Barnum",
        "The customer is always right. — P.T. Barnum",
        "Do not let your ambition be cramped by your lack of capital. — P.T. Barnum",
        
        // Sun Tzu - The Art of War
        "Know yourself and know your enemy, and you will not be defeated. — Sun Tzu",
        "In war, speed is the essence. — Sun Tzu",
        "The supreme art of war is to subdue the enemy without fighting. — Sun Tzu",
        "Every battle is won or lost before it is fought. — Sun Tzu",
        "Appear at points which the enemy must hasten to defend. — Sun Tzu",
        "He who knows when he can fight and when he cannot will be victorious. — Sun Tzu",
        "Move Swiftly as the wind—silent as the forest. — Sun Tzu",
        
        // Neville Goddard - Feeling is the Secret
        "The feeling of the wish fulfilled is the secret of success. — Neville Goddard",
        "Never affirm the want as a present reality—affirm the wish as already fulfilled. — Neville Goddard",
        "Consciousness is the only reality. — Neville Goddard",
        "Assume the feeling of the wish fulfilled and continue in that state. — Neville Goddard",
        "The present moment is the key to every door. — Neville Goddard",
        "You are already that which you want to be. — Neville Goddard",
        "I AM is the name of being—it is the name of God. — Neville Goddard",
        
        // Neville Goddard - The Law and the Promise
        "What is promised is always possible—it is the gift of God. — Neville Goddard",
        "Faith in the promise moves all things into action. — Neville Goddard",
        "To him who believes, all things are possible. — Neville Goddard",
        "The law works always for those who truly believe. — Neville Goddard",
        "When you assume the feeling of the wish fulfilled, you must live in that assumption. — Neville Goddard",
        "The things which are impossible are only things we have decided are impossible. — Neville Goddard",
        
        // Joseph Murphy - The Power of Your Subconscious Mind
        "The subconscious mind is reactive—it accepts what you impress. — Joseph Murphy",
        "The creative power of your subconscious mind is infinite—it responds to your thoughts. — Joseph Murphy",
        "A suggestion accepted by your subconscious mind becomes a self-fulfilling prophecy. — Joseph Murphy",
        "Your thought of wealth and riches opens the creative law of your subconscious mind. — Joseph Murphy",
        "Mentally impress on your subconscious mind the result you desire. — Joseph Murphy",
        "Whatever you think, dream, or imagine is recorded in your subconscious mind. — Joseph Murphy",
        "When you pray, believe and feel that your prayer is answered. — Joseph Murphy",
        "Your subconscious mind never sleeps—it works 24 hours a day. — Joseph Murphy",
        
        // Miyamoto Musashi - The Book of Five Rings (Vagabond inspiration)
        "The way of the warrior is the mind of the samurai. — Miyamoto Musashi",
        "Do nothing which is of no use. — Miyamoto Musashi",
        "Think of what is right and true. — Miyamoto Musashi",
        "Practice and hone your craft—perfection comes from daily discipline. — Miyamoto Musashi",
        "The enemy is in front of you—focus on your own path. — Miyamoto Musashi",
        "In strategy, there is no instant victory. Only continuous improvement. — Miyamoto Musashi",
        "The sword that cuts without cutting is the true blade. — Miyamoto Musashi",
        "Know the enemy and know yourself—victory then comes without doubt. — Miyamoto Musashi",
        "Accept everything just as it is—do not expect praise or blame. — Miyamoto Musashi",
        "Morning is the time to begin—do not wait for noon. — Miyamoto Musashi",
        "Perceive that which cannot be seen with the eye. — Miyamoto Musashi",
        
        // Nikola Tesla (3327 energy/Tesla room inspiration)
        "The present is theirs; the future, for which I really worked, is mine. — Nikola Tesla",
        "If you want to find the secrets of the universe, think in terms of energy, frequency, and vibration. — Nikola Tesla",
        "The scientists of today think deeply instead of clearly. One must be sane to think clearly. — Nikola Tesla",
        "The mind is the builder—the result is the created thing. — Nikola Tesla",
        "Alone we can do so little; together we can do so much. — Nikola Tesla",
        "There is no energy in matter—there is only energy in motion. — Nikola Tesla",
        "The gift of mental power comes from God, the divine source—if we want to do for all humanity what we are able to do for ourselves. — Nikola Tesla",
        "We have but to utilize the infinite waves of cosmic energy that surround us—never stop learning, never stop questioning. — Nikola Tesla",
        "What one man can imagine, another man can create. — Nikola Tesla",
        "The day science begins to study non-physical phenomena, it will make more progress in one decade than in all the previous centuries. — Nikola Tesla",
        
        // 3327 - Tesla's room number / mystical significance
        "3-3-2-7: The sequence that echoes through the void. — 3327",
        "In room 3327, Tesla found silence and spoke with the universe. — 3327",
        "The numbers align for those who listen: 33 is mastery, 27 is beginning. — 3327",
        "3327—the room where one man listened to the cosmic code. — 3327",
        
        // R.H. Jarrett - additional wisdom
        "The time is now—what you do today creates your future. — R.H. Jarrett",
        "No one can think for you—you must do your own thinking. — R.H. Jarrett",
        "The secret of all success is contained in the word 'work'. — R.H. Jarrett",
        
        // Core mystical wisdom
        "The silence knows what noise forgets.",
        "Ki is not found—it becomes.",
        "Want with certainty. Receive with grace.",
        "The owl sees what light ignores.",
        "Stillness is not empty—it awaits.",
        "Focus is the rarest wealth.",
        "Results follow direction—not chase.",
        "As within, so without.",
        "As above, so below."
    ];
    
    // Mouse tracking - with scroll support
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let lastX = window.innerWidth - 100;
    let lastY = window.innerHeight - 120;
    let isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    
    document.addEventListener('mousemove', (e) => {
        if (!isMobile) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }
    });
    
    // Touch tracking for mobile
    if (isMobile) {
        document.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            mouseX = touch.clientX;
            mouseY = touch.clientY;
        });
        
        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            mouseX = touch.clientX;
            mouseY = touch.clientY;
        });
    }
    
    
    
    companion.style.left = lastX + 'px';
    companion.style.top = lastY + 'px';
    
    // Click shows wisdom - single click
    let clickCount = 0;
    let clickTimer;
    let followMode = true;
    
    companion.style.pointerEvents = 'auto';
    companion.style.cursor = 'pointer';
    
    // Only trigger wisdom when clicking on the owl image itself
    const companionImg = companion.querySelector('img');
    
    companionImg.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        clickCount++;
        
        if (clickCount === 1) {
            clickTimer = setTimeout(() => {
                showWisdom(wisdom[Math.floor(Math.random() * wisdom.length)]);
                clickCount = 0;
            }, 250);
        } else if (clickCount === 2) {
            clearTimeout(clickTimer);
            clickCount = 0;
            followMode = !followMode;
            showWisdom(followMode ? "Following..." : "Staying put...");
        }
    });
    
    // Show tooltip with wisdom - bigger, more readable text
    function showWisdom(text) {
        // Remove any existing tooltips first
        const existingTooltips = document.querySelectorAll('.owl-wisdom-tooltip');
        existingTooltips.forEach(t => t.remove());
        
        const tooltip = document.createElement('div');
        tooltip.className = 'owl-wisdom-tooltip';
        tooltip.textContent = '"' + text + '"';
        
        // Position to the left/above of the owl - use current owl position
        const owlRect = companion.getBoundingClientRect();
        const isMobile = window.innerWidth <= 768;
        
        // Adjust positioning for mobile
        let tooltipX, tooltipY, maxWidth;
        if (isMobile) {
            // On mobile, position above the owl
            tooltipX = Math.max(10, owlRect.left - 50);
            tooltipY = Math.max(10, owlRect.top - 120);
            maxWidth = Math.min(240, window.innerWidth - 30);
        } else {
            tooltipX = owlRect.left - 240;
            tooltipY = owlRect.top - 20;
            maxWidth = 220;
        }
        
        tooltip.style.cssText = `
            position: fixed;
            left: ${tooltipX}px;
            top: ${tooltipY}px;
            max-width: ${maxWidth}px;
            padding: 14px 18px;
            background: rgba(20, 15, 10, 0.96);
            border: 1px solid rgba(255, 200, 100, 0.5);
            border-radius: 8px;
            font-family: var(--body-font);
            font-style: italic;
            font-size: ${isMobile ? '1rem' : '1.1rem'};
            line-height: 1.5;
            color: rgba(230, 215, 190, 0.95);
            box-shadow: 0 6px 25px rgba(0, 0, 0, 0.7);
            z-index: 10001;
            opacity: 0;
            transition: opacity 0.35s ease;
            word-wrap: break-word;
            text-align: center;
        `;
        
        document.body.appendChild(tooltip);
        
        requestAnimationFrame(() => tooltip.style.opacity = '1');
        
        setTimeout(() => {
            tooltip.style.opacity = '0';
            setTimeout(() => tooltip.remove(), 300);
        }, 4000);
    }
    
// Smooth follow - simpler, follows everywhere
    let offsetPhase = Math.random() * Math.PI * 2;
    let targetOffsetX = 60;
    let targetOffsetY = 60;
    let currentOffsetX = 60;
    let currentOffsetY = 60;
    
    function updateTargetOffset() {
        const angle = Math.random() * Math.PI * 2;
        const distance = 35 + Math.random() * 50;
        targetOffsetX = Math.cos(angle) * distance;
        targetOffsetY = Math.sin(angle) * distance;
    }
    updateTargetOffset();
    
    setInterval(() => {
        if (followMode) updateTargetOffset();
    }, 5000); // Update position every 5 seconds
    
    function smoothFollow() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (!followMode) {
            // Stay put
        } else {
            offsetPhase += 0.008;
            
            currentOffsetX += (targetOffsetX - currentOffsetX) * 0.004;
            currentOffsetY += (targetOffsetY - currentOffsetY) * 0.004;
            
            const wobbleX = Math.sin(offsetPhase) * 4;
            const wobbleY = Math.cos(offsetPhase * 0.8) * 3;
            
            const targetX = mouseX + currentOffsetX + wobbleX;
            const targetY = mouseY + currentOffsetY + wobbleY;
            
            // Very slow, smooth follow
            lastX += (targetX - lastX) * 0.02;
            lastY += (targetY - lastY) * 0.02;
        }
        
        // Set position - no bounds, follows everywhere
        companion.style.left = lastX + 'px';
        companion.style.top = lastY + 'px';
        
        requestAnimationFrame(smoothFollow);
    }
    smoothFollow();
    
    // Handle page navigation - teleport effect
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            companion.classList.add('teleporting');
            setTimeout(() => {
                lastX = window.innerWidth - 100;
                lastY = window.innerHeight / 2;
                companion.style.left = lastX + 'px';
                companion.style.top = lastY + 'px';
                setTimeout(() => companion.classList.remove('teleporting'), 400);
            }, 200);
        });
    });
})();
