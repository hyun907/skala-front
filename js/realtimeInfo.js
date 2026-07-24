/* ===== realtimeInfo.js — 화면(DOM) 담당 모듈 =====
 * weatherAPI.js 로부터 데이터/함수를 import 하여
 * <select id="city-select"> 의 change 이벤트를 처리하고
 * <div id="weather-box"> 에 실시간 날씨를 그린다.
 *
 * 데이터(좌표·서버 호출)는 weatherAPI 가 책임지고,
 * 이 모듈은 오직 화면 표시만 책임진다.
 */

import { CITY_COORDS, fetchWeather } from "./weatherAPI.js";

// weather-box 요소를 가져온다. (없으면 null)
function getWeatherBox() {
    return document.getElementById("weather-box");
}

// 선택된 도시의 실시간 날씨를 그린다.
async function renderWeather(cityKey) {
    var box = getWeatherBox();

    if (box === null) {
        return;
    }

    var city = CITY_COORDS[cityKey];

    // 아무 도시도 고르지 않았을 때
    if (!city) {
        box.innerHTML =
            '<p class="weather-hint">도시를 선택하면 실시간 날씨가 표시됩니다.</p>';
        return;
    }

    // 1) 데이터를 받아오는 동안 로딩 메시지를 띄운다.
    box.innerHTML =
        '<div class="weather-city">📍 ' + city.name + '</div>' +
        '<p class="weather-loading">로딩 중… ⏳</p>';

    try {
        // 2) weatherAPI 모듈을 통해 실제 날씨 데이터를 기다린다.
        var data = await fetchWeather(city.lat, city.lon);
        var current = data.current;

        var temperature = current.temperature_2m;
        var humidity = current.relative_humidity_2m;
        var tempUnit = data.current_units.temperature_2m;      // 예: "°C"
        var humidityUnit = data.current_units.relative_humidity_2m; // 예: "%"

        // 3) 실시간 온도/습도를 화면에 그린다.
        box.innerHTML =
            '<div class="weather-city">📍 ' + city.name + '</div>' +
            '<ul class="weather-coords">' +
                '<li><span>🌡️ 온도</span><strong>' +
                    temperature + tempUnit + '</strong></li>' +
                '<li><span>💧 습도</span><strong>' +
                    humidity + humidityUnit + '</strong></li>' +
            '</ul>' +
            '<p class="weather-hint">위도 ' + city.lat +
                ' · 경도 ' + city.lon + '</p>';
    } catch (error) {
        // 네트워크 오류 등으로 실패했을 때
        box.innerHTML =
            '<div class="weather-city">📍 ' + city.name + '</div>' +
            '<p class="weather-loading">⚠️ 날씨 정보를 가져오지 못했습니다.</p>';
    }
}

// 모듈 스크립트는 defer 로 실행되어 DOM 이 준비된 뒤 동작한다.
var select = document.getElementById("city-select");

if (select !== null) {
    // 사용자가 도시를 바꿀 때마다 실시간으로 다시 요청한다.
    select.addEventListener("change", function () {
        renderWeather(select.value);
    });

    // 첫 화면에도 현재 선택값을 반영한다.
    renderWeather(select.value);
}
