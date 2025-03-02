FROM node:latest

# Set working dir
WORKDIR /app

# Copy package.json and install dep
COPY package.json .
# Copy the entrie app to the container
COPY . .
# INstall the dependencies
RUN npm install
# Build the next.js app
RUN npm run build

# Expose the port 3000
EXPOSE 3000

# Start the server
CMD [ "npm", "start" ]