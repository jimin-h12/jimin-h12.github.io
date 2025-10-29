// 지도를 담을 영역의 DOM 레퍼런스를 가져옵니다.
var mapContainer = document.getElementById('map'); 

// 지도의 옵션을 설정합니다.
var mapOption = { 
    // 중심 좌표 (예: 카카오 본사 근처)
    center: new kakao.maps.LatLng(33.450701, 126.570667), 
    // 지도 확대 레벨 (1부터 14까지)
    level: 3 
};

// 지도를 생성합니다.
var map = new kakao.maps.Map(mapContainer, mapOption); 

console.log("카카오맵이 성공적으로 생성되었습니다!");