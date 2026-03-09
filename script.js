const API_URL = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
const SEARCH_URL = "https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=";

let allIssuesData = [];

const authScreen = document.getElementById('auth-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const authForm = document.getElementById('auth-form-submit');
const ticketGrid = document.getElementById('ticket-display-grid');
const spinner = document.getElementById('loading-spinner');
const ticketCounter = document.getElementById('ticket-total-count');
const filterTriggers = document.querySelectorAll('.filter-trigger');
const queryInput = document.getElementById('query-input');
const popupModal = document.getElementById('ticket-detail-modal');
const popupBody = document.getElementById('popup-content-area');


authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (document.getElementById('field-user').value === 'admin' && document.getElementById('field-pass').value === 'admin123') {
        authScreen.classList.add('hidden-item');
        dashboardScreen.classList.remove('hidden-item');
        fetchIssuesData();
    } else { alert("Invalid Credentials!"); }
});

async function fetchIssuesData() {
    toggleSpinner(true);
    try {
        const res = await fetch(API_URL);
        const json = await res.json();
        allIssuesData = json.data;
        renderTickets(allIssuesData);
    } catch (err) { console.error(err); } finally { toggleSpinner(false); }
}


function renderTickets(tickets) {
    ticketGrid.innerHTML = "";
    ticketCounter.innerText = `${tickets.length} Issues`;

    tickets.forEach(item => {
        const statusBorder = item.status === 'open' ? 'line-status-open' : 'line-status-closed';
        const priorityClass = `prio-${item.priority.toLowerCase()}`;
        const statusIconPath = item.status === 'open' ? './assets/Open-Status.png' : './assets/Closed- Status .png';

        const tagsHTML = item.labels.map((label, index) => {
            let icon = label.toLowerCase().includes('bug') ? '<i class="fas fa-bug"></i>' : '<i class="fas fa-life-ring"></i>';
            const extraStyle = index === 1 ? 'tag-style-alt' : '';
            return `<span class="tag-item ${extraStyle}">${icon} ${label.toUpperCase()}</span>`;
        }).join('');

        const cardElement = document.createElement('div');
        cardElement.className = `ticket-card-item ${statusBorder}`;
        cardElement.innerHTML = `
            <div class="card-content-wrap" onclick="openDetailModal(${item.id})">
                <div class="card-top-header">
                    <img src="${statusIconPath}" class="status-mini-icon">
                    <span class="priority-label ${priorityClass}">${item.priority}</span>
                </div>
                <h4>${item.title}</h4>
                <p>${item.description.substring(0, 80)}...</p>
                <div class="tags-list">${tagsHTML}</div>
            </div>
            <div class="card-base-footer">#${item.id} by ${item.author} <br> ${new Date(item.createdAt).toLocaleDateString()}</div>
        `;
        ticketGrid.appendChild(cardElement);
    });
}async function openDetailModal(id) {
    toggleSpinner(true);
    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
        const json = await res.json();
        const issue = json.data;
        
        const dateStr = new Date(issue.createdAt).toLocaleDateString('en-GB');

        const tagsHTML = issue.labels.map((label, index) => {
            let icon = label.toLowerCase().includes('bug') ? 'fa-bug' : 'fa-hand-holding-heart';
            const styleClass = index === 1 ? 'tag-style-alt' : '';
            return `<span class="tag-item ${styleClass}"><i class="fas ${icon}"></i> ${label.toUpperCase()}</span>`;
        }).join('');

        popupBody.innerHTML = `
            <h2 class="popup-heading">${issue.title}</h2>
            
            <div class="popup-sub-info">
                <span class="status-capsule">${issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}</span>
                <span> • Opened by ${issue.author} • ${dateStr}</span>
            </div>

            <div class="popup-tags-row">
                ${tagsHTML}
            </div>

            <p class="popup-body-desc">${issue.description}</p>

            <div class="popup-details-grid">
                <div class="detail-item">
                    <label>Assignee:</label>
                    <span>${issue.author}</span>
                </div>
                <div class="detail-item">
                    <label>Priority:</label>
                    <span class="prio-capsule-high">${issue.priority.toUpperCase()}</span>
                </div>
            </div>

            <div class="popup-footer-actions">
                <button class="btn-dismiss-large" onclick="closePopup()">Close</button>
            </div>
        `;
        popupModal.classList.remove('hidden-item');
    } finally { toggleSpinner(false); }
}

function closePopup() { popupModal.classList.add('hidden-item'); }
function toggleSpinner(isVisible) { isVisible ? spinner.classList.remove('hidden-item') : spinner.classList.add('hidden-item'); }


queryInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const text = queryInput.value.trim();
        if (!text) return fetchIssuesData();
        toggleSpinner(true);
        try {
            const res = await fetch(`${SEARCH_URL}${text}`);
            const json = await res.json();
            renderTickets(json.data);
        } finally { toggleSpinner(false); }
    }
});


filterTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
        filterTriggers.forEach(b => b.classList.remove('active-tab'));
        btn.classList.add('active-tab');
        const type = btn.dataset.filter;
        renderTickets(type === 'all' ? allIssuesData : allIssuesData.filter(i => i.status === type));
    });
});