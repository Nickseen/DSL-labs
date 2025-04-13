# CNF Conversion Report

## Course: Formal Languages & Finite Automata  
## Author: Petcov Nicolai (FAF-233)  
### Variant 22

----

## Theory

In this section, we define the process of converting a context-free grammar (CFG) into Chomsky Normal Form (CNF). A grammar is in CNF if all productions are of the form:
1. A → BC (where A, B, and C are nonterminals),
2. A → a (where A is a nonterminal and a is a terminal),
3. S → ε (only if the grammar generates the empty string ε, and S is the start symbol).

The goal of this task is to take an arbitrary CFG and transform it into CNF by eliminating unnecessary productions and ensuring the format adheres to the two above rules.

## Objectives:

* Eliminate ε-productions.
* Eliminate unit productions.
* Remove inaccessible symbols.
* Convert the grammar to binary productions.
* Finalize the grammar in CNF.

## Implementation description

The implementation follows a step-by-step approach, starting with the identification and removal of ε-productions. Once the ε-productions are removed, we proceed to eliminate unit productions, then inaccessible symbols, and finally transform the grammar into binary form.

Each of the steps involves manipulating the original productions to ensure the resulting grammar follows the CNF rules.

- **Step 1: Eliminate ε-productions**  
  The first step involves identifying nullable nonterminals (those that can derive the empty string) and replacing any production where these nullable symbols appear. After removing the ε-productions, we update the grammar accordingly.

- **Step 2: Eliminate unit productions**  
  Next, unit productions (productions where one nonterminal produces another nonterminal, e.g., A → B) are identified and eliminated. We replace them with appropriate productions involving terminals or more nonterminals.

- **Step 3: Remove inaccessible symbols**  
  Any nonterminal that cannot be reached from the start symbol is removed, simplifying the grammar further.

- **Step 4: Convert to binary productions**  
  Productions with more than two nonterminals on the right-hand side are split into multiple binary productions. This step ensures that the grammar is in the correct form for CNF.

- **Step 5: Final CNF Grammar**  
  After ensuring all productions fit the binary or terminal-based format, the grammar is finalized in CNF.

---

## Conclusion

The given grammar has been successfully converted to Chomsky Normal Form (CNF) by following the steps of eliminating ε-productions, unit productions, inaccessible symbols, and ensuring all productions are binary or terminal-based.

## References
1. LFA ELSE Course: https://else.fcim.utm.md/course/view.php?id=98

