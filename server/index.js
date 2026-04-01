const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(cors());
app.use(express.json());

// 메모리 데이터베이스 (재시작 시 초기화됨)
const users = {};

// 사용자별 거래 데이터 저장
function getUserTransactions(userId) {
    if (!users[userId]) {
        users[userId] = {
            transactions: []
        };
    }
    return users[userId].transactions;
}

// API 엔드포인트

// 1. 거래 목록 조회
app.get('/api/transactions/:userId', (req, res) => {
    const { userId } = req.params;
    const transactions = getUserTransactions(userId);
    res.json({ success: true, data: transactions });
});

// 2. 거래 추가
app.post('/api/transactions/:userId', (req, res) => {
    const { userId } = req.params;
    const { date, category, type, amount, description } = req.body;

    if (!date || !category || !type || amount === undefined) {
        return res.status(400).json({ success: false, message: '필수 필드가 없습니다.' });
    }

    const transaction = {
        id: Date.now(),
        date,
        category,
        type,
        amount,
        description: description || '',
        createdAt: new Date().toISOString()
    };

    const transactions = getUserTransactions(userId);
    transactions.push(transaction);

    res.json({ success: true, data: transaction, message: '거래가 추가되었습니다.' });
});

// 3. 거래 삭제
app.delete('/api/transactions/:userId/:id', (req, res) => {
    const { userId, id } = req.params;
    const transactions = getUserTransactions(userId);

    const index = transactions.findIndex(t => t.id === parseInt(id));
    if (index === -1) {
        return res.status(404).json({ success: false, message: '거래를 찾을 수 없습니다.' });
    }

    const deleted = transactions.splice(index, 1);
    res.json({ success: true, data: deleted[0], message: '거래가 삭제되었습니다.' });
});

// 4. 모든 거래 삭제
app.delete('/api/transactions/:userId', (req, res) => {
    const { userId } = req.params;
    if (users[userId]) {
        users[userId].transactions = [];
    }
    res.json({ success: true, message: '모든 거래가 삭제되었습니다.' });
});

// 정적 파일 제공 (프론트엔드)
app.use(express.static(path.join(__dirname, '../public')));

// 루트 경로
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 404 처리
app.use((req, res) => {
    res.status(404).json({ success: false, message: '요청한 경로를 찾을 수 없습니다.' });
});

app.listen(PORT, () => {
    console.log(`✅ 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
