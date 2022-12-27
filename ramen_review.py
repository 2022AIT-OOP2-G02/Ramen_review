from flask import Flask, request, render_template, redirect

app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False

PORT = 8080

@app.route('/ramen-map', methods=["GET"])
def address_get():
    return render_template("ramen_map.html")

@app.route('/')
def index():
    return redirect('/ramen-map')

if __name__ == "__main__":
    app.run(port=PORT, debug=True)
