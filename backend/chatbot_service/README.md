# FarmStellar Chatbot Service

This is the Python-based chatbot service for FarmStellar.

## Setup

1.  Open a terminal in this directory: `e:\farm_stellar\chatbot_service`
2.  Create a virtual environment (optional but recommended):
    ```bash
    python -m venv .venv
    .\.venv\Scripts\activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Create a `.env` file in this directory with your Google API Key:
    ```
    GOOGLE_API_KEY=your_api_key_here
    ```

## Running the Bot

Run the server using uvicorn:

```bash
uvicorn bot:app --reload --port 8000
```

The chatbot will be available at `http://localhost:8000`.
The frontend is configured to talk to this URL.
