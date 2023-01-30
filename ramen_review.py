from flask import Flask, request, render_template, jsonify, redirect
from dotenv import load_dotenv
load_dotenv()
import json
import requests, os
from pymongo import MongoClient
from datetime import datetime
from bson.json_util import dumps

class Mongo(object):
    def __init__(self):
        self.clint = MongoClient()
        self.db = self.clint['test']

    def add_one(self,wn,rp,re):
        """データ挿入"""
        post = {
            #'shop_name': p_write_name,
            'write_name': wn,
            'review_points': rp,
            'review':re,
            'created_at': datetime.now()
        }
        return self.db.test.insert_one(post)

    def get_all(self):
        """データ取得"""
        return self.db.test.find()

obj = Mongo()

PORT = os.getenv("PORT")
API_KEY = os.getenv("API_KEY")

app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False
app.config["DEBUG"] = True

# プロジェクトのトップ
@app.route('/')
def index():
    return render_template("ramen_map.html")

# レビュー評価画面
@app.route('/review_get')
def review():
    #print(dumps((obj.db.test).find()))
    return render_template("ramen_review_add.html")

# レビュー評価画面処理
@app.route('/review_get')
def reviews(): 
    data = obj.get_all()
    print("xxxx")
    
    #for data_list in (obj.db.test).find():
        #datas=reviews.form_doc(data_list)
        #data.append(data_list)
        #print(data)
    
    #data=obj.get_all()
    #print(data)
    return jsonify(data)

# データ登録画面
@app.route('/review/review_add')
def review_add():
    return render_template("ramen_review_add2.html")

# データ登録処理
@app.route('/review/review_add_post', methods=["POST"])
def review_post():
    # 検索パラメータの取得
    p_write_name = request.form.get('rn',None)
    #print(p_write_name)
    p_review_points = request.form.get('rp',None)
    p_review = request.form.get('re',None)

    #Addボタン押下時、未入力項目があればフォーム内のどこかに未入力項目があるメッセージを表示する
    error_message = ""
    if p_write_name is None:
        error_message += "名前が未入力です。<br>"
    if p_review_points is None:
        error_message += "評価点が未入力です。<br>"
    if p_review is None:
        error_message += "レビュー内容が未入力です。<br>"

    #それぞれのパラメータに入力不備があるかどうかをチェックし、入力不備があった場合は、不備がある旨をクライアントサイドに返信をする
    if len(error_message) > 0:
        return jsonify({
            "error": error_message
        })
    
    #データベースに追加
    rest = obj.add_one(p_write_name, p_review_points, p_review)

    #for data in (obj.db.test).find():
        #print(dumps(data))
        #ObjectId.prototype.tojson = function() { return '"' + this.valueOf() + '"'; };
    
    print(dumps((obj.db.test).find()))
    #(obj.db.test).collection.find()
    """
    json_data = (obj.db.test).products.find()
    print(json_data)
    """
    return jsonify()

@app.route('/ramen-map', methods=["GET"])
def ramen_map():
    return render_template("ramen_map.html")

@app.route('/api/ramen-shop', methods=["GET"])
def ramen_shop():
    args = request.args.copy()
    if API_KEY == None:
        raise Exception("APIキーが設定されていません")
    args.add("key", API_KEY)
    r = requests.get("http://webservice.recruit.co.jp/hotpepper/gourmet/v1/", args)
    return r.json()

"""
# レビュー評価画面呼び出し
@app.route('/review_get', methods=["GET"])
def review_get():
    # 検索パラメータの取得
    p_write_name = request.args.get('rn',None)
    p_review_points = request.args.get('rp',None)
    p_review = request.args.get('re',None)
    print(p_write_name,p_review_points,p_review)
    with open('ramen_review.json') as f:
        json_data = json.load(f) #データ型に変換
    # パラメータにより返すデータをフィルタリングする
    if p_write_name is not None:
        json_data = list(filter(lambda item: p_write_name.lower() in item["write_name"].lower(), json_data))
    if p_review_points is not None:
        json_data = list(filter(lambda item: p_review_points.lower() in item["review_points"].lower(), json_data))
    if p_review is not None:
        json_data = list(filter(lambda item: p_review.lower() in item["review"].lower(), json_data))

    return jsonify(json_data)
"""

if __name__ == "__main__":
    app.run(port=PORT)
    #app.run(debug=True)