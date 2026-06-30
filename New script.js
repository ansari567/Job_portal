// This script contains all the logic for the Startup Discovery Portal, including
// data generation, filtering, sorting, infinite scrolling, and modal interactions.

// --- DATA GENERATION (200 SIMULATED COMPANIES) ---
const startupNames = [
    'Flow', 'Grid', 'Predict', 'Spark', 'Quantum', 'Harvest', 'Pulse', 'Logic', 
    'Connect', 'Solar', 'Learn', 'Track', 'Trade', 'Vision', 'Eats', 'Sense', 
    'Innovate', 'Swift', 'Tech', 'Aero', 'Data', 'Web', 'Link', 'Zen'
];
const startupSuffixes = [
    'Automation', 'Solutions', 'AI', 'Academy', 'Finance', 'Local', 'Pro', 'Logic', 
    'Connect', 'Tech', 'VR', 'Health', 'Exchange', 'Systems', 'Delivery', 'Labs', 
    'Platform', 'Global', 'Hub', 'Nexus', 'Stream', 'Core', 'Dynamics', 'Works'
];
const categories = ['SaaS', 'CleanTech', 'HealthTech', 'EdTech', 'FinTech', 'FoodTech', 'E-commerce', 'AI/ML'];
const locations = [
    'San Francisco, CA', 'Austin, TX', 'Boston, MA', 'Seattle, WA', 'New York, NY', 
    'Portland, OR', 'Miami, FL', 'Denver, CO', 'San Diego, CA', 'Chicago, IL'
];
const fundingRanges = [
    { amount: 500000, str: '$500K Angel', id: 'Angel' },
    { amount: 1000000, str: '$1M Pre-Seed', id: 'Pre-Seed' },
    { amount: 5000000, str: '$5M Seed', id: 'Seed' },
    { amount: 15000000, str: '$15M Series A', id: 'Series A' },
    { amount: 30000000, str: '$30M Series B', id: 'Series B' },
    { amount: 75000000, str: '$75M Series C', id: 'Series C' },
    { amount: 150000000, str: '$150M Series D', id: 'Series D' }
];
const employeeRanges = ['5-15', '16-25', '26-50', '51-100', '101-250', '251-500', '500+'];
const baseDescriptions = [
    'Revolutionary platform that helps businesses streamline their operations using proprietary machine learning models.',
    'Sustainable solutions for smart systems, making technology accessible and affordable for everyone through decentralized networks.',
    'AI-powered analytics platform that helps professionals make better decisions and improve outcomes by reducing diagnostic time by 50%.',
    'Personalized learning tool that adapts to each user\'s style and pace for maximum educational impact in K-12 STEM subjects.',
    'Next-generation financial management tools leveraging blockchain for transparent and secure small business lending.',
    'A platform connecting local producers with consumers, supporting local ecosystems and sustainability with a direct-to-consumer model.',
    'A predictive analytics tool for online stores to forecast inventory and optimize pricing strategies, increasing conversion rates.',
    'Specialized in developing deep learning algorithms for complex problem-solving, particularly in logistics optimization and autonomous vehicle path planning.'
];

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateStartup(id) {
    const category = getRandomElement(categories);
    const name = getRandomElement(startupNames) + ' ' + getRandomElement(startupSuffixes);
    const location = getRandomElement(locations);
    const funding = getRandomElement(fundingRanges);
    const employees = getRandomElement(employeeRanges);
    const year = 2015 + Math.floor(Math.random() * 10);
    const logo = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

    let description = getRandomElement(baseDescriptions);
    description = description.replace('platform', category + ' platform').replace('systems', category + ' systems');

    return {
        id: id,
        name: name,
        logo: logo,
        category: category,
        location: location,
        employees: employees,
        funding: funding.amount,
        fundingStr: funding.str,
        year: year,
        url: `https://${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        description: description
    };
}

const allStartups = Array.from({ length: 200 }, (_, i) => generateStartup(i + 1));
        
// --- STATE MANAGEMENT ---
let currentFilterCategory = 'All';
let currentSortOrder = 'name';
let currentStartupKeyword = '';
let currentLocationKeyword = '';
let displayedCardCount = 12; 
const CARDS_PER_LOAD = 12;
let isLoading = false;

// --- DOM ELEMENTS ---
const startupsGrid = document.getElementById('startups-grid');
const searchInput = document.getElementById('searchInput');
const locationInput = document.getElementById('locationInput');
const searchButton = document.getElementById('searchButton');
const sortSelect = document.getElementById('sortOrder');
const resultsTitle = document.getElementById('results-title');
const noResultsMessage = document.getElementById('no-results-message');
const statCountElement = document.getElementById('stat-count');

// --- UTILITY FUNCTIONS ---
function getLogoStyle(logo) {
    let hash = 0;
    for (let i = 0; i < logo.length; i++) {
        hash = logo.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorSeed = hash % 360;
    return `background: linear-gradient(135deg, hsl(${colorSeed}, 50%, 40%) 0%, hsl(${colorSeed + 30}, 50%, 20%) 100%); color: white;`;
}

function createStartupCardHTML(startup) {
    const logoStyle = getLogoStyle(startup.logo);
    
    return `
        <div class="startup-card" data-id="${startup.id}">
            <div class="card-header">
                <div class="startup-logo" style="${logoStyle}">${startup.logo}</div>
                <div class="startup-info">
                    <h3 class="startup-name">${startup.name}</h3>
                    <div class="startup-category">${startup.category}</div>
                </div>
            </div>
            <p class="startup-description">${startup.description}</p>
            <div class="startup-meta">
                <div class="meta-item">
                    <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    ${startup.location}
                </div>
                <div class="meta-item">
                    <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    ${startup.employees}
                </div>
            </div>
            <div class="card-actions">
                <button class="btn-outline" data-id="${startup.id}">Learn More</button> 
                <a href="${startup.url}" target="_blank" class="btn-link">
                    <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15,3 21,3 21,9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    Visit
                </a>
            </div>
        </div>
    `;
}

// --- CORE FILTERING AND SORTING LOGIC ---
function getFilteredAndSortedList() {
    let list = allStartups;

    if (currentFilterCategory !== 'All') {
        list = list.filter(s => s.category === currentFilterCategory);
    }

    const keyword = currentStartupKeyword.toLowerCase();
    if (keyword) {
        list = list.filter(s => 
            s.name.toLowerCase().includes(keyword) || 
            s.description.toLowerCase().includes(keyword)
        );
    }

    const locationKeyword = currentLocationKeyword.toLowerCase();
    if (locationKeyword) {
        list = list.filter(s => s.location.toLowerCase().includes(locationKeyword));
    }

    list.sort((a, b) => {
        if (currentSortOrder === 'name') {
            return a.name.localeCompare(b.name);
        } else if (currentSortOrder === 'employees') {
            const employeesA = parseInt(a.employees.split('-')[0].replace('+', ''));
            const employeesB = parseInt(b.employees.split('-')[0].replace('+', ''));
            return employeesA - employeesB;
        } else if (currentSortOrder === 'year') {
            return b.year - a.year;
        } else if (currentSortOrder === 'funding') {
            return b.funding - a.funding;
        }
        return 0;
    });

    return list;
}

// --- UPDATING DISPLAY FUNCTIONS ---
function updateCategoryCounts() {
    const counts = allStartups.reduce((acc, startup) => {
        acc[startup.category] = (acc[startup.category] || 0) + 1;
        return acc;
    }, {});
    
    document.querySelectorAll('.category-badge').forEach(badge => {
        const category = badge.getAttribute('data-category');
        const count = category === 'All' ? allStartups.length : (counts[category] || 0);
        badge.querySelector('.count').textContent = `(${count})`;
    });
    statCountElement.textContent = `${allStartups.length}+ Startups`;
}

function updateCounts(totalCount) {
    resultsTitle.textContent = `Startups Found (${totalCount})`;
    
    if (totalCount > 0) {
        resultsTitle.style.display = 'block';
        noResultsMessage.style.display = 'none';
    } else {
        resultsTitle.style.display = 'none';
        noResultsMessage.style.display = 'block';
    }
}

function renderStartups(reset = false) {
    if (isLoading) return; 
    isLoading = true;

    if (reset) {
        displayedCardCount = CARDS_PER_LOAD;
        startupsGrid.innerHTML = '';
        window.scrollTo({ top: document.getElementById('startups-section').offsetTop - 100, behavior: 'smooth' });
    }

    const sortedList = getFilteredAndSortedList();
    const totalCount = sortedList.length;

    const listToDisplay = sortedList.slice(0, displayedCardCount);
    
    if (reset) {
        startupsGrid.innerHTML = listToDisplay.map(createStartupCardHTML).join('');
    } else {
        const newCardsHTML = listToDisplay.slice(displayedCardCount - CARDS_PER_LOAD).map(createStartupCardHTML).join('');
        startupsGrid.insertAdjacentHTML('beforeend', newCardsHTML);
    }

    updateCounts(totalCount);
    attachModalListeners();
    isLoading = false;
}

function attachModalListeners() {
    document.querySelectorAll('.startup-card .btn-outline').forEach(button => {
        button.removeEventListener('click', handleModalOpen);
        button.addEventListener('click', handleModalOpen);
    });
}

function handleModalOpen(e) {
    e.preventDefault(); 
    const startupId = parseInt(e.target.getAttribute('data-id'));
    openModal(startupId);
}

// --- EVENT HANDLERS ---
function handleSearchAndFilter() {
    currentStartupKeyword = searchInput.value.trim();
    currentLocationKeyword = locationInput.value.trim();
    
    currentFilterCategory = 'All';
    document.querySelectorAll('.category-badge').forEach(b => b.classList.remove('active'));
    document.querySelector('.category-badge[data-category="All"]').classList.add('active');

    updateUrl();
    renderStartups(true); 
}

function updateUrl() {
    const params = new URLSearchParams();
    if (currentFilterCategory !== 'All') params.set('category', currentFilterCategory);
    if (currentStartupKeyword) params.set('search', currentStartupKeyword);
    if (currentLocationKeyword) params.set('location', currentLocationKeyword);
    if (currentSortOrder !== 'name') params.set('sort', currentSortOrder);
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
}

// --- INITIALIZATION FROM URL ---
function initializeFromUrl() {
    const params = new URLSearchParams(window.location.search);
    currentFilterCategory = params.get('category') || 'All';
    currentStartupKeyword = params.get('search') || '';
    currentLocationKeyword = params.get('location') || '';
    currentSortOrder = params.get('sort') || 'name';

    searchInput.value = currentStartupKeyword;
    locationInput.value = currentLocationKeyword;
    sortSelect.value = currentSortOrder;
    
    document.querySelectorAll('.category-badge').forEach(b => {
        b.classList.remove('active');
        if (b.getAttribute('data-category') === currentFilterCategory) {
            b.classList.add('active');
        }
    });

    renderStartups(true);
}

searchButton.addEventListener('click', handleSearchAndFilter);
searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSearchAndFilter(); });
locationInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSearchAndFilter(); });

document.querySelectorAll('#categoryFilter .category-badge').forEach(badge => {
    badge.addEventListener('click', function() {
        searchInput.value = '';
        locationInput.value = '';
        currentStartupKeyword = '';
        currentLocationKeyword = '';
        
        document.querySelectorAll('.category-badge').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentFilterCategory = this.getAttribute('data-category');
        updateUrl();
        renderStartups(true);
    });
});

sortSelect.addEventListener('change', function() {
    currentSortOrder = this.value;
    updateUrl();
    renderStartups(true); 
});

window.addEventListener('popstate', initializeFromUrl);

// Infinite Scroll Event Listener
window.addEventListener('scroll', () => {
    if (isLoading) return;
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 300) { 
        const sortedList = getFilteredAndSortedList();
        if (displayedCardCount < sortedList.length) {
            displayedCardCount += CARDS_PER_LOAD;
            renderStartups(false);
        }
    }
});

// Function for footer links to filter and scroll
window.filterAndScroll = function(category) {
    currentFilterCategory = category;
    
    document.querySelectorAll('.category-badge').forEach(b => {
        b.classList.remove('active');
        if (b.getAttribute('data-category') === category) {
            b.classList.add('active');
        }
    });
    
    searchInput.value = '';
    locationInput.value = '';
    currentStartupKeyword = '';
    currentLocationKeyword = '';

    updateUrl();
    renderStartups(true);
}
        
// --- MODAL LOGIC (INTERACTIVE POP-UP) ---
const modal = document.getElementById('startupModal');
const closeModal = document.querySelector('.close-button');
const modalLogo = document.getElementById('modalLogo');
const modalName = document.getElementById('modalName');
const modalCategory = document.getElementById('modalCategory');
const modalDescription = document.getElementById('modalDescription');
const modalMetaGrid = document.getElementById('modalMetaGrid');
const modalWebsiteLink = document.getElementById('modalWebsiteLink');

function openModal(startupId) {
    const startup = allStartups.find(s => s.id === startupId);
    if (!startup) return;

    modalLogo.style = getLogoStyle(startup.logo);
    modalLogo.textContent = startup.logo;

    modalName.textContent = startup.name;
    modalCategory.textContent = startup.category;
    modalDescription.textContent = startup.description;
    modalWebsiteLink.href = startup.url;

    modalMetaGrid.innerHTML = `
        <div class="modal-meta-item"><strong>Location:</strong> ${startup.location}</div>
        <div class="modal-meta-item"><strong>Employees:</strong> ${startup.employees}</div>
        <div class="modal-meta-item"><strong>Funding:</strong> ${startup.fundingStr}</div>
        <div class="modal-meta-item"><strong>Founded Year:</strong> ${startup.year}</div>
    `;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; 
}

closeModal.onclick = () => { modal.style.display = 'none'; document.body.style.overflow = 'auto'; };
window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    updateCategoryCounts(); 
    initializeFromUrl();
    document.getElementById('currentYear').textContent = new Date().getFullYear();
});