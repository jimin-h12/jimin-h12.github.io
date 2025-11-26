// ==========================================
// [데이터] 질병 및 증상 데이터베이스 (PDF 기반)
// ==========================================
const DISEASE_DATABASE = {
    skin: [
        { name: "진균 감염 (곰팡이)", symptoms: ["탈모", "비듬/각질", "가려움증", "원형 발진"], description: "원형 탈모와 비듬이 특징이며 면역력이 약한 강아지에게 주로 발생합니다.", emergency: false },
        { name: "세균성 피부염", symptoms: ["가려움증", "누런 분비물", "농포", "피부 변색"], description: "피부를 심하게 긁거나 핥으며 끈적한 분비물이 나옵니다.", emergency: false },
        { name: "흑색종", symptoms: ["검은 점", "발톱 변색", "입안 검은 종괴", "붓기"], description: "피부나 입안에 검은 종괴가 생기면 즉시 조직 검사가 필요합니다.", emergency: true },
        { name: "피부농피증", symptoms: ["고름", "악취", "붉은 발진", "진물"], description: "세균 감염으로 고름과 악취가 납니다.", emergency: false }
    ],
    respiratory: [
        { name: "기관지염", symptoms: ["마른 기침", "거품 소리", "쌕쌕거림"], description: "2달 이상 기침이 지속된다면 만성 기관지염을 의심해야 합니다.", emergency: false },
        { name: "기관 허탈", symptoms: ["거위 울음 소리", "호흡 곤란", "운동 후 지침", "청색증"], description: "흥분했을 때 '꽥꽥' 거리는 거위 소리를 냅니다.", emergency: true },
        { name: "폐렴", symptoms: ["발열", "누런 콧물", "가래", "거친 숨소리"], description: "고열과 호흡 곤란이 동반되면 응급 상황입니다.", emergency: true }
    ],
    digestive: [
        { name: "급성 위장염", symptoms: ["구토", "설사", "식욕 저하", "복부 통증"], description: "갑작스러운 구토와 설사는 위장염일 가능성이 높습니다.", emergency: false },
        { name: "파보바이러스", symptoms: ["혈변", "비린내 나는 설사", "심한 구토", "탈수"], description: "치사율이 높은 전염병입니다. 즉시 병원으로 가세요.", emergency: true },
        { name: "췌장염", symptoms: ["반복 구토", "기도하는 자세(복통)", "설사", "식욕 부진"], description: "기름진 음식 섭취 후 주로 발생하며 극심한 복통을 유발합니다.", emergency: true }
    ],
    heart: [
        { name: "심부전", symptoms: ["마른 기침", "운동 기피", "청색증", "기절"], description: "심장 기능 저하로 혈액 순환이 잘 되지 않습니다.", emergency: true }
    ],
    musculoskeletal: [
        { name: "슬개골 탈구", symptoms: ["다리 절음", "뚝뚝 소리", "다리 들고 다님", "뒷다리 통증"], description: "소형견에게 흔하며 무릎 뼈가 빠지는 질환입니다.", emergency: false },
        { name: "디스크", symptoms: ["허리 통증", "마비", "보행 이상", "만지는 것 거부"], description: "등이나 목을 만지면 비명을 지르거나 움직이지 않으려 합니다.", emergency: true }
    ],
    urinary: [
        { name: "방광염", symptoms: ["혈뇨", "빈뇨", "배뇨 실수", "배뇨 통증"], description: "소변을 자주 찔끔거리거나 피가 섞여 나옵니다.", emergency: false },
        { name: "신부전", symptoms: ["다음다뇨", "구토", "체중 감소", "암모니아 냄새"], description: "신장 기능 저하로 독소가 배출되지 않습니다.", emergency: true }
    ],
    eye: [
        { name: "백내장", symptoms: ["눈동자 혼탁", "시력 저하", "눈 비빔"], description: "눈동자가 하얗게 변하고 여기저기 부딪힙니다.", emergency: false },
        { name: "녹내장", symptoms: ["충혈", "눈 통증", "동공 확장"], description: "안압 상승으로 인한 심한 통증이 있으며 실명 위험이 있습니다.", emergency: true }
    ],
    nervous: [
       { name: "뇌염/뇌수막염", symptoms: ["발작/경련", "마비", "목이 뻣뻣함", "고열"], description: "발작과 고열이 동반되면 신경계 질환을 의심해야 합니다.", emergency: true }
    ]
};

