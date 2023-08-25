# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

ARG DATABASE_URL=postgres://root:root@localhost:5432/parts
ARG NEXTAUTH_SECRET=aegrwsgwrgrsgvtjyugjndxbryhytrfdsvr

ENV DATABASE_URL=$DATABASE_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install @prisma/client
COPY . .

RUN npx prisma generate --schema ./prisma/schema.prisma


# Build the Next.js application
RUN npm run build

# Expose the port that the application will run on
EXPOSE 3000

# Command to run when the container starts
CMD ["npm", "start"]
