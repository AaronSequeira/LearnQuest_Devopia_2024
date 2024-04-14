from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
from flask import Flask, jsonify, request
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

df = pd.read_csv('youtube_urls_by_topic1.csv')


def get_topic_url_dict(list_of_topic):
    vectorizer = TfidfVectorizer(ngram_range=(1,2))
    tfidf = vectorizer.fit_transform(df["Topic"])
    result_dict = {}
    for topic in list_of_topic:
        query_vec = vectorizer.transform([topic])
        similarity = cosine_similarity(query_vec, tfidf).flatten()
        indices = np.argpartition(similarity, -5)[-5:]
        results = df.iloc[indices].iloc[::-1]
        topic_url_dict = results.groupby('Topic')['URL'].apply(list).to_dict()
        result_dict[topic] = topic_url_dict.get(topic, [])
    return result_dict

@app.route('/recommend', methods=['POST'])
def get_topic_url_dict_route():
    try:
        data = request.get_json()
        list_of_topic = data
        result_dict = get_topic_url_dict(list_of_topic)
        return jsonify(result_dict)
    except Exception as e:
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    app.run(port=8080,debug=True)
