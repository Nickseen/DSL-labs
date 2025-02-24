import { Grammar } from './Grammar';
import { FiniteAutomaton } from './FiniteAutomaton';

const VN: string[] = ['S', 'D', 'F'];
const VT: string[] = ['a', 'b', 'c', 'd'];
const startVariable: string = 'S';
const hashMap: Map<string, string[]> = new Map();

hashMap.set('S', ['aS', 'bS', 'cD']);
hashMap.set('D', ['dD', 'bF', 'a']);
hashMap.set('F', ['bS', 'a']);

const grammar = new Grammar(VN, VT, startVariable, hashMap);

console.log("Random generated string: " + grammar.generateString());

const automaton = grammar.toFiniteAutomaton();

console.log("\nFinite automaton: ");
console.log(automaton.toString());

const generatedString = grammar.generateString();
console.log(automaton.stringBelongToLanguage('abcd'));  // Example string for testing
console.log(automaton.stringBelongToLanguage(generatedString));  // Checking if the generated string belongs to the language
