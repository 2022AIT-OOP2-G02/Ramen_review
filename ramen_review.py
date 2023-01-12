from flask import Flask, request, render_template, redirect
from dotenv import load_dotenv
load_dotenv()
import requests, os

PORT = os.getenv("PORT")
API_KEY = os.getenv("API_KEY")

app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False
app.config["DEBUG"] = True

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

@app.route('/')
def index():
    return redirect('/ramen-map')

if __name__ == "__main__":
    app.run(port=PORT)
