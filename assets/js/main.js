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
// ... (기존 diseaseData, document.addEventListener('DOMContentLoaded', ...) 등의 코드)

/**
 * @function initKakaoMapAndSearch
 * 카카오 맵을 초기화하고 현재 위치 기반으로 주변 병원을 검색합니다.
 * 이 함수는 hospital-finder.html의 searchHospitals()에서 호출됩니다.
 */
function initKakaoMapAndSearch() {
    const mapContainer = document.getElementById('map');
    let mapOption = {
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 기본 중심 좌표 (제주도)
        level: 3 // 지도의 확대 레벨
    };
    
    // 맵 객체 생성
    const map = new kakao.maps.Map(mapContainer, mapOption); 
    
    // 장소 검색 객체 생성 (병원 검색을 위해 'services' 라이브러리가 필요)
    const ps = new kakao.maps.services.Places();  

    // HTML5의 Geolocation API를 사용하여 현재 위치를 얻어옵니다.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const locPosition = new kakao.maps.LatLng(lat, lon); // 현재 위치 좌표

            // 지도 중심을 현재 위치로 이동
            map.setCenter(locPosition);

            // 현재 위치에 마커 표시
            new kakao.maps.Marker({
                map: map,
                position: locPosition
            }).setMap(map);
            
            // ⭐️ 현재 위치 주변 동물병원 검색 시작
            searchNearbyHospitals(ps, map, locPosition);

        }, (error) => {
            // 위치 정보를 가져오는 데 실패했을 경우
            alert("위치 정보를 가져오는 데 실패했습니다. 기본 위치로 병원을 검색합니다.");
            searchNearbyHospitals(ps, map, mapOption.center); // 기본 위치에서 검색
        }, {
            enableHighAccuracy: false,
            maximumAge: 0,
            timeout: 5000
        });
    } else {
        alert("Geolocation을 지원하지 않아, 기본 위치로 병원을 검색합니다.");
        searchNearbyHospitals(ps, map, mapOption.center); // 기본 위치에서 검색
    }
}

/**
 * @function searchNearbyHospitals
 * 카카오 장소 검색 API를 이용하여 주변 동물병원을 검색하고 지도에 표시합니다.
 */
function searchNearbyHospitals(ps, map, center) {
    const keyword = document.getElementById('hospital-search').value || "동물병원";

    // 키워드로 주변 검색 요청 (좌표 기준 1km 이내)
    ps.keywordSearch(keyword, (data, status, pagination) => {
        if (status === kakao.maps.services.Status.OK) {
            
            const hospitalListEl = document.getElementById('hospital-list');
            const resultsListEl = hospitalListEl.querySelector('.hospital-results') || document.createElement('ul');
            resultsListEl.classList.add('hospital-results');
            resultsListEl.innerHTML = '';
            
            let bounds = new kakao.maps.LatLngBounds(); // 마커들을 포함할 영역

            data.forEach((place) => {
                // 1. 리스트에 항목 추가
                const li = document.createElement('li');
                li.classList.add('hospital-item');
                li.innerHTML = `
                    <strong>${place.place_name}</strong>
                    <p>주소: ${place.address_name}</p>
                    <p>연락처: ${place.phone || '정보 없음'}</p>
                    <a href="${place.place_url}" target="_blank">상세 정보 (카카오맵)</a>
                `;
                resultsListEl.appendChild(li);

                // 2. 지도에 마커 표시
                const position = new kakao.maps.LatLng(place.y, place.x);
                new kakao.maps.Marker({
                    map: map,
                    position: position
                });
                
                bounds.extend(position);
            });
            
            // 검색된 병원들이 보이도록 지도의 경계를 재설정
            map.setBounds(bounds);
            
            if(!hospitalListEl.querySelector('.hospital-results')) {
                hospitalListEl.appendChild(resultsListEl);
            }
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
            alert('주변에서 검색 결과가 없습니다.');
        } else if (status === kakao.maps.services.Status.ERROR) {
            alert('병원 검색 중 오류가 발생했습니다.');
        }
    }, {
        location: center, // 검색 중심 좌표
        radius: 1000, // 1km 반경
        sort: kakao.maps.services.SortBy.DISTANCE // 거리순 정렬
    });
}
});
