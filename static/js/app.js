/**
 * NexusFile AI — Frontend Application
 */

const API = '';
let currentPage = 'dashboard';
let currentGenType = 'ppt';
let allFiles = [];
let allGenerated = [];
let statsData = {};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function timeAgo(isoString) {
    if (!isoString) return '';
    const now = new Date();
    const date = new Date(isoString);
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
    return date.toLocaleDateString();
}

function getFileIcon(type) {
    const map = {
        pdf: '📕', doc: '📘', docx: '📘', txt: '📄', md: '📝', rst: '📝',
        xls: '📗', xlsx: '📗', csv: '📗',
        ppt: '📙', pptx: '📙',
        png: '🖼️', jpg: '🖼️', jpeg: '🖼️', gif: '🖼️', svg: '🖼️', webp: '🖼️', bmp: '🖼️',
        py: '🐍', js: '💛', ts: '💙', html: '🌐', css: '🎨', java: '☕',
        cpp: '⚙️', c: '⚙️', go: '🔵', rs: '🦀', rb: '💎', php: '🐘', sql: '🗃️',
        json: '📋', xml: '📋', yaml: '📋', yml: '📋',
        mp3: '🎵', wav: '🎵', mp4: '🎬', avi: '🎬', mov: '🎬',
        zip: '📦', rar: '📦', '7z': '📦', tar: '📦',
    };
    return map[type?.toLowerCase()] || '📄';
}

function getFileIconClass(category) {
    const map = {
        Documents: 'doc', Images: 'img', Code: 'code', Data: 'data',
        Spreadsheets: 'sheet', Presentations: 'pres',
        Audio: 'media', Video: 'media', Archives: 'other',
    };
    return map[category] || 'other';
}

function getGenDocIcon(docType) {
    const map = { pptx: '📊', pdf: '📄', xlsx: '📈', docx: '📝' };
    return map[docType] || '📄';
}

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span>${message}`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ============================================================
// LOADING OVERLAY
// ============================================================

function showLoading(text = 'Processing...') {
    document.getElementById('loading-text').textContent = text;
    document.getElementById('loading-overlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loading-overlay').classList.remove('active');
}

// ============================================================
// MODAL
// ============================================================

function showModal(title, bodyHTML, footerHTML = '') {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = bodyHTML;
    document.getElementById('modal-footer').innerHTML = footerHTML;
    document.getElementById('modal-overlay').classList.add('active');
}

function hideModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}

document.getElementById('modal-close').addEventListener('click', hideModal);
document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) hideModal();
});

// ============================================================
// NAVIGATION
// ============================================================

function navigateTo(page) {
    currentPage = page;

    // Update active nav
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const navItem = document.querySelector(`.nav-item[data-page="${page}"]`);
    if (navItem) navItem.classList.add('active');

    // Update page title
    const titles = {
        dashboard: 'Dashboard', files: 'My Files', upload: 'Upload Files',
        generate: 'Generate Documents', templates: 'Templates',
        generated: 'Generated Documents', settings: 'Settings',
    };
    document.getElementById('page-title').textContent = titles[page] || 'NexusFile AI';

    // Show/hide pages
    document.querySelectorAll('.page-section').forEach(el => el.classList.remove('active'));
    const section = document.getElementById(`page-${page}`);
    if (section) section.classList.add('active');

    // Refresh data
    if (page === 'dashboard') loadDashboard();
    if (page === 'files') loadFiles();
    if (page === 'generated') loadGenerated();
    if (page === 'templates') loadTemplates();
}

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const page = item.dataset.page;
        if (page) navigateTo(page);
    });
});

// ============================================================
// API HELPERS
// ============================================================

async function apiGet(endpoint) {
    const res = await fetch(`${API}${endpoint}`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
}

async function apiPost(endpoint, data) {
    const res = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `API error: ${res.status}`);
    }
    return res.json();
}

async function apiDelete(endpoint) {
    const res = await fetch(`${API}${endpoint}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
}

// ============================================================
// DASHBOARD
// ============================================================

async function loadDashboard() {
    try {
        const [stats, activity] = await Promise.all([
            apiGet('/api/stats'),
            apiGet('/api/activity'),
        ]);

        statsData = stats;

        document.getElementById('stat-total-files').textContent = stats.total_files || 0;
        document.getElementById('stat-total-size').textContent = formatBytes(stats.total_size || 0);
        document.getElementById('stat-generated').textContent = stats.total_generated || 0;
        document.getElementById('stat-categories').textContent = Object.keys(stats.categories || {}).length;
        document.getElementById('files-count').textContent = stats.total_files || 0;

        // Category chart
        renderCategoryChart(stats.categories || {});

        // Activity
        renderActivity(activity.activity || []);
    } catch (e) {
        console.error('Dashboard load error:', e);
    }
}