const CATEGORIES = [
    { id: 'respiratory', name: '호흡기', color: 'bg-blue-100 text-blue-600 border-blue-200' },
    { id: 'digestive', name: '소화기', color: 'bg-red-100 text-red-600 border-red-200' },
    { id: 'skin', name: '피부', color: 'bg-orange-100 text-orange-600 border-orange-200' },
    { id: 'heart', name: '심혈관', color: 'bg-pink-100 text-pink-600 border-pink-200' },
    { id: 'musculoskeletal', name: '근골격계', color: 'bg-purple-100 text-purple-600 border-purple-200' },
    { id: 'urinary', name: '비뇨기계', color: 'bg-yellow-100 text-yellow-600 border-yellow-200' },
    { id: 'eye', name: '안과', color: 'bg-green-100 text-green-600 border-green-200' },
    { id: 'nervous', name: '신경계', color: 'bg-gray-100 text-gray-600 border-gray-200' },
];

// 9단계 설문 질문
const QUESTIONS = [
    { id: 1, type: 'chips', question: "가장 걱정되는 증상 부위는 어디인가요?", subText: "가장 눈에 띄는 부위를 선택해주세요.", options: ["피부/털", "기침/호흡", "구토/설사(배변)", "걷기/다리", "소변/배뇨", "눈/귀"] },
    { id: 2, type: 'chips', question: "피부에 눈에 띄는 변화가 있나요?", subText: "해당하는 것을 모두 골라주세요.", options: ["없음", "가려움/긁음", "털 빠짐(탈모)", "붉은 발진", "비듬/각질", "고름/진물", "검은 점/혹"] },
    { id: 3, type: 'chips', question: "호흡이나 기침 증상은 어떤가요?", subText: "소리를 잘 들어보세요.", options: ["정상", "마른 기침(켁켁)", "거위 울음 소리(꽥꽥)", "가래 소리(걸걸)", "콧물", "쌕쌕거림"] },
    { id: 4, type: 'chips', question: "소화기(구토/대변) 상태는 어떤가요?", subText: "최근 2-3일 내의 상태를 체크해주세요.", options: ["정상", "구토함", "설사함", "혈변(피 섞임)", "식욕 없음", "배가 빵빵함"] },
    { id: 5, type: 'chips', question: "걷는 모습이나 행동에 변화가 있나요?", subText: "산책할 때나 집에서의 움직임을 관찰해주세요.", options: ["정상", "다리를 절뚝거림", "다리를 들고 다님", "잘 안 움직이려 함", "만지면 아파함", "허리가 굽음"] },
    { id: 6, type: 'slider', question: "아이가 통증을 느끼는 것 같나요?", subText: "1점(편안함) ~ 10점(매우 고통스러워함)", min: 1, max: 10, labels: ["편안함", "약간 불편", "매우 아픔"] },
    { id: 7, type: 'yesno', question: "소변(오줌) 색깔이 붉거나 평소와 다른가요?", subText: "혈뇨는 비뇨기 질환의 중요한 신호입니다." },
    { id: 8, type: 'yesno', question: "체온이 뜨겁거나 열이 나나요?", subText: "귀나 발바닥을 만져보았을 때 평소보다 뜨거운지 확인해주세요." },
    { id: 9, type: 'chips', question: "증상이 얼마나 지속되었나요?", subText: "증상이 시작된 시점을 알려주세요.", options: ["오늘 갑자기", "2~3일 정도", "일주일 이상", "한 달 이상"] }
];

// ==========================================
// [로직] 전역 변수 및 초기화
// ==========================================
let currentStep = 0;
let userAnswers = {};
let activeInfoCategory = 'respiratory';

// DOM이 로드되면 아이콘을 생성하고 초기화
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons(); // 아이콘 렌더링
    renderCategories();   // 건강정보 카테고리 렌더링
    showPage('home');     // 첫 화면은 홈
});

// ==========================================
// [기능 1] 페이지 이동 (네비게이션)
// ==========================================
function showPage(pageId) {
    // 모든 페이지 숨기기
    document.querySelectorAll('.page-section').forEach(el => el.classList.add('hidden'));

    // 선택한 페이지 보여주기
    const target = document.getElementById(`page-${pageId}`);
    if(target) target.classList.remove('hidden');

    // 스크롤 맨 위로
    window.scrollTo(0, 0);

    // 페이지별 추가 작업
    if(pageId === 'info') renderDiseaseList();
    if(pageId === 'map') {
        setTimeout(() => initKakaoMap(), 100); // 지도 초기화
    }

    // 아이콘 다시 렌더링
    setTimeout(() => lucide.createIcons(), 50);
}

// ==========================================
// [기능 2] 건강 정보 페이지 로직
// ==========================================
function renderCategories() {
    const container = document.getElementById('category-container');
    container.innerHTML = CATEGORIES.map(cat => `
        <button onclick="changeCategory('${cat.id}')"
            class="px-4 py-2 rounded-full text-sm font-bold border transition-all ${activeInfoCategory === cat.id ? `${cat.color} shadow-md scale-105` : 'bg-white text-gray-500 border-gray-200'}">
            ${cat.name}
        </button>
    `).join('');
}

