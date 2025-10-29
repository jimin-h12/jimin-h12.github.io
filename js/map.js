// 지도 생성
var mapContainer = document.getElementById('map'); 
var mapOption = { 
    // 지도 초기 중심 좌표 (예: 서울 시청)
    center: new kakao.maps.LatLng(37.566826, 126.978656), 
    level: 3 
};
var map = new kakao.maps.Map(mapContainer, mapOption); 

// 장소 검색 객체를 생성합니다. (services 라이브러리가 로드되어 있어야 사용 가능)
var ps = new kakao.maps.services.Places();  

// 검색 결과로 생성된 마커들을 담을 배열
var markers = [];

// 인포윈도우는 한 개만 사용
var infowindow = new kakao.maps.InfoWindow({zIndex:1}); 

// 검색 버튼 클릭 시 실행될 함수 (HTML에서 호출됨)
function searchPlaces() {
    var keyword = document.getElementById('keyword').value;

    if (!keyword.replace(/^\s+|\s+$/g, '')) {
        alert('키워드를 입력해 주세요!');
        return false;
    }

    // 장소 검색 객체를 통해 키워드로 장소검색을 요청합니다.
    ps.keywordSearch(keyword, placesSearchCB); 
}

// 장소검색이 완료되었을 때 호출되는 콜백함수 입니다.
function placesSearchCB(data, status, pagination) {
    // 1. 기존 마커 및 정보 제거
    removeMarker(); 

    if (status === kakao.maps.services.Status.OK) {
        // 2. 지도 범위 설정을 위한 객체 생성
        var bounds = new kakao.maps.LatLngBounds();

        for (var i = 0; i < data.length; i++) {
            // 3. 검색된 장소마다 마커 표시
            displayMarker(data[i]);    
            // 4. 지도 범위를 확장하여 모든 마커 포함
            bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }       

        // 5. 검색 결과가 한 눈에 들어오도록 지도 범위 재설정
        map.setBounds(bounds);
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 존재하지 않습니다.');
    } else if (status === kakao.maps.services.Status.ERROR) {
        alert('검색 중 오류가 발생했습니다.');
    }
}

// 지도에 마커를 표시하고 마커 배열에 추가하는 함수입니다.
function displayMarker(place) {
    var marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x) 
    });

    // 마커 배열에 추가
    markers.push(marker);

    // 마커에 클릭 이벤트를 등록합니다.
    kakao.maps.event.addListener(marker, 'click', function() {
        // 마커 클릭 시 인포윈도우를 표시합니다.
        infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
        infowindow.open(map, marker);
    });
}

// 지도 위에 표시되고 있는 마커를 모두 제거하는 함수입니다.
function removeMarker() {
    for ( var i = 0; i < markers.length; i++ ) {
        markers[i].setMap(null);
    }   
    markers = [];
    infowindow.close(); // 인포윈도우도 닫기
}