function renderCategoryChart(categories) {
    const container = document.getElementById('category-chart');
    const entries = Object.entries(categories).sort((a, b) => b[1] - a[1]);
    const max = Math.max(...entries.map(e => e[1]), 1);

    if (entries.length === 0) {
        container.innerHTML = '<div class="empty-state"><p style="color:var(--text-muted)">No data yet</p></div>';
        return;
    }

    container.innerHTML = entries.map(([cat, count], i) => `
        <div class="category-bar">
            <span class="category-label">${cat}</span>
            <div class="category-track">
                <div class="category-fill c${i % 9}" style="width: ${(count / max * 100)}%"></div>
            </div>
            <span class="category-count">${count}</span>
        </div>
    `).join('');
}

function renderActivity(activities) {
    const list = document.getElementById('activity-list');
    if (activities.length === 0) {
        list.innerHTML = '<li style="padding:20px;text-align:center;color:var(--text-muted)">No activity yet</li>';
        return;
    }
    list.innerHTML = activities.slice(0, 15).map(a => `
        <li class="activity-item">
            <span class="activity-icon">${a.icon || '📁'}</span>
            <div class="activity-text">
                <div class="action">${a.action}</div>
                <div class="details">${a.details}</div>
                <div class="time">${timeAgo(a.timestamp)}</div>
            </div>
        </li>
    `).join('');
}

// ============================================================
// FILES
// ============================================================

async function loadFiles(category = 'All') {
    try {
        const cat = category === 'All' ? '' : `?category=${encodeURIComponent(category)}`;
        const data = await apiGet(`/api/files${cat}`);
        allFiles = data.files || [];
        renderFiles(allFiles);
        loadFilterChips();
    } catch (e) {
        console.error('Files load error:', e);
    }
}

function loadFilterChips() {
    const toolbar = document.getElementById('files-toolbar');
    const categories = [...new Set(allFiles.map(f => f.category))];
    toolbar.innerHTML = `
        <button class="filter-chip active" data-cat="All">All (${allFiles.length})</button>
        ${categories.map(c => {
            const count = allFiles.filter(f => f.category === c).length;
            return `<button class="filter-chip" data-cat="${c}">${c} (${count})</button>`;
        }).join('')}
    `;

    toolbar.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            toolbar.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            const cat = chip.dataset.cat;
            if (cat === 'All') {
                renderFiles(allFiles);
            } else {
                renderFiles(allFiles.filter(f => f.category === cat));
            }
        });
    });
}

function renderFiles(files) {
    const grid = document.getElementById('files-grid');
    const empty = document.getElementById('files-empty');

    if (files.length === 0) {
        grid.innerHTML = '';
        empty.style.display = 'block';
        return;
    }

    empty.style.display = 'none';
    grid.innerHTML = files.map(f => `
        <div class="glass-card file-card" data-id="${f.id}">
            <div class="file-actions">
                <button class="file-action-btn" onclick="event.stopPropagation(); downloadFile(${f.id})" title="Download">⬇️</button>
                <button class="file-action-btn" onclick="event.stopPropagation(); reanalyzeFile(${f.id})" title="Re-analyze">🔄</button>
                <button class="file-action-btn delete" onclick="event.stopPropagation(); deleteFile(${f.id})" title="Delete">🗑️</button>
            </div>
            <div class="file-card-header">
                <div class="file-type-icon ${getFileIconClass(f.category)}">${getFileIcon(f.file_type)}</div>
                <div class="file-info">
                    <div class="file-name" title="${f.original_name}">${f.original_name}</div>
                    <div class="file-meta">
                        <span>${f.file_type?.toUpperCase()}</span>
                        <span>•</span>
                        <span>${formatBytes(f.file_size)}</span>
                    </div>
                </div>
            </div>
            ${f.summary ? `<div class="file-summary">${f.summary}</div>` : ''}
            <div class="file-tags">
                ${(f.tags || []).slice(0, 4).map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
        </div>
    `).join('');

    // Click to view details
    grid.querySelectorAll('.file-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = parseInt(card.dataset.id);
            const file = allFiles.find(f => f.id === id);
            if (file) showFileDetails(file);
        });
    });
}

