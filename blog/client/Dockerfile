FROM node:alpine

WORKDIR /app

# Set environment variable for React app
ENV PORT=3002

COPY package.json .
RUN npm install
COPY ./ ./

# Optional: expose the port your app will run on
EXPOSE 3002

CMD ["npm", "start"]
