#specifies the version of the code
FROM node:10

#copies the project to a directory in docker. ('/app' is a name we give)
COPY ./ /app

#sets up env variables
ENV NODE_ENV=production

#sets up the working directory
WORKDIR /app

#runs custom scripts
RUN npm run build

#the starting script
ENTRYPOINT node server.js