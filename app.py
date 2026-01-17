import streamlit as st
import pandas as pd
from datetime import datetime
import json
import os

# 페이지 설정
st.set_page_config(
    page_title="가계부",
    page_icon="💰",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# CSS 스타일링
st.markdown("""
    <style>
    .main {
        padding: 0rem 1rem;
    }
    .stMetric {
        background-color: #f0f2f6;
        padding: 1rem;
        border-radius: 0.5rem;
    }
    </style>
""", unsafe_allow_html=True)

# 제목
st.title("💰 가계부")

# 카테고리 설정
CATEGORIES = {
    "🍽️ 식비": "food",
    "🚗 교통": "transport",
    "🎬 오락": "entertainment",
    "💡 공과금": "utilities",
    "🛍️ 쇼핑": "shopping",
    "💵 급여": "salary",
    "📌 기타": "other"
}

REVERSE_CATEGORIES = {v: k for k, v in CATEGORIES.items()}

# 데이터 저장소
DATA_FILE = "transactions.json"

def load_data():
    """저장된 거래 데이터 로드"""
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_data(data):
    """거래 데이터 저장"""
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def get_user_transactions(user_id, data):
    """사용자의 거래 가져오기"""
    if user_id not in data:
        data[user_id] = []
    return data[user_id]

# 세션 상태 초기화
if 'data' not in st.session_state:
    st.session_state.data = load_data()

if 'current_user' not in st.session_state:
    st.session_state.current_user = None

# 사용자 선택
col1, col2 = st.columns([3, 1])

with col1:
    user_input = st.text_input(
        "👤 사용자 ID",
        placeholder="이름 또는 닉네임 입력",
        label_visibility="collapsed"
    )

with col2:
    if st.button("확인", use_container_width=True):
        if user_input.strip():
            st.session_state.current_user = user_input.strip()
            st.success(f"✅ {user_input}님으로 로그인했습니다!")
        else:
            st.error("사용자 ID를 입력하세요.")

if st.session_state.current_user:
    st.info(f"👤 현재 사용자: **{st.session_state.current_user}**")

    # 탭 생성
    tab1, tab2 = st.tabs(["거래 추가", "거래 내역"])

    with tab1:
        st.subheader("새 거래 기록")

        with st.form("transaction_form"):
            col1, col2 = st.columns(2)

            with col1:
                date = st.date_input("📅 날짜", value=datetime.now())

            with col2:
                category = st.selectbox("카테고리", list(CATEGORIES.keys()))

            col3, col4 = st.columns(2)

            with col3:
                trans_type = st.radio("유형", ["지출", "수입"], horizontal=True)

            with col4:
                amount = st.number_input("금액 (원)", min_value=0, step=1000)

            description = st.text_input("설명 (선택사항)")

            submitted = st.form_submit_button("✅ 거래 추가", use_container_width=True)

            if submitted:
                if amount > 0:
                    user_id = st.session_state.current_user
                    transactions = get_user_transactions(user_id, st.session_state.data)

                    new_transaction = {
                        "id": int(datetime.now().timestamp() * 1000),
                        "date": str(date),
                        "category": CATEGORIES[category],
                        "type": "expense" if trans_type == "지출" else "income",
                        "amount": int(amount),
                        "description": description,
                        "created_at": datetime.now().isoformat()
                    }

                    transactions.append(new_transaction)
                    st.session_state.data[user_id] = transactions
                    save_data(st.session_state.data)

                    st.success("✅ 거래가 추가되었습니다!")
                    st.rerun()
                else:
                    st.error("금액은 0보다 커야 합니다.")

    with tab2:
        st.subheader("거래 내역")

        user_id = st.session_state.current_user
        transactions = get_user_transactions(user_id, st.session_state.data)

        # 필터
        col1, col2, col3 = st.columns(3)

        with col1:
            filter_type = st.selectbox(
                "필터",
                ["전체", "수입", "지출"],
                key="filter_select"
            )

        with col2:
            if st.button("🗑️ 모두 삭제", use_container_width=True):
                if transactions:
                    st.session_state.data[user_id] = []
                    save_data(st.session_state.data)
                    st.success("모든 거래가 삭제되었습니다.")
                    st.rerun()

        with col3:
            st.write("")  # 스페이서

        # 데이터 필터링
        filtered_transactions = transactions.copy()

        if filter_type == "수입":
            filtered_transactions = [t for t in filtered_transactions if t["type"] == "income"]
        elif filter_type == "지출":
            filtered_transactions = [t for t in filtered_transactions if t["type"] == "expense"]

        # 날짜순 정렬 (최신순)
        filtered_transactions.sort(key=lambda x: x["date"], reverse=True)

        # 통계
        total_income = sum(t["amount"] for t in transactions if t["type"] == "income")
        total_expense = sum(t["amount"] for t in transactions if t["type"] == "expense")
        balance = total_income - total_expense

        col1, col2, col3 = st.columns(3)

        with col1:
            st.metric("수입", f"{total_income:,}원", delta=None)

        with col2:
            st.metric("지출", f"{total_expense:,}원", delta=None)

        with col3:
            st.metric("잔액", f"{balance:,}원", delta=None)

        st.divider()

        # 거래 목록 표시
        if filtered_transactions:
            for idx, transaction in enumerate(filtered_transactions):
                col1, col2, col3, col4, col5 = st.columns([1, 2, 2, 2, 1])

                with col1:
                    st.write(REVERSE_CATEGORIES.get(transaction["category"], "📌"))

                with col2:
                    st.write(f"**{transaction['date']}**")
                    if transaction["description"]:
                        st.caption(transaction["description"])

                with col3:
                    st.write(transaction["category"])

                with col4:
                    amount_display = f"{'+ ' if transaction['type'] == 'income' else '- '}{transaction['amount']:,}원"
                    color = "green" if transaction['type'] == 'income' else "red"
                    st.write(f":{color}[{amount_display}]")

                with col5:
                    if st.button("🗑️", key=f"delete_{transaction['id']}", use_container_width=True):
                        transactions = [t for t in transactions if t["id"] != transaction["id"]]
                        st.session_state.data[user_id] = transactions
                        save_data(st.session_state.data)
                        st.success("거래가 삭제되었습니다.")
                        st.rerun()

                st.divider()
        else:
            st.info("📭 거래 기록이 없습니다.")

else:
    st.info("👤 위에서 사용자 ID를 입력하고 확인 버튼을 클릭하세요.")