function showFileDetails(file) {
    const body = `
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px;">
            <div class="file-type-icon ${getFileIconClass(file.category)}" style="width:56px;height:56px;font-size:28px;">
                ${getFileIcon(file.file_type)}
            </div>
            <div>
                <div style="font-size:16px;font-weight:700;">${file.original_name}</div>
                <div style="font-size:13px;color:var(--text-muted);">${file.file_type?.toUpperCase()} • ${formatBytes(file.file_size)} • ${file.category}</div>
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">AI Summary</label>
            <p style="font-size:14px;color:var(--text-secondary);line-height:1.7;">${file.summary || 'No summary available. Click Re-analyze to generate one.'}</p>
        </div>
        <div class="form-group">
            <label class="form-label">AI Tags</label>
            <div class="file-tags">${(file.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}</div>
        </div>
        <div class="form-group">
            <label class="form-label">Uploaded</label>
            <p style="font-size:13px;color:var(--text-muted);">${new Date(file.upload_date).toLocaleString()}</p>
        </div>
    `;

    const footer = `
        <button class="btn btn-secondary" onclick="downloadFile(${file.id}); hideModal();">⬇️ Download</button>
        <button class="btn btn-primary" onclick="reanalyzeFile(${file.id}); hideModal();">🔄 Re-analyze</button>
    `;

    showModal('File Details', body, footer);
}

async function deleteFile(id) {
    if (!confirm('Delete this file?')) return;
    try {
        await apiDelete(`/api/files/${id}`);
        showToast('File deleted', 'success');
        loadFiles();
        loadDashboard();
    } catch (e) {
        showToast('Delete failed: ' + e.message, 'error');
    }
}

async function reanalyzeFile(id) {
    showLoading('AI is analyzing your file...');
    try {
        await apiPost(`/api/analyze/${id}`, {});
        showToast('File re-analyzed successfully!', 'success');
        loadFiles();
    } catch (e) {
        showToast('Analysis failed: ' + e.message, 'error');
    } finally {
        hideLoading();
    }
}

function downloadFile(id) {
    window.open(`${API}/api/download/file/${id}`, '_blank');
}

// ============================================================
// FILE UPLOAD
// ============================================================

const uploadZone = document.getElementById('upload-zone');
const fileInput = document.getElementById('file-input');
const browseLink = document.getElementById('browse-link');

browseLink.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
});

uploadZone.addEventListener('click', () => fileInput.click());

uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
        uploadFiles(e.dataTransfer.files);
    }
});

fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
        uploadFiles(fileInput.files);
    }
});

async function uploadFiles(fileList) {
    const formData = new FormData();
    for (const file of fileList) {
        formData.append('files', file);
    }

    const progress = document.getElementById('upload-progress');
    const fill = document.getElementById('progress-fill');
    const text = document.getElementById('progress-text');

    progress.style.display = 'block';
    fill.style.width = '0%';
    text.textContent = `Uploading ${fileList.length} file(s)...`;

    try {
        // Simulate progress
        let pct = 0;
        const interval = setInterval(() => {
            pct = Math.min(pct + Math.random() * 15, 85);
            fill.style.width = pct + '%';
        }, 200);

        const res = await fetch(`${API}/api/upload`, {
            method: 'POST',
            body: formData,
        });

        clearInterval(interval);
        fill.style.width = '100%';

        if (!res.ok) throw new Error('Upload failed');

        const data = await res.json();
        text.textContent = `✅ ${data.count} file(s) uploaded and analyzed!`;
        showToast(`${data.count} file(s) uploaded successfully!`, 'success');

        // Reset after delay
        setTimeout(() => {
            progress.style.display = 'none';
            fill.style.width = '0%';
        }, 3000);

        fileInput.value = '';
        loadDashboard();
    } catch (e) {
        fill.style.width = '0%';
        text.textContent = '❌ Upload failed';
        showToast('Upload failed: ' + e.message, 'error');
        setTimeout(() => { progress.style.display = 'none'; }, 3000);
    }
}

// ============================================================
// DOCUMENT GENERATION
// ============================================================

// Tab switching
document.querySelectorAll('.gen-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.gen-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentGenType = tab.dataset.type;

        // Update placeholder
        const placeholders = {
            ppt: 'e.g. Create a 10-slide presentation about machine learning trends in 2026, including adoption statistics and key industry players...',
            pdf: 'e.g. Write a comprehensive market analysis report for the electric vehicle industry, covering current trends, major competitors, and 5-year forecasts...',
            excel: 'e.g. Create a monthly budget tracker for a small business with categories for rent, utilities, salaries, marketing, and supplies with sample data...',
            docx: 'e.g. Write a software project proposal for a mobile health application, including objectives, technical architecture, timeline, and budget...',
        };
        document.getElementById('gen-prompt').placeholder = placeholders[currentGenType] || '';
    });
});

