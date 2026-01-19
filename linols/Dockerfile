# LinOLS Web Interface Docker Image
FROM ubuntu:22.04

# Install dependencies
RUN apt-get update && apt-get install -y \
    wine64 \
    xvfb \
    x11vnc \
    fluxbox \
    wget \
    curl \
    unzip \
    python3 \
    python3-pip \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip3 install flask flask-cors websockets

# Create app directory
WORKDIR /app

# Copy LinOLS files (you need to provide these)
COPY linols-files/ /app/linols/
COPY web-interface/ /app/web/

# Set up Wine environment
ENV WINEPREFIX=/app/.wine
ENV DISPLAY=:99

# Initialize Wine
RUN wine64 --version

# Copy startup script
COPY start-linols.sh /app/start-linols.sh
RUN chmod +x /app/start-linols.sh

# Expose ports
EXPOSE 8080 5900

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Start LinOLS
CMD ["/app/start-linols.sh"]