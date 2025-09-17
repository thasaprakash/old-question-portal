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
                <button class="view-button" data-url="${paper.url}">View</button>
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

// --- 4. PDF VIEWER FUNCTIONALITY ---
const pdfViewerModal = document.getElementById("pdfViewerModal");
const pdfCanvas = document.getElementById("pdf_canvas");
const pageNumSpan = document.getElementById("page_num");
const pageCountSpan = document.getElementById("page_count");
const prevPageBtn = document.getElementById("prevPageBtn");
const nextPageBtn = document.getElementById("nextPageBtn");
const downloadPdfBtn = document.getElementById("downloadPdfBtn");
const closeViewerBtn = document.getElementById("closeViewerBtn");
let pdfDoc = null, pageNum = 1, pageRendering = false, pageNumPending = null;

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

function renderPage(num) {
    pageRendering = true;
    pdfDoc.getPage(num).then(page => {
        const viewport = page.getViewport({ scale: 1.5 });
        pdfCanvas.height = viewport.height;
        pdfCanvas.width = viewport.width;
        const renderContext = { canvasContext: pdfCanvas.getContext('2d'), viewport: viewport };
        page.render(renderContext).promise.then(() => {
            pageRendering = false;
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }
        });
    });
    pageNumSpan.textContent = num;
}

function queueRenderPage(num) { if (pageRendering) { pageNumPending = num; } else { renderPage(num); } }
prevPageBtn.onclick = () => { if (pageNum <= 1) return; pageNum--; queueRenderPage(pageNum); };
nextPageBtn.onclick = () => { if (pageNum >= pdfDoc.numPages) return; pageNum++; queueRenderPage(pageNum); };
closeViewerBtn.onclick = () => { pdfViewerModal.style.display = 'none'; pdfDoc = null; };

function showPdf(url) {
    pdfjsLib.getDocument(url).promise.then(pdf => {
        pdfDoc = pdf;
        pageCountSpan.textContent = pdfDoc.numPages;
        pageNum = 1;
        renderPage(pageNum);
        downloadPdfBtn.href = url;
        pdfViewerModal.style.display = 'block';
    }).catch(err => {
        alert('Could not load the PDF. Please try downloading instead.');
    });
}

document.addEventListener('click', e => {
    if (e.target && e.target.classList.contains('view-button')) {
        showPdf(e.target.getAttribute('data-url'));
    }
});

// --- 5. TEXT SELECTION POP-UP FUNCTIONALITY ---
const textSelectionPopup = document.getElementById('text-selection-popup');
document.addEventListener('mouseup', e => {
    if (document.getElementById('pdf-render-area').contains(e.target)) {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText.length > 0) {
            textSelectionPopup.style.left = `${e.pageX + 5}px`;
            textSelectionPopup.style.top = `${e.pageY + 5}px`;
            textSelectionPopup.style.display = 'block';
        } else {
            textSelectionPopup.style.display = 'none';
        }
    }
});
document.addEventListener('mousedown', e => { if (!textSelectionPopup.contains(e.target)) { textSelectionPopup.style.display = 'none'; } });

document.getElementById('copyTextBtn').onclick = () => {
    navigator.clipboard.writeText(window.getSelection().toString());
    textSelectionPopup.style.display = 'none';
};
document.getElementById('searchTextBtn').onclick = () => {
    const searchUrl = `https://gemini.google.com/app/search?q=${encodeURIComponent(window.getSelection().toString())}`;
    window.open(searchUrl, '_blank');
    textSelectionPopup.style.display = 'none';
};

window.onclick = function(event) {
    if (simpleModals.includes(event.target)) {
        closeAllSimpleModals();
    }
};
        
