import { FiniteAutomaton } from './FiniteAutomaton';

export class Grammar {
    private VN: string[]; // Множество нетерминалов
    private VT: string[]; // Множество терминалов
    private startVariable: string; // Стартовый символ
    private hashMap: Map<string, string[]>; // Продукции

    constructor(VN: string[], VT: string[], startVariable: string, hashMap: Map<string, string[]>) {
        this.VN = VN;
        this.VT = VT;
        this.startVariable = startVariable;
        this.hashMap = hashMap;
    }

    // Генерация строки
    public generateString(): string {
        let result = this.startVariable;
        let cursor = 0;

        while (cursor < result.length) {
            const currentChar = result.charAt(cursor);
            if (this.VT.includes(currentChar)) {
                cursor++;
            } else {
                const possibleValues = this.hashMap.get(currentChar);
                if (!possibleValues || possibleValues.length === 0) {
                    throw new Error(`No production rule for non-terminal: ${currentChar}`);
                }
                const replacement = possibleValues[Math.floor(Math.random() * possibleValues.length)];
                result = result.slice(0, cursor) + replacement + result.slice(cursor + 1);
            }
        }

        return result;
    }

    // Преобразование грамматики в конечный автомат
    public toFiniteAutomaton(): FiniteAutomaton {
        const sigma = [...this.VT];
        const Q = [...this.VN, "X"];
        const q0 = this.startVariable;
        const finalState = "X";
        const delta = new Map<string, string>();

        this.hashMap.forEach((values, key) => {
            values.forEach(value => {
                if (value.length === 2) {
                    delta.set(`${key},${value.charAt(0)}`, value.charAt(1));
                } else if (value.length === 1) {
                    delta.set(`${key},${value}`, finalState);
                }
            });
        });

        return new FiniteAutomaton(Q, sigma, delta, q0, finalState);
    }
}
