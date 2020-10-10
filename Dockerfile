FROM nginx:alpine


ADD ./dist/ /usr/share/nginx/html/

COPY ./default.conf /etc/nginx/conf.d/