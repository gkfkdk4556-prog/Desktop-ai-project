# Streamlit Cloud 배포 가이드

## 로컬에서 테스트

### 1. 설치
```bash
pip install -r requirements.txt
```

### 2. 실행
```bash
streamlit run app.py
```

브라우저에서 `http://localhost:8501` 로 자동 열림

---

## Streamlit Cloud에 배포

### 사전 요구사항
- [GitHub 계정](https://github.com)
- [Streamlit Community Cloud 계정](https://share.streamlit.io) (GitHub 로그인으로 가입)

### 배포 단계

#### 1️⃣ GitHub에 업로드

```bash
git add .
git commit -m "Add Streamlit app"
git push origin relaxed-banach
```

#### 2️⃣ Streamlit Cloud 연결

1. [Streamlit Community Cloud](https://share.streamlit.io) 접속
2. 우측 상단 "New app" 클릭
3. 다음 정보 입력:
   - **Repository:** `사용자명/저장소명` (예: `myuser/relaxed-banach`)
   - **Branch:** `relaxed-banach` 또는 `main`
   - **Main file path:** `app.py`

#### 3️⃣ Deploy

"Deploy" 버튼 클릭하면 자동 배포 시작

배포 완료 후 `https://[your-app-name].streamlit.app` 형식의 URL 제공

---

## 주요 특징

✅ **다중 사용자 지원** - 각자 다른 ID로 거래 관리
✅ **JSON 기반 저장** - 별도 DB 없이 파일 저장
✅ **실시간 업데이트** - 변경사항 즉시 반영
✅ **반응형 UI** - 모바일 지원
✅ **배포 무료** - Streamlit Community Cloud 무료 이용

---

## 데이터 저장

- **로컬:** `transactions.json` 파일로 저장
- **배포 후:** Streamlit Cloud 서버의 파일 시스템에 저장
- **주의:** 앱 재배포 시 데이터가 초기화될 수 있음

### 영구 저장이 필요한 경우

1. **Supabase** (PostgreSQL 기반)
   ```python
   import supabase
   # Supabase 연동 코드
   ```

2. **Firebase Realtime Database**
   ```python
   import firebase_admin
   # Firebase 연동 코드
   ```

---

## 배포 후 문제 해결

### 1. 앱이 안 열림
- Streamlit Cloud 대시보드에서 로그 확인
- `requirements.txt` 패키지 확인

### 2. 데이터가 저장 안 됨
- Streamlit 앱은 재실행할 때마다 파일 초기화될 수 있음
- 외부 데이터베이스 연동 필요

### 3. 성능이 느림
- Streamlit Community Cloud는 무료 티어 한정
- 유료 플랜 업그레이드 고려

---

## 다음 단계

1. **데이터베이스 연동**
   - Supabase로 업그레이드
   - 영구 데이터 저장

2. **고급 기능**
   - 📊 차트/그래프 추가
   - 📥 CSV 내보내기
   - 🔐 암호 기반 로그인

3. **성능 최적화**
   - Streamlit 캐싱 활용
   - 데이터 필터링 최적화

---

## 주요 명령어

```bash
# 로컬 실행
streamlit run app.py

# 포트 변경
streamlit run app.py --server.port 8502

# 배포 (GitHub에 push 후)
# Streamlit Cloud에서 "Redeploy" 클릭

# 로그 확인
streamlit run app.py --logger.level=debug
```

---

## 비용

- **Streamlit Community Cloud:** 무료
- **Supabase:** 무료 티어 5MB 저장소
- **Firebase:** 무료 티어 있음

총 비용: **완전 무료** ✅
