/*
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
*/
//<button id="add-submit">Add</button>
const ab = document.querySelector("#add-submit")
ab.addEventListener("click", (ev) => {
    ev.preventDefault() //HTMLが本来持っている他の正常なボタン処理をなかったことにする
    console.log("追加ボタン押されたよ")
    //パラメーター取得
    const na = document.querySelector("#add-shop_name").value
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
    data.append("na", na)
    data.append("rn", rn)
    data.append("rp", rp)
    data.append("re", re)
    /*
    //データ表示
    fetch('/review_get/review_add_post', {
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
    })*/
})