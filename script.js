// 카테고리 이모지 맵
const categoryEmojis = {
    food: '🍽️',
    transport: '🚗',
    entertainment: '🎬',
    utilities: '💡',
    shopping: '🛍️',
    salary: '💵',
    other: '📌'
};

const categoryNames = {
    food: '식비',
    transport: '교통',
    entertainment: '오락',
    utilities: '공과금',
    shopping: '쇼핑',
    salary: '급여',
    other: '기타'
};

// 상태 관리
let transactions = [];
let currentFilter = 'all';

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    loadTransactions();
    setToday();
    setupEventListeners();
    render();
});

// 오늘 날짜 설정
function setToday() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 폼 제출
    document.getElementById('transactionForm').addEventListener('submit', handleAddTransaction);

    // 필터 버튼
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            render();
        });
    });

    // 모두 삭제 버튼
    document.querySelector('.btn-clear').addEventListener('click', handleClearAll);
}

// 거래 추가
function handleAddTransaction(e) {
    e.preventDefault();

    const transaction = {
        id: Date.now(),
        date: document.getElementById('date').value,
        category: document.getElementById('category').value,
        type: document.querySelector('input[name="type"]:checked').value,
        amount: parseInt(document.getElementById('amount').value),
        description: document.getElementById('description').value
    };

    transactions.push(transaction);
    saveTransactions();
    render();

    // 폼 리셋
    document.getElementById('transactionForm').reset();
    setToday();
}

// 거래 삭제
function handleDeleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveTransactions();
    render();
}

// 모두 삭제
function handleClearAll() {
    if (transactions.length === 0) {
        alert('삭제할 거래가 없습니다.');
        return;
    }

    if (confirm('정말 모든 거래 기록을 삭제하시겠습니까?')) {
        transactions = [];
        saveTransactions();
        render();
    }
}

// 화면 렌더링
function render() {
    updateSummary();
    renderTransactionList();
}

// 요약 업데이트
function updateSummary() {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(t => {
        if (t.type === 'income') {
            totalIncome += t.amount;
        } else {
            totalExpense += t.amount;
        }
    });

    const balance = totalIncome - totalExpense;

    document.getElementById('totalIncome').textContent = formatCurrency(totalIncome);
    document.getElementById('totalExpense').textContent = formatCurrency(totalExpense);
    document.getElementById('totalBalance').textContent = formatCurrency(balance);
}

// 거래 목록 렌더링
function renderTransactionList() {
    const listElement = document.getElementById('transactionList');

    // 필터링
    let filtered = transactions;
    if (currentFilter !== 'all') {
        filtered = transactions.filter(t => t.type === currentFilter);
    }

    // 날짜순 정렬 (최신순)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (filtered.length === 0) {
        listElement.innerHTML = '<div class="empty-message">거래 기록이 없습니다.</div>';
        return;
    }

    listElement.innerHTML = filtered.map(t => `
        <li class="transaction-item">
            <div class="transaction-info">
                <div class="transaction-header">
                    <span class="transaction-category">
                        ${categoryEmojis[t.category]} ${categoryNames[t.category]}
                    </span>
                    <span class="transaction-date">${formatDate(t.date)}</span>
                </div>
                ${t.description ? `<div class="transaction-description">${t.description}</div>` : ''}
            </div>
            <span class="transaction-amount ${t.type}">
                ${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}
            </span>
            <button class="btn-delete" onclick="handleDeleteTransaction(${t.id})">삭제</button>
        </li>
    `).join('');
}

// 유틸리티 함수
function formatCurrency(amount) {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
}

function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return new Intl.DateTimeFormat('ko-KR', {
        month: 'short',
        day: 'numeric',
        weekday: 'short'
    }).format(date);
}

// 로컬 스토리지
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function loadTransactions() {
    const saved = localStorage.getItem('transactions');
    transactions = saved ? JSON.parse(saved) : [];
}
