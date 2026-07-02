# 빌드 스테이지
# Node.js 20 경량(alpine) 이미지를 베이스로 사용
# AS build = 이 스테이지를 'build'로 명명 (2단계에서 참조)
FROM node:20-alpine AS build

# 컨테이너 안 작업 디렉토리 설정
WORKDIR /app

# package.json, package-lock.json 먼저 복사
# 소스코드와 분리해서 캐시 재사용
COPY package.json package-lock.json ./

# 의존성 설치
RUN npm ci

# 빌드 시 외부에서 주입 가능한 변수 선언
# 기본값: http://localhost:8088/api
ARG REACT_APP_API_BASE_URL=http://localhost:8088/api
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

# 나머지 소스코드 전체 복사
COPY . .
# React 앱 빌드
# 결과물: /app/build 폴더에 HTML, CSS, JS 정적 파일 생성
RUN npm run build

# 실행 스테이지 - Nginx로 정적 파일 서빙
FROM nginx:alpine

# 빌드 결과물만 가져옴
COPY --from=build /app/build /usr/share/nginx/html

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf
# 명시한것 없어도 상관없다.
EXPOSE 80

# Nginx 실행
# daemon off = 백그라운드 실행 안 함 (포그라운드 유지)
# 컨테이너가 종료되지 않고 계속 실행됨
CMD ["nginx", "-g", "daemon off;"]
