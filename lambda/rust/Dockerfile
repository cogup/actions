# create dockerfile rust
FROM rust:1

WORKDIR /github/workspace

RUN apt-get update
RUN apt-get install -y \
    build-essential \
    zip \
    python3 \
    python3-pip

RUN pip3 install cargo-lambda

COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
