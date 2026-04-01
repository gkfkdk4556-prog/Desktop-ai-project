# 가계부 앱 배포 가이드

## 로컬 실행 (개발)

### 1. 서버 실행
```bash
cd server
npm install
npm start
```

서버가 `http://localhost:3000` 에서 실행됩니다.

### 2. 앱 접속
브라우저에서 `http://localhost:3000` 으로 접속합니다.

---

## Vercel에 배포 (온라인 공유)

### 사전 요구사항
- [Vercel 계정](https://vercel.com) (GitHub으로 가입 가능)
- GitHub 저장소 (코드 업로드용)

### 배포 단계

#### 1. GitHub에 업로드
```bash
git add .
git commit -m "Initial commit"
git push origin relaxed-banach
```

#### 2. Vercel 연결
1. [Vercel 대시보드](https://vercel.com/dashboard) 접속
2. "Add New Project" 클릭
3. GitHub 저장소 선택
4. 다음 설정 입력:
   - **Root Directory:** (기본값 사용)
   - **Framework Preset:** Node.js
   - **Build Command:** `npm run build` (또는 비워두기)
   - **Output Directory:** `public`

#### 3. 배포
"Deploy" 버튼 클릭하면 자동 배포됩니다.

배포 완료 후 제공되는 URL을 다른 사람과 공유하세요!

---

## 주요 특징

✅ **다중 사용자 지원** - 사용자 ID별로 별도의 데이터 저장
✅ **실시간 동기화** - 서버에서 모든 거래 관리
✅ **반응형 디자인** - 모바일, 태블릿, PC 모두 지원
✅ **카테고리 분류** - 7가지 카테고리로 분류
✅ **통계** - 수입/지출/잔액 자동 계산

---

## API 엔드포인트

### GET `/api/transactions/:userId`
사용자의 모든 거래 조회

### POST `/api/transactions/:userId`
새 거래 추가

**Body:**
```json
{
  "date": "2024-01-17",
  "category": "food",
  "type": "expense",
  "amount": 15000,
  "description": "점심식사"
}
```

### DELETE `/api/transactions/:userId/:id`
특정 거래 삭제

### DELETE `/api/transactions/:userId`
사용자의 모든 거래 삭제

---

## 데이터 저장 주의사항

현재 버전:
- 메모리에만 저장 (서버 재시작 시 초기화)

영구 저장이 필요한 경우:
- MongoDB 추가 필요
- 또는 Firebase 연동

---

## 트러블슈팅

### 서버가 안 시작됨
```bash
# PORT 확인
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows
```

### CORS 에러
- 프론트엔드와 백엔드 URL이 일치하는지 확인
- CORS 설정 확인 (server/index.js)

---

## 다음 단계 (선택사항)

1. **데이터베이스 연결** - MongoDB/Firebase로 영구 저장
2. **인증 시스템** - 비밀번호 기반 로그인
3. **차트 기능** - 지출 통계 시각화
4. **내보내기** - CSV/Excel 다운로드