document.getElementById('btn-generate').addEventListener('click', async () => {
    const title = document.getElementById('gen-title').value.trim();
    const prompt = document.getElementById('gen-prompt').value.trim();

    if (!prompt) {
        showToast('Please describe what you want to generate', 'warning');
        return;
    }

    const typeNames = { ppt: 'PowerPoint', pdf: 'PDF Report', excel: 'Excel Spreadsheet', docx: 'Word Document' };
    showLoading(`AI is generating your ${typeNames[currentGenType]}...`);

    try {
        const endpoint = `/api/generate/${currentGenType}`;
        const data = await apiPost(endpoint, { title, prompt });
        hideLoading();
        showToast(`${typeNames[currentGenType]} generated successfully!`, 'success');

        // Clear form
        document.getElementById('gen-title').value = '';
        document.getElementById('gen-prompt').value = '';

        // Offer download
        if (data.id) {
            showModal(
                '✨ Document Generated!',
                `<div style="text-align:center;padding:20px 0;">
                    <div style="font-size:64px;margin-bottom:16px;">${getGenDocIcon(data.doc_type)}</div>
                    <div style="font-size:18px;font-weight:700;margin-bottom:8px;">${data.title}</div>
                    <div style="font-size:13px;color:var(--text-muted);">${data.doc_type?.toUpperCase()} file ready for download</div>
                </div>`,
                `<button class="btn btn-secondary" onclick="hideModal()">Close</button>
                 <button class="btn btn-primary" onclick="window.open('${API}/api/download/generated/${data.id}', '_blank'); hideModal();">⬇️ Download</button>`
            );
        }

        loadDashboard();
    } catch (e) {
        hideLoading();
        showToast('Generation failed: ' + e.message, 'error');
    }
});

// ============================================================
// TEMPLATES
// ============================================================

async function loadTemplates() {
    try {
        const data = await apiGet('/api/templates');
        const templates = data.templates || {};
        const grid = document.getElementById('templates-grid');

        grid.innerHTML = Object.entries(templates).map(([key, tpl]) => `
            <div class="glass-card template-card" data-template="${key}">
                <span class="template-icon">${tpl.icon}</span>
                <div class="template-name">${tpl.name}</div>
                <div class="template-desc">${tpl.description}</div>
            </div>
        `).join('');

        grid.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', () => {
                const key = card.dataset.template;
                const tpl = templates[key];
                if (tpl) showTemplateForm(key, tpl);
            });
        });
    } catch (e) {
        console.error('Templates load error:', e);
    }
}

function showTemplateForm(key, template) {
    const fields = template.fields || [];
    const body = `
        <p style="color:var(--text-secondary);margin-bottom:20px;">${template.description}</p>
        <div class="template-form">
            ${fields.map(f => `
                <div class="form-group">
                    <label class="form-label">${f.replace(/_/g, ' ')}</label>
                    <input class="form-input template-field" data-field="${f}" placeholder="Enter ${f.replace(/_/g, ' ')}..." autocomplete="off">
                </div>
            `).join('')}
            <div class="form-group">
                <label class="form-label">Output Format</label>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                    <button class="filter-chip active template-format" data-format="docx">📝 Word</button>
                    <button class="filter-chip template-format" data-format="pdf">📄 PDF</button>
                    <button class="filter-chip template-format" data-format="xlsx">📈 Excel</button>
                    <button class="filter-chip template-format" data-format="pptx">📊 PPT</button>
                </div>
            </div>
        </div>
    `;

    showModal(`${template.icon} ${template.name}`, body,
        `<button class="btn btn-secondary" onclick="hideModal()">Cancel</button>
         <button class="btn btn-primary" id="btn-gen-template">✨ Generate</button>`
    );

    // Format selection
    document.querySelectorAll('.template-format').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.template-format').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Generate button
    document.getElementById('btn-gen-template').addEventListener('click', async () => {
        const data = {};
        document.querySelectorAll('.template-field').forEach(input => {
            data[input.dataset.field] = input.value.trim();
        });
        const format = document.querySelector('.template-format.active')?.dataset.format || 'docx';

        hideModal();
        showLoading(`AI is generating your ${template.name}...`);

        try {
            const result = await apiPost('/api/templates/generate', {
                template_type: key,
                data: data,
                format: format,
            });
            hideLoading();
            showToast(`${template.name} generated!`, 'success');

            if (result.id) {
                showModal(
                    '✨ Template Generated!',
                    `<div style="text-align:center;padding:20px 0;">
                        <div style="font-size:64px;margin-bottom:16px;">${template.icon}</div>
                        <div style="font-size:18px;font-weight:700;margin-bottom:8px;">${result.title}</div>
                        <div style="font-size:13px;color:var(--text-muted);">${result.doc_type?.toUpperCase()} ready for download</div>
                    </div>`,
                    `<button class="btn btn-secondary" onclick="hideModal()">Close</button>
                     <button class="btn btn-primary" onclick="window.open('${API}/api/download/generated/${result.id}', '_blank'); hideModal();">⬇️ Download</button>`
                );
            }
            loadDashboard();
        } catch (e) {
            hideLoading();
            showToast('Generation failed: ' + e.message, 'error');
        }
    });
}

