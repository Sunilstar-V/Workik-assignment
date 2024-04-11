from flask import Flask, request, jsonify
from flask_cors import CORS
import openai

app = Flask(__name__)
CORS(app, resources={r"/query": {"origins": "*"}})

openai.api_key = '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'

@app.route('/query', methods=['POST'])
def query():
    if not request.json or 'query' not in request.json:
        return jsonify({'error': 'Invalid request'}), 400

    user_query = request.json['query']

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": user_query}
            ]
        )
        return jsonify({'response': response.choices[0].message['content']})

    except Exception as e:
        print(str(e))   # print error message to console
        return jsonify({'error': 'Error occurred'}), 500

if __name__ == '__main__':
    app.run(debug=True)
