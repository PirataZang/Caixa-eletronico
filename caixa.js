class CaixaEletronico {
    constructor() {
        this.cedulas = { 200: 0, 100: 0, 50: 0, 20: 0, 10: 0, 5: 0, 2: 0 };
        this.logs = [];
    }



    /**
     * Retorna o saldo total disponível no caixa
     * 
     * @returns {number}
     */
    saldo() {
        return Object.entries(this.cedulas).reduce((total, [valor, quantidade]) => total + (valor * quantidade), 0)
    }



    /**
     * Deposita notas no caixa
     * 
     * @param {object} deposito - Ex: { 100: 2, 50: 1 }
     */
    depositar(deposito) {
        for (let valor in deposito) 
            this.cedulas[valor] += deposito[valor]

        this.registrarLog("Depósito realizado", this.formatarNotas(deposito))
    }



    /**
     * Realiza um saque, se possível
     * 
     * @param {number} valor - Valor solicitado
     * @returns {object|null} - Retorna objeto com notas ou null se não for possível
     */
    sacar(valor) {
        let saque = {}
        let restante = valor

        const notasDisponiveis = Object.keys(this.cedulas).map(Number).sort((a, b) => b - a) // Maior para menor

        // Calcula o saque para o valor solicitado utilizando a menor quantidade de notas disponíveis
        for (let nota of notasDisponiveis) {
            let qtdNecessaria = Math.floor(restante / nota)
            let qtdDisponivel = this.cedulas[nota]
            let qtdUsada = Math.min(qtdNecessaria, qtdDisponivel)

            if (qtdUsada > 0) {
                saque[nota] = qtdUsada
                restante -= nota * qtdUsada
            }
        }

        // Atualiza o caixa após saque bem-sucedido
        if (restante === 0) {
            for (let nota in saque) 
                this.cedulas[nota] -= saque[nota]

            this.registrarLog("Saque realizado", `R$${valor} -> ${this.formatarNotas(saque)}`);

            return saque
        }

        // Saque impossível
        this.registrarLog("Erro no saque", `Não foi possível montar R$${valor} com as cédulas disponíveis.`)

        return null
    }



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



    /**
     * Formata um objeto de notas em string legível
     * Exemplo: {200:1, 50:2} -> "1x R$200, 2x R$50"
     * 
     * @param {object} notas
     * @returns {string}
     */
    formatarNotas(notas) {
        return Object.entries(notas).map(([valor, qtd]) => `${qtd}x R$${valor}`).join(", ")
    }



    /**
     * Registra eventos no log interno
     * 
     * @param {string} evento
     * @param {string} mensagem
     */
    registrarLog(evento, mensagem) {
        const data = new Date().toLocaleString()
        this.logs.push(`[${data}] ${evento}: ${mensagem}`)
    }
}






// #################
// ### SIMULAÇÃO ###
// #################

let caixa = new CaixaEletronico()

// Deposita algumas notas
caixa.depositar({ 200: 1, 50: 1, 10: 3 })
console.log("Depósito realizado.");

// Valida se o saque é possível no valor solicitado
caixa.valoresDisponiveisSaque(200);
console.log("Validação de saque para R$200 realizada.");

// Exibe saldo e realiza saques possíveis
console.log("Saldo:", caixa.saldo())
console.log("Saque de R$260:", caixa.sacar(260))

// Exibe o novo saldo e tenta realizar saque impossível
console.log("Saldo:", caixa.saldo())
console.log("Novo saque de R$120")
console.log("Saque impossível:", caixa.sacar(120))

// Valida novamente se o saque é possível no valor solicitado
caixa.valoresDisponiveisSaque(120);
console.log("Validação de saque para R$120 realizada.");

// Exibe logs
console.log(caixa.logs.join("\n"))



