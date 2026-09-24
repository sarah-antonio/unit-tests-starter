const ClienteService = require("../services/ClienteService");

// Teste unitario: o service e testado em isolamento total.
// O repository e substituido por um mock (jest.fn()), assim testamos so a
// logica do service, sem depender de dados reais.
//
// Abaixo ha 1 teste pronto (listar) como referencia de estilo.
// Os demais estao como test.todo — implemente cada um seguindo o ENUNCIADO-02-CLIENTES.md.

describe("ClienteService (unitario com mocks)", () => {
  let service;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }});

    service = new ClienteService(mockRepository);
  });

  describe("listar", () => {
    test("chama repository.findAll uma vez e retorna o resultado", () => {
      const clientes = [{ id: 1, nome: "Ana Souza", email: "ana@email.com" }];
      mockRepository.findAll.mockReturnValue(clientes);

      const resultado = service.listar();

      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(resultado).toEqual(clientes);
    });
  });

  describe("buscarPorId", () => {
    test("repassa o id ao repository e retorna o cliente encontrado", () => {
      const clienteMock = { id: 1, nome: "Ana Souza", email: "ana@email.com" };
      mockRepository.findById.mockReturnValue(clienteMock);

      const resultado = service.buscarPorId(1);

      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(resultado).toEqual(clienteMock);
    });

    describe("criar", () => {
    test("repassa os dados ao repository e retorna o cliente criado", () => {
      const dadosCliente = { nome: "Carlos", email: "carlos@email.com" };
      const clienteCriado = { id: 1, ...dadosCliente };

      mockRepository.findByEmail.mockReturnValue(null);
      mockRepository.create.mockReturnValue(clienteCriado);

      const resultado = service.criar(dadosCliente);

      expect(mockRepository.create).toHaveBeenCalledWith(dadosCliente);
      expect(resultado).toEqual(clienteCriado);
    });
    test("propaga o erro quando nome ou email estiverem faltando", () => {
      // Simula o erro do Service/Model quando faltam dados obrigatorios
      mockRepository.create.mockImplementation(() => {
        throw new Error("Nome e email sao obrigatorios");
      });

      expect(() => service.criar({ nome: "Carlos" })).toThrow("Nome e email sao obrigatorios");
    });

    test("propaga o erro quando o email ja estiver cadastrado", () => {
      mockRepository.create.mockImplementation(() => {
        throw new Error("Email ja cadastrado");
      });

      expect(() => service.criar({ nome: "Ana", email: "ana@email.com" })).toThrow("Email ja cadastrado");
    });
  });
describe("atualizar", () => {
    test("chama repository.findById e repository.update quando o cliente existe", () => {
      const clienteExistente = { id: 1, nome: "Ana", email: "ana@email.com" };
      const dadosAtualizacao = { nome: "Ana Maria", email: "ana@email.com" };
      const clienteAtualizado = { id: 1, ...dadosAtualizacao };

      mockRepository.findById.mockReturnValue(clienteExistente);
      mockRepository.update.mockReturnValue(clienteAtualizado);

      const resultado = service.atualizar(1, dadosAtualizacao);

      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(mockRepository.update).toHaveBeenCalledWith(1, dadosAtualizacao);
      expect(resultado).toEqual(clienteAtualizado);
    });

    test("lanca erro 'Cliente nao encontrado' sem chamar repository.update quando o cliente nao existe", () => {
      mockRepository.findById.mockReturnValue(null);

      expect(() => service.atualizar(999, { nome: "Novo Nome" })).toThrow("Cliente nao encontrado");
      expect(mockRepository.findById).toHaveBeenCalledWith(999);
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

test("propaga o erro quando o novo email ja pertence a outro cliente", () => {
      mockRepository.findById.mockReturnValue({ id: 1, nome: "Ana", email: "ana@email.com" });
      mockRepository.update.mockImplementation(() => {
        throw new Error("Email ja cadastrado");
      });

      expect(() => service.atualizar(1, { nome: "Ana", email: "existente@email.com" })).toThrow("Email ja cadastrado");
    });
  });

  describe("remover", () => {
    test("chama repository.delete com o id correto quando o cliente existe", () => {
      mockRepository.delete.mockReturnValue(true);

      const resultado = service.remover(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
      expect(resultado).toBe(true);
    });

    test("lanca erro 'Cliente nao encontrado' quando o repository retorna false", () => {
      mockRepository.delete.mockReturnValue(false);

      expect(() => service.remover(999)).toThrow("Cliente nao encontrado");
      expect(mockRepository.delete).toHaveBeenCalledWith(999);
    });
  });
});
