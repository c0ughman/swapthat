// Full profile data with diagnosis content
const fullProfileData = {
    firefighter: {
        name: 'The Frazzled Firefighter',
        color: '#FFB5B5',
        colorDark: '#E89999',
        product: 'Bubbles',
        productLink: './bubbles.html',
        headline: 'Stop Fighting Fires.<br><span class="highlight">Start Seeing Them Coming.</span>',
        subheadline: 'Your diagnosis revealed exactly why you\'re always behind. Now here\'s the tool built specifically to fix it.',
        productDescription: 'Visual news intelligence that shows you the entire landscape at a glance. Spot patterns before they become problems. See what\'s developing, not just what\'s happened.',
        bookTitle: 'The Modern Firefighter\'s Guide to Proactive Decision-Making',
        bookDescription: 'A comprehensive playbook for professionals who are done reacting and ready to start anticipating. Learn to leverage AI-powered intelligence tools to stay three steps ahead.',
        finalMessage: `Most people stay stuck in reactive mode forever. They keep fighting the same fires,
            missing the same signals, wondering why they're always a step behind.`,
        rootCause: `The information you need exists. It's out there right now. But it's scattered across hundreds of sources, buried in noise, and impossible to see as a coherent picture. You're not behind because you're slow. You're behind because you don't have a bird's-eye view of the landscape.`,
        insight: `You don't need to consume more news. You need to see the news landscape — all at once, visually mapped, so patterns emerge before they become problems.`,
        solution: `Bubbles gives you exactly that: a visual map of everything happening in your world, organized into clusters that reveal what's actually developing. Instead of reading article after article, you see the entire landscape at a glance.`
        ,
        problemCopy: `Every morning starts with a new fire alarm. Important shifts happen off your radar and you only hear about them once you're already scrambling.`,
        needCopy: `You need a single pane of glass that surfaces the signal before the fire becomes a crisis.`,
        helpCopy: `Bubbles plots the landscape, highlights the critical moves, and lets you act with the calm control you're after.`
    },
    detective: {
        name: 'The Drowning Detective',
        color: '#D4B5FF',
        colorDark: '#B899E8',
        product: 'Genie',
        productLink: './genie.html',
        headline: 'Stop Drowning in Data.<br><span class="highlight">Start Surfacing Insights.</span>',
        subheadline: 'Your diagnosis revealed why information overload is killing your effectiveness. Now here\'s the tool that does the analysis for you.',
        productDescription: 'Strategic intelligence that transforms your questions into clear, actionable answers. Ask anything about your industry, market, or competitors — get synthesized insights in seconds.',
        bookTitle: 'The Modern Detective\'s Guide to Strategic Intelligence',
        bookDescription: 'A comprehensive playbook for professionals who are done drowning in data and ready to derive real insights. Learn to leverage AI-powered analysis to cut through the noise.',
        finalMessage: `Most people stay trapped in information overload forever. They keep collecting data,
            missing the insights, wondering why they can't turn knowledge into action.`,
        rootCause: `You're not drowning in information. You're drowning in unprocessed information — raw data that hasn't been analyzed, connected, or translated into actionable insight. You're doing the work of an entire research team by yourself, manually.`,
        insight: `You don't need more sources or better discipline. You need a system that does the analysis for you — one that takes your specific question and delivers a synthesized, actionable answer.`,
        solution: `Genie is built for exactly this problem. Ask a strategic question — any question about your industry, market, competitors, or trends — and Genie analyzes hundreds of sources to give you a clear, comprehensive answer.`
        ,
        problemCopy: `You're shouldering the work of an entire research team — dozens of sources, zero synthesis, and no time for decisive action.`,
        needCopy: `You need a partner that distills everything into the insight you can share at the next meeting in minutes, not hours.`,
        helpCopy: `Genie reads the signal, connects the dots, and summarizes the winning narrative so you can advise with confidence.`
    },
    collector: {
        name: 'The Cautious Collector',
        color: '#B5FFD4',
        colorDark: '#99E8B8',
        product: 'Chat',
        productLink: './chat.html',
        headline: 'Stop Collecting Information.<br><span class="highlight">Start Making Decisions.</span>',
        subheadline: 'Your diagnosis revealed why more data never feels like enough. Now here\'s the thinking partner that turns knowledge into confident action.',
        productDescription: 'An AI conversation partner that knows the news, understands context, and helps you think through decisions in real-time. Get executive briefs, SWOT analyses, and strategic recommendations on demand.',
        bookTitle: 'The Modern Collector\'s Guide to Decisive Action',
        bookDescription: 'A comprehensive playbook for professionals who are done preparing and ready to start acting. Learn frameworks that transform information into confident decisions.',
        finalMessage: `Most people stay paralyzed by analysis forever. They keep gathering more data,
            missing more opportunities, wondering why certainty never comes.`,
        rootCause: `Information abundance creates the illusion that perfect knowledge is possible. It's not. But more importantly, you don't need more information — you need a way to think through what you already have. The gap isn't in your data. It's in your ability to process it into clear conclusions.`,
        insight: `You don't need more data. You need a thinking partner — a way to talk through what you know and arrive at clarity through conversation.`,
        solution: `Chat lets you do exactly that. It's an AI conversation partner that knows the news, understands context, and helps you think through decisions in real-time. Ask questions. Explore angles. Request analysis in any format — executive briefs, SWOT analyses, risk assessments, talking points.`
        ,
        problemCopy: `You archive every article but still feel uncertain at the decision point — the data is there, the confidence is not.`,
        needCopy: `You need a rapid-fire conversation that turns all that context into a clear direction.`,
        helpCopy: `Chat hears every nuance, asks the right follow-ups, and hands you the insight you never have time to extract yourself.`
    },
    islander: {
        name: 'The Intuitive Islander',
        color: '#B5E5FF',
        colorDark: '#99CCE8',
        product: 'Bites',
        productLink: './bites.html',
        headline: 'Stay Informed, Not Overwhelmed.<br><span class="highlight">Intelligence on Your Terms.</span>',
        subheadline: 'Your diagnosis revealed why you opted out of the information chaos. Now here\'s the single source that respects your time while keeping you sharp.',
        productDescription: 'Daily intelligence briefings tailored to your interests. Everything that matters, nothing that doesn\'t. Delivered once a day, consumed in minutes.',
        bookTitle: 'The Modern Islander\'s Guide to Calibrated Intuition',
        bookDescription: 'A comprehensive playbook for professionals who value their instincts and their sanity. Learn to enhance your gut with strategic intelligence — without rejoining the chaos.',
        finalMessage: `Most people either drown in information or fly blind forever. They never find the balance
            between staying informed and staying sane.`,
        rootCause: `You're not wrong to be skeptical. Most information sources are noise machines that create anxiety without creating value. Opting out was a rational response to an irrational system. But here's the thing: opting out of bad information isn't the same as opting out of all information.`,
        insight: `You don't need to rejoin the chaos. You need a single source that respects your time, delivers only what matters, and keeps your intuition sharp without overwhelming it.`,
        solution: `Bites is designed for people exactly like you. Pick your topics. Get one daily email with everything that actually matters, intelligently summarized. No endless feeds. No notification anxiety. Just the essential intelligence you need to keep your instincts calibrated to current reality.`
        ,
        problemCopy: `You opted out of noise because it was making you anxious, but now you wonder what important pieces you missed.`,
        needCopy: `You need intelligent curation that keeps your intuition sharp without dragging you back into the storm.`,
        helpCopy: `Bites delivers one precise briefing per day: zero clutter, only the storylines you need to stay confident.`
    }
};

