# Ramen_review
## アプリの仕様
##### 簡単に言えばラーメン屋の店舗のレビューサイトであり、サイトを開くとラーメン屋のそれぞれの店舗の店名、住所、おすすめ一覧でランキング形式で見ることができる。店名検索するとその店舗の詳細を表示することができる。さらに地図も載っており場所が見やすくなっている。
## アプリ完成イメージ
##### 大まかなサイトの構想のpdfが情報を共有しているLINEグループに存在する。

python-dotenvが必要なので入れてないなら`pip install python-dotenv`が必要
また、`.env.sample`ファイルを参考に`.env`ファイルを作り、APIキーを設定しておくこと

データベースmongodb使用のためインストールが必要   
mongodb mac installで検索してもらうとできると思います

＜こちらだけで使用できるかも＞
vscodeで使用するために拡張機能MongoDB for VS Codeの追加をする
コマンド　pip install pymongo　

インストールするとMONGODBタブが表示される
CONNECTIONS欄にあるAdd Connectionを選択しMongoDB接続プロファイルを作成する
画面に情報を入力(localhost:27017)入力したらConnect
成功していたら"successfully connected to localhost:27017"というメッセージが出る
成功したらタブは閉じて良い