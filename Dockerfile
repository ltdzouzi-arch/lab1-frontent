# Dockerfile
FROM alpine:3.6

RUN apk add --no-cache nginx

# Create required tmp dirs
RUN mkdir -p \
    /var/lib/nginx/tmp/client_body \
    /var/lib/nginx/tmp/proxy \
    /var/lib/nginx/tmp/fastcgi \
    /var/lib/nginx/tmp/uwsgi \
    /var/lib/nginx/tmp/scgi

# Replace default 404 config with working one
RUN printf "server {\n\
    listen 80;\n\
    location / {\n\
        root /usr/share/nginx/html;\n\
        index index.html;\n\
    }\n\
}\n" > /etc/nginx/conf.d/default.conf

CMD mkdir -p /run/nginx && nginx -g "daemon off;"