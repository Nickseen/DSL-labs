// Define the interface for Grammar
export interface Grammar {
  nonTerminals: Set<string>;
  terminals: Set<string>;
  productions: Map<string, string[][]>;
  startSymbol: string;
}