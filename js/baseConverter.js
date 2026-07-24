/* ===== 진법 변환기 =====
 * N진법 → 10진법 : startBaseConverter()
 * 10진법 → N진법 : startToBaseConverter()
 * 각 시작 버튼(index.html)의 onclick 에서 호출한다.
 */

// 문자 하나를 숫자로 변환한다. (0~9, A~Z)
function charToNumber(char) {
    if (char >= "0" && char <= "9") {
        return char.charCodeAt(0) - "0".charCodeAt(0);
    }

    return char.charCodeAt(0) - "A".charCodeAt(0) + 10;
}

// 숫자 하나(0~35)를 문자로 변환한다. (0~9, A~Z)
function numberToChar(digit) {
    if (digit < 10) {
        return String.fromCharCode("0".charCodeAt(0) + digit);
    }

    return String.fromCharCode("A".charCodeAt(0) + digit - 10);
}

function startBaseConverter() {
    var number = prompt("변환할 진법 숫자를 입력하세요.\n예: ZZZZZ");

    if (number === null) {
        alert("진법 변환을 취소했습니다.");
        return;
    }

    var baseInput = prompt("몇 진법인지 입력하세요.\n예: 36");

    if (baseInput === null) {
        alert("진법 변환을 취소했습니다.");
        return;
    }

    number = number.trim().toUpperCase();
    var base = Number(baseInput);

    // 진법은 2부터 36까지만 입력할 수 있다.
    if (
        number === "" ||
        baseInput.trim() === "" ||
        isNaN(base) ||
        base < 2 ||
        base > 36
    ) {
        alert("⚠️ 숫자와 2부터 36 사이의 진법을 입력해 주세요.");
        return;
    }

    var decimalValue = 0;

    // 각 자릿수를 숫자로 바꾼 후 10진법 값을 계산한다.
    for (var i = 0; i < number.length; i++) {
        var digit = charToNumber(number[i]);

        // 입력한 문자가 해당 진법에서 사용할 수 있는지 확인한다.
        if (digit >= base) {
            alert(
                "⚠️ " + number[i] +
                "은(는) " + base + "진법에서 사용할 수 없습니다."
            );
            return;
        }

        decimalValue =
            decimalValue +
            digit * Math.pow(base, number.length - i - 1);
    }

    alert(
        "🔢 진법 변환 결과\n\n" +
        number + " (" + base + "진법)\n" +
        "→ " + decimalValue + " (10진법)"
    );
}

/* ===== 10진법 → N진법 변환기 =====
 * 10진법 숫자와 진법을 입력받아 N진법으로 변환한다.
 * 시작 버튼(index.html)의 onclick 에서 startToBaseConverter() 를 호출한다.
 */
function startToBaseConverter() {
    var decimalInput = prompt("변환할 10진법 숫자를 입력하세요.\n예: 60466175");

    if (decimalInput === null) {
        alert("진법 변환을 취소했습니다.");
        return;
    }

    var baseInput = prompt("몇 진법으로 바꿀지 입력하세요.\n예: 36");

    if (baseInput === null) {
        alert("진법 변환을 취소했습니다.");
        return;
    }

    var decimalValue = Number(decimalInput.trim());
    var base = Number(baseInput);

    // 10진법 값은 0 이상의 정수, 진법은 2부터 36까지만 입력할 수 있다.
    if (
        decimalInput.trim() === "" ||
        baseInput.trim() === "" ||
        isNaN(decimalValue) ||
        !Number.isInteger(decimalValue) ||
        decimalValue < 0 ||
        isNaN(base) ||
        base < 2 ||
        base > 36
    ) {
        alert("⚠️ 0 이상의 정수와 2부터 36 사이의 진법을 입력해 주세요.");
        return;
    }

    var result = "";

    // 0은 어떤 진법에서도 "0"이다.
    if (decimalValue === 0) {
        result = "0";
    }

    // base로 나눈 나머지를 문자로 바꿔 앞에 붙여나간다.
    while (decimalValue > 0) {
        var digit = decimalValue % base;
        result = numberToChar(digit) + result;
        decimalValue = Math.floor(decimalValue / base);
    }

    alert(
        "🔢 진법 변환 결과\n\n" +
        decimalInput.trim() + " (10진법)\n" +
        "→ " + result + " (" + base + "진법)"
    );
}
