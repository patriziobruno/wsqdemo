# Demo
#
# VERSION 0.0.1

FROM pitzcarraldo/alpine-node-mongo
MAINTAINER Patrizio Bruno <desertconsulting@gmail.com>

RUN mkdir -p /usr/src/demo
WORKDIR /usr/src/demo
COPY ./ /usr/src/demo


RUN apk update && \
    apk add make gcc g++ python git && \
    npm install --unsafe-perm --production && \
    apk del make gcc g++ python git

RUN /usr/src/demo/install.sh

EXPOSE 8080 8081

ENTRYPOINT ["/usr/bin/demorunall.sh"]
