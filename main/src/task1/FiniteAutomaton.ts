export class FiniteAutomaton {
    Q: string[];
    Sigma: string[];
    delta: Map<string, string>;
    q0: string;
    F: string;

    constructor(Q: string[], Sigma: string[], delta: Map<string, string>, q0: string, F: string) {
        this.Q = Q;
        this.Sigma = Sigma;
        this.delta = delta;
        this.q0 = q0;
        this.F = F;
    }

    // Проверка, принадлежит ли строка языку
    public stringBelongToLanguage(inputString: string): boolean {
        let currentState = this.q0;
        for (let i = 0; i < inputString.length; i++) {
            const cursor = inputString.charAt(i);
            const transition = this.delta.get(`${currentState},${cursor}`);
            if (!transition) {
                return false;
            }
            currentState = transition;
        }
        return currentState === this.F;
    }

    // Строковое представление конечного автомата
    public toString(): string {
        if (!this.Q || !this.Sigma || !this.delta) {
            throw new Error("Finite Automaton properties are not initialized properly.");
        }
        let res = '';
        res += `Q: ${this.Q.join(', ')}\n`;
        res += `Sigma: ${this.Sigma.join(', ')}\n`;
        res += `delta: ${JSON.stringify([...this.delta.entries()])}\n`;
        res += `q0: ${this.q0}\n`;
        res += `F: ${this.F}\n`;
        return res;
    }
}
