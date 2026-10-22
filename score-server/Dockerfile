FROM python:3.12-alpine
WORKDIR /app
COPY server.py ./
COPY data/scores.jsonl ./data/
VOLUME /data
EXPOSE 8080
HEALTHCHECK --interval=60s --timeout=5s CMD python3 -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8080/health')"
CMD ["python3", "-u", "server.py"]
