# Usa uma imagem base do Node.js
FROM node:20

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos do diretório atual para dentro do contêiner
COPY . .

# Instala as dependências do projeto
RUN npm install

# Expõe a porta 3000 para acesso externo
EXPOSE 3000

# Comando padrão para iniciar a aplicação
CMD ["npm", "start"]
