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


  /**
   * Realiza um saque do valor solicitado, se possível
   * 
   * @param {int} valor 
   * @returns 
   */
  sacar(valor) {
    let saque = {};
    let restante = valor;

    const notasDisponiveis = Object.keys(this.cedulas).map(Number).sort((a, b) => b - a);

    for (let nota of notasDisponiveis) {
      const quantidadeNecessaria = Math.floor(restante / nota);
      const quantidadeDisponivel = this.cedulas[nota];
      const quantidadeUtilizada = Math.min(quantidadeNecessaria, quantidadeDisponivel);

      if (quantidadeUtilizada > 0) {
        saque[nota] = quantidadeUtilizada;
        restante -= nota * quantidadeUtilizada;
      }
    }

    
    if (restante === 0) {
      for (let nota in saque) {
        this.cedulas[nota] -= saque[nota];
      }

      this.registrarLog(
        "Saque realizado",
        `R$${valor} -> ${this.formatarNotas(saque)}`
      );

      return saque;
    } else {
      this.registrarLog(
        "Erro no saque",
        `Não foi possível montar R$${valor}`
      );
      return null;
    }
  }




  // Formata um objeto de notas em string legível (ex: "1x R$200, 2x R$50")
  formatarNotas(notas) {
    return Object.entries(notas)
      .map(([valor, qtd]) => `${qtd}x R$${valor}`)
      .join(", ");
  }

  // Registra eventos no log interno
  registrarLog(evento, mensagem) {
    const data = new Date().toLocaleString();
    this.logs.push(`[${data}] ${evento}: ${mensagem}`);
  }
}




// #################
// ### SIMULAÇÃO ###
// #################

let caixa = new CaixaEletronico();
caixa.depositar({ 200: 1, 50: 2, 10: 3 });

console.log("Saldo:", caixa.saldo());
console.log("Saque:", caixa.sacar(260));
console.log("Saque impossível:", caixa.sacar(120));
console.log(caixa.logs.join("\n"));