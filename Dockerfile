FROM ubuntu:latest
USER root
WORKDIR /home/app
COPY . /home/app
RUN apt-get update \
	&& apt-get -y install curl gnupg \
	&& curl -sL https://deb.nodesource.com/setup_18.x  | bash - \
	&& apt-get -y install nodejs \
	&& npm install \
	&& npm run build:nest

RUN apt-get -qq update \
   	&& apt-get install -y -q \
  	build-essential \
  	curl \
  	&& curl https://sh.rustup.rs -sSf | sh -s -- -y

ENV PATH="/root/.cargo/bin:${PATH}"

RUN npm run build:rust

EXPOSE 8080

CMD [ "npm", "start" ]