// Keep profileData for backward compatibility
const profileData = fullProfileData;

const prizeDescriptions = {
    '7-day-free': { display: '7 Days Free', trial: 7, discount: null },
    '14-day-free': { display: '14 Days Free', trial: 14, discount: null },
    '21-day-free': { display: '21 Days Free', trial: 21, discount: null },
    '30-day-free': { display: '30 Days Free', trial: 30, discount: null },
    '30-percent-off': { display: '30% Off First Month', trial: 7, discount: 30 },
    '40-percent-off': { display: '40% Off First Month', trial: 7, discount: 40 },
    '50-percent-off': { display: '50% Off First Month', trial: 7, discount: 50 },
    '60-percent-off': { display: '60% Off First Month', trial: 7, discount: 60 }
};

let timeRemaining = 600; // 10 minutes
let timerInterval;

// Default offer - auto-applied when page loads
const DEFAULT_OFFER = '14-day-free';

function getQuizProfile() {
    const stored = localStorage.getItem('quizProfile');
    if (stored) {
        return JSON.parse(stored);
    }
    return null;
}

function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        profile: params.get('profile') || 'firefighter',
        product: params.get('product') || 'bubbles',
        email: params.get('email') || '',
        name: params.get('name') || ''
    };
}

function generateDiscountCode(personaName, name, personaId) {
    // Extract persona type from persona name (e.g., "The Cautious Collector" -> "Collector")
    const personaTypeMap = {
        'firefighter': 'Firefighter',
        'detective': 'Detective',
        'collector': 'Collector',
        'islander': 'Islander'
    };
    
    // Get persona type (capitalize first letter, rest lowercase)
    const personaType = personaTypeMap[personaId] || personaName.split(' ').pop();
    
    // Get user's first name or use "Name" as placeholder
    let userName = 'Name';
    if (name && name.trim()) {
        userName = name.split(' ')[0].trim();
        // Capitalize first letter, rest lowercase
        userName = userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase();
    }
    
    // Get current date in format: MONDD (e.g., JAN30)
    const now = new Date();
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month = monthNames[now.getMonth()];
    const day = String(now.getDate());
    const dateStr = month + day;
    
    // Create code: Name + PersonaType + Date (e.g., NameCollectorJAN30)
    return `${userName}${personaType}${dateStr}`;
}