// ============================================================
// GENERATED DOCUMENTS
// ============================================================

async function loadGenerated() {
    try {
        const data = await apiGet('/api/generated');
        allGenerated = data.documents || [];
        renderGenerated(allGenerated);
    } catch (e) {
        console.error('Generated load error:', e);
    }
}

function renderGenerated(docs) {
    const list = document.getElementById('generated-list');
    const empty = document.getElementById('generated-empty');

    if (docs.length === 0) {
        list.innerHTML = '';
        empty.style.display = 'block';
        return;
    }

    empty.style.display = 'none';
    list.innerHTML = docs.map(d => `
        <div class="glass-card gen-doc-card">
            <div class="gen-doc-type">${getGenDocIcon(d.doc_type)}</div>
            <div class="gen-doc-title" title="${d.title}">${d.title}</div>
            <div class="gen-doc-prompt">${d.prompt || ''}</div>
            <div style="font-size:11px;color:var(--text-muted);margin-bottom:10px;">${timeAgo(d.created_date)}</div>
            <div class="gen-doc-actions">
                <button class="btn btn-primary" onclick="window.open('${API}/api/download/generated/${d.id}', '_blank')">⬇️ Download</button>
                <button class="btn btn-danger" onclick="deleteGenerated(${d.id})">🗑️</button>
            </div>
        </div>
    `).join('');
}

async function deleteGenerated(id) {
    if (!confirm('Delete this generated document?')) return;
    try {
        await apiDelete(`/api/generated/${id}`);
        showToast('Document deleted', 'success');
        loadGenerated();
        loadDashboard();
    } catch (e) {
        showToast('Delete failed: ' + e.message, 'error');
    }
}

// ============================================================
// SEARCH
// ============================================================

let searchTimeout = null;
document.getElementById('global-search').addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();

    if (!query) {
        if (currentPage === 'files') renderFiles(allFiles);
        return;
    }

    searchTimeout = setTimeout(async () => {
        try {
            const data = await apiPost('/api/search', { query });
            if (currentPage !== 'files') navigateTo('files');
            renderFiles(data.files || []);
        } catch (e) {
            console.error('Search error:', e);
        }
    }, 500);
});

// ============================================================
// AUTO-ORGANIZE
// ============================================================

document.getElementById('btn-organize').addEventListener('click', async () => {
    if (!confirm('Organize all files into category folders?')) return;
    showLoading('Organizing files...');
    try {
        const data = await apiPost('/api/organize', {});
        hideLoading();
        showToast(`${data.organized} files organized into folders!`, 'success');
        loadDashboard();
    } catch (e) {
        hideLoading();
        showToast('Organize failed: ' + e.message, 'error');
    }
});

// ============================================================
// FLOATING ACTION BUTTON
// ============================================================

const fabContainer = document.getElementById('fab-container');
document.getElementById('fab-btn').addEventListener('click', () => {
    fabContainer.classList.toggle('open');
});

document.querySelectorAll('.fab-menu-item').forEach(item => {
    item.addEventListener('click', () => {
        fabContainer.classList.remove('open');
        const action = item.dataset.action;
        if (action === 'upload') navigateTo('upload');
        if (action === 'generate') navigateTo('generate');
        if (action === 'organize') document.getElementById('btn-organize').click();
    });
});

// Close FAB when clicking outside
document.addEventListener('click', (e) => {
    if (!fabContainer.contains(e.target)) {
        fabContainer.classList.remove('open');
    }
});

// ============================================================
// MOBILE MENU
// ============================================================

const menuToggle = document.getElementById('menu-toggle');

function checkMobile() {
    if (window.innerWidth <= 768) {
        menuToggle.style.display = 'flex';
    } else {
        menuToggle.style.display = 'none';
        document.getElementById('sidebar').classList.remove('open');
    }
}

menuToggle.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
});

window.addEventListener('resize', checkMobile);

// ============================================================
// INIT
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    checkMobile();
    loadDashboard();
});
