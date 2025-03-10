import { FiniteAutomaton } from './FiniteAutomaton';

export class Grammar {
    private VN: string[]; // Non-terminals
    private VT: string[]; // Terminals
    private startVariable: string; // Start symbol
    private hashMap: Map<string, string[]>; // Production rules

    constructor(VN: string[], VT: string[], startVariable: string, hashMap: Map<string, string[]>) {
        this.VN = VN;
        this.VT = VT;
        this.startVariable = startVariable;
        this.hashMap = hashMap;
    }

    // Generate a string from the grammar
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

    // Convert the grammar to a finite automaton
public toFiniteAutomaton(): FiniteAutomaton {
    const sigma = [...this.VT]; // Алфавит
    const Q = [...this.VN, "X"]; // Состояния (нетерминалы + финальное состояние X)
    const q0 = this.startVariable; // Начальное состояние
    const finalState = "X"; // Финальное состояние
    const delta = new Map<string, string>();

    // Сначала собираем все переходы в промежуточную структуру
    const transitions = new Map<string, string[]>();

    this.hashMap.forEach((values, key) => {
        values.forEach(value => {
            if (value.length === 2) {
                // Переход вида A -> aB
                const inputSymbol = value.charAt(0); // Первый символ (терминал)
                const nextState = value.charAt(1); // Второй символ (нетерминал)
                const transKey = `${key},${inputSymbol}`;

                if (!transitions.has(transKey)) {
                    transitions.set(transKey, []);
                }
                transitions.get(transKey)!.push(nextState);
            } else if (value.length === 1) {
                // Переход вида B -> a (ведет в финальное состояние X)
                const inputSymbol = value.charAt(0); // Терминал
                const transKey = `${key},${inputSymbol}`;

                if (!transitions.has(transKey)) {
                    transitions.set(transKey, []);
                }
                transitions.get(transKey)!.push(finalState);
            }
        });
    });

    // Теперь превращаем это в детерминированный автомат
    transitions.forEach((nextStates, transKey) => {
        if (nextStates.length === 1) {
            // Если только один переход, добавляем его напрямую
            delta.set(transKey, nextStates[0]);
        } else {
            // Если несколько переходов, добавляем их в виде множества состояний
            delta.set(transKey, `{${nextStates.join(',')}}`);

            // Для DFA должны быть добавлены переходы из этого нового составного состояния
            // Это будет автоматически сделано при вызове toDFA() позже
        }
    });

    // Создаем автомат (который может быть недетерминированным)
    return new FiniteAutomaton(Q, sigma, delta, q0, finalState);
}
    // Classify the grammar based on Chomsky hierarchy
    public classifyGrammar(): string {
        let isType3 = true;
        let isType2 = true;

        this.hashMap.forEach((productions, nonTerminal) => {
            productions.forEach(production => {
                if (production.length > 2) {
                    isType3 = false;
                }
                if (production.length === 2 && !this.VT.includes(production[0])) {
                    isType3 = false;
                }
                if (production.length === 1 && !this.VT.includes(production[0])) {
                    isType3 = false;
                }
                if (production.length === 0) {
                    isType2 = false;
                }
            });
        });

        if (isType3) {
            return "Type 3 (Regular Grammar)";
        } else if (isType2) {
            return "Type 2 (Context-Free Grammar)";
        } else {
            return "Type 1 (Context-Sensitive Grammar)";
        }
    }

    // Метод для класса Grammar
public isDeterministic(): boolean {
    const transitions = new Map<string, Set<string>>();

    this.hashMap.forEach((productions, nonTerminal) => {
        productions.forEach(production => {
            if (production.length >= 1) {
                const inputSymbol = production.charAt(0);
                const transitionKey = `${nonTerminal},${inputSymbol}`;

                if (!transitions.has(transitionKey)) {
                    transitions.set(transitionKey, new Set<string>());
                }

                if (production.length === 1) {
                    transitions.get(transitionKey)!.add("X"); // X - финальное состояние
                } else {
                    transitions.get(transitionKey)!.add(production.charAt(1));
                }
            }
        });
    });

    // Проверяем, есть ли состояния и символы с несколькими переходами
    for (const [key, nextStates] of transitions.entries()) {
        if (nextStates.size > 1) {
            return false; // Недетерминированный
        }
    }

    return true; // Детерминированный
}
}