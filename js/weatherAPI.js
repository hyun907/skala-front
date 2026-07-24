/* ===== weatherAPI.js — 데이터 담당 모듈 =====
 * 도시 좌표 데이터와 Open-Meteo 서버 호출(비동기)을 책임진다.
 * 화면(DOM)은 전혀 건드리지 않고, 데이터만 export 한다.
 * 화면 그리기는 realtimeInfo.js 가 담당한다.
 */

// 도시별 위도(latitude) / 경도(longitude) 좌표
export var CITY_COORDS = {
    seoul:     { name: "서울",   lat: 37.5665, lon: 126.9780 },
    gangneung: { name: "강릉",   lat: 37.7519, lon: 128.8761 },
    busan:     { name: "부산",   lat: 35.1796, lon: 129.0756 },
    kyoto:     { name: "교토",   lat: 35.0116, lon: 135.7681 },
    shanghai:  { name: "상하이", lat: 31.2304, lon: 121.4737 }
};

// Open-Meteo 서버에서 현재 날씨를 비동기로 가져온다.
export async function fetchWeather(lat, lon) {
    var url =
        "https://api.open-meteo.com/v1/forecast" +
        "?latitude=" + lat +
        "&longitude=" + lon +
        "&current=temperature_2m,relative_humidity_2m";

    var response = await fetch(url);

    // 응답 코드가 200번대가 아니면 오류로 처리한다.
    if (!response.ok) {
        throw new Error("서버 응답 오류: " + response.status);
    }

    return await response.json();
}
