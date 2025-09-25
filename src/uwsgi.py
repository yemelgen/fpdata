from flask import Flask, send_from_directory

from endpoints import fingerprint_router


app = Flask(__name__)
app.register_blueprint(fingerprint_router, url_prefix='/fingerprint')


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8001, debug=False)
