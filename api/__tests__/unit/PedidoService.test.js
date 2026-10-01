const PedidoService = require("../../services/PedidoService");

// Teste unitario: o service e testado em isolamento total.
// O repository e substituido por um mock (jest.fn()), assim testamos so a
// logica do service, sem depender de dados reais.
//
// Abaixo ha 1 teste pronto (listar) como referencia de estilo.
// Os demais estao como test.todo — implemente cada um seguindo o ENUNCIADO-03-PEDIDOS.md.

describe("PedidoService (unitario com mocks)", () => {
  let service;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      updateStatus: jest.fn(),
      delete: jest.fn(),
    };

    service = new PedidoService(mockRepository);
  });

  describe("listar", () => {
    test("chama repository.findAll uma vez e retorna o resultado", () => {
      const pedidos = [
        {
          id: 1,
          cliente: "Ana Souza",
          itens: [],
          status: "pendente",
          total: 0,
        },
      ];
      mockRepository.findAll.mockReturnValue(pedidos);

      const resultado = service.listar();

      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(resultado).toEqual(pedidos);
    });
  });

  describe("buscarPorId", () => {
    test("Deve repassar o id ao mockRepository.findById e retornar o pedido encontrado", () => {
      const pedidoMock = {
        id: 1,
        cliente: "Ana Souza",
        itens: [{ nome: "Coxinha", precoUnitario: 5, quantidade: 2 }],
        status: "pendente",
        total: 10,
      };
      mockRepository.findById.mockReturnValue(pedidoMock);

      const resultado = service.buscarPorId(1);

      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(resultado).toEqual(pedidoMock);
    });

    test("Deve lancar erro 'Pedido nao encontrado' quando o repository retornar null", () => {
      mockRepository.findById.mockReturnValue(null);

      expect(() => service.buscarPorId(999)).toThrow("Pedido nao encontrado");
      expect(mockRepository.findById).toHaveBeenCalledWith(999);
    });
  });

  describe("criar", () => {
    test("Deve repassar dados para mockRepository.create e retornar o pedido criado", () => {
      const dadosEntrada = {
        cliente: "Ana Souza",
        itens: [{ nome: "Coxinha", precoUnitario: 5, quantidade: 2 }],
      };
      const pedidoCriado = {
        id: 1,
        ...dadosEntrada,
        status: "pendente",
        total: 10,
      };

      mockRepository.create.mockReturnValue(pedidoCriado);

      const resultado = service.criar(dadosEntrada);

      expect(mockRepository.create).toHaveBeenCalledWith(dadosEntrada);
      expect(resultado).toEqual(pedidoCriado);
    });

    test("Deve propagar o erro quando o cliente estiver faltando", () => {
      mockRepository.create.mockImplementation(() => {
        throw new Error("Cliente e obrigatorio");
      });

      expect(() =>
        service.criar({ itens: [{ nome: "Coxinha", precoUnitario: 5, quantidade: 2 }] })
      ).toThrow("Cliente e obrigatorio");
    });

    test("Deve propagar o erro quando a lista de itens estiver vazia", () => {
      mockRepository.create.mockImplementation(() => {
        throw new Error("O pedido deve conter ao menos um item");
      });

      expect(() =>
        service.criar({ cliente: "Ana Souza", itens: [] })
      ).toThrow("O pedido deve conter ao menos um item");
    });

    test("Deve propagar o erro quando algum item tiver preco ou quantidade invalidos", () => {
      mockRepository.create.mockImplementation(() => {
        throw new Error("Preco unitario e quantidade devem ser validos");
      });

      const dadosInvalidos = {
        cliente: "Ana Souza",
        itens: [{ nome: "Coxinha", precoUnitario: -5, quantidade: 0 }],
      };

      expect(() => service.criar(dadosInvalidos)).toThrow(
        "Preco unitario e quantidade devem ser validos"
      );
    });
  });

  describe("atualizarStatus", () => {
    test("Deve chamar mockRepository.findById e depois mockRepository.updateStatus quando o pedido existe", () => {
      const pedidoExistente = { id: 1, status: "pendente" };
      const pedidoAtualizado = { id: 1, status: "pago" };

      mockRepository.findById.mockReturnValue(pedidoExistente);
      mockRepository.updateStatus.mockReturnValue(pedidoAtualizado);

      const resultado = service.atualizarStatus(1, "pago");

      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(mockRepository.updateStatus).toHaveBeenCalledWith(1, "pago");
      expect(resultado).toEqual(pedidoAtualizado);
    });

    test("Deve lancar erro 'Pedido nao encontrado' sem chamar mockRepository.updateStatus quando findById retornar null", () => {
      mockRepository.findById.mockReturnValue(null);

      expect(() => service.atualizarStatus(999, "pago")).toThrow(
        "Pedido nao encontrado"
      );
      expect(mockRepository.findById).toHaveBeenCalledWith(999);
      expect(mockRepository.updateStatus).not.toHaveBeenCalled();
    });

    test("Deve propagar o erro quando o novo status for invalido", () => {
      mockRepository.findById.mockReturnValue({ id: 1, status: "pendente" });
      mockRepository.updateStatus.mockImplementation(() => {
        throw new Error("Status invalido");
      });

      expect(() => service.atualizarStatus(1, "entregue")).toThrow(
        "Status invalido"
      );
    });

    test("Deve propagar o erro quando o pedido ja estiver cancelado", () => {
      mockRepository.findById.mockReturnValue({ id: 1, status: "cancelado" });
      mockRepository.updateStatus.mockImplementation(() => {
        throw new Error("Pedido cancelado nao pode ser alterado");
      });

      expect(() => service.atualizarStatus(1, "pago")).toThrow(
        "Pedido cancelado nao pode ser alterado"
      );
    });
  });

  describe("remover", () => {
    test("Deve chamar mockRepository.delete com o id correto quando o pedido existe", () => {
      mockRepository.delete.mockReturnValue(true);

      const resultado = service.remover(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
      expect(resultado).toBe(true);
    });

    test("Deve lancar erro 'Pedido nao encontrado' quando o repository retornar false", () => {
      mockRepository.delete.mockReturnValue(false);

      expect(() => service.remover(999)).toThrow("Pedido nao encontrado");
      expect(mockRepository.delete).toHaveBeenCalledWith(999);
    });
  });
});
