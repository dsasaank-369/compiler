FROM node:18-alpine3.18

ENV DEBIAN_FRONTEND=noninteractive
ENV JAVA_HOME="/usr/lib/jvm/java-11-openjdk"
ENV PATH="$JAVA_HOME/bin:$PATH"

RUN apk update && \
    apk add --no-cache \
        openjdk11 \
        python3 \
        py3-pip \
        g++ \
        make \
        curl \
        bash && \
    ln -sf python3 /usr/bin/python && \
    python3 -m ensurepip && \
    pip3 install --no-cache --upgrade pip setuptools wheel

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]