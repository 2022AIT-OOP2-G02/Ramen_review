from flask import Flask, request, render_template, redirect
import requests

app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False

PORT = 8080
API_KEY = "xxx"

@app.route('/ramen-map', methods=["GET"])
def ramen_map():
    return render_template("ramen_map.html")

@app.route('/api/ramen-shop', methods=["GET"])
def ramen_shop():
    args = request.args.copy()
    args.add("key", API_KEY)
    r = requests.get("http://webservice.recruit.co.jp/hotpepper/gourmet/v1/", args)
    return r.json()

@app.route('/')
def index():
    return redirect('/ramen-map')

if __name__ == "__main__":
    app.run(port=PORT, debug=True)
