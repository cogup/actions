FROM ghcr.io/cargo-lambda/cargo-lambda:0.21.1

COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
