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

// API 기본 URL
const API_URL = '/api';

// 상태 관리
let currentUser = null;
let transactions = [];
let currentFilter = 'all';

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    checkExistingUser();
});

// 기존 사용자 확인
function checkExistingUser() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        setUser(savedUser);
    }
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 사용자 설정
    document.getElementById('setUserBtn').addEventListener('click', () => {
        const userId = document.getElementById('userId').value.trim();
        if (!userId) {
            alert('사용자 ID를 입력하세요.');
            return;
        }
        setUser(userId);
    });

    // 엔터키 입력
    document.getElementById('userId').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('setUserBtn').click();
        }
    });
}

// 사용자 설정
function setUser(userId) {
    currentUser = userId;
    localStorage.setItem('currentUser', userId);

    // UI 업데이트
    document.getElementById('userDisplay').textContent = userId;
    document.querySelector('.user-input').style.display = 'none';
    document.getElementById('currentUser').style.display = 'block';
    document.getElementById('mainApp').style.display = 'block';

    // 폼 이벤트 설정
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

    // 데이터 로드 및 렌더링
    setToday();
    loadTransactions();
}

// 오늘 날짜 설정
function setToday() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
}

// 거래 로드
async function loadTransactions() {
    try {
        const response = await fetch(`${API_URL}/transactions/${currentUser}`);
        const result = await response.json();

        if (result.success) {
            transactions = result.data;
            render();
        }
    } catch (error) {
        console.error('거래 로드 실패:', error);
        showError('거래를 불러올 수 없습니다.');
    }
}

// 거래 추가
async function handleAddTransaction(e) {
    e.preventDefault();

    const transaction = {
        date: document.getElementById('date').value,
        category: document.getElementById('category').value,
        type: document.querySelector('input[name="type"]:checked').value,
        amount: parseInt(document.getElementById('amount').value),
        description: document.getElementById('description').value
    };

    try {
        const response = await fetch(`${API_URL}/transactions/${currentUser}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transaction)
        });

        const result = await response.json();

        if (result.success) {
            transactions.push(result.data);
            render();
            document.getElementById('transactionForm').reset();
            setToday();
            showSuccess('거래가 추가되었습니다.');
        } else {
            showError(result.message || '거래 추가에 실패했습니다.');
        }
    } catch (error) {
        console.error('거래 추가 실패:', error);
        showError('거래를 추가할 수 없습니다.');
    }
}

// 거래 삭제
async function handleDeleteTransaction(id) {
    try {
        const response = await fetch(`${API_URL}/transactions/${currentUser}/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            transactions = transactions.filter(t => t.id !== id);
            render();
            showSuccess('거래가 삭제되었습니다.');
        }
    } catch (error) {
        console.error('거래 삭제 실패:', error);
        showError('거래를 삭제할 수 없습니다.');
    }
}

// 모두 삭제
async function handleClearAll() {
    if (transactions.length === 0) {
        alert('삭제할 거래가 없습니다.');
        return;
    }

    if (!confirm('정말 모든 거래 기록을 삭제하시겠습니까?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/transactions/${currentUser}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            transactions = [];
            render();
            showSuccess('모든 거래가 삭제되었습니다.');
        }
    } catch (error) {
        console.error('전체 삭제 실패:', error);
        showError('거래를 삭제할 수 없습니다.');
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

// 알림 함수
function showSuccess(message) {
    console.log('✅', message);
}

function showError(message) {
    alert('❌ ' + message);
}