function initializePage() {
    try {
        const urlParams = getUrlParams();

        const profile = profileData[urlParams.profile] || profileData.firefighter;

        // Auto-apply default offer
        const prize = prizeDescriptions[DEFAULT_OFFER] || prizeDescriptions['30-day-free'];

        personalizeContent(profile, prize);
        setupDiscountCode(urlParams, profile);
        highlightRecommendedProduct(profile.product);
    } catch (error) {
        console.error('Error in initializePage:', error);
    }
    
    // Always initialize timer and carousel, even if other parts fail
    try {
        startTimer();
    } catch (error) {
        console.error('Error starting timer:', error);
    }
    
    try {
        initializeReviewsSlideshow();
    } catch (error) {
        console.error('Error initializing reviews slideshow:', error);
    }
}

// Reviews Slideshow
let currentSlide = 0;
let slideshowInterval;

function initializeReviewsSlideshow() {
    const cards = document.querySelectorAll('.review-card');
    const dots = document.querySelectorAll('.dot');
    
    if (cards.length === 0) {
        console.warn('No review cards found');
        return;
    }
    
    // Ensure first slide is active (in case HTML doesn't have it)
    if (cards.length > 0) {
        cards.forEach((card, index) => {
            if (index === 0) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }
    
    // Set up dot click handlers
    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetAutoPlay();
            });
        });
        
        // Ensure first dot is active
        dots.forEach((dot, index) => {
            if (index === 0) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Start auto-play
    startAutoPlay();
}

function goToSlide(index) {
    const cards = document.querySelectorAll('.review-card');
    const dots = document.querySelectorAll('.dot');
    
    // Remove active class from all
    cards.forEach(card => card.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to current
    cards[index].classList.add('active');
    dots[index].classList.add('active');
    
    currentSlide = index;
}

function nextSlide() {
    const cards = document.querySelectorAll('.review-card');
    currentSlide = (currentSlide + 1) % cards.length;
    goToSlide(currentSlide);
}

function startAutoPlay() {
    // Clear any existing interval
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
    }
    slideshowInterval = setInterval(nextSlide, 3000); // 3 seconds
}

function resetAutoPlay() {
    clearInterval(slideshowInterval);
    startAutoPlay();
}

function setupDiscountCode(urlParams, profile) {
    const personaName = profile.name || 'Firefighter';
    const personaId = urlParams.profile || 'firefighter';
    const name = urlParams.name || '';
    const quizProfile = getQuizProfile();
    const userName = name || (quizProfile && quizProfile.name) || '';
    
    const discountCode = generateDiscountCode(personaName, userName, personaId);
    const codeInput = document.getElementById('discountCodeInput');
    if (codeInput) {
        codeInput.value = discountCode;
    }
    
    // Store discount code for checkout
    localStorage.setItem('discountCode', discountCode);
    localStorage.setItem('discountCodeExpiry', Date.now() + (600 * 1000)); // 10 minutes
}

function highlightRecommendedProduct(product) {
    // Hide all recommended badges first
    document.querySelectorAll('.recommended-badge-overlay').forEach(badge => {
        badge.style.display = 'none';
    });
    
    // Show the recommended badge for the selected product
    const badgeMap = {
        'Bubbles': 'recommendedBadgeBubbles',
        'Genie': 'recommendedBadgeGenie',
        'Chat': 'recommendedBadgeChat',
        'Bites': 'recommendedBadgeBites'
    };
    
    const badgeId = badgeMap[product];
    if (badgeId) {
        const badgeEl = document.getElementById(badgeId);
        if (badgeEl) {
            badgeEl.style.display = 'block';
        }
    }
}


function personalizeContent(profile, prize) {
    const urlParams = getUrlParams();
    const personaId = urlParams.profile || 'firefighter';
    const fullProfile = fullProfileData[personaId] || fullProfileData.firefighter;

    // Apply persona colors to elements
    const profileDot = document.querySelector('.profile-dot');
    if (profileDot) profileDot.style.background = fullProfile.color;
    
    const profileName = document.querySelector('.profile-name');
    if (profileName) profileName.textContent = fullProfile.name;
    
    // Style the labels with persona color accent
    const labels = document.querySelectorAll('.insight-label');
    labels.forEach(label => {
        if (!label.parentElement.classList.contains('highlight-item')) {
            label.style.color = fullProfile.colorDark || fullProfile.color;
        }
    });

    const offerHeadline = document.getElementById('offerHeadline');
    if (offerHeadline) {
        offerHeadline.innerHTML = fullProfile.headline;
    }
    
    const offerSubheadline = document.getElementById('offerSubheadline');
    if (offerSubheadline) {
        offerSubheadline.textContent = fullProfile.subheadline;
    }

    // Set persona image
    const personaImage = document.getElementById('personaImage');
    if (personaImage) {
        const img = document.createElement('img');
        img.src = `../media/${personaId}-persona.jpg`;
        img.alt = fullProfile.name;
        img.onerror = function() {
            this.style.display = 'none';
            this.parentElement.innerHTML = '<span class="placeholder-text">' + fullProfile.name + '</span>';
        };
        personaImage.innerHTML = '';
        personaImage.appendChild(img);
    }
    
    const problemText = fullProfile.problemCopy || summarizeText(fullProfile.rootCause, 1);
    const profileProblem = document.getElementById('profileProblem');
    if (profileProblem) {
        profileProblem.innerHTML = createHardHittingCopy(problemText, 0);
    }

    const needText = fullProfile.needCopy || fullProfile.insight;
    const profileSolution = document.getElementById('profileSolution');
    if (profileSolution) {
        profileSolution.innerHTML = createHardHittingCopy(needText, 0);
    }

    const helpText = fullProfile.helpCopy || fullProfile.solution;
    const profileHelp = document.getElementById('profileHelp');
    if (profileHelp) {
        profileHelp.innerHTML = createHardHittingCopy(helpText, 1, fullProfile.product);
    }
    
    // Highlight item styling
    const highlightItem = document.getElementById('insightsHighlight');
    if (highlightItem) {
        highlightItem.style.borderLeftColor = fullProfile.color;
    }
    
    // Set "How We Help" label color to persona color
    const howWeHelpLabel = document.getElementById('howWeHelpLabel');
    if (howWeHelpLabel) {
        howWeHelpLabel.style.color = fullProfile.color;
    }

    // Standard offer fields
    const productTitle = document.getElementById('productTitle');
    if (productTitle) {
        productTitle.textContent = `Briefed ${fullProfile.product}`;
    }
    
    const productDescription = document.getElementById('productDescription');
    if (productDescription) {
        productDescription.textContent = fullProfile.productDescription;
    }

    const bookDesc = document.getElementById('bookDescription');
    if (bookDesc) {
        bookDesc.innerHTML = `"${fullProfile.bookTitle}" — ${fullProfile.bookDescription}`;
    }

    const prizeBadge = document.getElementById('prizeBadge');
    if (prizeBadge) {
        prizeBadge.textContent = prize.display;
    }
    
    const valuePrizeAmount = document.querySelector('.value-prize .prize-amount');
    if (valuePrizeAmount) {
        valuePrizeAmount.textContent = prize.display;
    }
    
    const prizeDisplay = document.getElementById('prizeDisplay');
    if (prizeDisplay) {
        prizeDisplay.textContent = prize.display;
    }

    const afterTrialNote = document.getElementById('afterTrialNote');
    if (afterTrialNote) {
        if (prize.trial) {
            afterTrialNote.textContent =
                `After your ${prize.trial}-day trial, continue for just $49/month. Cancel anytime.`;
        } else if (prize.discount) {
            afterTrialNote.textContent =
                `Your first month is ${prize.discount}% off ($${(49 * (1 - prize.discount/100)).toFixed(0)}/month), then $49/month. Cancel anytime.`;
        }
    }

    const finalMessageEl = document.getElementById('finalMessage');
    if (finalMessageEl) {
        const firstP = finalMessageEl.querySelectorAll('p')[0];
        if (firstP) {
            firstP.textContent = fullProfile.finalMessage;
        }
    }

    updateProductIcon(fullProfile.product);
}

// Helper function to create bold, hard-hitting copy
function createHardHittingCopy(text, sentenceLimit = 0, highlightWord = null) {
    if (!text) return '';
    
    // Clean up text
    let cleanText = text.replace(/\n\n/g, ' ').replace(/\n/g, ' ').trim();
    let sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 5);
    
    if (sentenceLimit > 0) {
        sentences = sentences.slice(0, sentenceLimit);
    }
    
    let result = sentences.map(s => s.trim()).join('. ') + '.';
    
    // Bold the core impact statement
    result = result.replace(/^(.*?)(is|are|exists|means|requires|needs|gives|built)/i, '<strong>$1$2</strong>');
    
    if (highlightWord) {
        const escaped = highlightWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
        result = result.replace(regex, match => `<strong>${match}</strong>`);
    }
    
    return result;
}

