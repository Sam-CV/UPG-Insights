/**
 * Quiz Analytics Dashboard
 * Advanced visualization system for quiz data analysis
 */

class QuizAnalyticsDashboard {
    constructor() {
        this.quizData = null;
        this.currentCountry = 'Nepal';
        this.currentChart = null;
        this.modalChart = null;
        this.currentModalChartType = 'bar';
        this.comparisonMode = false;
        this.currentModalQuestion = null;

        // Color palettes for different countries (no gradients)
        this.colorPalettes = {
            'Nepal': {
                primary: '#DC143C',
                secondary: '#003893',
                accent: '#4169E1',
                palette: ['#DC143C', '#003893', '#4169E1', '#6495ED', '#87CEEB', '#B0C4DE', '#FFD700', '#FF6347']
            },
            'Bangladesh': {
                primary: '#006A4E',
                secondary: '#F42A41',
                accent: '#228B22',
                palette: ['#006A4E', '#F42A41', '#228B22', '#32CD32', '#90EE90', '#FFB347', '#FF6961', '#AEC6CF']
            }
        };

        this.init();
    }

    init() {
        this.loadQuizData();
        this.setupEventListeners();
        this.renderDashboard();
    }

    loadQuizData() {
        if (typeof NEPAL_QUIZ_RESULTS !== 'undefined' && typeof BANGLA_QUIZ_RESULTS !== 'undefined') {
            this.quizData = {
                'Nepal': NEPAL_QUIZ_RESULTS,
                'Bangladesh': BANGLA_QUIZ_RESULTS
            };
            console.log('✅ Quiz data loaded successfully');
        } else {
            console.error('❌ Quiz data not found');
        }
    }

