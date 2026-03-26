FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for psutil
RUN apt-get update && apt-get install -y gcc python3-dev

COPY . .

RUN pip install --no-cache-dir fastapi uvicorn psutil sqlalchemy scikit-learn numpy pandas databases[sqlite] websockets

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
