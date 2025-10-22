/**
 * 멍이 진단소 - 증상 진단 로직 (diagnosis.html 전용)
 * 질문 단계 관리 및 결과 도출을 담당합니다.
 */

// 1. 진단 질문 정의 (키: 질문 ID)
const diagnosisQuestions = {
    Q1: {
        question: "강아지의 주된 증상은 무엇인가요?",
        options: [
            { text: "구토", next: "Q1_VOMIT", key: "vomit" },
            { text: "기침", next: "Q1_COUGH", key: "cough" },
            { text: "설사", next: "Q1_DIARRHEA", key: "diarrhea" },
            { text: "식욕 부진", next: "Q1_APPETITE", key: "appetite" }
        ]
    },
    Q1_VOMIT: {
        question: "구토 횟수와 양상은 어떤가요?",
        options: [
            { text: "단발성, 소량의 거품/액체", next: "Q2_VOMIT_MINOR", score: 1 },
            { text: "하루 3회 이상, 음식물 포함, 기력 양호", next: "Q2_VOMIT_MODERATE", score: 2 },
            { text: "하루 종일 반복, 물만 마셔도 구토, 혈액 또는 커피색", next: "Q2_VOMIT_SEVERE", score: 4 }
        ]
    },
    Q2_VOMIT_MINOR: {
        question: "다른 이상 증상이 있나요? (예: 설사, 기침, 발열)",
        options: [
            { text: "아니요, 구토 외엔 모두 정상", next: "RESULT_MINOR", score: 0 },
            { text: "설사를 같이 해요", next: "RESULT_MODERATE", score: 2 }
        ]
    },
    Q2_VOMIT_SEVERE: {
        question: "현재 강아지의 기력은 어떤가요?",
        options: [
            { text: "축 처져 있고 움직임이 거의 없어요.", next: "RESULT_SEVERE", score: 5 },
            { text: "힘은 없지만 움직일 수는 있어요.", next: "RESULT_MODERATE", score: 3 }
        ]
    },
    // Q1_COUGH, Q1_DIARRHEA 등 추가 질문 단계 정의...
};

// 2. 진단 결과 정의 (score를 기준으로 매칭)
const diagnosisResults = [
    { scoreRange: [0, 1], diseases: [{ name: "단순 소화 불량", key: "indigestion", probability: "낮음" }] },
    { scoreRange: [2, 3], diseases: [
        { name: "위장염 (경증~중증)", key: "gastritis", probability: "중간" },
        { name: "식도염", key: "esophagitis", probability: "낮음" }
    ] },
    { scoreRange: [4, 6], diseases: [
        { name: "강아지 파보 바이러스", key: "parvo", probability: "높음" },
        { name: "췌장염", key: "pancreatitis", probability: "높음" },
        { name: "이물질 섭취", key: "foreign_body", probability: "중간" }
    ] },
    // 기타 결과 추가...
];

let currentQuestionKey = "Q1";
let totalScore = 0;
let selectedOption = null;

// DOM 요소 캐시
const currentQuestionEl = document.getElementById('current-question');
const answerOptionsEl = document.getElementById('answer-options');
const nextButton = document.getElementById('next-button');
const diagnosisForm = document.getElementById('diagnosis-form');
const diagnosisResult = document.getElementById('diagnosis-result');
const diseaseListEl = document.getElementById('disease-list');


/**
 * @function loadQuestion
 * 현재 질문 키에 해당하는 질문과 옵션을 화면에 렌더링
 * @param {string} key - diagnosisQuestions의 키
 */
