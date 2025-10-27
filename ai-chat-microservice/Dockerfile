FROM python:3.11-slim

WORKDIR /app

# Install system deps
RUN pip install --no-cache-dir --upgrade pip

# Install Python deps
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy app
COPY app ./app

# Env
ENV AI_CHAT_HOST=0.0.0.0
ENV AI_CHAT_PORT=8001

EXPOSE 8001

# Run
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
