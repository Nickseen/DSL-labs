# Laboratory Work Report
## Formal Languages & Finite Automata

### Course: Formal Languages & Finite Automata
### Author: Petcov Nicolai
### Group: FAF-233

---

## Abstract
This laboratory work focuses on the concept of determinism in finite automata, conversion between non-deterministic finite automata (NDFA) and deterministic finite automata (DFA), as well as implementing functionality to convert a finite automaton to a regular grammar and classifying grammars according to the Chomsky hierarchy. The implementation is done in TypeScript.

## Introduction
Finite automata are abstract computational models used to represent processes in a formal way. They can be classified as deterministic or non-deterministic based on their structure and behavior. In systems theory, determinism characterizes how predictable a system is - if there are random variables involved, the system becomes stochastic or non-deterministic.

Understanding determinism in finite automata and the relationships between automata and grammars is fundamental in the study of formal languages and automata theory. The ability to convert between different representations (NDFA to DFA, FA to grammar) enables various applications in compiler design, text processing, and formal verification.

## Objectives
1. Understand what an automaton is and its applications
2. Implement a function to classify a grammar based on the Chomsky hierarchy
3. Implement conversion of a finite automaton to a regular grammar
4. Determine whether a finite automaton is deterministic or non-deterministic
5. Implement functionality to convert an NDFA to a DFA
6. Represent the finite automaton graphically (optional bonus)

## Implementation Description

### Grammar Class
The `Grammar` class represents a formal grammar with non-terminals, terminals, a start symbol, and production rules. The main methods implemented in this class include:

- `generateString()`: Generates a random string that belongs to the language defined by the grammar
- `toFiniteAutomaton()`: Converts the grammar to a finite automaton
- `classifyGrammar()`: Classifies the grammar based on the Chomsky hierarchy
- `isDeterministic()`: Determines if the grammar, when viewed as an automaton, is deterministic

```typescript
// Key method for classifying grammar based on Chomsky hierarchy
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
```

### FiniteAutomaton Class
The `FiniteAutomaton` class represents a finite automaton with states, alphabet, transition function, initial state, and final state. The implemented methods include:

- `stringBelongToLanguage()`: Checks if a string belongs to the language defined by the automaton
- `toString()`: Provides a string representation of the automaton
- `isDeterministic()`: Determines if the automaton is deterministic
- `toDFA()`: Converts a non-deterministic finite automaton to a deterministic one
- `toRegularGrammar()`: Converts the finite automaton to a regular grammar
- `toDot()`: Generates a DOT representation for graphical visualization



### Main Components and Their Interaction

The implementation consists of two main classes:

1. `Grammar`: Represents formal grammars with methods for generation, classification, and conversion to automata
2. `FiniteAutomaton`: Represents finite automata with methods for language recognition, conversion, and visualization

These classes interact with each other through conversion methods:
- `Grammar.toFiniteAutomaton()`: Converts a grammar to a finite automaton
- `FiniteAutomaton.toRegularGrammar()`: Converts a finite automaton to a regular grammar

## Determinism in Finite Automata

### Definition and Characteristics
A finite automaton is deterministic if for each state and input symbol, there is exactly one next state. In contrast, a non-deterministic finite automaton may have multiple possible next states for a given state and input symbol, or even transitions on empty strings (ε-transitions).

The implementation checks for determinism by examining the transition function:

### Conversion from NDFA to DFA
The conversion from a non-deterministic finite automaton to a deterministic one is implemented using the subset construction algorithm. This algorithm creates a new DFA where:
- Each state in the DFA corresponds to a set of states in the NDFA
- The initial state of the DFA is the set containing the initial state of the NDFA
- The transition function maps a state (set of NDFA states) and an input symbol to a new state (set of NDFA states)
- The final states of the DFA are those that contain at least one final state of the NDFA

## Chomsky Hierarchy and Grammar Classification

The Chomsky hierarchy classifies formal grammars into four types:
1. Type 0: Unrestricted grammars
2. Type 1: Context-sensitive grammars
3. Type 2: Context-free grammars
4. Type 3: Regular grammars

The implementation focuses on identifying Types 1-3:

- Type 3 (Regular Grammar): Productions of the form A → a or A → aB
- Type 2 (Context-Free Grammar): Productions of the form A → α where A is a non-terminal and α is a string of terminals and non-terminals
- Type 1 (Context-Sensitive Grammar): Productions of the form α → β where |α| ≤ |β|

## Results
The implemented functionality successfully:
1. Classifies grammars according to the Chomsky hierarchy
2. Determines whether a finite automaton is deterministic
3. Converts non-deterministic finite automata to deterministic ones
4. Converts finite automata to regular grammars
5. Provides a graphical representation of finite automata using DOT format

## Conclusions
This laboratory work provided practical experience in working with formal languages, grammars, and automata. The implementation demonstrated the relationships between different types of automata and grammars, as well as the algorithms for converting between them.

The key insights gained from this work include:
1. Understanding the concept of determinism in finite automata and its implications
2. Learning the algorithms for converting between different representations (NDFA to DFA, FA to grammar)
3. Implementing the classification of grammars according to the Chomsky hierarchy
4. Visualizing finite automata for better understanding and analysis

The practical applications of these concepts extend to compiler design, natural language processing, protocol verification, and many other areas of computer science.
