
fetch("/review_get").then(response => {
    console.log("aaaa")
    console.log(response);
    response.json().then((data) => {
        console.log("bbbb")
        console.log(data); // 取得されたレスポンスデータをデバッグ表示
        const target = getElementById('review');
        data.forEach(elm => {
            console.log("ccccc")
            let div1 = document.createElement('div');
            div1.innerHTML=elm['review'];
            let div2 = document.createElement('div');
            div2.innerHTML=elm['review_point'];
            let div3 = document.createElement('div');
            div3.innerHTML=elm['write_name'];
            target.appendChild(div1);
            target.appendChild(div2);
            target.appendChild(div3);
        });
        // document.getElementById('review_average').innerHTML = sum3;
    })
})
