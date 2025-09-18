FROM registry.cn-hangzhou.aliyuncs.com/maxtan-frontend/node-nginx:99b9268d as builder

RUN npm config set registry https://registry.npmmirror.com
 
COPY ./ /workspace/

WORKDIR /workspace

RUN pnpm install --frozen-lockfile

RUN pnpm build:test

FROM registry.cn-hangzhou.aliyuncs.com/maxtan-frontend/nginx:99b9268d

COPY deploy/nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /workspace/.output /var/lib/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]