function loadQuestion(key) {
    const qData = diagnosisQuestions[key];

    if (!qData) {
        // 더 이상 질문이 없으면 결과 페이지로 이동
        showResult();
        return;
    }

    currentQuestionKey = key;
    selectedOption = null; // 옵션 초기화
    nextButton.disabled = true; // 버튼 비활성화

    currentQuestionEl.textContent = qData.question;
    answerOptionsEl.innerHTML = ''; // 옵션 영역 초기화

    qData.options.forEach((option, index) => {
        const optionEl = document.createElement('div');
        optionEl.classList.add('answer-option');
        optionEl.textContent = option.text;
        optionEl.dataset.index = index; // 인덱스 저장 (선택된 옵션 추적용)
        optionEl.addEventListener('click', () => selectOption(optionEl, index));
        answerOptionsEl.appendChild(optionEl);
    });
}

/**
 * @function selectOption
 * 답변 옵션을 선택했을 때 실행
 * @param {HTMLElement} element - 선택된 옵션 요소
 * @param {number} index - 선택된 옵션의 인덱스
 */
function selectOption(element, index) {
    // 모든 옵션에서 'selected' 클래스 제거
    document.querySelectorAll('.answer-option').forEach(el => el.classList.remove('selected'));

    // 현재 선택된 옵션에 'selected' 클래스 추가
    element.classList.add('selected');

    // 선택된 옵션 데이터 저장
    selectedOption = diagnosisQuestions[currentQuestionKey].options[index];

    // 다음 버튼 활성화
    nextButton.disabled = false;
}

/**
 * @function goToNextQuestion
 * '다음 단계' 버튼 클릭 시 실행
 */
function goToNextQuestion() {
    if (!selectedOption) return;

    // 1. 점수 누적 (score가 있을 경우)
    if (selectedOption.score !== undefined) {
        totalScore += selectedOption.score;
    }

    // 2. 다음 질문 로드 또는 결과 페이지로 이동
    const nextKey = selectedOption.next;
    if (diagnosisQuestions[nextKey] || nextKey.startsWith('Q')) {
        loadQuestion(nextKey);
    } else if (nextKey.startsWith('RESULT')) {
        showResult();
    } else {
        // 예상치 못한 종료 (일반적으로 발생 X)
        showResult();
    }
}

/**
 * @function showResult
 * 최종 진단 결과를 화면에 표시
 */
function showResult() {
    diagnosisForm.style.display = 'none';
    diagnosisResult.style.display = 'block';

    // 누적 점수에 따라 결과 필터링
    const finalResults = diagnosisResults.filter(r =>
        totalScore >= r.scoreRange[0] && totalScore <= r.scoreRange[1]
    );

    diseaseListEl.innerHTML = '';

    if (finalResults.length > 0) {
        // 해당 점수 범위의 질병들을 목록에 표시
        finalResults[0].diseases.forEach(disease => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${disease.name}</strong> (${disease.probability} 가능성)
                <br>
                <a href="disease-detail.html?disease=${disease.key}">상세 정보 보기</a>
            `;
            diseaseListEl.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = "현재 선택된 증상으로는 명확한 예상 질병을 도출하기 어렵습니다. 추가 증상 정보를 입력하거나, 즉시 병원을 방문해 주세요.";
        diseaseListEl.appendChild(li);
    }
}


// ====================================
// 초기화
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    // '다음 단계' 버튼 이벤트 리스너
    nextButton.addEventListener('click', goToNextQuestion);

    // 쿼리 파라미터 (index.html에서 특정 증상 아이콘 클릭 시) 처리
    const urlParams = new URLSearchParams(window.location.search);
    const initialSymptom = urlParams.get('symptom');

    if (initialSymptom) {
        // 초기 증상 선택 로직 (예: vomit -> Q1_VOMIT으로 바로 이동)
        const initialOption = diagnosisQuestions.Q1.options.find(opt => opt.key === initialSymptom);
        if (initialOption) {
            // Q1_VOMIT 등으로 바로 이동 (Q1은 건너뛰고)
            loadQuestion(initialOption.next);
            // Q1의 점수를 누적하지 않으므로 totalScore는 0
        } else {
            loadQuestion("Q1"); // 찾을 수 없으면 Q1부터 시작
        }
    } else {
        loadQuestion("Q1"); // Q1부터 진단 시작
    }
});