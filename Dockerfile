# Base image
FROM node:20.9.0-alpine

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN yarn

# Copy the rest of the source files into the image.
COPY . .

# Run the application.
CMD node triggerCron.js
