#FROM ubuntu:latest
#USER root
#WORKDIR /home/app
#COPY . /home/app
#RUN apt-get update \
#	&& apt-get -y install curl gnupg \
#	&& curl -sL https://deb.nodesource.com/setup_18.x  | bash - \
#	&& apt-get -y install nodejs \
#	&& npm install \
#	&& npm run build:nest
#
#RUN apt-get -qq update \
#   	&& apt-get install -y -q \
#  	build-essential \
#  	curl \
#  	&& curl https://sh.rustup.rs -sSf | sh -s -- -y

#ENV PATH="/root/.cargo/bin:${PATH}"
#FROM node
#MAINTAINER Dany Laporte

#RUN apt-get update && \
#    apt-get install --no-install-recommends -y \
#    ca-certificates curl file \
#    build-essential \
#    autoconf automake autotools-dev libtool xutils-dev && \
#    rm -rf /var/lib/apt/lists/*
#
#ENV SSL_VERSION=1.0.2k
#
#RUN curl https://www.openssl.org/source/openssl-$SSL_VERSION.tar.gz -O && \
#    tar -xzf openssl-$SSL_VERSION.tar.gz && \
#    cd openssl-$SSL_VERSION && ./config && make depend && make install && \
#    cd .. && rm -rf openssl-$SSL_VERSION*
#
#ENV OPENSSL_LIB_DIR=/usr/local/ssl/lib \
#    OPENSSL_INCLUDE_DIR=/usr/local/ssl/include \
#    OPENSSL_STATIC=1
#
#RUN curl https://sh.rustup.rs -sSf | \
#    sh -s -- --default-toolchain nightly -y
#
#ENV PATH=/root/.cargo/bin:$PATH

FROM cimg/rust:1.65-node
USER root
COPY . /home/app
WORKDIR /home/app

ENV PATH=/root/.cargo/bin:$PATH
RUN npm install
RUN npm run build:nest
RUN rustup default stable
RUN npm run build:rust

EXPOSE 8080

CMD [ "npm", "start" ]
