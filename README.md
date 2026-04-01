# 💰 공유 가계부 앱

다른 사람과 함께 가계부를 관리할 수 있는 간단한 웹 앱입니다.

## 🚀 빠른 시작

### 로컬 실행

```bash
# 1. 패키지 설치
pip install -r requirements.txt

# 2. 앱 실행
streamlit run app.py
```

브라우저에서 `http://localhost:8501` 이 자동으로 열립니다.

### 온라인 사용 (무료)

👉 [가계부 앱 바로가기](https://your-app-name.streamlit.app)

*(배포 후 URL로 변경됨)*

---

## ✨ 주요 기능

- 👤 **다중 사용자** - 각자 ID로 로그인해 거래 관리
- 💸 **거래 기록** - 수입/지출 추가 및 관리
- 📊 **통계** - 수입, 지출, 잔액 자동 계산
- 🏷️ **카테고리** - 7가지 카테고리로 분류
  - 🍽️ 식비
  - 🚗 교통
  - 🎬 오락
  - 💡 공과금
  - 🛍️ 쇼핑
  - 💵 급여
  - 📌 기타
- 🗑️ **삭제** - 거래 개별/전체 삭제 가능
- 📱 **반응형** - 모바일, 태블릿, PC 모두 지원

---

## 📦 구조

```
.
├── app.py                      # Streamlit 메인 앱
├── requirements.txt            # Python 의존성
├── STREAMLIT_DEPLOYMENT.md     # Streamlit Cloud 배포 가이드
├── DEPLOYMENT.md               # Node.js 배포 가이드 (참고용)
└── README.md                   # 이 파일
```

---

## 🌐 배포

### Streamlit Cloud에 배포 (권장)

**Step 1: GitHub에 업로드**
```bash
git add .
git commit -m "Add Streamlit app"
git push origin main
```

**Step 2: Streamlit Cloud 연결**
1. https://share.streamlit.io 접속
2. "New app" 클릭
3. GitHub 저장소 선택
4. `app.py` 지정

**Step 3: Deploy**
- "Deploy" 클릭
- 2-3분 후 URL 제공됨

### Vercel에 배포 (Node.js 버전)

- `DEPLOYMENT.md` 파일 참고

---

## 💾 데이터 저장

- **로컬:** `transactions.json` 파일
- **배포:** Streamlit Cloud 서버 (재배포 시 초기화될 수 있음)

### 영구 저장이 필요한 경우

아래 옵션 중 하나 선택:

1. **Supabase** (PostgreSQL 기반)
   ```bash
   pip install supabase
   ```

2. **Firebase Realtime Database**
   ```bash
   pip install firebase-admin
   ```

3. **Google Sheets API**
   ```bash
   pip install gspread oauth2client
   ```

---

## 📝 사용 방법

1. **사용자 ID 입력**
   - 상단에 이름이나 닉네임 입력
   - "확인" 버튼 클릭

2. **거래 추가**
   - "거래 추가" 탭에서 정보 입력
   - 날짜, 카테고리, 유형(수입/지출), 금액 필수
   - 설명은 선택사항
   - "거래 추가" 버튼 클릭

3. **거래 확인**
   - "거래 내역" 탭에서 전체 내역 확인
   - 필터로 수입/지출만 필터링 가능
   - 각 거래 옆 "🗑️" 버튼으로 삭제

4. **데이터 초기화**
   - "모두 삭제" 버튼으로 전체 거래 삭제

---

## 🔧 기술 스택

- **Frontend:** Streamlit (Python)
- **Backend:** Streamlit (Python)
- **Storage:** JSON 파일 (로컬) / Streamlit Cloud (배포)
- **Hosting:** Streamlit Community Cloud (무료)

---

## 📋 요구사항

- Python 3.8+
- Streamlit 1.28.1
- Pandas 2.1.3

---

## 🚀 다음 단계

- [ ] 데이터베이스 연동 (Supabase/Firebase)
- [ ] 차트/그래프 추가
- [ ] CSV 내보내기
- [ ] 암호 기반 로그인
- [ ] 카카오톡 공유 기능

---

## 📄 라이선스

MIT

---

## 💬 피드백

문제가 있거나 제안이 있으면 GitHub Issues에 등록해주세요.

---

**Enjoy your budget tracking! 💰**
