/**
 * Quiz Analytics Dashboard — combined Nepal + Bangladesh, new card design
 */

class QuizAnalyticsDashboard {
    constructor() {
        this.combinedQuizzes = [];
        this.init();
    }

    init() {
        this.combineData();
        this.renderCards();
        this.setupModal();
    }

    // Merge Nepal + Bangladesh quizzes by matching quizId base name
    combineData() {
        if (typeof NEPAL_QUIZ_RESULTS === 'undefined') return;

        const nepalQuizzes = NEPAL_QUIZ_RESULTS.quizzes || [];
        const banglaQuizzes = (typeof BANGLA_QUIZ_RESULTS !== 'undefined')
            ? BANGLA_QUIZ_RESULTS.quizzes || []
            : [];

        // Index Bangladesh quizzes by base quizId (strip trailing country suffix)
        const banglaMap = {};
        banglaQuizzes.forEach(q => {
            const baseId = q.quizId.replace(/_(bangla|bd|bangladesh)$/i, '');
            banglaMap[baseId] = q;
        });

        this.combinedQuizzes = nepalQuizzes.map(nq => {
            const baseId = nq.quizId.replace(/_(nepal|np)$/i, '');
            const bq = banglaMap[baseId];

            if (!bq) return { ...nq };

            // Merge question responses
            const mergedQuestions = nq.questions.map(nQuestion => {
                const bQuestion = bq.questions.find(bq => bq.id === nQuestion.id
                    || bq.question.toLowerCase() === nQuestion.question.toLowerCase());

                if (!bQuestion) return { ...nQuestion };

                const mergedResponses = { ...nQuestion.responses };
                Object.entries(bQuestion.responses).forEach(([key, val]) => {
                    mergedResponses[key] = (mergedResponses[key] || 0) + val;
                });

                return { ...nQuestion, responses: mergedResponses };
            });

            return {
                ...nq,
                quizName: nq.quizName.replace(/\s*(Quiz|Survey)?\s*-?\s*(Nepal|Bangla|Bangladesh)?$/i, '').trim(),
                questions: mergedQuestions
            };
        });
    }

    renderCards() {
        const grid = document.getElementById('quiz-cards-grid');
        if (!grid) return;
        grid.innerHTML = '';

        this.combinedQuizzes.forEach((quiz, index) => {
            grid.appendChild(this.createCard(quiz, index));
        });
    }

    // Segment colours matching reference design
    segmentColors = ['#1a2744', '#3b7dd8', '#6baee0', '#a8d4f0'];

    createCard(quiz, index) {
        const totalResponses = quiz.questions.reduce((sum, q) =>
            sum + Object.entries(q.responses)
                .filter(([k]) => k !== 'Written Answer')
                .reduce((s, [, v]) => s + v, 0), 0);

        const previewQuestions = quiz.questions.slice(0, 3);

        const card = document.createElement('div');
        card.className = 'quiz-card-new';

        card.innerHTML = `
            <div class="qcn-header">
                <p class="qcn-subject-line">Subject: <strong>${quiz.quizName}</strong></p>
                <p class="qcn-desc">${quiz.description || ''}</p>
            </div>
            <div class="qcn-meta">
                <div class="qcn-meta-item">
                    <span class="qcn-meta-num">${quiz.questions.length}</span>
                    <span class="qcn-meta-label">QUESTIONS</span>
                </div>
                <div class="qcn-meta-item">
                    <span class="qcn-meta-num">${totalResponses.toLocaleString()}</span>
                    <span class="qcn-meta-label">RESPONSES</span>
                </div>
                <div class="qcn-meta-item">
                    <span class="qcn-meta-num">2024</span>
                    <span class="qcn-meta-label">FIELD YEAR</span>
                </div>
            </div>
            <div class="qcn-questions">
                ${previewQuestions.map(q => this.renderSegmentedQuestion(q)).join('')}
            </div>
            <button class="qcn-view-btn" data-index="${index}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="4" height="18"/><rect x="10" y="8" width="4" height="13"/><rect x="17" y="13" width="4" height="8"/></svg>
                View All Questions
            </button>
        `;

        card.querySelector('.qcn-view-btn').addEventListener('click', () => this.openModal(index));
        return card;
    }

    renderSegmentedQuestion(question) {
        const entries = Object.entries(question.responses)
            .filter(([k, v]) => k !== 'Written Answer' && v > 0)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4);

        const total = entries.reduce((s, [, v]) => s + v, 0);
        if (total === 0) return '';

        const legend = entries.map(([label], i) => `
            <span class="qcn-legend-item">
                <span class="qcn-legend-dot" style="background:${this.segmentColors[i]}"></span>
                ${label}
            </span>`).join('');

        const segments = entries.map(([label, count], i) => {
            const pct = Math.round((count / total) * 100);
            if (pct === 0) return '';
            const textColor = i < 2 ? '#ffffff' : '#0f2d54';
            const showLabel = pct >= 9;
            return `<div class="qcn-seg" style="flex:${pct};background:${this.segmentColors[i]};color:${textColor}" title="${label}: ${pct}%">${showLabel ? pct + '%' : ''}</div>`;
        }).join('');

        return `
            <div class="qcn-question-row">
                <p class="qcn-question-text">${question.question}</p>
                <div class="qcn-right">
                    <div class="qcn-legend">${legend}</div>
                    <div class="qcn-seg-bar">${segments}</div>
                </div>
            </div>`;
    }

    // ── Modal ──────────────────────────────────────────────────────────────────

    setupModal() {
        const backdrop = document.getElementById('modal-backdrop');
        const closeBtn = document.getElementById('modal-close-btn');
        if (backdrop) backdrop.addEventListener('click', () => this.closeModal());
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal());
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') this.closeModal();
        });
    }

    openModal(quizIndex) {
        const quiz = this.combinedQuizzes[quizIndex];
        if (!quiz) return;

        const totalResponses = quiz.questions.reduce((sum, q) =>
            sum + Object.entries(q.responses)
                .filter(([k]) => k !== 'Written Answer')
                .reduce((s, [, v]) => s + v, 0), 0);

        document.getElementById('modal-question-title').textContent = quiz.quizName;
        document.getElementById('modal-question-desc').textContent = quiz.description || '';

        // Stats row
        const statsRow = document.getElementById('modal-stats-row');
        statsRow.innerHTML = `
            <div class="qcn-meta-item">
                <span class="qcn-meta-num">${quiz.questions.length}</span>
                <span class="qcn-meta-label">QUESTIONS</span>
            </div>
            <div class="qcn-meta-item">
                <span class="qcn-meta-num">${totalResponses.toLocaleString()}</span>
                <span class="qcn-meta-label">RESPONSES</span>
            </div>
            <div class="qcn-meta-item">
                <span class="qcn-meta-num">2024</span>
                <span class="qcn-meta-label">FIELD YEAR</span>
            </div>`;

        // All questions
        const body = document.getElementById('modal-questions-body');
        body.innerHTML = quiz.questions
            .map(q => `<div class="modal-question-block">${this.renderSegmentedQuestion(q)}</div>`)
            .join('');

        document.getElementById('question-detail-modal').style.display = 'flex';
    }

    closeModal() {
        const modal = document.getElementById('question-detail-modal');
        if (modal) modal.style.display = 'none';
    }
}

// Init when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    new QuizAnalyticsDashboard();
});
