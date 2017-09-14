FROM node:7
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
ENV NODE_ENV=staging
ENV NAME: sp-json-logger
ENV APPLICATION=api
ENV PROGRAM=sp-json-logger
ENV LANGUAGE=javascript
CMD node test/test.1.js


