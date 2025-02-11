# backend/Dockerfile
FROM python:3.9-slim

WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    build-essential \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

# Copiar APENAS o backend e galerias
COPY ./backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./backend /app

RUN chmod -R a+rwx /app/galerias  # ✅ Adiciona permissões

EXPOSE $PORT

CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT} --timeout 300 app:app"]