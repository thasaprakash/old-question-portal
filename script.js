// --- 1. DATABASE OF PAPERS ---
const questionPapers = [
    {
        subject: 'Cloud Computing', year: 2024, title: 'Cloud Computing QP 2024',
        viewUrl: 'https://drive.google.com/file/d/1nXoHSITN-dBCAMa0Ng-HZ5WYBocrSKfL/preview',
        downloadUrl: 'https://raw.githubusercontent.com/thasaprakash/old-question-portal/2392d5bd85b673901506340da089de5890782942/cloud computing_2024.pdf', 
    },
    {
        subject: 'Cloud Computing', year: 2024, title: 'Cloud Computing QP 2024 (Set 2)',
        viewUrl: 'https://drive.google.com/file/d/1mwIDAWxcfvOzPj6OzaWwjuz141_NxXaY/preview',
        downloadUrl: 'https://raw.githubusercontent.com/thasaprakash/old-question-portal/2392d5bd85b673901506340da089de5890782942/cloud computing_2024(1).pdf',
    },
    {
        subject: 'Manufacturing Technology', year: 2024, title: 'Manufacturing Technology QP 2024',
        viewUrl: 'https://drive.google.com/file/d/1kph5Tmnor0AeEACvVM75w3PVlBDLKzAm/preview',
        downloadUrl: 'https://raw.githubusercontent.com/thasaprakash/old-question-portal/2392d5bd85b673901506340da089de5890782942/Manufacturing Technology_2024.pdf',
    },
    {
        subject: 'Design of Steel Structural Elements', year: '2024', title: 'CE8601 Design of Steel Structural Elements (Q) - Copy',
        viewUrl: 'https://drive.google.com/file/d/1nILaCUAPy4-bmaNX53ouEzM8jR6dftLe/preview',
        downloadUrl: 'https://raw.githubusercontent.com/thasaprakash/old-question-portal/2392d5bd85b673901506340da089de5890782942/CE8601- Design of Steel Structural Elements(Q) - Copy - Copy.pdf',
    }
];

// --- 2. SEARCH FUNCTIONALITY ---
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('resultsContainer');
const analysisSection = document.getElementById('analysis-section');
// Get the new suggestions container
const suggestionsContainer = document.getElementById('suggestionsContainer');
let currentResults = [];

function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    resultsContainer.innerHTML = '';
    analysisSection.innerHTML = '';
    currentResults = [];
    // Clear suggestions when a full search is performed
    suggestionsContainer.innerHTML = ''; 
    if (!query) { return; }
    
    currentResults = questionPapers.filter(paper => paper.subject.toLowerCase().includes(query));
    if (currentResults.length > 0) {
        if (currentResults.length >= 99999999) {
            const analyseBtn = document.createElement('button');
            analyseBtn.className = 'analysis-btn';
            analyseBtn.innerText = '📊 Analyse Topics';
            analyseBtn.id = 'analyseTopicsBtn';
            analysisSection.appendChild(analyseBtn);
        }
        currentResults.forEach(paper => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.innerHTML = `
                <div>
                    <strong>${paper.title}</strong>
                    <p>Subject: ${paper.subject} | Year: ${paper.year}</p>
                </div>
                <div class="button-group">
                    <button class="view-button" data-url="${paper.viewUrl}" data-title="${paper.title}" data-download="${paper.downloadUrl}">View</button>
                    <a href="${paper.downloadUrl}" class="download-button" download>Download</a>
                </div>
            `;
            resultsContainer.appendChild(resultItem);
        });
    } else {
        resultsContainer.innerHTML = '<p>No papers found.</p>';
    }
}

// New function to show live suggestions
function showSuggestions() {
    const query = searchInput.value.toLowerCase().trim();
    suggestionsContainer.innerHTML = ''; // Clear old suggestions
    if (!query) {
        return; // Exit if the search box is empty
    }

    // Get a unique list of subjects from the database
    const uniqueSubjects = [...new Set(questionPapers.map(paper => paper.subject))];
    const filteredSubjects = uniqueSubjects.filter(subject => subject.toLowerCase().includes(query));

    if (filteredSubjects.length > 0) {
        filteredSubjects.forEach(subject => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';
            suggestionItem.textContent = subject;
            suggestionItem.addEventListener('click', () => {
                searchInput.value = subject;
                suggestionsContainer.innerHTML = ''; // Hide suggestions after selection
                performSearch(); // Immediately perform the search for the selected subject
            });
            suggestionsContainer.appendChild(suggestionItem);
        });
    }
}

// Event listeners for the search functionality
searchButton.addEventListener('click', performSearch);
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        performSearch();
    }
});

// Add the new event listener for live suggestions
searchInput.addEventListener('input', showSuggestions);

// Optional: Hide suggestions when clicking anywhere else on the page
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-section')) {
        suggestionsContainer.innerHTML = '';
    }
});


// --- 3. MODAL FUNCTIONALITY ---
const allModals = document.querySelectorAll('.modal');
const pdfViewerModal = document.getElementById('pdfViewerModal');
const pdfIframe = document.getElementById('pdf-iframe');
const pdfTitle = document.getElementById('pdf-title');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');
const closeViewerBtn = document.getElementById('closeViewerBtn');

function openModal(modal) { modal.style.display = "block"; }
function closeAllModals() { allModals.forEach(m => m.style.display = "none"); }

document.getElementById("contactBtn").onclick = () => openModal(document.getElementById("contactModal"));
document.getElementById("foundersBtn").onclick = () => openModal(document.getElementById("foundersModal"));
document.getElementById("helpBtn").onclick = () => openModal(document.getElementById("helpModal"));
document.getElementById("aboutCollegeBtn").onclick = () => openModal(document.getElementById("aboutCollegeModal"));
document.querySelectorAll('.modal .close-btn').forEach(btn => { btn.onclick = closeAllModals; });

document.addEventListener('click', e => {
    if (e.target && e.target.id === 'analyseTopicsBtn') {
        const allTopics = currentResults.flatMap(paper => paper.topics || []);
        const topicCounts = allTopics.reduce((acc, topic) => { acc[topic] = (acc[topic] || 0) + 1; return acc; }, {});
        const sortedTopics = Object.entries(topicCounts).sort(([,a],[,b]) => b-a);
        let reportHTML = '<ul>' + sortedTopics.map(([topic, count]) => `<li>${topic} <span>Appeared in ${count} paper(s)</span></li>`).join('') + '</ul>';
        document.getElementById("analysisReportContainer").innerHTML = reportHTML;
        openModal(document.getElementById("analysisModal"));
    }
});
document.addEventListener('click', e => {
    if (e.target && e.target.classList.contains('view-button')) {
        // Get the direct Google Drive URL from the data-url attribute
        const url = e.target.getAttribute('data-url');
        
        // Open the URL in a new tab, allowing users to use Google Drive's native features
        window.open(url, '_blank');
    }
});
closeViewerBtn.onclick = () => {
    pdfViewerModal.style.display = 'none';
    pdfIframe.src = '';
};
