FROM node:16-alpine

# Configurar diretório de trabalho
WORKDIR /app

# Copiar arquivos necessários
COPY . /app

# Instalar dependências
RUN npm ci --only=production

# Definir o ponto de entrada
ENTRYPOINT ["node", "/app/src/index.mjs"]
