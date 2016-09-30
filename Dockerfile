# Demo
#
# VERSION 0.0.1

FROM mhart/alpine-node:4
MAINTAINER Patrizio Bruno <desertconsulting@gmail.com>

ADD https://raw.githubusercontent.com/mvertes/dosu/0.1.0/dosu /sbin/

RUN chmod +x /sbin/dosu && \
  echo http://dl-4.alpinelinux.org/alpine/edge/testing >> /etc/apk/repositories && \
  apk add --no-cache mongodb make gcc g++ git python

RUN mkdir -p /usr/src/demo
WORKDIR /usr/src/demo
COPY ./ /usr/src/demo


RUN apk update && \
    #apk add make gcc g++ python git && \
    npm install --unsafe-perm --production && \
    apk del make gcc g++ python git

RUN /usr/src/demo/install.sh

EXPOSE 8080 8081

ENTRYPOINT ["/usr/bin/demorunall.sh"]
