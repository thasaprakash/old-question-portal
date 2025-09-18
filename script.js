// --- 1. DATABASE OF PAPERS ---
const questionPapers = [
    {
        subject: 'Cloud Computing', year: 2024, title: 'Cloud Computing QP 2024',
        // IMPORTANT: Use the Google Drive /preview link for viewing
        viewUrl: 'https://drive.google.com/file/d/1nXoHSITN-dBCAMa0Ng-HZ5WYBocrSKfL/preview',
        // IMPORTANT: Use the GitHub /raw/ link for downloading
        downloadUrl: 'https://github.com/thasaprakash/old-question-portal/raw/main/cloud%20computing_2024.pdf'
    },
    {
        subject: 'Cloud Computing', year: 2024, title: 'Cloud Computing QP 2024 (Set 2)',
        viewUrl: 'https://drive.google.com/file/d/1mwIDAWxcfvOzPj6OzaWwjuz141_NxXaY/preview',
        downloadUrl: 'https://github.com/thasaprakash/old-question-portal/raw/main/cloud%20computing_2024(1).pdf'
    }
    // ... ADD ALL YOUR OTHER PAPERS HERE
];

// --- 2. SEARCH FUNCTIONALITY ---
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('resultsContainer');

searchButton.addEventListener('click', () => {
    const query = searchInput.value.toLowerCase().trim();
    resultsContainer.innerHTML = '';
    if (!query) { return; }
    
    const results = questionPapers.filter(paper => paper.subject.toLowerCase().includes(query));
    if (results.length > 0) {
        results.forEach(paper => {
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
