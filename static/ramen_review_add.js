// データの初期表示
fetch("/review_get").then(response => {
    console.log(response);
    response.json().then((data) => {
        console.log(data);  // 取得されたレスポンスデータをデバッグ表示

        //評価点の合計表示
        //const review_average = document.querySelector("#review_average > tbody");


        let sum = 0;
        data.forEach(elm => {
            //console.log(Object.keys(elm).length);
            const obj = JSON.parse(elm.review_points);
            //console.log(obj);
            sum += obj;
        });
        console.log(Object.keys(data).length);
        let sum2 = sum/Object.keys(data).length;
        let sum3 = Math.trunc(sum2)
        document.getElementById('review_average').innerHTML = sum3;
        

        // データを表示させる
        const tableBody = document.querySelector("#review-list > tbody");
        data.forEach(elm => {
            // 1行づつ処理を行う
            let tr = document.createElement('tr');
            // 名前
            let td = document.createElement('td');
            td.innerText = elm.write_name;
            tr.appendChild(td);
            // 評価点
            td = document.createElement('td');
            td.innerText = elm.review_points;
            tr.appendChild(td);
            // レビュー内容
            td = document.createElement('td');
            td.innerText = elm.review;
            tr.appendChild(td);
            // 1行分をtableタグ内のtbodyへ追加する
            tableBody.appendChild(tr);
        });
    })
})

//初期化
document.getElementById('error-container').innerHTML = ""
document.getElementById('error-container').style.display = "none"
document.getElementById('message-container').innerHTML = ""
document.getElementById('message-container').style.display = "none"

//データ表示
const show_data = (data) => {
    const tableBody = document.querySelector("#review-list > tbody")
    tableBody.innerHTML = ""
    //レスポンスのJSONデータの件数が0だった場合
    if (data && data.length == 0) {
        let tr = document.createElement('tr')
        tr.innerHTML = "表示するデータがありません。"
        tableBody.appendChild(tr)
        return
    }
    data.forEach(elm => {
        let tr = document.createElement('tr')
        let td = document.createElement('td')
        td.textContent = elm.write_name
        tr.appendChild(td)
        td = document.createElement('td')
        td.textContent = elm.review_points
        tr.appendChild(td)
        td = document.createElement('td')
        td.textContent = elm.review
        tr.appendChild(td)
        //追加
        tableBody.appendChild(tr)
    })
}

// <button id="search-submit">Search</button>
const sb = document.querySelector("#search-submit")
sb.addEventListener("click", (ev) => {
    ev.preventDefault() //HTMLが本来持っている他の正常なボタン処理をなかったことにする

    console.log("検索ボタン押されたよ")

    //クエリパラメータにて、以下の項目を指定できます。
    //rn: 指定されたキーワードがreviewに含まれるデータを返します。省略時全件。
    //rp: 指定されたキーワードがreview_pointsに含まれるデータを返します。省略時全件。
    //re: 指定されたキーワードがwrite_nameに含まれるデータを返します。省略時全件。

    //パラメーター取得
    //<input type="text" id="search-write_name" placeholder="ニックネーム" name="fn">
    const rn = document.querySelector("#search-write_name").value
    //<input type="text" id="earch-review_points" placeholder="評価点" name="ln">
    const rp = document.querySelector("#search-review_points").value
    //<input type="text" id="earch-review" placeholder="内容" name="em">
    //const re = document.querySelector("#search-review").value

    const param = new URLSearchParams

    if (rn !== "") param.append("rn", rn)
    if (rp !== "") param.append("rp", rp)
    //if (re !== "") param.append("re", re)

    console.log(param.toString())

    //データ検索のWeb APIは/addressをGETメソッドで呼び出す

    // データの初期表示
    fetch("/review?" + param.toString()).then(response => {
        console.log(response);
        response.json().then((data) => {
            console.log(data);  // 取得されたレスポンスデータをデバッグ表示
            // データを表示させる
            const tableBody = document.querySelector("#review-list > tbody");

            //検索ごとに、<table class="table" id="address-list">〜</table>内の<tbody>〜</tbody>内部はクリアされて結果が表示される
            // 子要素を全削除
            //元々入っていたtbodyのtrタグが全て削除される
            while (tableBody.firstChild) {
                tableBody.removeChild(tableBody.firstChild);
            }

            //データを件数分追加
            data.forEach(elm => {
                // 1行づつ処理を行う
                let tr = document.createElement('tr');
                // 名前
                let td = document.createElement('td');
                td.innerText = elm.write_name;
                tr.appendChild(td);
                // 評価点
                td = document.createElement('td');
                td.innerText = elm.review_points;
                tr.appendChild(td);
                // レビュー内容
                td = document.createElement('td');
                td.innerText = elm.review;
                tr.appendChild(td);

                // 1行分をtableタグ内のtbodyへ追加する
                tableBody.appendChild(tr);
            });
        });
    });
})