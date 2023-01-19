# Ramen_review
## アプリの仕様
##### 簡単に言えばラーメン屋の店舗のレビューサイトであり、サイトを開くとラーメン屋のそれぞれの店舗の店名、住所、おすすめ一覧でランキング形式で見ることができる。店名検索するとその店舗の詳細を表示することができる。さらに地図も載っており場所が見やすくなっている。
## アプリ完成イメージ
##### 大まかなサイトの構想のpdfが情報を共有しているLINEグループに存在する。

python-dotenvが必要なので入れてないなら`pip install python-dotenv`が必要
また、`.env.sample`ファイルを参考に`.env`ファイルを作り、APIキーを設定しておくこと

＜データベースmongodb使用のためインストールが必要＞
1. $ brew updateでHomebrewをアップデート
2. $ brew tap mongodb/brewでtapのインストール
3. $ brew install mongodb-communityでmongodb-communityのインストール
4. $ brew services start mongodb-community でMongoDBを起動(停止する際は brew services stop mongodb-community)
5. vscodeで拡張機能"MongoDB for VS Code"の追加をする
6. インストールするとMONGODBタブが表示される
7. CONNECTIONS欄にあるAdd Connectionを選択しMongoDB接続プロファイルを作成する
8. openformをクリック
9. 画面に情報を入力(localhost:27017)入力したらConnect
10. 成功していたら"successfully connected to localhost:27017"というメッセージが出る
11. 成功したらタブを閉じて終了
vscode上のターミナルでコマンド　pip install pymongo　を打ち込みpymongoを使えるようにする　

<確認方法>
　MONGODBタブ->CONNECTIONS欄->localhost:27017->test->test->Documentの中に保存される