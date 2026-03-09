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