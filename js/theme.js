/* ===== 다크모드 =====
 * 1) 저장된 선택이 있으면 그대로
 * 2) 없으면 운영체제 설정(prefers-color-scheme)을 따른다
 * <head>에서 바로 실행되므로 화면이 깜빡이지 않는다.
 */
(function () {
    "use strict";

    var KEY = "theme";
    var root = document.documentElement;
    var media = window.matchMedia("(prefers-color-scheme: dark)");

    function saved() {
        try {
            return localStorage.getItem(KEY);
        } catch (e) {
            return null;   // 사생활 보호 모드 등에서 접근이 막힌 경우
        }
    }

    function apply(theme) {
        root.setAttribute("data-theme", theme);
    }

    // 첫 적용 (문서가 그려지기 전)
    apply(saved() || (media.matches ? "dark" : "light"));

    // 저장된 선택이 없을 때만 운영체제 설정 변화를 따라간다
    function onSystemChange(e) {
        if (!saved()) {
            apply(e.matches ? "dark" : "light");
        }
    }

    if (media.addEventListener) {
        media.addEventListener("change", onSystemChange);
    } else if (media.addListener) {
        media.addListener(onSystemChange);   // 구형 사파리
    }

    document.addEventListener("DOMContentLoaded", function () {
        var btn = document.querySelector(".theme-toggle");
        if (!btn) return;

        function sync() {
            var isDark = root.getAttribute("data-theme") === "dark";
            btn.setAttribute("aria-checked", String(isDark));
            btn.title = isDark ? "라이트 모드로 전환" : "다크 모드로 전환";
        }

        btn.addEventListener("click", function () {
            var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
            apply(next);
            try {
                localStorage.setItem(KEY, next);
            } catch (e) { /* 저장 못 해도 전환은 동작 */ }
            sync();
        });

        sync();
    });
})();
