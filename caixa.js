class CaixaEletronico {
    constructor() {
        this.cedulas = { 200: 0, 100: 0, 50: 0, 20: 0, 10: 0, 5: 0, 2: 0 };
        this.logs = [];
    }



    /**
     * Retorna o saldo total disponível no caixa
     * @returns {number}
     */
    saldo() {
        return Object.entries(this.cedulas).reduce((total, [valor, quantidade]) => total + (valor * quantidade), 0);
    }



    /**
     * Deposita notas no caixa
     * @param {object} deposito - Ex: { 100: 2, 50: 1 }
     */
    depositar(deposito) {
        for (let valor in deposito) 
            this.cedulas[valor] += deposito[valor];

        this.registrarLog("Depósito realizado", this.formatarNotas(deposito));
    }



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
            const qtdNecessaria = Math.floor(restante / nota);
            const qtdDisponivel = this.cedulas[nota];
            const qtdUsada = Math.min(qtdNecessaria, qtdDisponivel);

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
}






// #################
// ### SIMULAÇÃO ###
// #################

let caixa = new CaixaEletronico()

// Deposita algumas notas
caixa.depositar({ 200: 1, 50: 2, 10: 3 })

// Exibe saldo e realiza saques possíveis
console.log("Saldo:", caixa.saldo())
console.log("Saque de R$260:", caixa.sacar(260))

// Exibe o novo saldo e tenta realizar saque impossível
console.log("Saldo:", caixa.saldo())
console.log("Novo saque de R$120")
console.log("Saque impossível:", caixa.sacar(120))

// Exibe logs
console.log(caixa.logs.join("\n"))
