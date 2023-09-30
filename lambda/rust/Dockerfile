FROM ghcr.io/cargo-lambda/cargo-lambda:0.21.1

RUN apt-get update
RUN apt-get install -y zip

COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
