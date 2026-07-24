/* ===== 성적 계산기 =====
 * HTML · CSS · JavaScript 3과목의 점수를 연속으로 입력받아
 * 총점과 평균을 구하고 합격 여부와 등급을 정한다. (myClass.html)
 * 시작 버튼의 onclick 에서 startGrade() 를 호출한다.
 */

// 과목 이름이 담긴 배열을 미리 만들어 둔다.
var subjects = ["HTML", "CSS", "JavaScript"];

// 평균 점수로 등급을 정한다.
function getGrade(average) {
    if (average >= 90) return "A";
    if (average >= 80) return "B";
    if (average >= 70) return "C";
    if (average >= 60) return "D";
    return "F";
}

function startGrade() {
    var total = 0;   // 총점을 저장할 변수

    // 배열의 길이만큼 반복하며 각 과목의 점수를 입력받아 total 에 더한다.
    for (var i = 0; i < subjects.length; i++) {
        var input = prompt(subjects[i] + " 점수를 입력하세요.");

        // '취소'를 누르거나 창을 닫으면 계산을 멈춘다.
        if (input === null) {
            alert("성적 계산을 취소했습니다.");
            return;
        }

        var score = Number(input);

        // 0~100 사이의 숫자가 아니면 처음부터 다시 입력받는다.
        if (input.trim() === "" || isNaN(score) || score < 0 || score > 100) {
            alert("⚠️ 0부터 100 사이의 숫자를 입력해 주세요. 처음부터 다시 시작합니다.");
            return;
        }

        total = total + score;
    }

    // 반복문이 끝난 후 평균 점수를 구한다. (소수점은 한 자리까지)
    var average = Math.round((total / subjects.length) * 10) / 10;

    // 평균이 60점 이상이면 합격, 미만이면 불합격
    var result = average >= 60 ? "합격입니다!" : "불합격입니다.";
    var grade = getGrade(average);

    // 결과를 alert 창으로 보여준다.
    alert(
        "총점: " + total + "점, 평균: " + average + ", 결과: " + result + "\n" +
        "등급: " + grade + " (" +
        subjects.length + "과목 · 과목당 100점 만점)"
    );
}
