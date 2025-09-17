// --- 1. DATABASE OF PAPERS ---
const questionPapers = [
    {
        subject: 'Cloud Computing', year: 2024, title: 'Cloud Computing QP 2024',
        url: 'https://github.com/thasaprakash/old-question-portal/raw/main/cloud%20computing_2024.pdf',
        topics: ['Serverless', 'AWS', 'Azure', 'Data Centers', 'Virtualization']
    },
    {
        subject: 'Cloud Computing', year: 2024, title: 'Cloud Computing QP 2024 (Set 2)',
        url: 'https://github.com/thasaprakash/old-question-portal/raw/main/cloud%20computing_2024(1).pdf',
        topics: ['Virtualization', 'SaaS', 'IaaS', 'PaaS', 'Load Balancing']
    },
    {
        subject: 'Cloud Computing', year: 2023, title: 'Cloud Computing QP 2023',
        url: 'https://github.com/thasaprakash/old-question-portal/raw/main/cloud%20computing_2023.pdf',
        topics: ['AWS', 'Data Centers', 'IaaS', 'Security']
    },
    {
        subject: 'Cloud Computing', year: 2023, title: 'Cloud Computing QP 2023 (Set 2)',
        url: 'https://github.com/thasaprakash/old-question-portal/raw/main/cloud%20computing_2023(2).pdf',
        topics: ['Virtualization', 'PaaS', 'Load Balancing', 'Azure']
    },
    {
        subject: 'Cloud Computing', year: 2023, title: 'Cloud Computing QP 2023 (Set 3)',
        url: 'https://github.com/thasaprakash/old-question-portal/raw/main/cloud%20computing_2023(1).pdf',
        topics: ['SaaS', 'Serverless', 'Security', 'AWS']
    }
];

// --- 2. SEARCH FUNCTIONALITY ---
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('resultsContainer');
const analysisSection = document.getElementById('analysis-section');
let currentResults = [];

searchButton.addEventListener('click', () => {
    const query = searchInput.value.toLowerCase().trim();
    resultsContainer.innerHTML = '';
    analysisSection.innerHTML = '';
    currentResults = [];
    if (!query) {
        resultsContainer.innerHTML = '<p>Please enter a subject to search.</p>';
        return;
    }
    currentResults = questionPapers.filter(paper => paper.subject.toLowerCase().includes(query));
    if (currentResults.length > 0) {
        if (currentResults.length >= 2) {
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
                <button class="view-button" data-url="${paper.url}" data-title="${paper.title}">View</button>
            `;
            resultsContainer.appendChild(resultItem);
        });
    } else {
        resultsContainer.innerHTML = '<p>Sorry, no question papers found for that subject.</p>';
    }
});

// --- 3. SIMPLE MODAL & ANALYSIS FUNCTIONALITY ---
const contactModal = document.getElementById("contactModal");
const foundersModal = document.getElementById("foundersModal");
const helpModal = document.getElementById("helpModal");
const aboutCollegeModal = document.getElementById("aboutCollegeModal");
const analysisModal = document.getElementById("analysisModal");
const simpleModals = [contactModal, foundersModal, helpModal, aboutCollegeModal, analysisModal];

function openModal(modal) { modal.style.display = "block"; }
function closeAllSimpleModals() { simpleModals.forEach(m => { m.style.display = "none"; }); }

document.getElementById("contactBtn").onclick = () => { openModal(contactModal); };
document.getElementById("foundersBtn").onclick = () => { openModal(foundersModal); };
document.getElementById("helpBtn").onclick = () => { openModal(helpModal); };
document.getElementById("aboutCollegeBtn").onclick = () => { openModal(aboutCollegeModal); };
document.querySelectorAll('.modal .close-btn').forEach(btn => { btn.onclick = closeAllSimpleModals; });

document.addEventListener('click', e => {
    if (e.target && e.target.id === 'analyseTopicsBtn') {
        const allTopics = currentResults.flatMap(paper => paper.topics || []);
        const topicCounts = allTopics.reduce((acc, topic) => {
            acc[topic] = (acc[topic] || 0) + 1;
            return acc;
        }, {});
        const sortedTopics = Object.entries(topicCounts).sort(([,a],[,b]) => b-a);
        let reportHTML = '<ul>' + sortedTopics.map(([topic, count]) => `<li>${topic} <span>Appeared in ${count} paper(s)</span></li>`).join('') + '</ul>';
        document.getElementById("analysisReportContainer").innerHTML = reportHTML;
        openModal(analysisModal);
    }
});

window.onclick = function(event) {
    if (simpleModals.includes(event.target)) {
        closeAllSimpleModals();
    }
};


// --- 4. SIMPLIFIED PDF VIEWER LOGIC ---
const pdfViewerModal = document.getElementById('pdfViewerModal');
const pdfIframe = document.getElementById('pdf-iframe');
const pdfTitle = document.getElementById('pdf-title');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');
const closeViewerBtn = document.getElementById('closeViewerBtn');

// Use event delegation to handle clicks on the dynamically created "View" buttons
document.addEventListener('click', e => {
    if (e.target && e.target.classList.contains('view-button')) {
        const url = e.target.getAttribute('data-url');
        const title = e.target.getAttribute('data-title');
        
        // Set the content for the viewer
        pdfIframe.src = url;
        pdfTitle.textContent = title;
        downloadPdfBtn.href = url;
        
        // Show the viewer
        pdfViewerModal.style.display = 'block';
    }
});

// Close the PDF viewer
closeViewerBtn.onclick = () => {
    pdfViewerModal.style.display = 'none';
    pdfIframe.src = ''; // Clear the iframe src to stop loading in the background
};
