/* ===== 내 가방 보기 =====
 * 가방 속 물품을 JavaScript 객체(Object)로 만들고 그 내용을 보여준다. (index.html)
 * 시작 버튼의 onclick 에서 showMyBag() 을 호출한다.
 */

// 소지품 객체(소지품 명 name, 소지품 수 count)를 담은 배열
var myBag = [
    { name: "노트북", count: 1 },
    { name: "충전기", count: 1 },
    { name: "지갑", count: 1 },
    { name: "립밤", count: 2 }
];

function showMyBag() {
    var message = "🎒 내 가방 속 물품\n\n";
    var totalCount = 0;

    // 반복문을 통해 소지품 객체를 하나씩 출력한다.
    for (var i = 0; i < myBag.length; i++) {
        var item = myBag[i];
        message += (i + 1) + ". " + item.name + " — " + item.count + "개\n";
        totalCount = totalCount + item.count;

        // 콘솔에도 함께 출력한다.
        console.log(item.name + ": " + item.count + "개");
    }

    message += "\n총 " + myBag.length + "종류 · " + totalCount + "개를 챙겼어요!";
    alert(message);
}
