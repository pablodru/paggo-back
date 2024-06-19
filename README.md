# Paggo-back

Este é o backend do projeto InvoiceSnap, um sistema que trata o upload de imagens e utiliza o OCR que utiliza o NestJS, Prisma, e AWS Textract para processamento de imagens e autenticação de usuários.

## Descrição

Paggo-back é um serviço backend desenvolvido com NestJS que fornece APIs para upload de imagens e autenticação de usuários. Ele usa Prisma como ORM para interação com o banco de dados e AWS Textract para extrair texto de imagens enviadas. Certifique-se de ter seu cadastro na AWS para usar o Textract.

O deploy do Back-end pode ser utilizado pelo link: [https://paggo-back.onrender.com](https://paggo-back.onrender.com)

O Front-end dessa aplicação está disponível em: [https://www.github.com/pablodru/paggo-front](https://www.github.com/pablodru/paggo-front)

## Instalação

1. Clone o repositório:

    ```sh
    git clone https://github.com/pablodru/paggo-back.git
    cd paggo-back
    ```

2. Instale as dependências:

    ```sh
    npm install
    ```

## Configuração

1. Configure as variáveis de ambiente. Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:

    ```env
    DATABASE_URL=your_database_url
    AWS_ACCESS_KEY_ID=your_aws_access_key
    AWS_SECRET_ACCESS_KEY=your_aws_secret_access
    AWS_REGION=your_aws_region
    ```

2. Configure o Prisma:

    ```sh
    npx prisma generate
    npx prisma migrate dev
    ```

## Inicialização

Para iniciar o servidor, use o comando:

  ```sh
  npm run dev
  ```

## Endpoints

### Autenticação

- **URL:** `POST /auth/signin`
- **Body:**
  - `email`: Email do usuário
  - `token`: Token gerado pelo firebase para o login
- **Resposta:**
  ```json
  {
    "success": Boolean,
    "message": Mensagem referente ao sucesso do login
  }

#### Upload de Imagem

- **URL:** `POST /upload/image`
- **Headers:**
  - `Content-Type: multipart/form-data`
  - `Authorization: Bearer <token>`
- **Body:**
  - `file`: A imagem a ser enviada (jpg, jpeg, png, gif)
- **Resposta:**
  ```json
  {
    "ocrText": "Texto extraído da imagem"
  }

## Tecnologias

- **Node.js**: v14.x
- **NestJS**: v10.x
- **Prisma**: v5.15.0
- **AWS Textract SDK**: v3.592.0
- **Jest**: v29.7.0
- **TypeScript**: v5.1.3
- **Multer**: v1.4.5
