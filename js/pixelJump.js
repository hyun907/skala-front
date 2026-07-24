/* ===== 픽셀 점프 =====
 * ← → 로 좌우 이동, Space 로 점프하는 횡스크롤 게임. (pixelJump.html)
 * <canvas> 없이 순수 HTML <div> 의 위치만 바꿔서 움직인다.
 * 오른쪽에서 다가오는 블록을 뛰어넘으며 오래 버틸수록 점수가 오른다.
 */
(function () {
    "use strict";

    // ----- 화면 요소 -----
    var stage = document.getElementById("stage");
    if (!stage) return;   // 게임 페이지가 아니면 아무것도 하지 않는다.

    var player = document.getElementById("player");
    var scoreEl = document.getElementById("score");
    var bestEl = document.getElementById("best");
    var overlay = document.getElementById("overlay");
    var overlayTitle = document.getElementById("overlayTitle");
    var overlayDesc = document.getElementById("overlayDesc");
    var startBtn = document.getElementById("startBtn");

    // ----- 물리·게임 설정값 (px 기준, 초 단위) -----
    var GRAVITY = 2000;       // 중력 가속도 (아래로)
    var JUMP_V = 780;         // 점프 시작 속도 (위로)
    var MOVE_SPEED = 240;     // 좌우 이동 속도
    var PLAYER_W = 34;        // 캐릭터 크기
    var PLAYER_H = 38;
    var GROUND_RATIO = 0.20;  // 바닥 띠가 차지하는 화면 높이 비율

    var SPEED_START = 230;    // 블록이 다가오는 처음 속도
    var SPEED_ACCEL = 7;      // 1초마다 빨라지는 양
    var SPEED_MAX = 560;      // 최고 속도

    // ----- 게임 상태 -----
    var running = false;      // 게임이 진행 중인가
    var stageW = 0;           // 화면 크기 (창 크기에 따라 다시 잰다)
    var stageH = 0;
    var groundH = 0;          // 바닥 높이

    var px = 0;               // 캐릭터 x 위치 (왼쪽 기준)
    var py = 0;               // 캐릭터가 바닥에서 떠 있는 높이
    var vy = 0;               // 세로 속도
    var onGround = true;      // 바닥에 닿아 있는가

    var keys = { left: false, right: false };
    var obstacles = [];       // 장애물 배열: { el, x, w, h, passed }
    var speed = SPEED_START;  // 현재 블록 속도
    var spawnTimer = 0;       // 다음 블록까지 남은 시간
    var score = 0;
    var best = loadBest();
    var lastTime = 0;
    var rafId = null;

    bestEl.textContent = "BEST " + best;

    // 창 크기를 재서 바닥 높이 등을 다시 계산한다.
    function measure() {
        stageW = stage.clientWidth;
        stageH = stage.clientHeight;
        groundH = Math.round(stageH * GROUND_RATIO);
    }

    // 캐릭터를 화면에 그린다. (왼쪽·아래 위치를 지정)
    function drawPlayer() {
        player.style.left = px + "px";
        player.style.bottom = (groundH + py) + "px";
    }

    // 블록(장애물) 하나를 새로 만든다.
    function spawnObstacle() {
        var h = 26 + Math.floor(Math.random() * 62);   // 26~87px 높이
        var w = 22 + Math.floor(Math.random() * 12);    // 22~33px 너비

        var el = document.createElement("div");
        el.className = "obstacle";
        el.style.width = w + "px";
        el.style.height = h + "px";
        el.style.bottom = groundH + "px";
        stage.appendChild(el);

        obstacles.push({ el: el, x: stageW, w: w, h: h, passed: false });
    }

    // 장애물을 모두 지운다. (다시 시작할 때)
    function clearObstacles() {
        for (var i = 0; i < obstacles.length; i++) {
            stage.removeChild(obstacles[i].el);
        }
        obstacles = [];
    }

    // 두 사각형이 겹치는지 확인한다. (충돌 판정)
    function isHit(ob) {
        // 살짝 여유를 줘서 너무 빡빡하지 않게 한다.
        var pad = 5;
        var pl = px + pad;
        var pr = px + PLAYER_W - pad;
        var pb = py;                 // 캐릭터 아랫변 (바닥 기준 높이)
        var pt = py + PLAYER_H - pad; // 캐릭터 윗변

        var ol = ob.x;
        var or = ob.x + ob.w;
        var ot = ob.h;               // 블록 윗변 (바닥 기준 높이)

        var overlapX = pl < or && pr > ol;
        var overlapY = pb < ot && pt > 0;
        return overlapX && overlapY;
    }

    // 매 프레임 실행되는 게임 루프
    function loop(now) {
        if (!running) return;

        // 프레임 사이 시간(초). 탭 전환 등으로 너무 커지면 잘라낸다.
        var dt = (now - lastTime) / 1000;
        lastTime = now;
        if (dt > 0.05) dt = 0.05;

        // 1) 좌우 이동
        if (keys.left) px -= MOVE_SPEED * dt;
        if (keys.right) px += MOVE_SPEED * dt;
        if (px < 0) px = 0;
        if (px > stageW - PLAYER_W) px = stageW - PLAYER_W;

        // 2) 점프·중력
        vy -= GRAVITY * dt;
        py += vy * dt;
        if (py <= 0) {           // 바닥에 닿으면 멈춘다.
            py = 0;
            vy = 0;
            onGround = true;
            player.classList.remove("jumping");
        }
        drawPlayer();

        // 3) 블록 생성
        spawnTimer -= dt;
        if (spawnTimer <= 0) {
            spawnObstacle();
            // 속도가 빠를수록 조금 더 촘촘하게 나온다.
            spawnTimer = 0.9 + Math.random() * 0.9 * (SPEED_START / speed);
        }

        // 4) 블록 이동·충돌·점수
        speed = Math.min(SPEED_MAX, speed + SPEED_ACCEL * dt);
        for (var i = obstacles.length - 1; i >= 0; i--) {
            var ob = obstacles[i];
            ob.x -= speed * dt;
            ob.el.style.left = ob.x + "px";

            if (isHit(ob)) {
                gameOver();
                return;
            }

            // 캐릭터를 지나치면 점수 +1
            if (!ob.passed && ob.x + ob.w < px) {
                ob.passed = true;
                score += 1;
                scoreEl.textContent = score;
            }

            // 화면 왼쪽으로 완전히 사라지면 제거
            if (ob.x + ob.w < -10) {
                stage.removeChild(ob.el);
                obstacles.splice(i, 1);
            }
        }

        rafId = requestAnimationFrame(loop);
    }

    // 점프 시도
    function jump() {
        if (onGround && running) {
            vy = JUMP_V;
            onGround = false;
            player.classList.add("jumping");
        }
    }

    // 게임 시작 (또는 다시 시작)
    function startGame() {
        measure();
        clearObstacles();

        px = Math.round(stageW * 0.18);
        py = 0;
        vy = 0;
        onGround = true;
        keys.left = keys.right = false;
        speed = SPEED_START;
        spawnTimer = 0.6;
        score = 0;
        scoreEl.textContent = "0";

        player.classList.remove("jumping", "hit");
        drawPlayer();

        overlay.classList.remove("show");
        stage.classList.add("playing");
        running = true;
        lastTime = performance.now();
        rafId = requestAnimationFrame(loop);
        stage.focus();
    }

    // 게임 오버
    function gameOver() {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
        player.classList.add("hit");
        stage.classList.remove("playing");

        if (score > best) {
            best = score;
            saveBest(best);
            bestEl.textContent = "BEST " + best;
        }

        overlayTitle.textContent = "게임 오버";
        overlayDesc.innerHTML =
            "점수 <b>" + score + "</b>점 · 최고 <b>" + best + "</b>점<br>" +
            "다시 도전해 보세요!";
        startBtn.textContent = "다시하기 ▶";
        overlay.classList.add("show");
    }

    // 최고 점수 저장·불러오기 (localStorage)
    function loadBest() {
        try {
            return Number(localStorage.getItem("pixelJumpBest")) || 0;
        } catch (e) {
            return 0;
        }
    }
    function saveBest(v) {
        try {
            localStorage.setItem("pixelJumpBest", String(v));
        } catch (e) { /* 저장 못 해도 게임은 동작 */ }
    }

    // ----- 입력 처리 -----
    function onKeyDown(e) {
        switch (e.key) {
            case "ArrowLeft":
                keys.left = true;
                e.preventDefault();
                break;
            case "ArrowRight":
                keys.right = true;
                e.preventDefault();
                break;
            case " ":
            case "Spacebar":     // 구형 브라우저 호환
                e.preventDefault();
                if (running) {
                    jump();
                } else {
                    startGame();  // 대기·게임오버 화면에서는 시작
                }
                break;
        }
    }

    function onKeyUp(e) {
        if (e.key === "ArrowLeft") keys.left = false;
        if (e.key === "ArrowRight") keys.right = false;
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", function () {
        measure();
        drawPlayer();
    });

    startBtn.addEventListener("click", startGame);
    stage.addEventListener("click", function () {
        if (!running) startGame();
    });

    // 모바일 터치 버튼 (누르는 동안만 동작)
    var touchBtns = document.querySelectorAll(".touch-btn");
    for (var t = 0; t < touchBtns.length; t++) {
        (function (btn) {
            var key = btn.getAttribute("data-key");

            function press(e) {
                e.preventDefault();
                if (key === "jump") {
                    if (running) jump(); else startGame();
                } else {
                    keys[key] = true;
                }
            }
            function release() {
                if (key !== "jump") keys[key] = false;
            }

            btn.addEventListener("touchstart", press, { passive: false });
            btn.addEventListener("touchend", release);
            btn.addEventListener("mousedown", press);
            btn.addEventListener("mouseup", release);
            btn.addEventListener("mouseleave", release);
        })(touchBtns[t]);
    }

    // 첫 화면 준비
    measure();
    px = Math.round(stageW * 0.18);
    drawPlayer();
})();