    setupEventListeners() {
        // Country tabs
        document.querySelectorAll('.country-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const country = e.currentTarget.dataset.country;
                if (country === 'compare') {
                    this.enableComparisonMode();
                } else {
                    this.switchCountry(country);
                }
            });
        });

        // Modal close
        const modalBackdrop = document.getElementById('modal-backdrop');
        const modalCloseBtn = document.getElementById('modal-close-btn');

        if (modalBackdrop) {
            modalBackdrop.addEventListener('click', () => this.closeQuestionModal());
        }
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => this.closeQuestionModal());
        }

        // Chart type toggle in modal
        document.querySelectorAll('.chart-toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const chartType = e.currentTarget.dataset.chart;
                this.changeModalChartType(chartType);
            });
        });
    }

    switchCountry(country) {
        this.currentCountry = country;
        this.comparisonMode = false;

        // Update active tab
        document.querySelectorAll('.country-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.country === country) {
                tab.classList.add('active');
            }
        });

        this.renderDashboard();
    }

    enableComparisonMode() {
        this.comparisonMode = true;

        // Update active tab
        document.querySelectorAll('.country-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.country === 'compare') {
                tab.classList.add('active');
            }
        });

        this.renderComparisonView();
    }

    renderDashboard() {
        const countryData = this.quizData[this.currentCountry];
        if (!countryData) return;

        // Update overview stats
        this.updateOverviewStats(countryData);

        // Render quiz cards
        this.renderQuizCards(countryData);
    }

    updateOverviewStats(countryData) {
        // Calculate total responses
        let totalResponses = 0;
        let totalQuestions = 0;
        let totalDataPoints = 0;

        countryData.quizzes.forEach(quiz => {
            totalQuestions += quiz.questions.length;
            quiz.questions.forEach(q => {
                Object.values(q.responses).forEach(count => {
                    totalResponses += count;
                    totalDataPoints++;
                });
            });
        });

        document.getElementById('overview-total-surveys').textContent = countryData.quizzes.length;
        document.getElementById('overview-total-responses').textContent = totalResponses.toLocaleString();
        document.getElementById('overview-total-questions').textContent = totalQuestions;
        document.getElementById('overview-data-points').textContent = totalDataPoints.toLocaleString();
    }

    renderQuizCards(countryData) {
        const grid = document.getElementById('quiz-cards-grid');
        grid.innerHTML = '';

        countryData.quizzes.forEach((quiz, index) => {
            const card = this.createQuizCard(quiz, index);
            grid.appendChild(card);
        });
    }

    createQuizCard(quiz, index) {
        const card = document.createElement('div');
        card.className = 'quiz-card';

        // Calculate quiz stats
        const totalResponses = quiz.questions.reduce((sum, q) => {
            return sum + Object.values(q.responses).reduce((s, c) => s + c, 0);
        }, 0);

        const mostCommonResponses = this.getMostCommonResponses(quiz);
        const colors = this.colorPalettes[this.currentCountry];

        card.innerHTML = `
            <div class="quiz-card-header">
                <div class="quiz-card-title-section">
                    <h3 class="quiz-card-title">${quiz.quizName}</h3>
                    <p class="quiz-card-description">${quiz.description}</p>
                </div>
            </div>

            <div class="quiz-card-stats">
                <div class="quiz-mini-stat">
                    <span class="mini-stat-value">${quiz.questions.length}</span>
                    <span class="mini-stat-label">Questions</span>
                </div>
                <div class="quiz-mini-stat">
                    <span class="mini-stat-value">${totalResponses.toLocaleString()}</span>
                    <span class="mini-stat-label">Responses</span>
                </div>
                <div class="quiz-mini-stat">
                    <span class="mini-stat-value">${mostCommonResponses[0] || '-'}</span>
                    <span class="mini-stat-label">Top Response</span>
                </div>
            </div>

            <div class="quiz-card-preview">
                <canvas id="preview-chart-${index}"></canvas>
            </div>

            <div class="quiz-card-actions">
                <button class="view-all-btn" data-quiz-index="${index}">
                    <span class="material-symbols-outlined">bar_chart</span>
                    <span>View All Questions</span>
                </button>
            </div>

            <div class="quiz-card-questions">
                <div class="questions-header" data-quiz-index="${index}">
                    <div class="questions-header-left">
                        <span class="material-symbols-outlined">list</span>
                        <span>Questions (${quiz.questions.length})</span>
                    </div>
                    <button class="questions-toggle-btn">
                        <span class="material-symbols-outlined">expand_more</span>
                    </button>
                </div>
                <div class="questions-list collapsed" id="questions-list-${index}">
                    ${this.renderQuestionsList(quiz, index)}
                </div>
            </div>
        `;

        // Render preview chart after card is added to DOM
        setTimeout(() => this.renderPreviewChart(quiz, index), 100);

        // Add event listeners
        setTimeout(() => {
            // View all questions button
            const viewAllBtn = card.querySelector('.view-all-btn');
            if (viewAllBtn) {
                viewAllBtn.addEventListener('click', () => this.openAllQuestionsModal(index));
            }

            // Questions toggle button
            const toggleBtn = card.querySelector('.questions-toggle-btn');
            const questionsList = card.querySelector('.questions-list');
            if (toggleBtn && questionsList) {
                toggleBtn.addEventListener('click', () => {
                    questionsList.classList.toggle('collapsed');
                    const icon = toggleBtn.querySelector('.material-symbols-outlined');
                    icon.textContent = questionsList.classList.contains('collapsed') ? 'expand_more' : 'expand_less';
                });
            }

            // Question item clicks
            card.querySelectorAll('.question-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    const quizIndex = parseInt(e.currentTarget.dataset.quizIndex);
                    const questionId = e.currentTarget.dataset.questionId;
                    this.openQuestionModal(quizIndex, questionId);
                });
            });
        }, 150);

        return card;
    }

    renderQuestionsList(quiz, quizIndex) {
        return quiz.questions.map((question, qIndex) => {
            const totalResponses = Object.values(question.responses).reduce((s, c) => s + c, 0);
            const topResponse = Object.entries(question.responses)
                .filter(([key]) => key !== 'Written Answer')
                .sort((a, b) => b[1] - a[1])[0];

            return `
                <div class="question-item" data-quiz-index="${quizIndex}" data-question-id="${question.id}">
                    <div class="question-item-header">
                        <span class="question-id">${question.id}</span>
                        <span class="question-text">${question.question}</span>
                    </div>
                    <div class="question-item-footer">
                        <span class="question-responses">${totalResponses} responses</span>
                        <span class="question-top-answer">Top: ${topResponse ? topResponse[0] : '-'}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderPreviewChart(quiz, index) {
        const canvas = document.getElementById(`preview-chart-${index}`);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Aggregate first 3 questions for preview
        const previewData = this.aggregateQuizData(quiz, 3);
        const colors = this.colorPalettes[this.currentCountry];

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: previewData.labels,
                datasets: [{
                    label: 'Responses',
                    data: previewData.data,
                    backgroundColor: colors.palette.slice(0, previewData.labels.length),
                    borderRadius: 6,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        padding: 12,
                        titleFont: {
                            family: 'Lexend',
                            size: 13,
                            weight: '600'
                        },
                        bodyFont: {
                            family: 'Lexend',
                            size: 12
                        },
                        callbacks: {
                            title: (context) => {
                                return context[0].label;
                            },
                            label: (context) => {
                                const value = context.parsed.y;
                                const total = previewData.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return ` ${value} responses (${percentage}%)`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: false
                    },
                    y: {
                        display: false,
                        beginAtZero: true
                    }
                }
            }
        });

        // Add click handlers to questions
        document.querySelectorAll(`#questions-list-${index} .question-item`).forEach(item => {
            item.addEventListener('click', (e) => {
                const quizIndex = parseInt(e.currentTarget.dataset.quizIndex);
                const questionId = e.currentTarget.dataset.questionId;
                this.openQuestionModal(quizIndex, questionId);
            });
        });
    }

    aggregateQuizData(quiz, numQuestions) {
        const aggregated = {};

        quiz.questions.slice(0, numQuestions).forEach(q => {
            Object.entries(q.responses).forEach(([response, count]) => {
                if (response !== 'Written Answer') {
                    aggregated[response] = (aggregated[response] || 0) + count;
                }
            });
        });

        return {
            labels: Object.keys(aggregated).slice(0, 6),
            data: Object.values(aggregated).slice(0, 6)
        };
    }

    getMostCommonResponses(quiz) {
        const responseCounts = {};

        quiz.questions.forEach(q => {
            Object.entries(q.responses).forEach(([response, count]) => {
                if (response !== 'Written Answer') {
                    responseCounts[response] = (responseCounts[response] || 0) + count;
                }
            });
        });

        return Object.entries(responseCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([response]) => response);
    }

    getQuizIcon(quizId) {
        const icons = {
            'importance_to_god': 'star',
            'does_god_love_me': 'favorite',
            'my_purpose': 'explore'
        };
        return icons[quizId] || 'quiz';
    }

    openQuestionModal(quizIndex, questionId) {
        const countryData = this.quizData[this.currentCountry];
        const quiz = countryData.quizzes[quizIndex];
        const question = quiz.questions.find(q => q.id === questionId);

        if (!question) return;

        // Store current question for chart type switching
        this.currentModalQuestion = question;

        // Update modal content
        document.getElementById('modal-question-title').textContent = question.question;
        document.getElementById('modal-question-subtitle').textContent = `${this.currentCountry} - ${quiz.quizName} - ${question.id}`;

        // Update response stats
        this.updateResponseStats(question);

        // Render modal chart
        this.renderModalChart(question);

        // Update response breakdown
        this.updateResponseBreakdown(question);

        // Show modal
        document.getElementById('question-detail-modal').style.display = 'flex';
    }

    closeQuestionModal() {
        document.getElementById('question-detail-modal').style.display = 'none';
        if (this.modalChart) {
            this.modalChart.destroy();
            this.modalChart = null;
        }
        this.currentModalQuestion = null;
        this.currentModalChartType = 'bar';

        // Reset chart type buttons
        document.querySelectorAll('.chart-toggle-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.chart === 'bar') {
                btn.classList.add('active');
            }
        });
    }

    openAllQuestionsModal(quizIndex) {
        const countryData = this.quizData[this.currentCountry];
        const quiz = countryData.quizzes[quizIndex];

        // Store for chart type switching
        this.currentModalQuestion = {
            question: `All Questions - ${quiz.quizName}`,
            responses: {},
            isAggregated: true,
            quiz: quiz
        };

        // Update modal content
        document.getElementById('modal-question-title').textContent = quiz.quizName;
        document.getElementById('modal-question-subtitle').textContent = `${this.currentCountry} - All ${quiz.questions.length} Questions Overview`;

        // Update response stats for all questions
        this.updateAllQuestionsStats(quiz);

        // Render aggregated chart
        this.renderAllQuestionsChart(quiz);

        // Show modal
        document.getElementById('question-detail-modal').style.display = 'flex';
    }

    updateAllQuestionsStats(quiz) {
        const grid = document.getElementById('response-stats-grid');

        const totalResponses = quiz.questions.reduce((sum, q) => {
            return sum + Object.values(q.responses).reduce((s, c) => s + c, 0);
        }, 0);

        const totalQuestions = quiz.questions.length;
        const avgResponsesPerQuestion = (totalResponses / totalQuestions).toFixed(0);

        // Find most common response across all questions
        const allResponses = {};
        quiz.questions.forEach(q => {
            Object.entries(q.responses).forEach(([key, value]) => {
                if (key !== 'Written Answer') {
                    allResponses[key] = (allResponses[key] || 0) + value;
                }
            });
        });

        const mostCommon = Object.entries(allResponses).sort((a, b) => b[1] - a[1])[0];

        grid.innerHTML = `
            <div class="response-stat-item">
                <div class="stat-item-label">Total Questions</div>
                <div class="stat-item-value">${totalQuestions}</div>
            </div>
            <div class="response-stat-item">
                <div class="stat-item-label">Total Responses</div>
                <div class="stat-item-value">${totalResponses.toLocaleString()}</div>
            </div>
            <div class="response-stat-item">
                <div class="stat-item-label">Avg per Question</div>
                <div class="stat-item-value">${avgResponsesPerQuestion}</div>
            </div>
            <div class="response-stat-item">
                <div class="stat-item-label">Most Common</div>
                <div class="stat-item-value">${mostCommon ? mostCommon[0] : '-'}</div>
            </div>
        `;
    }

    renderAllQuestionsChart(quiz) {
        const chartContainer = document.querySelector('.modal-chart-container');
        const canvas = document.getElementById('modal-chart');

        // Destroy existing chart
        if (this.modalChart) {
            this.modalChart.destroy();
            this.modalChart = null;
        }

        // Completely reset canvas
        const parent = canvas.parentNode;
        const newCanvas = document.createElement('canvas');
        newCanvas.id = 'modal-chart';
        parent.replaceChild(newCanvas, canvas);

        const ctx = newCanvas.getContext('2d');

        // Aggregate all responses across all questions
        const aggregatedResponses = {};
        quiz.questions.forEach(q => {
            Object.entries(q.responses).forEach(([key, value]) => {
                if (key !== 'Written Answer') {
                    aggregatedResponses[key] = (aggregatedResponses[key] || 0) + value;
                }
            });
        });

        const sortedResponses = Object.entries(aggregatedResponses)
            .sort((a, b) => b[1] - a[1]);

        const labels = sortedResponses.map(([key]) => key);
        const data = sortedResponses.map(([, value]) => value);
        const colors = this.colorPalettes[this.currentCountry];

        const chartType = this.currentModalChartType;

        this.modalChart = new Chart(ctx, {
            type: chartType,
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total Responses',
                    data: data,
                    backgroundColor: colors.palette,
                    borderWidth: 0,
                    borderRadius: chartType === 'bar' ? 8 : 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: chartType !== 'bar',
                        position: 'right',
                        labels: {
                            font: {
                                family: 'Lexend',
                                size: 12
                            },
                            padding: 16,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        padding: 12,
                        titleFont: {
                            family: 'Lexend',
                            size: 13,
                            weight: '600'
                        },
                        bodyFont: {
                            family: 'Lexend',
                            size: 12
                        },
                        callbacks: {
                            label: (context) => {
                                const value = context.parsed.y || context.parsed;
                                const total = data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return ` ${value} responses (${percentage}%)`;
                            }
                        }
                    }
                },
                scales: chartType === 'bar' ? {
                    x: {
                        grid: { display: false },
                        ticks: {
                            font: { family: 'Lexend', size: 11 }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: { family: 'Lexend', size: 11 }
                        }
                    }
                } : {}
            }
        });

        // Update breakdown table
        this.updateAllQuestionsBreakdown(sortedResponses, data);
    }

    updateAllQuestionsBreakdown(sortedResponses, data) {
        const container = document.getElementById('response-breakdown');
        const total = data.reduce((a, b) => a + b, 0);

        const rows = sortedResponses.map(([response, count]) => {
            const percentage = ((count / total) * 100).toFixed(1);
            return `
                <div class="breakdown-row">
                    <div class="breakdown-response">${response}</div>
                    <div class="breakdown-stats">
                        <div class="breakdown-bar">
                            <div class="breakdown-bar-fill" style="width: ${percentage}%"></div>
                        </div>
                        <div class="breakdown-count">${count} (${percentage}%)</div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = `
            <div class="breakdown-header">
                <h4>Response Distribution</h4>
                <p>Aggregated across all ${sortedResponses.length} response types</p>
            </div>
            ${rows}
        `;
    }

    updateResponseStats(question) {
        const grid = document.getElementById('response-stats-grid');
        const responses = question.responses;
        const total = Object.values(responses).reduce((s, c) => s + c, 0);
        const nonWritten = Object.entries(responses).filter(([key]) => key !== 'Written Answer');

        const topResponse = nonWritten.sort((a, b) => b[1] - a[1])[0];
        const writtenCount = responses['Written Answer'] || 0;

        grid.innerHTML = `
            <div class="response-stat-item">
                <div class="response-stat-label">Total Responses</div>
                <div class="response-stat-value">${total.toLocaleString()}</div>
            </div>
            <div class="response-stat-item">
                <div class="response-stat-label">Written Answers</div>
                <div class="response-stat-value">${writtenCount.toLocaleString()}</div>
            </div>
            <div class="response-stat-item">
                <div class="response-stat-label">Top Response</div>
                <div class="response-stat-value">${topResponse ? topResponse[0] : '-'}</div>
            </div>
            <div class="response-stat-item">
                <div class="response-stat-label">Top Count</div>
                <div class="response-stat-value">${topResponse ? topResponse[1].toLocaleString() : '0'}</div>
            </div>
        `;
    }

    renderModalChart(question) {
        const canvas = document.getElementById('modal-chart');

        // Destroy existing chart
        if (this.modalChart) {
            this.modalChart.destroy();
            this.modalChart = null;
        }

        // Completely reset canvas
        const parent = canvas.parentNode;
        const newCanvas = document.createElement('canvas');
        newCanvas.id = 'modal-chart';
        parent.replaceChild(newCanvas, canvas);

        const ctx = newCanvas.getContext('2d');

        const data = this.prepareModalChartData(question);
        const colors = this.colorPalettes[this.currentCountry];

        const config = {
            type: this.currentModalChartType,
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Responses',
                    data: data.values,
                    backgroundColor: colors.palette,
                    borderWidth: 0,
                    borderRadius: this.currentModalChartType === 'bar' ? 8 : 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: this.currentModalChartType !== 'bar',
                        position: 'right',
                        labels: {
                            font: { family: 'Lexend', size: 12 },
                            padding: 15,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        padding: 16,
                        titleFont: { family: 'Lexend', size: 14, weight: '600' },
                        bodyFont: { family: 'Lexend', size: 13 },
                        callbacks: {
                            label: (context) => {
                                const value = context.parsed.y || context.parsed;
                                const total = data.values.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return ` ${context.label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                },
                scales: this.currentModalChartType === 'bar' ? {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: { family: 'Lexend', size: 11 }
                        },
                        grid: { color: 'rgba(0, 0, 0, 0.05)' }
                    },
                    x: {
                        ticks: {
                            font: { family: 'Lexend', size: 11 }
                        },
                        grid: { display: false }
                    }
                } : {}
            }
        };

        this.modalChart = new Chart(ctx, config);
    }

    prepareModalChartData(question) {
        const labels = [];
        const values = [];

        Object.entries(question.responses).forEach(([response, count]) => {
            if (response !== 'Written Answer') {
                labels.push(response);
                values.push(count);
            }
        });

        return { labels, values };
    }

    changeModalChartType(chartType) {
        this.currentModalChartType = chartType;

        // Update active button
        document.querySelectorAll('.chart-toggle-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.chart === chartType) {
                btn.classList.add('active');
            }
        });

        // Re-render chart with stored question
        if (this.currentModalQuestion) {
            // Check if this is an aggregated view
            if (this.currentModalQuestion.isAggregated) {
                this.renderAllQuestionsChart(this.currentModalQuestion.quiz);
            } else {
                this.renderModalChart(this.currentModalQuestion);
            }
        }
    }

    updateResponseBreakdown(question) {
        const container = document.getElementById('response-breakdown');
        const total = Object.values(question.responses).reduce((s, c) => s + c, 0);

        const rows = Object.entries(question.responses)
            .filter(([key]) => key !== 'Written Answer')
            .sort((a, b) => b[1] - a[1])
            .map(([response, count]) => {
                const percentage = ((count / total) * 100).toFixed(1);
                return `
                    <div class="breakdown-row">
                        <div class="breakdown-label">${response}</div>
                        <div class="breakdown-bar-container">
                            <div class="breakdown-bar" style="width: ${percentage}%; background: ${this.colorPalettes[this.currentCountry].primary};"></div>
                        </div>
                        <div class="breakdown-stats">
                            <span class="breakdown-count">${count}</span>
                            <span class="breakdown-percentage">${percentage}%</span>
                        </div>
                    </div>
                `;
            }).join('');

        container.innerHTML = `
            <div class="breakdown-header">
                <h4>Response Breakdown</h4>
            </div>
            <div class="breakdown-list">
                ${rows}
            </div>
        `;
    }

    renderComparisonView() {
        const grid = document.getElementById('quiz-cards-grid');
        grid.innerHTML = '<div class="comparison-placeholder"><span class="material-symbols-outlined" style="font-size: 64px; color: #94a3b8;">compare_arrows</span><h3>Comparison View</h3><p>Compare quiz data across countries (Coming soon)</p></div>';
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.quizDashboard = new QuizAnalyticsDashboard();
    }, 100);
});
