from flask import Flask
import logging

app = Flask(__name__)

@app.route('/')
def home():
    app.logger.info("Home page accessed")
    return "Hello, DevOps Monitoring!"

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    app.run(host='0.0.0.0', port=5000)
