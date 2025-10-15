class Dashboard {
    constructor() {
        this.apiUrl = 'https://uwuajcjtvpqf6x4a2wauthzgfi0uifir.lambda-url.ap-southeast-2.on.aws/';
        this.version = 'v1.1.2';
        this.mediaApiUrl = 'https://ilt7x5cj65bdd2ydpb5odqm7ym0aexif.lambda-url.ap-southeast-2.on.aws/';
        this.tables = [];
        this.selectedTable = null;
        this.columns = [];
        this.tableData = [];
        this.currentPage = 0;
        this.pageSize = 25;
        this.totalRows = 0;
        this.sortColumn = null;
        this.sortDirection = null;
        this.filters = [];
        this.showFilters = false;
        this.activeTab = 'tables';
        this.uploads = [];

        this.init();
    }

    async init() {
        this.bindEvents();
        this.setActiveTab('tables');
        await this.loadTables();
    }

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = item.dataset.tab;
                if (tab) {
                    this.setActiveTab(tab);
                }
            });
        });

        // Table selection
        document.getElementById('tableSelect').addEventListener('change', (e) => {
            this.selectTable(e.target.value);
        });

        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.refresh();
        });

        // Filter controls
        document.getElementById('toggleFiltersBtn').addEventListener('click', () => {
            this.toggleFilters();
        });

        document.getElementById('addFilterBtn').addEventListener('click', () => {
            this.addFilter();
        });

        document.getElementById('applyFiltersBtn').addEventListener('click', () => {
            this.applyFilters();
        });

        document.getElementById('clearFiltersBtn').addEventListener('click', () => {
            this.clearFilters();
        });

        // Pagination
        document.getElementById('prevBtn').addEventListener('click', () => {
            this.changePage(-1);
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            this.changePage(1);
        });

        document.getElementById('pageSizeSelect').addEventListener('change', (e) => {
            this.pageSize = parseInt(e.target.value);
            this.currentPage = 0;
            this.loadTableData();
        });

        // Export
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportToCSV();
        });

        // File upload events
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.handleFileSelection(e);
            });
        }

        const uploadArea = document.querySelector('.upload-area');
        if (uploadArea) {
            // Prevent default drag behaviors
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                uploadArea.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                });
            });

            // Highlight drop area when dragging
            ['dragenter', 'dragover'].forEach(eventName => {
                uploadArea.addEventListener(eventName, () => {
                    uploadArea.classList.add('drag-active');
                });
            });

            ['dragleave', 'drop'].forEach(eventName => {
                uploadArea.addEventListener(eventName, () => {
                    uploadArea.classList.remove('drag-active');
                });
            });

            // Handle dropped files
            uploadArea.addEventListener('drop', (e) => {
                const files = e.dataTransfer.files;
                this.handleFileSelection({ target: { files } });
            });
        }

        // Upload button and other clicks
        document.addEventListener('click', (e) => {
            if (e.target.id === 'uploadBtn') {
                this.uploadSelectedFiles();
            }
            if (e.target.classList.contains('copy-url-btn')) {
                this.copyToClipboard(e.target.dataset.url);
            }
            if (e.target.classList.contains('remove-file-btn')) {
                this.removeSelectedFile(parseInt(e.target.dataset.index));
            }
        });
    }

    setActiveTab(tab) {
        this.activeTab = tab;

        // Update nav active state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        // Update header
        this.updateHeader();

        // Show/hide content
        this.showTabContent(tab);
    }

    updateHeader() {
        const titles = {
            'tables': 'Table Explorer',
            'upload': 'Media Upload',
            'queries': 'Query Builder',
            'reports': 'Reports & Analytics'
        };

        const subtitles = {
            'tables': 'Browse and analyze your database tables',
            'upload': 'Upload and manage your media files',
            'queries': 'Build custom SQL queries',
            'reports': 'Generate insights and reports'
        };

        const titleEl = document.querySelector('.header-title');
        const subtitleEl = document.querySelector('.header-subtitle');

        if (titleEl) titleEl.textContent = titles[this.activeTab] || 'Dashboard';
        if (subtitleEl) subtitleEl.textContent = subtitles[this.activeTab] || '';
    }

    showTabContent(tab) {
        // Hide all content sections
        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = 'none';
        });

        // Show active tab content
        const activeContent = document.getElementById(`${tab}Content`);
        if (activeContent) {
            activeContent.style.display = 'block';
        }
    }

    async query(sql) {
        try {
            console.log('Executing SQL:', sql);
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sql })
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error Response:', errorText);
                throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
            }

            const data = await response.json();
            console.log('API Response:', data);

            // Handle different response formats from your API
            if (data.rows !== undefined) {
                // API returns {rows: [...], rowCount: 123, fields: [...]}
                return data;
            } else if (Array.isArray(data)) {
                // API returns raw array
                return { rows: data, rowCount: data.length };
            } else if (data.message) {
                // API returned an error message
                throw new Error(data.message);
            } else {
                // Unknown format
                return data;
            }
        } catch (error) {
            console.error('Query error:', error);
            this.showNotification('Database query failed: ' + error.message, 'error');
            throw error;
        }
    }

    // Media Upload Methods
    handleFileSelection(event) {
        const files = Array.from(event.target.files);
        const allowedTypes = ['image/jpeg', 'image/png', 'audio/mpeg', 'audio/ogg', 'audio/wav', 'video/mp4'];
        const maxSize = 25 * 1024 * 1024; // 25MB

        files.forEach(file => {
            if (!allowedTypes.includes(file.type)) {
                this.showNotification(`File type ${file.type} not allowed`, 'error');
                return;
            }

            if (file.size > maxSize) {
                this.showNotification(`File ${file.name} is too large (max 25MB)`, 'error');
                return;
            }

            // Add to upload queue
            this.uploads.push({
                file: file,
                status: 'pending',
                progress: 0,
                url: null,
                id: Date.now() + Math.random()
            });
        });

        this.renderUploadQueue();

        // Clear file input
        if (event.target.value !== undefined) {
            event.target.value = '';
        }
    }

    async uploadSelectedFiles() {
        const pendingUploads = this.uploads.filter(upload => upload.status === 'pending');

        if (pendingUploads.length === 0) {
            this.showNotification('No files to upload', 'error');
            return;
        }

        for (const upload of pendingUploads) {
            await this.uploadSingleFile(upload);
        }
    }

    async uploadSingleFile(upload) {
        upload.status = 'uploading';
        upload.progress = 0;
        this.renderUploadQueue();

        try {
            // Convert file to base64
            const base64Data = await this.fileToBase64(upload.file);

            upload.progress = 25;
            this.renderUploadQueue();

            // Upload to API
            const response = await fetch(this.mediaApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fileName: upload.file.name,
                    mimeType: upload.file.type,
                    fileData: base64Data
                })
            });

            upload.progress = 75;
            this.renderUploadQueue();

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Upload failed: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                upload.status = 'completed';
                upload.progress = 100;
                upload.url = result.data.publicUrl;
                upload.s3Key = result.data.s3Key;
                upload.uploadedAt = result.data.uploadedAt;

                this.showNotification(`Successfully uploaded ${upload.file.name}`, 'success');
            } else {
                throw new Error(result.error || 'Upload failed');
            }

        } catch (error) {
            console.error('Upload error:', error);
            upload.status = 'error';
            upload.error = error.message;
            this.showNotification(`Failed to upload ${upload.file.name}: ${error.message}`, 'error');
        }

        this.renderUploadQueue();
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    renderUploadQueue() {
        const container = document.getElementById('uploadQueue');
        if (!container) return;

        if (this.uploads.length === 0) {
            container.innerHTML = `
                        <div class="empty-state">
                            <span class="material-symbols-outlined">cloud_upload</span>
                            <h3>No files selected</h3>
                            <p>Choose files to upload to your media library</p>
                        </div>
                    `;
            return;
        }

        container.innerHTML = this.uploads.map((upload, index) => `
                    <div class="upload-item ${upload.status}">
                        <div class="upload-info">
                            <div class="upload-filename">${upload.file.name}</div>
                            <div class="upload-meta">
                                ${this.formatFileSize(upload.file.size)} • ${upload.file.type}
                            </div>
                        </div>
                        
                        <div class="upload-progress">
                            ${upload.status === 'uploading' ? `
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${upload.progress}%"></div>
                                </div>
                                <div class="progress-text">${upload.progress}%</div>
                            ` : ''}
                            
                            ${upload.status === 'completed' ? `
                                <div class="upload-success">
                                    <span class="material-symbols-outlined">check_circle</span>
                                    <a href="${upload.url}" target="_blank" class="upload-url">${upload.url}</a>
                                    <button class="btn btn-secondary copy-url-btn" data-url="${upload.url}">
                                        <span class="material-symbols-outlined">content_copy</span>
                                    </button>
                                </div>
                            ` : ''}
                            
                            ${upload.status === 'error' ? `
                                <div class="upload-error">
                                    <span class="material-symbols-outlined">error</span>
                                    ${upload.error}
                                </div>
                            ` : ''}
                            
                            ${upload.status === 'pending' ? `
                                <button class="btn btn-secondary remove-file-btn" data-index="${index}">
                                    <span class="material-symbols-outlined">delete</span>
                                </button>
                            ` : ''}
                        </div>
                    </div>
                `).join('');
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    removeSelectedFile(index) {
        this.uploads.splice(index, 1);
        this.renderUploadQueue();
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showNotification('URL copied to clipboard!', 'success');
        } catch (error) {
            console.error('Copy failed:', error);
            this.showNotification('Failed to copy URL', 'error');
        }
    }

    // Rest of the methods continue here...
    async loadTables() {
        const loadingEl = document.getElementById('loadingTables');
        const selectEl = document.getElementById('tableSelect');

        if (loadingEl) {
            loadingEl.classList.remove('hidden');
        }

        try {
            // SQL Server compatible query
            const sql = `
                        SELECT TABLE_NAME as name
                        FROM INFORMATION_SCHEMA.TABLES 
                        WHERE TABLE_TYPE = 'BASE TABLE' 
                        AND TABLE_SCHEMA = 'dbo'
                        ORDER BY TABLE_NAME
                    `;

            const result = await this.query(sql);

            // Handle the response format from your API
            const tables = result.rows || result;
            this.tables = tables;

            // Clear and populate select
            if (selectEl) {
                selectEl.innerHTML = '<option value="">Choose a table...</option>';
                tables.forEach(table => {
                    const option = document.createElement('option');
                    option.value = table.name;
                    option.textContent = table.name;
                    selectEl.appendChild(option);
                });
            }

            this.showNotification(`Loaded ${tables.length} tables`, 'success');
        } catch (error) {
            console.error('Load tables error:', error);
            this.showNotification('Failed to load tables: ' + error.message, 'error');
        } finally {
            if (loadingEl) {
                loadingEl.classList.add('hidden');
            }
        }
    }

    async selectTable(tableName) {
        if (!tableName) {
            this.selectedTable = null;
            const filtersCard = document.getElementById('filtersCard');
            const dataCard = document.getElementById('dataCard');
            if (filtersCard) filtersCard.style.display = 'none';
            if (dataCard) dataCard.style.display = 'none';
            return;
        }

        this.selectedTable = tableName;
        this.currentPage = 0;
        this.sortColumn = null;
        this.sortDirection = null;
        this.filters = [];
        this.showFilters = false;

        const tableTitle = document.getElementById('tableTitle');
        const filtersCard = document.getElementById('filtersCard');
        const dataCard = document.getElementById('dataCard');

        if (tableTitle) {
            tableTitle.textContent = `Data: ${tableName}`;
        }
        if (filtersCard) {
            filtersCard.style.display = 'block';
        }
        if (dataCard) {
            dataCard.style.display = 'block';
        }

        await this.loadTableColumns();
        await this.loadTableData();
    }

    async loadTableColumns() {
        if (!this.selectedTable) return;

        try {
            // SQL Server compatible query
            const sql = `
                        SELECT 
                            COLUMN_NAME as name,
                            DATA_TYPE as type,
                            IS_NULLABLE as nullable
                        FROM INFORMATION_SCHEMA.COLUMNS 
                        WHERE TABLE_NAME = '${this.selectedTable}' 
                        AND TABLE_SCHEMA = 'dbo'
                        ORDER BY ORDINAL_POSITION
                    `;

            const result = await this.query(sql);
            this.columns = result.rows || result;
        } catch (error) {
            console.error('Load columns error:', error);
            this.showNotification('Failed to load table columns: ' + error.message, 'error');
        }
    }

    async loadTableData() {
        if (!this.selectedTable) return;

        const containerEl = document.getElementById('tableContainer');
        let loadingEl = document.getElementById('loadingData');
        const paginationEl = document.getElementById('pagination');

        // Create loading element if it doesn't exist
        if (!loadingEl) {
            containerEl.innerHTML = `
                        <div id="loadingData" class="loading">
                            <div class="spinner"></div>
                            Loading data...
                        </div>
                    `;
            loadingEl = document.getElementById('loadingData');
        }

        if (loadingEl) {
            loadingEl.style.display = 'flex';
        }
        if (paginationEl) {
            paginationEl.style.display = 'none';
        }

        try {
            // Build SQL Server compatible query
            let sql = `SELECT * FROM [dbo].[${this.selectedTable}]`;

            // Add WHERE clause for filters
            if (this.filters.length > 0) {
                const conditions = this.filters.map(filter => this.buildFilterCondition(filter)).filter(Boolean);
                if (conditions.length > 0) {
                    sql += ` WHERE ${conditions.join(' AND ')}`;
                }
            }

            // Add ORDER BY clause
            if (this.sortColumn && this.sortDirection) {
                sql += ` ORDER BY [${this.sortColumn}] ${this.sortDirection}`;
            } else {
                // SQL Server requires ORDER BY for OFFSET/FETCH
                sql += ` ORDER BY (SELECT NULL)`;
            }

            // Add SQL Server pagination (OFFSET/FETCH)
            const offset = this.currentPage * this.pageSize;
            sql += ` OFFSET ${offset} ROWS FETCH NEXT ${this.pageSize} ROWS ONLY`;

            // Get total count
            let countSql = `SELECT COUNT(*) as total FROM [dbo].[${this.selectedTable}]`;
            if (this.filters.length > 0) {
                const conditions = this.filters.map(filter => this.buildFilterCondition(filter)).filter(Boolean);
                if (conditions.length > 0) {
                    countSql += ` WHERE ${conditions.join(' AND ')}`;
                }
            }

            console.log('Data SQL:', sql);
            console.log('Count SQL:', countSql);

            const [dataResult, countResult] = await Promise.all([
                this.query(sql),
                this.query(countSql)
            ]);

            // Handle API response format {rows, rowCount, fields}
            this.tableData = dataResult.rows || dataResult;
            const countRows = countResult.rows || countResult;
            this.totalRows = countRows[0].total;

            console.log('Loaded data:', this.tableData.length, 'rows');
            console.log('Total rows:', this.totalRows);

            this.renderTable();
            this.updatePagination();

        } catch (error) {
            console.error('Load table data error:', error);
            this.showNotification('Failed to load table data: ' + error.message, 'error');
            containerEl.innerHTML = `
                        <div class="empty-state">
                            <span class="material-symbols-outlined">error</span>
                            <h3>Error loading data</h3>
                            <p>${error.message}</p>
                        </div>
                    `;
        } finally {
            // Hide loading if it still exists
            const finalLoadingEl = document.getElementById('loadingData');
            if (finalLoadingEl) {
                finalLoadingEl.style.display = 'none';
            }
        }
    }

    buildFilterCondition(filter) {
        if (!filter.column || !filter.operator) return null;

        // SQL Server uses square brackets for identifiers
        const column = `[${filter.column}]`;

        switch (filter.operator) {
            case 'equals':
                return `${column} = '${filter.value.replace(/'/g, "''")}'`;
            case 'contains':
                return `CAST(${column} AS NVARCHAR(MAX)) LIKE '%${filter.value.replace(/'/g, "''")}%'`;
            case 'not_equals':
                return `${column} != '${filter.value.replace(/'/g, "''")}'`;
            case 'greater_than':
                return `${column} > '${filter.value.replace(/'/g, "''")}'`;
            case 'less_than':
                return `${column} < '${filter.value.replace(/'/g, "''")}'`;
            case 'is_null':
                return `${column} IS NULL`;
            case 'is_not_null':
                return `${column} IS NOT NULL`;
            default:
                return null;
        }
    }

    renderTable() {
        const containerEl = document.getElementById('tableContainer');

        if (this.tableData.length === 0) {
            containerEl.innerHTML = `
                        <div class="empty-state">
                            <span class="material-symbols-outlined">inbox</span>
                            <h3>No data found</h3>
                            <p>This table appears to be empty or your filters returned no results.</p>
                        </div>
                    `;
            return;
        }

        const columns = Object.keys(this.tableData[0]);

        let tableHtml = `
                    <table class="table">
                        <thead>
                            <tr>
                                ${columns.map(column => `
                                    <th class="${this.sortColumn === column ? 'sorted' : ''}" 
                                        onclick="dashboard.sortBy('${column}')">
                                        <div class="sort-header">
                                            <span>${column}</span>
                                            <span class="material-symbols-outlined">
                                                ${this.getSortIcon(column)}
                                            </span>
                                        </div>
                                    </th>
                                `).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${this.tableData.map(row => `
                                <tr>
                                    ${columns.map(column => `
                                        <td>${this.formatCellValue(row[column])}</td>
                                    `).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;

        containerEl.innerHTML = tableHtml;
    }

    getSortIcon(column) {
        if (this.sortColumn !== column) return 'unfold_more';
        return this.sortDirection === 'ASC' ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
    }

    sortBy(column) {
        if (this.sortColumn === column) {
            // Cycle through: ASC -> DESC -> NONE
            if (this.sortDirection === 'ASC') {
                this.sortDirection = 'DESC';
            } else if (this.sortDirection === 'DESC') {
                this.sortColumn = null;
                this.sortDirection = null;
            }
        } else {
            // New column, start with ASC
            this.sortColumn = column;
            this.sortDirection = 'ASC';
        }

        this.currentPage = 0;
        this.loadTableData();
    }

    formatCellValue(value) {
        if (value === null || value === undefined) {
            return '<em class="text-muted">NULL</em>';
        }
        if (value === '') {
            return '<em class="text-muted">(empty)</em>';
        }
        if (typeof value === 'string' && value.length > 100) {
            return value.substring(0, 100) + '...';
        }
        if (typeof value === 'number') {
            return value.toLocaleString();
        }
        if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
            try {
                return new Date(value).toLocaleString();
            } catch (e) {
                return value;
            }
        }
        return String(value);
    }

    updatePagination() {
        const paginationEl = document.getElementById('pagination');
        const infoEl = document.getElementById('paginationInfo');
        const pageInfoEl = document.getElementById('pageInfo');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (!paginationEl) return;

        if (this.totalRows === 0) {
            paginationEl.style.display = 'none';
            return;
        }

        paginationEl.style.display = 'flex';

        // Update info
        const start = this.currentPage * this.pageSize + 1;
        const end = Math.min((this.currentPage + 1) * this.pageSize, this.totalRows);
        if (infoEl) {
            infoEl.textContent = `Showing ${start.toLocaleString()}-${end.toLocaleString()} of ${this.totalRows.toLocaleString()} results`;
        }

        // Update page info
        const totalPages = Math.ceil(this.totalRows / this.pageSize);
        if (pageInfoEl) {
            pageInfoEl.textContent = `Page ${this.currentPage + 1} of ${totalPages}`;
        }

        // Update button states
        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 0;
        }
        if (nextBtn) {
            nextBtn.disabled = (this.currentPage + 1) * this.pageSize >= this.totalRows;
        }
    }

    changePage(direction) {
        const newPage = this.currentPage + direction;
        const maxPage = Math.ceil(this.totalRows / this.pageSize) - 1;

        if (newPage >= 0 && newPage <= maxPage) {
            this.currentPage = newPage;
            this.loadTableData();
        }
    }

    // Filter Management
    toggleFilters() {
        this.showFilters = !this.showFilters;
        const filtersEl = document.getElementById('filtersContent');
        const btnEl = document.getElementById('toggleFiltersBtn');

        if (!filtersEl || !btnEl) return;

        const iconEl = btnEl.querySelector('.material-symbols-outlined');
        const textEl = btnEl.querySelector('span:last-child');

        if (this.showFilters) {
            filtersEl.classList.remove('hidden');
            if (iconEl) iconEl.textContent = 'visibility_off';
            if (textEl) textEl.textContent = 'Hide Filters';
            if (this.filters.length === 0) {
                this.addFilter();
            }
        } else {
            filtersEl.classList.add('hidden');
            if (iconEl) iconEl.textContent = 'visibility';
            if (textEl) textEl.textContent = 'Show Filters';
        }
    }

    addFilter() {
        const filter = {
            column: '',
            operator: 'equals',
            value: ''
        };
        this.filters.push(filter);
        this.renderFilters();
    }

    removeFilter(index) {
        this.filters.splice(index, 1);
        this.renderFilters();
    }

    renderFilters() {
        const containerEl = document.getElementById('filterRows');

        if (!containerEl) return;

        containerEl.innerHTML = this.filters.map((filter, index) => `
                    <div class="filter-row">
                        <select class="input" onchange="dashboard.updateFilter(${index}, 'column', this.value)">
                            <option value="">Select Column</option>
                            ${this.columns.map(col => `
                                <option value="${col.name}" ${filter.column === col.name ? 'selected' : ''}>
                                    ${col.name}
                                </option>
                            `).join('')}
                        </select>
                        
                        <select class="input" onchange="dashboard.updateFilter(${index}, 'operator', this.value)">
                            <option value="equals" ${filter.operator === 'equals' ? 'selected' : ''}>Equals</option>
                            <option value="contains" ${filter.operator === 'contains' ? 'selected' : ''}>Contains</option>
                            <option value="not_equals" ${filter.operator === 'not_equals' ? 'selected' : ''}>Not Equals</option>
                            <option value="greater_than" ${filter.operator === 'greater_than' ? 'selected' : ''}>Greater Than</option>
                            <option value="less_than" ${filter.operator === 'less_than' ? 'selected' : ''}>Less Than</option>
                            <option value="is_null" ${filter.operator === 'is_null' ? 'selected' : ''}>Is Null</option>
                            <option value="is_not_null" ${filter.operator === 'is_not_null' ? 'selected' : ''}>Is Not Null</option>
                        </select>
                        
                        <input type="text" 
                               class="input" 
                               placeholder="Value" 
                               value="${filter.value}"
                               ${['is_null', 'is_not_null'].includes(filter.operator) ? 'disabled' : ''}
                               onchange="dashboard.updateFilter(${index}, 'value', this.value)">
                        
                        <button class="btn btn-secondary" onclick="dashboard.removeFilter(${index})">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                `).join('');
    }

    updateFilter(index, field, value) {
        if (this.filters[index]) {
            this.filters[index][field] = value;
            if (field === 'operator') {
                this.renderFilters();
            }
        }
    }

    applyFilters() {
        this.currentPage = 0;
        this.loadTableData();
    }

    clearFilters() {
        this.filters = [];
        this.renderFilters();
        this.currentPage = 0;
        this.loadTableData();
    }

    async exportToCSV() {
        if (!this.selectedTable) {
            this.showNotification('Please select a table first', 'error');
            return;
        }

        try {
            let sql = `SELECT * FROM [dbo].[${this.selectedTable}]`;

            if (this.filters.length > 0) {
                const conditions = this.filters.map(filter => this.buildFilterCondition(filter)).filter(Boolean);
                if (conditions.length > 0) {
                    sql += ` WHERE ${conditions.join(' AND ')}`;
                }
            }

            if (this.sortColumn && this.sortDirection) {
                sql += ` ORDER BY [${this.sortColumn}] ${this.sortDirection}`;
            } else {
                sql += ` ORDER BY (SELECT NULL)`;
            }

            sql = sql.replace('SELECT *', 'SELECT TOP 10000 *');

            console.log('Export SQL:', sql);
            const result = await this.query(sql);
            const data = result.rows || result;

            if (data.length === 0) {
                this.showNotification('No data to export', 'error');
                return;
            }

            const headers = Object.keys(data[0]);
            const csvHeaders = headers.map(h => `"${h}"`).join(',');

            const csvRows = data.map(row => {
                return headers.map(header => {
                    let value = row[header];
                    if (value === null || value === undefined) return '';
                    if (typeof value === 'string') {
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return `"${value}"`;
                }).join(',');
            });

            const csv = [csvHeaders, ...csvRows].join('\n');

            // Download file
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const timestamp = new Date().toISOString().split('T')[0];
            const filename = `${this.selectedTable}_export_${timestamp}.csv`;

            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();

            URL.revokeObjectURL(link.href);

            this.showNotification(`Exported ${data.length.toLocaleString()} rows to ${filename}`, 'success');

        } catch (error) {
            console.error('Export error:', error);
            this.showNotification('Export failed: ' + error.message, 'error');
        }
    }

    refresh() {
        if (this.selectedTable) {
            this.loadTableData();
        } else {
            this.loadTables();
        }
    }

    showNotification(message, type = 'success') {
        const existing = document.querySelectorAll('.notification');
        existing.forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
                    <span class="material-symbols-outlined">
                        ${type === 'success' ? 'check_circle' : 'error'}
                    </span>
                    <span>${message}</span>
                `;

        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);


        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

const dashboard = new Dashboard();

