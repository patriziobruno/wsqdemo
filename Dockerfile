# Demo
#
# VERSION 0.0.1

#FROM mhart/alpine-node:4
FROM anshulguleria/ubuntu-node-mongo
MAINTAINER Patrizio Bruno <desertconsulting@gmail.com>

ADD https://raw.githubusercontent.com/mvertes/dosu/0.1.0/dosu /sbin/

RUN chmod +x /sbin/dosu \
  && apt update \
  && apt install --assume-yes make gcc g++ git python bash

RUN mkdir -p /usr/src/demo
WORKDIR /usr/src/demo
COPY ./ /usr/src/demo


RUN apt update && \
    #apk add make gcc g++ python git && \
    npm install --unsafe-perm --production

RUN chmod +x /usr/src/demo/install.sh
RUN bash -c /usr/src/demo/install.sh
RUN apt remove --assume-yes make gcc g++ python git
RUN apt clean
RUN apt autoremove --assume-yes
ADD demorunall.sh /usr/bin
RUN chmod +x /usr/bin/demorunall.sh
RUN mkdir -p /data/db

EXPOSE 8081 8082

ENTRYPOINT ["/usr/bin/demorunall.sh"]
