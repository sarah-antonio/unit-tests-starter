const request = require("supertest");
const createApp = require("../app");

describe('API/produtos - testes de integraçao',()=>{
    let app;

    beforeEach(()=>{
        app = createApp();
    });

    describe('GET/ produtos',()=>{
        test('Retorna 200 e um array com os produtos iniciais', async()=>{
            const res = await request(app).get("/produtos");

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(3);
        });

        //teste Get/produtos/:id
    });
    describe('POST /produtos', () => {
    test('Deve retornar 201 e o produto criado com id gerado', async () => {
      const novoProduto = { nome: 'Mouse Gamer', preco: 120 };

      const response = await request(app)
        .post('/produtos')
        .send(novoProduto);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.nome).toBe(novoProduto.nome);
      expect(response.body.preco).toBe(novoProduto.preco);
    });

    test('Deve retornar 400 com { erro: ... } quando o nome estiver faltando', async () => {
      const response = await request(app)
        .post('/produtos')
        .send({ preco: 100 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('erro');
    });

    test('Deve retornar 400 com { erro: ... } quando o preço estiver faltando', async () => {
      const response = await request(app)
        .post('/produtos')
        .send({ nome: 'Monitor' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('erro');
    });

    test('O produto criado deve aparecer em uma chamada seguinte a GET /produtos', async () => {
      const produto = { nome: 'Headset', preco: 250 };

      // 1. Cria o produto
      const postRes = await request(app)
        .post('/produtos')
        .send(produto);

      const produtoCriado = postRes.body;

      // 2. Busca todos os produtos
      const getRes = await request(app).get('/produtos');

      expect(getRes.status).toBe(200);
      // Verifica se a lista contém o objeto criado
      expect(getRes.body).toContainEqual(produtoCriado);
    });
  });

  describe('DELETE /produtos/:id', () => {
    test('Deve retornar 204 quando o produto é removido com sucesso e 404 ao buscar o mesmo produto', async () => {
      // 1. Cria um produto para ser removido em seguida
      const postRes = await request(app)
        .post('/produtos')
        .send({ nome: 'Cadeira Gamer', preco: 800 });

      const idParaRemover = postRes.body.id;

      // 2. Remove o produto
      const deleteRes = await request(app).delete(`/produtos/${idParaRemover}`);
      expect(deleteRes.status).toBe(204);

      // 3. Garante que ele não existe mais
      const getRes = await request(app).get(`/produtos/${idParaRemover}`);
      expect(getRes.status).toBe(404);
    });

    test('Deve retornar 404 com { erro: ... } quando o produto não existir', async () => {
      const idInexistente = 99999;

      const response = await request(app).delete(`/produtos/${idInexistente}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('erro');
    });
  });
});