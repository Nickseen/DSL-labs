import {CNFConverter} from "./cnf-converter";

class Main {
  private readonly converter: CNFConverter;

  constructor() {
    this.converter = new CNFConverter();
  }

  public run(): void {
    try {
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

      const grammar = this.converter.createGrammarFromProductions(productions, 'S');
      const cnfGrammar = this.converter.convertToCNF(grammar);

      console.log("CNF Conversion completed successfully!");
    } catch (error) {
      console.error("Error during CNF conversion:", error);
    }
  }
}

// Application entry point
const app = new Main();
app.run();