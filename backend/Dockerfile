FROM python:3.10-slim

WORKDIR /app

# Install system dependencies if needed (e.g. gcc for compilation)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install email-validator and httpx explicitly to ensure it runs in container
RUN pip install --no-cache-dir email-validator httpx

COPY . .

# Create persistent storage directories
RUN mkdir -p data/uploads data/reports

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
