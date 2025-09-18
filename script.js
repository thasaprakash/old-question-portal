// --- 1. DATABASE OF PAPERS ---
const questionPapers = [
    {
        subject: 'Cloud Computing', year: 2024, title: 'Cloud Computing QP 2024',
        viewUrl: 'https://drive.google.com/file/d/1nXoHSITN-dBCAMa0Ng-HZ5WYBocrSKfL/preview',
        downloadUrl: 'https://github.com/thasaprakash/old-question-portal/raw/main/cloud%20computing_2024.pdf',
        topics: ['Serverless', 'AWS', 'Azure', 'Data Centers', 'Virtualization']
    },
    {
        subject: 'Cloud Computing', year: 2024, title: 'Cloud Computing QP 2024 (Set 2)',
        viewUrl: 'https://drive.google.com/file/d/1mwIDAWxcfvOzPj6OzaWwjuz141_NxXaY/preview',
        downloadUrl: 'https://github.com/thasaprakash/old-question-portal/raw/main/cloud%20computing_2024(1).pdf',
        topics: ['Virtualization', 'SaaS', 'IaaS', 'PaaS', 'Load Balancing']
    }
];

// --- 2. SEARCH FUNCTIONALITY ---
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('resultsContainer');
const analysisSection = document.getElementById('analysis-section');
let currentResults = [];

function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    resultsContainer.innerHTML = '';
    analysisSection.innerHTML = '';
    currentResults = [];
    if (!query) { return; }

    currentResults = questionPapers.filter(paper => paper.subject.toLowerCase().includes(query));  
    if (currentResults.length > 0) {  
        if (currentResults.length >= 2) {  
            const analyseBtn = document.createElement('button');  
            analyseBtn.className = 'analysis-btn view-button'; 
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

searchButton.addEventListener('click', performSearch);
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        performSearch();
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

        // --- FIX #2: TOPIC ANALYSIS REPORT ---
        // Changed single quotes to backticks (`) to correctly display the variables.
        let reportHTML = '<ul>' + sortedTopics.map(([topic, count]) => `<li>${topic} <span>Appeared in ${count} paper(s)</span></li>`).join('') + '</ul>';
        
        document.getElementById("analysisReportContainer").innerHTML = reportHTML;
        openModal(document.getElementById("analysisModal"));
    }
});

document.addEventListener('click', e => {
    if (e.target && e.target.classList.contains('view-button')) {
        const url = e.target.getAttribute('data-url');
        const title = e.target.getAttribute('data-title');
        const downloadUrl = e.target.getAttribute('data-download');

        pdfIframe.src = url;  
        pdfTitle.textContent = title;  
        downloadPdfBtn.href = downloadUrl;  
        
        pdfViewerModal.style.display = 'block';  
    }
});

closeViewerBtn.onclick = () => {
    pdfViewerModal.style.display = 'none';
    pdfIframe.src = '';
};
