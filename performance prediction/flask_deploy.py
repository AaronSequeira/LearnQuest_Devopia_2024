from flask import Flask, jsonify, request, render_template
import pickle
import pandas as pd
import numpy as np
from sklearn.preprocessing import OneHotEncoder

app = Flask(__name__)

# Load the trained model
model = pickle.load(open('xgboost_model.pkl', 'rb'))

df = pd.read_csv('performance_pred.csv')
encoder = OneHotEncoder()
topics_encoded = encoder.fit_transform(df['topics_lacking'].str.get_dummies(', '))

@app.route('/predict', methods=['POST'])

def predict():
    json_ = request.json
    query_df = pd.DataFrame(json_)
    topics_encoded_query = encoder.transform(query_df['topics_lacking'].str.get_dummies(', '))
    topics_encoded_df = pd.DataFrame(topics_encoded_query.toarray(), columns=encoder.get_feature_names_out(['topics_lacking']))
    # Merge encoded topics with other features
    X = pd.concat([query_df[['no_of_wrong_answer', 'no_of_right_answer', 'ability_score']], topics_encoded_df], axis=1)
    X.columns = X.columns.astype(str)
    prediction = model.predict(X)
    return jsonify({"Prediction": list(prediction)})

if __name__ == '__main__':
    app.run(debug=True)
