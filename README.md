# Ramen_review
## アプリの仕様
本アプリはラーメン屋のレビューサイトである。サイトを開くとマップが表示され、範囲円の中に存在するラーメン屋がピックアップされる。ユーザーはラーメン店に対しレビューを書き込む、書かれたレビューを見ることができる。
## アプリ完成イメージ）(pdf)
[page1](oop2-G02_page1.pdf)
[page2](OOP2-G02_page2.pdf)
[page3](OOP2-G02_page3.pdf)

# 動作方法
1. ターミナル上で`Ramen_review`ディレクトリへ移動
2. `$ python ramen_review.py`で実行可能
3. Running on xxxxx（xxxxxはurl)の表示があるので任意のブラウザでurlにアクセス

# 以下動作条件
python-dotenvが必要なので入れてないなら`$ pip install python-dotenv`が必要

また、`.env.sample`ファイルを参考に`.env`ファイルを作り、APIキーを設定しておくこと

#### データベースmongodb使用のためインストールが必要
1. `$ brew update`でHomebrewをアップデート
2. `$ brew tap mongodb/brew`でtapのインストール
3. `$ brew install mongodb-community`でmongodb-communityのインストール
4. `$ brew services start mongodb-community` でMongoDBを起動(停止する際は `$ brew services stop mongodb-community`)
5. vscodeで拡張機能"MongoDB for VS Code"の追加をする
6. インストールするとMONGODBタブが表示される
7. CONNECTIONS欄にあるAdd Connectionを選択しMongoDB接続プロファイルを作成する
8. openformをクリック
9. 画面に情報を入力(localhost:27017)入力したらConnect
10. 成功していたら"successfully connected to localhost:27017"というメッセージが出る
11. 成功したらタブを閉じて終了
12. pymongoを使うため、`$ pip install pymongo`を行う　

#### データベース確認方法
MONGODBタブ->CONNECTIONS欄->localhost:27017->test->test->Documentの中に保存される