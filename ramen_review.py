from flask import Flask, request, render_template, redirect
import requests

app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False

PORT = 8080

@app.route('/ramen-map', methods=["GET"])
def ramen_map():
    return render_template("ramen_map.html")

@app.route('/api/ramen-shop', methods=["GET"])
def ramen_shop():
    # print('?' + '&'.join(f"{v[0]}={','.join(v[1])}" for v in request.args.lists()))
    url = "http://webservice.recruit.co.jp/hotpepper/gourmet/v1/"
    r = requests.get(url, request.args.to_dict())
    return r.json()

@app.route('/')
def index():
    return redirect('/ramen-map')

if __name__ == "__main__":
    app.run(port=PORT, debug=True)
