# Regular Expressions

## Course: Formal Languages & Finite Automata  
## Author: Petcov Nicolai (FAF-233)  

---

## Theory
Regular expressions describe patterns in strings and serve as an algebraic representation of DFA and NFA. They consist of characters combined with operators like `+`, `*`, and `|` to define search patterns. A language is considered **regular** if it can be represented by a regular expression.

### Equivalence with Finite Automata
Regular expressions and finite automata (DFA/NFA) are equivalent in defining regular languages. **Kleene’s Theorem** establishes that a language is regular if it can be recognized by a finite automaton and expressed as a regular expression. The main transformations between these models include:
- **Regex to NFA:** Thompson’s Construction builds an NFA recursively.
- **NFA to DFA:** Subset construction converts an NFA into a DFA.
- **DFA to Regex:** The state elimination method replaces transitions with regular expressions.

### Algebraic Properties
Regular expressions follow algebraic rules similar to arithmetic. Some key identities include:
- **Union:** `R + ∅ = R`, `R + R = R`
- **Concatenation:** `R · E = E · R = R`, `R · ∅ = ∅`
- **Kleene Star:** `∅* = E`, `R* = E + RR*`
- **Commutativity:** Union is commutative (`R + S = S + R`), but concatenation is not (`RS ≠ SR`).

## Objectives
This project aims to define regular expressions, implement a program for generating valid strings based on given regex patterns, and visualize the parsing process. The implementation limits repetitions to five to maintain readability.

## My Variant
![alt text](Variant2.png)

## Implementation
The implementation is in TypeScript (`Regular_expressions.ts`), featuring two main methods.

### String Generation
The `StringGeneration()` method interprets regex operators dynamically:
- `?` – Includes the preceding symbol with a 50% chance.
- `*` – Repeats the preceding symbol 0–5 times.
- `+` – Repeats the preceding symbol 1–5 times.
- `^` – Repeats a symbol exactly `n` times.
- `(X|Y|Z)` – Randomly selects one of the options.

#### Example Snippets
Handling the `?` operator:
```typescript
if (reArr[currentPos] === '?') {
                steps.push(`Step ${steps.length}: Found '?' operator after '${reArr[currentPos-1]}' - Character may appear 0 or 1 time`);
                currentPos++;
            }
```
Handling the `^` operator:
```typescript
if (reArr[currentPos] === '^') {
                steps.push(`Step ${steps.length}: Found '^${reArr[currentPos+1]}' operator after '${reArr[currentPos-1]}' - Character appears exactly ${reArr[currentPos+1]} times`);
                currentPos += 2;
```
Handling `(X|Y|Z)` choice:
```typescript
const options = reArr.slice(currentPos + 1, closePos).join('').split('|');
                steps.push(`Step ${steps.length}: Found alternation group (${options.join('|')}) - Will randomly select one option`);

```

## Results
Generated outputs:
```powershell
Regular Expression 1: M?N^2(O|P)^3Q*R+                                   
                                                                         
Processing Steps:                                                        
Processing the regular expression: "M?N^2(O|P)^3Q*R+"                    
Step 1: Found character 'M'                                              
Step 2: Found '?' operator after 'M' - Character may appear 0 or 1 time  
Step 3: Found character 'N'                                              
Step 4: Found '^2' operator after 'N' - Character appears exactly 2 times
Step 5: Found alternation group (O|P) - Will randomly select one option  
Step 6: The selected option will be repeated exactly 3 times             
Step 7: Found '^3' operator after ')' - Character appears exactly 3 times
Step 8: Found character 'Q'                                              
Step 9: Found '*' operator after 'Q' - Character may appear 0 to 5 times 
Step 10: Found character 'R'                                             
Step 11: Found '+' operator after 'R' - Character may appear 1 to 5 times
Step 12: Generation complete                                             

Generated Strings:
1. NNOOOQRRRR
2. NNOOOQR
3. NNOOOQQQRRRR
4. NNPPPQQQRRR
5. NNPPPQQR

-------------------

Regular Expression 2: (X|Y|Z)^38+(9|0)

Processing Steps:
Processing the regular expression: "(X|Y|Z)^38+(9|0)"
Step 1: Found alternation group (X|Y|Z) - Will randomly select one option
Step 2: The selected option will be repeated exactly 3 times
Step 3: Found '^3' operator after ')' - Character appears exactly 3 times
Step 4: Found character '8'
Step 5: Found '+' operator after '8' - Character may appear 1 to 5 times
Step 6: Found alternation group (9|0) - Will randomly select one option
Step 7: Generation complete

Generated Strings:
1. XXX880
2. ZZZ80
3. ZZZ889
4. YYY88880
5. ZZZ880

-------------------

Regular Expression 3: (H|i)(J|K)L*N?

Processing Steps:
Processing the regular expression: "(H|i)(J|K)L*N?"
Step 1: Found alternation group (H|i) - Will randomly select one option
Step 2: Found alternation group (J|K) - Will randomly select one option
Step 3: Found character 'L'
Step 4: Found '*' operator after 'L' - Character may appear 0 to 5 times
Step 5: Found character 'N'
Step 6: Found '?' operator after 'N' - Character may appear 0 or 1 time
Step 7: Generation complete

Generated Strings:
1. iKN
2. HKLL
3. iJLLL
4. HJLL
5. iKLLLLL

-------------------
         
```

## Conclusion
This project demonstrated how regular expressions relate to finite automata and how they can be used to generate structured string outputs. The implementation successfully handled key regex operations and validated theoretical principles in practice. Future improvements could involve expanding the regex parser to support more complex expressions.

## References
1. LFA ELSE Course: https://else.fcim.utm.md/course/view.php?id=98

