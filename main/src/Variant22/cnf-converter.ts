// Define types for Grammar
import {Grammar} from "./grammar.interface";
export class CNFConverter {
  /**
   * Converts a given grammar to Chomsky Normal Form (CNF)
   * @param grammar The input grammar
   * @returns Grammar in Chomsky Normal Form
   */
  convertToCNF(grammar: Grammar): Grammar {
    console.log("=== Original Grammar ===");
    console.log(this.grammarToString(grammar));

    // Create a deep copy of the grammar to avoid modifying the original
    let cnfGrammar = this.cloneGrammar(grammar);

    // Step 1: Eliminate ε-productions
    cnfGrammar = this.eliminateEpsilonProductions(cnfGrammar);
    console.log("\n=== After eliminating ε-productions ===");
    console.log(this.grammarToString(cnfGrammar));

    // Step 2: Eliminate unit productions (renaming)
    cnfGrammar = this.eliminateUnitProductions(cnfGrammar);
    console.log("\n=== After eliminating unit productions ===");
    console.log(this.grammarToString(cnfGrammar));

    // Step 3: Eliminate inaccessible symbols
    cnfGrammar = this.eliminateInaccessibleSymbols(cnfGrammar);
    console.log("\n=== After eliminating inaccessible symbols ===");
    console.log(this.grammarToString(cnfGrammar));

    // Step 4: Eliminate non-productive symbols
    cnfGrammar = this.eliminateNonProductiveSymbols(cnfGrammar);
    console.log("\n=== After eliminating non-productive symbols ===");
    console.log(this.grammarToString(cnfGrammar));

    // Step 5: Convert to Chomsky Normal Form
    cnfGrammar = this.convertToStrictCNF(cnfGrammar);
    console.log("\n=== Final CNF Grammar ===");
    console.log(this.grammarToString(cnfGrammar));

    return cnfGrammar;
  }

  /**
   * Step 1: Eliminate ε-productions
   */
  private eliminateEpsilonProductions(grammar: Grammar): Grammar {
    const result = this.cloneGrammar(grammar);
    const nullable = new Set<string>();

    // Find all nullable non-terminals
    let changed = true;
    while (changed) {
      changed = false;
      for (const [nt, prods] of result.productions) {
        for (const prod of prods) {
          if (prod.length === 0 || (prod.length === 1 && prod[0] === 'ε')) {
            if (!nullable.has(nt)) {
              nullable.add(nt);
              changed = true;
            }
          }
          if (prod.every(s => nullable.has(s))) {
            if (!nullable.has(nt)) {
              nullable.add(nt);
              changed = true;
            }
          }
        }
      }
    }

    // Remove ε-productions and add new productions
    for (const [nt, prods] of result.productions) {
      const newProds: string[][] = [];
      for (const prod of prods) {
        if (prod.length === 0 || (prod.length === 1 && prod[0] === 'ε')) continue;

        // Find nullable positions
        const nullablePos = prod
          .map((s, i) => nullable.has(s) ? i : -1)
          .filter(i => i !== -1);

        // Generate all subsets
        const subsets = this.generateSubsets(nullablePos);
        for (const subset of subsets) {
          if (subset.length === 0) continue;
          const newProd = prod.filter((_, i) => !subset.includes(i));
          if (newProd.length > 0 && !newProds.some(p => this.arraysEqual(p, newProd))) {
            newProds.push(newProd);
          }
        }

        // Add original production if not already present
        if (!newProds.some(p => this.arraysEqual(p, prod))) {
          newProds.push([...prod]);
        }
      }
      result.productions.set(nt, newProds);
    }

    // Handle nullable start symbol
    if (nullable.has(result.startSymbol)) {
      const newStart = `${result.startSymbol}'`;
      result.nonTerminals.add(newStart);
      result.productions.set(newStart, [[result.startSymbol], []]);
      result.startSymbol = newStart;
    }

    return result;
  }

