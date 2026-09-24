const ProdutoService = require("../services/ProdutoService");

describe("ProdutoService - testes unitarios",()=>{
    let service;
    let mockRepository;

    beforeEach(()=>{
        mockRepository = {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
        };
        service = new ProdutoService(mockRepository);
    });
    describe("listar",()=>{
        test("chama repository.findAll uma vez e retorna o resultado", ()=> {
            const produtos = [{id: 1,nome:"coxinha",preco:5}]
            mockRepository.findAll.mockReturnValue(produtos)

            const resultado = service.listar()

            expect(mockRepository.findAll).toHaveBeenCalledTimes(1) // verificar se o mock foi chamado uma unica vez 
            expect(resultado).toEqual(produtos)
        });
    });

    describe('criar', () => {
    test('Deve repassar dados para mockRepository.create e retornar o produto criado', async () => {
      // 1. Dados de entrada e produto esperado
      const dadosProduto = { nome: 'Teclado', preco: 150 };
      const produtoCriado = { id: 1, ...dadosProduto };

      // 2. Configura o mock do repository para retornar o produto
      mockRepository.create.mockResolvedValue(produtoCriado);

      // 3. Executa o método do service
      const resultado = await produtoService.criar(dadosProduto);

      // 4. Asserções
      expect(mockRepository.create).toHaveBeenCalledWith(dadosProduto);
      expect(resultado).toEqual(produtoCriado);
    });

    test('Deve propagar o erro lançado pelo repository quando os dados forem inválidos', async () => {
      const dadosInvalidos = { preco: 150 }; // sem nome
      const erroRepository = new Error('Nome é obrigatório');

      // Configura o mock para simular uma rejeição/erro
      mockRepository.create.mockRejectedValue(erroRepository);

      // Asserção para funções assíncronas que lançam erro
      await expect(produtoService.criar(dadosInvalidos)).rejects.toThrow('Nome é obrigatório');
    });
  });

  describe('remover', () => {
    test('Deve chamar mockRepository.delete com o id correto quando o produto existe', async () => {
      const id = 1;
      // Simula que a exclusão no repository funcionou (retorna true ou o item removido)
      mockRepository.delete.mockResolvedValue(true);

      // Garante que a chamada não lança nenhum erro
      await expect(produtoService.remover(id)).resolves.not.toThrow();
      expect(mockRepository.delete).toHaveBeenCalledWith(id);
    });

    test("Deve lançar erro 'Produto não encontrado' quando o repository retornar false", async () => {
      const idInexistente = 999;
      // Simula que o produto não foi encontrado para deletar
      mockRepository.delete.mockResolvedValue(false);

      await expect(produtoService.remover(idInexistente)).rejects.toThrow('Produto não encontrado');
      expect(mockRepository.delete).toHaveBeenCalledWith(idInexistente);
    });
  });
});