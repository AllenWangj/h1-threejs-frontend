FROM registry.cn-hangzhou.aliyuncs.com/maxtan-frontend/node-18.18.2:4.30 as builder

RUN npm config set registry https://registry.npmmirror.com
 
COPY ./ /workspace/

WORKDIR /workspace

RUN pnpm install --no-frozen-lockfile

RUN pnpm build:test

FROM registry.cn-hangzhou.aliyuncs.com/maxtan-frontend/nginx:99b9268d

COPY deploy/nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /workspace/.output /var/lib/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]