function summarizeText(text, maxSentences = 1) {
    if (!text) return '';
    const sentences = text
        .replace(/\n+/g, ' ')
        .split(/[.!?]+/)
        .map(s => s.trim())
        .filter(Boolean);
    if (!sentences.length) return '';
    return sentences.slice(0, maxSentences).join('. ') + '.';
}

function updateProductIcon(product) {
    const iconContainer = document.getElementById('productIcon');
    let iconSvg = '';

    switch (product) {
        case 'Bubbles':
            iconSvg = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="6"></circle>
                <circle cx="12" cy="12" r="2"></circle>
            </svg>`;
            break;
        case 'Genie':
            iconSvg = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="1"></circle>
                <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"></path>
            </svg>`;
            break;
        case 'Chat':
            iconSvg = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>`;
            break;
        case 'Bites':
            iconSvg = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
            </svg>`;
            break;
    }

    iconContainer.innerHTML = iconSvg;
}

function startTimer() {
    const timerValueEl = document.getElementById('timerValue');
    if (!timerValueEl) {
        console.warn('Timer element not found');
        return;
    }
    
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        timeRemaining--;

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            // Offer expires - just stop the timer, no modal
            return;
        }

        updateTimerDisplay();

        if (timeRemaining <= 30) {
            if (timerValueEl) timerValueEl.classList.add('urgent');
            const urgencyTimer = document.getElementById('urgencyTimer');
            if (urgencyTimer) urgencyTimer.classList.add('urgent');
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    const timerValue = document.getElementById('timerValue');
    if (timerValue) {
        timerValue.textContent = display;
    }
    
    const urgencyTimer = document.getElementById('urgencyTimer');
    if (urgencyTimer) {
        urgencyTimer.textContent = display;
    }
    
    const urgencyTimer2 = document.getElementById('urgencyTimer2');
    if (urgencyTimer2) {
        urgencyTimer2.textContent = display;
    }
    
    // Update discount code timer
    const discountTimer = document.getElementById('discountTimer');
    if (discountTimer) {
        discountTimer.textContent = display;
    }
}

function handleClaim() {
    const urlParams = getUrlParams();
    const discountCode = localStorage.getItem('discountCode') || document.getElementById('discountCodeInput')?.value || '';

    alert(`Redirecting to Stripe checkout...\n\nDiscount Code: ${discountCode}\n\nIn production, this would open a Stripe payment form for $0.99 with the discount code applied.`);
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        initializePage();

        const ctaButton = document.getElementById('ctaButton');
        if (ctaButton) {
            ctaButton.addEventListener('click', handleClaim);
        }
        
        // Add click handler for second CTA button
        const ctaButton2 = document.getElementById('ctaButton2');
        if (ctaButton2) {
            ctaButton2.addEventListener('click', handleClaim);
        }
    } catch (error) {
        console.error('Error initializing page:', error);
    }
});
