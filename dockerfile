# Use an official Node runtime as a parent image
# Here we use Node.js version 16 to ensure support for modern JavaScript features
FROM node:24

# Set the working directory inside the container
# This is where all the following commands will be executed
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
# This is done to take advantage of Docker's caching mechanism
COPY package*.json ./

# Install the dependencies specified in package.json
# This ensures all necessary modules are available for the app
RUN npm install

# Copy the rest of the application's source code to the working directory
# This includes all other files and folders in the project directory
COPY . .

# Expose port 8080 to the outside world
# This is the port the application will run on and should be accessible from outside the container
EXPOSE 3001
# EXPOSE 8080

# Define the command to run the application
# Here we specify to run the index.mjs file using Node.js
CMD ["node", "index.mjs"]
