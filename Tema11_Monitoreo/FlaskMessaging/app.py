from flask import Flask, jsonify
from datetime import datetime
import time
import threading

app = Flask(__name__)
messages = []

# Function to generate a message every second
def generate_messages():
    while True:
        message = {
            "timestamp": datetime.utcnow().isoformat(),
            "content": "This is a message generated every second."
        }
        messages.append(message)
        time.sleep(1)

# Start the background thread to generate messages
threading.Thread(target=generate_messages, daemon=True).start()

@app.route('/messages', methods=['GET'])
def get_messages():
    return jsonify(messages)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5100)
