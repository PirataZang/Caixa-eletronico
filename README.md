# Teste Técnico – Sistema de Caixa Eletrônico  

Este projeto foi desenvolvido em **JavaScript puro (ES6+)**, seguindo as instruções do teste técnico.  
O sistema simula um **Caixa Eletrônico orientado a objetos**, permitindo depósitos, saques e registrando eventos em log.  

---

## 📌 Tecnologias Utilizadas
- **JavaScript (sem frameworks ou bibliotecas externas)**  

---

## ✅ Funcionalidades Implementadas  

### **Questão 1 – Estoque de Cédulas**
Classe para representar o **estoque do caixa eletrônico**, permitindo depósitos e consulta ao valor total.  

```js
class CaixaEletronico {
  constructor() {
    this.cedulas = { 200: 0, 100: 0, 50: 0, 20: 0, 10: 0, 5: 0, 2: 0};
    this.logs = [];
  }


  /**
   * 
   * @returns {number} Saldo total disponível no caixa
   */
  saldo() {
    return Object.entries(this.cedulas)
      .reduce((total, [valor, quantidade]) => total + (valor * quantidade), 0);
  }


  /**
   * depositar notas no caixa
   * 
   * @param {object} deposito 
   */
  depositar(deposito) {
    for (let valor in deposito) {
      this.cedulas[valor] += deposito[valor];
    }
    this.registrarLog(
      "Depósito realizado",
      this.formatarNotas(deposito)
    );
  }
}
```

---

### **Questão 2 – Saque**
Implementação da regra de saque, sempre retornando a **menor quantidade de cédulas possível**.  

```js
/**
 * Realiza um saque, se possível
 * @param {number} valor - Valor solicitado
 * @returns {object|null} - Retorna objeto com notas ou null se não for possível
 */
sacar(valor) {
    let saque = {};
    let restante = valor;

    const notasDisponiveis = Object.keys(this.cedulas)
        .map(Number)
        .sort((a, b) => b - a); // Maior para menor

    // Calcula o saque para o valor solicitado utilizando a menor quantidade de notas disponíveis
    for (let nota of notasDisponiveis) {
        let qtdNecessaria = Math.floor(restante / nota);
        let qtdDisponivel = this.cedulas[nota];
        let qtdUsada = Math.min(qtdNecessaria, qtdDisponivel);

        if (qtdUsada > 0) {
            saque[nota] = qtdUsada;
            restante -= nota * qtdUsada;
        }
    }

    // Atualiza o caixa após saque bem-sucedido
    if (restante === 0) {
        for (let nota in saque) {
            this.cedulas[nota] -= saque[nota];
        }

        this.registrarLog(
            "Saque realizado",
            `R$${valor} -> ${this.formatarNotas(saque)}`
        );

        return saque;
    }

    // Saque impossível
    this.registrarLog("Erro no saque", `Não foi possível montar R$${valor}`);

    return null;
}
```

---

### **Questão 3 – Notificações e Log**
Foi criada uma interface simples de **notificação**, com implementação para log no próprio Caixa, permitindo a visualização das açöes realizadas.  

```js
/**
 * Formata um objeto de notas em string legível
 * Exemplo: {200:1, 50:2} -> "1x R$200, 2x R$50"
 * @param {object} notas
 * @returns {string}
 */
formatarNotas(notas) {
    return Object.entries(notas).map(([valor, qtd]) => `${qtd}x R$${valor}`).join(", ");
}

/**
 * Registra eventos no log interno
 * @param {string} evento
 * @param {string} mensagem
 */
registrarLog(evento, mensagem) {
    const data = new Date().toLocaleString();
    this.logs.push(`[${data}] ${evento}: ${mensagem}`);
}
```

Exemplo de log:
```js
console.log(caixa.log)

[22/04/2025 15:47:02] Depósito realizado: 1x R$200, 2x R$50, 3x R$10
[22/04/2025 15:50:11] Saque realizado: R$260
[22/04/2025 15:53:45] Erro no saque: Não foi possível montar R$120 com as cédulas disponíveis
```

---

### **Questão 4 – Composição Impossível**
Implementada lógica que detecta quando o valor **existe no caixa**, mas não pode ser entregue.  

```js
/**
 * Valida se o valor informado pode ser sacado
 * 
 * @param {int} valor 
 * @returns {string}
 */
valoresDisponiveisSaque(valor) {
    let saquesimulado = new CaixaEletronico()
    saquesimulado.cedulas = { ...this.cedulas } // Clona o estado atual do caixa

    let notasFormatadas = Object.entries(this.cedulas).map(([nota, qtd]) => ({ nota: Number(nota), qtd })).filter(n => n.qtd > 0)
    let valoresDisponiveis = notasFormatadas.map(n => `${n.qtd}x R$${n.nota}`).join(", ")

    let message = saquesimulado.sacar(valor) == null ? `Impossível de sacar o valor de R$${valor} devido as cédulas disponíveis neste caixa, possibilitando apenas o saque de ${valoresDisponiveis}.` : `Saque possível no valor de R$${valor}.`;

    this.registrarLog("Validação de saque", message);
}
```
---

## 🎯 Conclusão
O sistema foi desenvolvido de forma **orientada a objetos, modular e em JavaScript puro**, respeitando todas as regras do enunciado.  
O código está **estruturado, comentado e com nomes claros** para métodos e variáveis, conforme solicitado.  
