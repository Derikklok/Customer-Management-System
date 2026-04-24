# Stage 1: Build the React application
FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine
# Copy the build output to replace the default nginx contents.
COPY --from=build /app/dist /usr/share/nginx/html
# Copy a custom nginx configuration to handle SPA routing if necessary
# For Vite/React SPA, we need to ensure index.html is served for all routes
RUN printf "server { \n\
    listen 80; \n\
    location / { \n\
        root /usr/share/nginx/html; \n\
        index index.html index.htm; \n\
        try_files \$uri \$uri/ /index.html; \n\
    } \n\
}" > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
