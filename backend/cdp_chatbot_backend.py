from flask import Flask, request, jsonify
import faiss
import numpy as np
import json
from sentence_transformers import SentenceTransformer
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def load_docs():
    with open("cdp_chatbot\\backend\\cdp_docs.json", "r", encoding="utf-8") as f:
        return json.load(f)

docs = load_docs()
model = SentenceTransformer("all-MiniLM-L6-v2") 

doc_texts = [doc["text"] for doc in docs]
doc_embeddings = model.encode(doc_texts)

d = doc_embeddings.shape[1]
index = faiss.IndexFlatL2(d)
index.add(np.array(doc_embeddings, dtype=np.float32))

@app.route("/", methods=["GET"])
def home():
    return "CDP Chatbot API is running. Send a POST request to /ask."

@app.route("/ask", methods=["POST"])
def ask():
    data = request.json
    question = data.get("question")
    if not question:
        return jsonify({"error": "No question provided"}), 400

    question_embedding = model.encode([question])
    D, I = index.search(np.array(question_embedding, dtype=np.float32), k=3)

    results = [docs[i] for i in I[0]]
    return jsonify({"answers": results})

if __name__ == "__main__":
    app.run(debug=True)