FROM --platform=amd64 node:18-alpine as build-stage

WORKDIR /src

RUN apk add --update --no-cache \
    make \
    g++ \
    jpeg-dev \
    cairo-dev \
    giflib-dev \
    pango-dev \
    libtool \
    autoconf \
    automake

COPY *.json ./

RUN yarn --ignore-engines

COPY . .

# RUN yarn build

COPY *.TTF ./dist

EXPOSE 1000

ENV NODE_ENV=development

CMD ["yarn", "start:dev"]



# # Stage 2: Runtime environment
# FROM --platform=amd64 node:18-alpine3.18 AS final-stage  

# WORKDIR /src

# RUN mkdr node_modules 

# COPY --from=build-stage /src/node_modules /src/.env ./node_modules/ 
# #  Copy application artifacts from the build stage 
# COPY --from=build-stage /src/dist /src/node_modules /src/.env ./

# EXPOSE 9090

# ENV NODE_ENV=development

# CMD ["node" ,"main.js"]