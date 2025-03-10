import { Grammar } from './Grammar';
import { FiniteAutomaton } from './FiniteAutomaton';
import { generateImage } from './GraphvizUtils';

// Пример использования
const VN = ['S', 'A', 'B'];
const VT = ['a', 'b'];
const startVariable = 'S';
const hashMap = new Map<string, string[]>([
    ['S', ['aS', 'bA']],
    ['A', ['aS', 'bA', 'bB']],
    ['B', ['a', 'bA']],
]);

const grammar = new Grammar(VN, VT, startVariable, hashMap);
console.log("Generated string:", grammar.generateString());
console.log("Grammar classification:", grammar.classifyGrammar());

const finiteAutomaton = grammar.toFiniteAutomaton();
console.log("Finite Automaton:\n", finiteAutomaton.toString());
console.log("Is deterministic:", grammar.isDeterministic());

const dfa = finiteAutomaton.toDFA();
console.log("DFA:\n", dfa.toString());

const regularGrammar = finiteAutomaton.toRegularGrammar();
console.log("Regular Grammar:", regularGrammar);

// Генерация изображения
const dotCode = finiteAutomaton.toDot();

generateImage(dotCode, './finite_automaton.png')
    .then(() => console.log("Image generated successfully!"))
    .catch(err => console.error(err));