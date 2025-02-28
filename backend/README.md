# CDP Chatbot - Backend
## Setup & Run

### Install dependencies
```sh
pip install -r requirements.txt


Post request
Invoke-WebRequest -Uri "http://127.0.0.1:5000/ask" `
    -Method Post `
    -Headers @{"Content-Type"="application/json"} `
    -Body '{"question": "How do I set up a source in Segment?"}'
