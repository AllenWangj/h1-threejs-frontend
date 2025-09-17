FROM registry.cn-hangzhou.aliyuncs.com/maxtan-frontend/node-18.18.2:4.30

RUN npm config set registry https://registry.npmmirror.com
 
COPY ./ /workspace/

COPY deploy/nginx.conf /etc/nginx/nginx.conf

WORKDIR /workspace

RUN pnpm install --frozen-lockfile

RUN pnpm build

RUN cp -rf /workspace/.output/* /var/lib/nginx/html

EXPOSE 80

ENTRYPOINT nginx -g 'daemon off;'