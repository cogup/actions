# Create dockerfile for build lambda runtime nodejs18.04
FROM node:18-buster

WORKDIR /github/workspace

# Install build tools
RUN apt-get update && apt-get install -y \
    build-essential \
    zip \
    && rm -rf /var/lib/apt/lists/*
    
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

# zip artifacts
ENTRYPOINT ["/entrypoint.sh"]

