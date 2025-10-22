/**
 * 멍이 진단소 - 메인 및 공통 JavaScript
 * disease-detail.html 페이지의 데이터 로딩을 주로 담당합니다.
 */

// 예시 질병 데이터 (실제로는 서버/DB에서 가져와야 함)
const diseaseData = {
    parvo: {
        name: "강아지 파보 바이러스",
        summary: "전염성이 매우 강한 바이러스성 질병으로, 어린 강아지에게 치명적입니다.",
        cause: "강아지 파보 바이러스(CPV-2) 감염. 주로 감염된 변을 통해 전파됩니다.",
        symptoms: [
            "심한 구토와 혈변",
            "식욕 부진 및 기력 상실",
            "탈수 및 고열"
        ],
        action: "즉시 동물병원으로 이동하고, 이동 중에는 다른 강아지와 접촉을 피합니다. 탈수를 막기 위해 소량의 물을 줄 수 있지만, 구토가 심하면 금식합니다.",
        treatment: "입원 치료를 통한 수액 처치, 구토 억제제, 항생제 투여(2차 감염 방지). 예방 접종이 가장 중요합니다."
    },
    kennel_cough: {
        name: "켄넬 코프 (전염성 기관지염)",
        summary: "주로 바이러스나 세균에 의해 발생하는 호흡기 감염병입니다. 전염성이 높습니다.",
        cause: "보데텔라 기관지염균, 파라인플루엔자 바이러스 등이 주요 원인입니다.",
        symptoms: [
            "마른 기침 (거위 울음 소리와 유사)",
            "콧물 및 재채기",
            "심하면 구토를 동반"
        ],
        action: "흥분하지 않도록 안정시키고, 습도를 높여 기침을 완화시킵니다. 목줄 대신 하네스를 사용하여 목에 압박을 주지 않습니다. 타견과의 접촉을 피합니다.",
        treatment: "증상 완화를 위한 기침 억제제, 항생제(세균 감염 시). 대부분 자연 치유되지만 증상에 따라 치료가 필요합니다."
    }
    // 기타 질병 데이터 추가...
};


document.addEventListener('DOMContentLoaded', () => {
    // URL에서 쿼리 파라미터 추출 함수
    const getQueryParam = (param) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    };

    // disease-detail.html 페이지 로직
    if (document.title.includes("질병 상세 정보")) {
        const diseaseKey = getQueryParam('disease');
        const data = diseaseData[diseaseKey];

        if (data) {
            document.getElementById('disease-title-tag').textContent = `${data.name} - 멍이 진단소`;
            document.getElementById('disease-name').textContent = data.name;
            document.getElementById('disease-summary').textContent = data.summary;
            document.getElementById('disease-cause').textContent = data.cause;
            document.getElementById('disease-action').textContent = data.action;
            document.getElementById('disease-treatment').textContent = data.treatment;

            const symptomsList = document.getElementById('disease-symptoms');
            symptomsList.innerHTML = ''; // 기존 내용 초기화
            data.symptoms.forEach(symptom => {
                const li = document.createElement('li');
                li.textContent = symptom;
                symptomsList.appendChild(li);
            });
        } else {
            document.getElementById('disease-name').textContent = "⚠️ 질병 정보를 찾을 수 없습니다.";
            document.querySelector('.detail-container').innerHTML += "<p>요청하신 질병에 대한 상세 정보를 불러오지 못했습니다. 목록에서 다시 선택해 주세요.</p>";
        }
    }

    // 다른 페이지 공통 로직 (필요하다면 여기에 추가)
});