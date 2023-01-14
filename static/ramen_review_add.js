// データの初期表示
fetch("/review").then(response => {
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
    const re = document.querySelector("#search-review").value

    const param = new URLSearchParams

    if (rn !== "") param.append("rn", rn)
    if (rp !== "") param.append("rp", rp)
    if (re !== "") param.append("re", re)

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
                // first name
                let td = document.createElement('td');
                td.innerText = elm.write_name;
                tr.appendChild(td);
                // last name
                td = document.createElement('td');
                td.innerText = elm.review_points;
                tr.appendChild(td);
                // email
                td = document.createElement('td');
                td.innerText = elm.review;
                tr.appendChild(td);

                // 1行分をtableタグ内のtbodyへ追加する
                tableBody.appendChild(tr);
            });
        });
    });
})

//<button id="add-submit">Add</button>
const ab = document.querySelector("#add-submit")
ab.addEventListener("click", (ev) => {
    ev.preventDefault() //HTMLが本来持っている他の正常なボタン処理をなかったことにする

    console.log("追加ボタン押されたよ")

    //パラメーター取得
    //<input required type="text" id="add-write_name" placeholder="write_name" name="rn">
    const rn = document.querySelector("#add-write_name").value
    //<input required type="text" id="add-review_points" placeholder="review_points" name="rp">
    const rp = document.querySelector("#add-review_points").value
    //<input required type="text" id="add-review" placeholder="review" name="re">
    const re = document.querySelector("#add-review").value

    //未入力項目があるエラーメッセージ
    let error_message = ""
    if (!rn && rn === "") error_message += "名前が未入力です。<br>"
    if (!rp && rp === "") error_message += "評価点が未入力です。<br>"
    if (!re && re === "") error_message += "レビュー内容が未入力です。<br>"

    //評価点が数字以外の時のエラー処理
    if (isNaN(rp)) error_message += "整数で入力してください。<br>"
    if(rp<1 || 100<rp) error_message += "1~100の数字で入力してください。<br>"

    //処理中断
    if (error_message !== "") {
        document.getElementById('error-container').innerHTML = error_message
        document.getElementById('error-container').style.display = "block"
        return
    } else {
        document.getElementById('error-container').innerHTML = ""
        document.getElementById('error-container').style.display = "none"
    }

    //データ送信
    let data = new FormData()
    data.append("rn", rn)
    data.append("rp", rp)
    data.append("re", re)


    //データ表示
    fetch('/review', {
        method: 'POST',
        body: data,
    }).then((response) => {
        document.getElementById("add").reset()
        document.getElementById('error-container').innerHTML = ""
        document.getElementById('error-container').style.display = "none"
        document.getElementById('message-container').innerHTML = ""
        document.getElementById('message-container').style.display = "none"
        response.json().then((data) => {
            if (data.error) {
                //エラー受信
                document.getElementById('error-container').innerHTML = data.error
                document.getElementById('error-container').style.display = "block"
            }
            if (data.result) {
                //メッセージ受信
                document.getElementById('message-container').innerHTML = data.result
                document.getElementById('message-container').style.display = "block"
                console.log("aaaaa")
                if (data.json_data) {
                    show_data(data.json_data) 
                }
            }
        })
    })
})