function changeCategory(id) {
    activeInfoCategory = id;
    renderCategories();
    renderDiseaseList();
}

function renderDiseaseList() {
    const listContainer = document.getElementById('disease-list');
    const diseases = DISEASE_DATABASE[activeInfoCategory];

    if (!diseases) {
        listContainer.innerHTML = '<div class="text-center py-10 text-gray-400">데이터 준비 중</div>';
        return;
    }

    listContainer.innerHTML = diseases.map(d => `
        <div class="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
            <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-bold text-gray-800">${d.name}</h3>
                ${d.emergency ? '<span class="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold">응급</span>' : ''}
            </div>
            <p class="text-gray-600 text-sm mb-3 leading-relaxed">${d.description}</p>
            <div class="flex flex-wrap gap-2">
                ${d.symptoms.map(s => `<span class="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">${s}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

// ==========================================
// [기능 3] 진단(설문) 로직
// ==========================================
function startDiagnosis() {
    currentStep = 0;
    userAnswers = {};
    showPage('diagnosis');
    renderQuestion();
}

function renderQuestion() {
    const q = QUESTIONS[currentStep];
    const container = document.getElementById('question-container');

    // 진행바 업데이트
    document.getElementById('progress-bar').style.width = `${((currentStep + 1) / QUESTIONS.length) * 100}%`;
    document.getElementById('question-count').innerText = `${currentStep + 1} / ${QUESTIONS.length}`;

    // 질문 HTML 생성
    let html = `
        <div class="mb-2 text-blue-500 font-bold text-sm tracking-wide">QUESTION ${currentStep + 1}</div>
        <h2 class="text-2xl font-bold mb-3 text-gray-900 leading-snug">${q.question}</h2>
        <p class="text-gray-500 mb-8">${q.subText}</p>
    `;

    // 답변 타입별 UI 생성
    if (q.type === 'chips') {
        html += `<div class="flex flex-wrap gap-3">`;
        q.options.forEach(opt => {
            const isSelected = (userAnswers[q.id] || []).includes(opt);
            const btnClass = isSelected
                ? 'bg-gray-900 text-white border-gray-900 shadow-lg'
                : 'bg-white text-gray-600 border-gray-200';
            html += `<button onclick="handleAnswer('${opt}')" class="px-5 py-3 rounded-xl border text-sm font-bold transition-all ${btnClass}">${opt}</button>`;
        });
        html += `</div>`;
    } else if (q.type === 'slider') {
        const val = userAnswers[q.id] || 5;
        html += `
            <div class="py-8 px-2">
                <input type="range" min="${q.min}" max="${q.max}" value="${val}"
                    oninput="handleSlider(this.value)" class="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black">
                <div class="flex justify-between mt-4 text-xs font-bold text-gray-400">
                    ${q.labels.map(l => `<span>${l}</span>`).join('')}
                </div>
                <div class="text-center mt-6 text-3xl font-bold text-blue-600">${val}</div>
            </div>
        `;
    } else if (q.type === 'yesno') {
        html += `<div class="flex gap-4">`;
        ["예", "아니오"].forEach(opt => {
            const isSelected = userAnswers[q.id] === opt;
            const btnClass = isSelected ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-600 border-gray-200';
            html += `<button onclick="handleAnswer('${opt}')" class="flex-1 py-6 rounded-2xl font-bold text-lg border transition-all ${btnClass}">${opt}</button>`;
        });
        html += `</div>`;
    }

    container.innerHTML = html;

    // 다음 버튼 활성화 여부 체크
    const nextBtn = document.getElementById('btn-next');
    const hasAnswer = q.type === 'slider' ? true : (userAnswers[q.id] && userAnswers[q.id].length > 0);
    nextBtn.disabled = !hasAnswer;
    nextBtn.innerText = currentStep === QUESTIONS.length - 1 ? "결과 보기" : "다음으로";
}

function handleAnswer(value) {
    const q = QUESTIONS[currentStep];

    if (q.type === 'chips') {
        // 다중 선택 로직
        let current = userAnswers[q.id] || [];
        if (value === "없음") {
            current = ["없음"];
        } else {
            if (current.includes("없음")) current = []; // '없음' 해제
            if (current.includes(value)) current = current.filter(v => v !== value);
            else current.push(value);
        }
        userAnswers[q.id] = current;
    } else {
        // 단일 선택 로직
        userAnswers[q.id] = value;
    }
    renderQuestion(); // 화면 갱신
}

function handleSlider(value) {
    const q = QUESTIONS[currentStep];
    userAnswers[q.id] = Number(value);
    renderQuestion();
}

function nextQuestion() {
    if (currentStep < QUESTIONS.length - 1) {
        currentStep++;
        renderQuestion();
    } else {
        analyzeResult();
    }
}

function prevQuestion() {
    if (currentStep > 0) {
        currentStep--;
        renderQuestion();
    } else {
        showPage('home');
    }
}

// ==========================================
// [기능 4] 결과 분석
// ==========================================
function analyzeResult() {
    // 사용자가 선택한 키워드들을 하나의 배열로 만듦
    const keywords = Object.values(userAnswers).flat().map(v => String(v));
    let scores = [];

    // 모든 질병을 돌면서 점수 매기기
    Object.keys(DISEASE_DATABASE).forEach(catKey => {
        DISEASE_DATABASE[catKey].forEach(disease => {
            let score = 0;
            // 증상 매칭 점수
            disease.symptoms.forEach(sym => {
                if (keywords.some(k => k.includes(sym) || sym.includes(k))) score += 1;
            });
            // 카테고리(질문1번) 매칭 가중치
            const targetCategoryName = CATEGORIES.find(c => c.id === catKey)?.name;
            if (userAnswers[1] && userAnswers[1].includes(targetCategoryName)) {
                score += 2;
            }
            if (score > 0) scores.push({ ...disease, score });
        });
    });

    // 점수 높은 순 정렬
    scores.sort((a, b) => b.score - a.score);
    const topResults = scores.slice(0, 3);

    showResultPage(topResults);
}

function showResultPage(results) {
    showPage('result');
    const container = document.getElementById('result-content');

    if (results.length === 0) {
        container.innerHTML = `
            <div class="bg-gray-50 p-8 rounded-3xl text-center">
                <p class="text-gray-500 font-bold">뚜렷한 의심 질환을 찾지 못했습니다.</p>
                <p class="text-xs text-gray-400 mt-2">증상이 지속되면 병원을 방문하세요.</p>
            </div>`;
        return;
    }

    const top = results[0];
    let html = `
        <div class="bg-white border-2 border-blue-500 rounded-3xl p-6 shadow-xl mb-6 relative overflow-hidden">
            <div class="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">예상 질환 1위</div>
            <h3 class="text-2xl font-extrabold text-gray-900 mb-2">${top.name}</h3>
            <p class="text-gray-600 mb-4 leading-relaxed">${top.description}</p>

            <div class="bg-gray-50 p-3 rounded-xl mb-3">
                <span class="text-xs font-bold text-gray-400 block mb-2">관련 증상</span>
                <div class="flex flex-wrap gap-2">
                    ${top.symptoms.map(s => `<span class="text-xs bg-white border border-gray-200 px-2 py-1 rounded-md text-gray-600 font-medium">${s}</span>`).join('')}
                </div>
            </div>
            ${top.emergency ? `<div class="flex items-start gap-2 bg-red-50 text-red-600 p-3 rounded-xl border border-red-100"><i data-lucide="alert-circle" class="w-5 h-5 shrink-0"></i><span class="text-xs font-bold">응급 질환일 가능성이 있습니다. 빠른 시일 내에 병원을 방문하세요.</span></div>` : ''}
        </div>
    `;

    if (results.length > 1) {
        html += `<h4 class="text-sm font-bold text-gray-400 mb-3 ml-1">다른 의심 질환</h4><div class="space-y-3">`;
        results.slice(1).forEach(res => {
            html += `
                <div class="bg-white p-4 rounded-2xl border border-gray-100">
                    <h5 class="font-bold text-gray-800">${res.name}</h5>
                    <p class="text-xs text-gray-500 line-clamp-1">${res.description}</p>
                </div>`;
        });
        html += `</div>`;
    }

    container.innerHTML = html;
    lucide.createIcons(); // 결과 페이지 아이콘 렌더링
}
// ==========================================
// [기능 5] 카카오 지도 초기화
// ==========================================
let map = null;

function initKakaoMap() {
    if (typeof kakao === 'undefined') {
        console.error('카카오 지도 API가 로드되지 않았습니다.');
        return;
    }

    const container = document.getElementById('map');
    const options = {
        center: new kakao.maps.LatLng(37.5665, 126.9780), // 서울 중심 좌표
        level: 3
    };

    map = new kakao.maps.Map(container, options);

    // 현재 위치 가져오기
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const locPosition = new kakao.maps.LatLng(lat, lon);

            // 지도 중심을 현재 위치로 이동
            map.setCenter(locPosition);

            // 현재 위치 마커 표시
            const marker = new kakao.maps.Marker({
                map: map,
                position: locPosition
            });
        });
    }
}