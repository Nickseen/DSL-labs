import { Grammar } from './Grammar';

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

    // Check if a string belongs to the language
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

    // Represent the finite automaton as a string
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

    // Determine if the automaton is deterministic
    // Метод для класса Grammar

    // Convert NDFA to DFA
    public toDFA(): FiniteAutomaton {
        const newQ: string[] = [];
        const newDelta = new Map<string, string>();
        const newF: string[] = [];
        const newQ0 = `{${this.q0}}`;
        const queue: string[] = [newQ0];

        while (queue.length > 0) {
            const currentStateSet = queue.shift()!;
            newQ.push(currentStateSet);

            this.Sigma.forEach(symbol => {
                const nextStateSet = new Set<string>();
                currentStateSet.slice(1, -1).split(',').forEach(state => {
                    const transition = `${state},${symbol}`;
                    if (this.delta.has(transition)) {
                        nextStateSet.add(this.delta.get(transition)!);
                    }
                });

                if (nextStateSet.size > 0) {
                    const nextStateSetString = `{${Array.from(nextStateSet).join(',')}}`;
                    newDelta.set(`${currentStateSet},${symbol}`, nextStateSetString);

                    if (!newQ.includes(nextStateSetString)) {
                        queue.push(nextStateSetString);
                    }
                }
            });

            if (currentStateSet.includes(this.F)) {
                newF.push(currentStateSet);
            }
        }

        return new FiniteAutomaton(newQ, this.Sigma, newDelta, newQ0, newF[0]);
    }

    // Convert finite automaton to regular grammar
    public toRegularGrammar(): Grammar {
        const VN = this.Q;
        const VT = this.Sigma;
        const startVariable = this.q0;
        const hashMap = new Map<string, string[]>();

        this.delta.forEach((nextState, transition) => {
            const [currentState, inputSymbol] = transition.split(',');
            if (!hashMap.has(currentState)) {
                hashMap.set(currentState, []);
            }
            if (nextState === this.F) {
                hashMap.get(currentState)?.push(inputSymbol);
            } else {
                hashMap.get(currentState)?.push(inputSymbol + nextState);
            }
        });

        return new Grammar(VN, VT, startVariable, hashMap);
    }

    public toDot(): string {
        let dot = 'digraph FiniteAutomaton {\n';
        dot += '  rankdir=LR; // Left-to-Right layout\n';

        // Обычные состояния (исключаем финальное состояние)
        const nonFinalStates = this.Q.filter(state => state !== this.F);
        dot += `  node [shape = circle]; ${nonFinalStates.join(' ')};\n`;

        // Финальное состояние
        dot += `  node [shape = doublecircle]; ${this.F};\n`;

        // Начальное состояние
        dot += `  start [shape = plaintext, label = ""];\n`;
        dot += `  start -> ${this.q0};\n`;

        // Переходы
        this.delta.forEach((nextState, transition) => {
            const [currentState, inputSymbol] = transition.split(',');
            dot += `  ${currentState} -> ${nextState} [label = "${inputSymbol}"];\n`;
        });

        dot += '}';
        return dot;
    }
}