  /**
   * Step 2: Eliminate unit productions (A → B)
   */
  private eliminateUnitProductions(grammar: Grammar): Grammar {
    const result = this.cloneGrammar(grammar);
    const unitPairs = new Map<string, Set<string>>();

    // Initialize unit pairs (reflexive)
    for (const nt of result.nonTerminals) {
      unitPairs.set(nt, new Set([nt]));
    }

    // Find all unit pairs
    let changed = true;
    while (changed) {
      changed = false;
      for (const [nt, prods] of result.productions) {
        for (const prod of prods) {
          if (prod.length === 1 && result.nonTerminals.has(prod[0])) {
            const B = prod[0];
            for (const C of unitPairs.get(B)!) {
              if (!unitPairs.get(nt)!.has(C)) {
                unitPairs.get(nt)!.add(C);
                changed = true;
              }
            }
          }
        }
      }
    }

    // Replace unit productions
    for (const [nt, prods] of result.productions) {
      const newProds = prods.filter(p => !(p.length === 1 && result.nonTerminals.has(p[0])));

      for (const B of unitPairs.get(nt)!) {
        if (nt === B) continue;
        const BProds = result.productions.get(B) || [];
        for (const prod of BProds) {
          if (!(prod.length === 1 && result.nonTerminals.has(prod[0]))) {
            if (!newProds.some(p => this.arraysEqual(p, prod))) {
              newProds.push([...prod]);
            }
          }
        }
      }
      result.productions.set(nt, newProds);
    }

    return result;
  }

  /**
   * Step 3: Eliminate inaccessible symbols
   */
  private eliminateInaccessibleSymbols(grammar: Grammar): Grammar {
    const result = this.cloneGrammar(grammar);
    const accessible = new Set<string>();

    const visit = (symbol: string) => {
      if (accessible.has(symbol)) return;
      accessible.add(symbol);
      if (result.nonTerminals.has(symbol)) {
        for (const prod of result.productions.get(symbol) || []) {
          for (const s of prod) {
            visit(s);
          }
        }
      }
    };

    visit(result.startSymbol);

    // Remove inaccessible symbols
    for (const nt of [...result.nonTerminals]) {
      if (!accessible.has(nt)) {
        result.nonTerminals.delete(nt);
        result.productions.delete(nt);
      }
    }

    for (const t of [...result.terminals]) {
      if (!accessible.has(t)) {
        result.terminals.delete(t);
      }
    }

    return result;
  }

  /**
   * Step 4: Eliminate non-productive symbols
   */
  private eliminateNonProductiveSymbols(grammar: Grammar): Grammar {
    const result = this.cloneGrammar(grammar);
    const productive = new Set<string>();

    // Terminals are always productive
    for (const t of result.terminals) {
      productive.add(t);
    }

    // Find productive non-terminals
    let changed = true;
    while (changed) {
      changed = false;
      for (const [nt, prods] of result.productions) {
        if (productive.has(nt)) continue;
        for (const prod of prods) {
          if (prod.every(s => productive.has(s))) {
            productive.add(nt);
            changed = true;
            break;
          }
        }
      }
    }

    // Remove non-productive symbols
    for (const nt of [...result.nonTerminals]) {
      if (!productive.has(nt)) {
        result.nonTerminals.delete(nt);
        result.productions.delete(nt);
      } else {
        result.productions.set(nt,
          (result.productions.get(nt) || []).filter(prod =>
            prod.every(s => productive.has(s))
          )
        );
      }
    }

    return result;
  }

