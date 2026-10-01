const {soma, subtrai, multiplica, divide, ehPar, raiz, media,} = require("./calculadora");


describe("soma",()=> {
    test("soma dois numeros positivos",()=>{
        expect(soma(2, 3)).toBe(5);
    });

    //soma com numero negativo  
});

describe("raiz",()=>{
    test("calcule a raiz de numero nao exato com precisao",() => {
        expect(raiz(2)).toBeCloseTo(1.414);
    });

    test("Lança erro para numero negativo",()=>{
        expect(() =>  raiz(-4)).toThrow(
            "Nao e possivel calcular raiz de numero negativo",
        );
    });
});

describe ("subtrai",()=>{
    test("Deve retornar o resultado correto da subtracao",()=>{
        expect(subtrai(5, 2)).toBe(3);
    });
});

describe ("multiplica",()=>{
    test("Deve retornar o produto correto de dois numeros",()=>{
        expect(multiplica(3, 4)).toBe(12);
    });
});

describe ("divide",()=>{
    test("Deve retornar o resultado correto da divisao", ()=>{
        expect(divide(10, 2 )).toBe(5);
    });
    test("Nao e possivel dividir por zero",()=>{
        expect(ehPar(0)).toThrow;
    });
});


describe ("ehPar",()=>{
    test("Deve retornar um valor verdadeiro para numero par",()=>{
        expect(ehPar(4)).toBe(true);
    });

    test("retorna falso para numero impar",()=>{
        expect(ehPar(5)).toBe(false);
    });
});

describe ("media",()=>{
    test("Deve calcular corretamente a media de uma lista de inteiros",()=>{
        expect(media(6, 8)).toBe(7);
    });
});