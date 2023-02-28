FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm i --production

COPY . .

ENV PORT=5000
ENV MONGO_URI=mongodb+srv://user:3KrpnpJriNwMb0LX@thoughtscape-cluster.deycvnr.mongodb.net/thoughtscape-database?retryWrites=true&w=majority
ENV JWT_SECRET=betterthanbrainscape

CMD ["npm", "start"]
EXPOSE 5000