  /**
   * Step 5: Convert to strict CNF
   */
  private convertToStrictCNF(grammar: Grammar): Grammar {
    const result = this.cloneGrammar(grammar);
    let counter = 0;

    // Step 1: Replace terminals with new non-terminals
    const termToNT = new Map<string, string>();
    for (const t of result.terminals) {
      const nt = `T_${t}`;
      termToNT.set(t, nt);
      result.nonTerminals.add(nt);
      result.productions.set(nt, [[t]]);
    }

    // Step 2: Process all productions
    for (const [nt, prods] of [...result.productions.entries()]) {
      const newProds: string[][] = [];
      for (const prod of prods) {
        if (prod.length === 0) continue;

        // Case 1: A → a → A → T_a
        if (prod.length === 1 && result.terminals.has(prod[0])) {
          newProds.push([termToNT.get(prod[0])!]);
          continue;
        }

        // Case 2: A → B (should have been eliminated)
        if (prod.length === 1) {
          newProds.push([...prod]);
          continue;
        }

        // Replace terminals in production
        const converted = prod.map(s => termToNT.get(s) || s);

        // Case 3: A → BC (already in CNF)
        if (converted.length === 2) {
          newProds.push(converted);
          continue;
        }

        // Case 4: Break longer productions into binary
        let current = converted[0];
        for (let i = 1; i < converted.length - 1; i++) {
          const newNT = `N${counter++}`;
          result.nonTerminals.add(newNT);
          result.productions.set(newNT, [[current, converted[i]]]);
          current = newNT;
        }
        newProds.push([current, converted[converted.length - 1]]);
      }
      result.productions.set(nt, newProds);
    }

    return result;
  }

  // Helper methods
  private arraysEqual(a: string[], b: string[]): boolean {
    return a.length === b.length && a.every((val, i) => val === b[i]);
  }

  private generateSubsets<T>(arr: T[]): T[][] {
    const result: T[][] = [[]];
    for (const item of arr) {
      const newSubsets = result.map(subset => [...subset, item]);
      result.push(...newSubsets);
    }
    return result;
  }

  private cloneGrammar(grammar: Grammar): Grammar {
    const clonedProds = new Map<string, string[][]>();
    for (const [nt, prods] of grammar.productions) {
      clonedProds.set(nt, prods.map(p => [...p]));
    }
    return {
      nonTerminals: new Set(grammar.nonTerminals),
      terminals: new Set(grammar.terminals),
      productions: clonedProds,
      startSymbol: grammar.startSymbol
    };
  }

  grammarToString(grammar: Grammar): string {
    let str = `G = (VN, VT, P, S)\nVN = {${[...grammar.nonTerminals].join(', ')}}\n`;
    str += `VT = {${[...grammar.terminals].join(', ')}}\n`;
    str += `Start Symbol = ${grammar.startSymbol}\nProductions:\n`;

    let i = 1;
    for (const [nt, prods] of grammar.productions) {
      for (const prod of prods) {
        str += `${i++}. ${nt} → ${prod.length > 0 ? prod.join('') : 'ε'}\n`;
      }
    }
    return str;
  }

  createGrammarFromProductions(
    prods: [string, string[]][],
    startSymbol?: string
  ): Grammar {
    const grammar: Grammar = {
      nonTerminals: new Set(),
      terminals: new Set(),
      productions: new Map(),
      startSymbol: startSymbol || prods[0][0]
    };

    for (const [nt] of prods) {
      grammar.nonTerminals.add(nt);
    }

    for (const [nt, rhs] of prods) {
      if (!grammar.productions.has(nt)) {
        grammar.productions.set(nt, []);
      }

      if (rhs.length === 1 && rhs[0] === 'ε') {
        grammar.productions.get(nt)!.push([]);
      } else {
        const prod = [...rhs];
        grammar.productions.get(nt)!.push(prod);
        for (const s of rhs) {
          if (!grammar.nonTerminals.has(s)) {
            grammar.terminals.add(s);
          }
        }
      }
    }

    return grammar;
  }
}

// Test the implementation
function testCNFConversion() {
  const converter = new CNFConverter();

  // Define the grammar from the variant
  const productions: [string, string[]][] = [
    ['S', ['a', 'B']],
    ['S', ['A', 'C']],
    ['A', ['a']],
    ['A', ['A', 'C', 'S', 'C']],
    ['A', ['B', 'C']],
    ['B', ['b']],
    ['B', ['a', 'A']],
    ['C', ['B', 'A']],
    ['C', []], // ε-production
    ['E', ['b', 'B']]
  ];

  const grammar = converter.createGrammarFromProductions(productions, 'S');
  const cnfGrammar = converter.convertToCNF(grammar);
}

testCNFConversion();