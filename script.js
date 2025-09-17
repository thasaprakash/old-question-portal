// --- 1. DATABASE OF PAPERS ---
const questionPapers = [
    {
        subject: 'Cloud Computing', year: 2024, title: 'Cloud Computing QP 2024',
        url: 'https://github.com/thasaprakash/old-question-portal/blob/main/cloud%20computing_2024.pdf'
    },
    {
        subject: 'Cloud Computing', year: 2024, title: 'Cloud Computing QP 2024 (Set 2)',
        url: 'https://github.com/thasaprakash/old-question-portal/blob/main/cloud%20computing_2024(1).pdf'
    },
    {
        subject: 'Cloud Computing', year: 2023, title: 'Cloud Computing QP 2023',
        url: 'https://github.com/thasaprakash/old-question-portal/blob/main/cloud%20computing_2023.pdf'
    },
    {
        subject: 'Cloud Computing', year: 2023, title: 'Cloud Computing QP 2023 (Set 2)',
        url: 'https://github.com/thasaprakash/old-question-portal/raw/main/cloud%20computing_2023(2).pdf'
    },
    {
        subject: 'Cloud Computing', year: 2023, title: 'Cloud Computing QP 2023 (Set 3)',
        url: 'https://github.com/thasaprakash/old-question-portal/raw/main/cloud%20computing_2023(1).pdf'
    }
];

// --- 2. SEARCH FUNCTIONALITY (Final Version) ---
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('resultsContainer');

searchButton.addEventListener('click', () => {
    const query = searchInput.value.toLowerCase().trim();
    resultsContainer.innerHTML = '';
    if (!query) {
        resultsContainer.innerHTML = '<p>Please enter a subject to search.</p>';
        return;
    }
    const results = questionPapers.filter(paper => paper.subject.toLowerCase().includes(query));
    if (results.length > 0) {
        results.forEach(paper => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';

            // IMPORTANT CHANGE HERE: We create a special link for viewing
            // It MUST be the link with "/blob/" not "/raw/"
            const viewUrl = `https://htmlpreview.github.io/?${paper.url.replace('/raw/', '/blob/')}`;
            
            // The download URL is still the direct "/raw/" link
            const downloadUrl = paper.url.replace('/blob/', '/raw/');

            resultItem.innerHTML = `
                <div>
                    <strong>${paper.title}</strong>
                    <p>Subject: ${paper.subject} | Year: ${paper.year}</p>
                </div>
                <div class="button-group">
                    <a href="${viewUrl}" class="view-button" target="_blank">View</a>
                    <a href="${downloadUrl}" class="download-button" download>Download</a>
                </div>
            `;
            resultsContainer.appendChild(resultItem);
        });
    } else {
        resultsContainer.innerHTML = '<p>Sorry, no question papers found for that subject.</p>';
    }
});

// --- 3. SIMPLE MODAL FUNCTIONALITY ---
const contactModal = document.getElementById("contactModal");
const foundersModal = document.getElementById("foundersModal");
const helpModal = document.getElementById("helpModal");
const aboutCollegeModal = document.getElementById("aboutCollegeModal");
const simpleModals = [contactModal, foundersModal, helpModal, aboutCollegeModal];

function openModal(modal) {
    modal.style.display = "block";
}
function closeAllSimpleModals() {
    simpleModals.forEach(m => {
        m.style.display = "none";
    });
}

document.getElementById("contactBtn").onclick = () => openModal(contactModal);
document.getElementById("foundersBtn").onclick = () => openModal(foundersModal);
document.getElementById("helpBtn").onclick = () => openModal(helpModal);
document.getElementById("aboutCollegeBtn").onclick = () => openModal(aboutCollegeModal);

document.querySelectorAll('.modal .close-btn').forEach(btn => {
    btn.onclick = closeAllSimpleModals;
});

window.onclick = function(event) {
    if (simpleModals.includes(event.target)) {
        closeAllSimpleModals();
    }
};
