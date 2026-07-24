/* ===== Up-Down 숫자 맞추기 게임 =====
 * 컴퓨터가 1~50 중 하나를 정하고, 사용자가 맞출 때까지 반복한다.
 * - 정답보다 크면 "Down!", 작으면 "Up!"
 * - 맞추면 "축하합니다! X번 만에 맞추셨습니다."
 * 시작 버튼(index.html)의 onclick 에서 startUpDown() 을 호출한다.
 */
function startUpDown() {
    // 컴퓨터가 1부터 50 사이의 무작위 숫자 하나를 정한다.
    var computerNum = Math.floor(Math.random() * 50) + 1;

    var count = 0;      // 시도 횟수
    var low = 1;        // 남은 범위(최소) — 힌트로 좁혀서 보여준다
    var high = 50;      // 남은 범위(최대)

    alert("🔢 1부터 50 사이의 숫자를 정했습니다!.\n무엇일지 맞춰보세요!");

    // 사용자가 맞출 때까지 계속 기회를 준다.
    while (true) {
        var input = prompt(
            "제가 정한 숫자는 무엇일까요?  (" + low + " ~ " + high + ")\n" +
            "지금까지 " + count + "번 시도했어요."
        );

        // '취소'를 누르거나 창을 닫으면 게임을 그만둔다.
        if (input === null) {
            alert("게임을 종료합니다. 다음에 다시 도전해요! 👋");
            return;
        }

        var guess = Number(input);

        // 숫자가 아니거나 1~50 범위를 벗어나면 다시 입력받는다.
        if (input.trim() === "" || !Number.isInteger(guess) || guess < 1 || guess > 50) {
            alert("⚠️ 1부터 50 사이의 숫자를 입력해 주세요.");
            continue;
        }

        count = count + 1;

        if (guess > computerNum) {
            high = guess - 1;   // 정답은 이 값보다 작다
            alert("Down! 🔽");
        } else if (guess < computerNum) {
            low = guess + 1;    // 정답은 이 값보다 크다
            alert("Up! 🔼");
        } else {
            alert("🎉 축하합니다! " + count + "번 만에 맞추셨습니다.");
            break;              // 정답 — 게임 종료
        }
    }
}
