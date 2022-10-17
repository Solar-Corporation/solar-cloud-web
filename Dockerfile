FROM ubuntu:latest
USER root
WORKDIR /home/app
COPY . /home/app
RUN apt-get update
RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_18.x  | bash -
RUN apt-get -y install nodejs
RUN npm install
RUN npm run build:ts

RUN apt-get -qq update

RUN apt-get install -y -q \
    build-essential \
    curl

RUN curl https://sh.rustup.rs -sSf | sh -s -- -y

ENV PATH="/root/.cargo/bin:${PATH}"

RUN npm run build:rust

EXPOSE 8080

CMD [ "npm", "start" ]
