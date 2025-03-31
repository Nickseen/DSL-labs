export class RegexGenerator {
    public generateString(re: string): string {
        let result = "";
        const reArr = re.split('');

        for (let i = 0; i < reArr.length; i++) {
            if (reArr[i] === '?' && this.isCharOrDigit(reArr[i-1]) && reArr[i-1] !== ')') {
                const randomNum = Math.floor(Math.random() * 2);
                if (randomNum === 1) result += reArr[i-1];
            }
            else if (reArr[i] === '*' && this.isCharOrDigit(reArr[i-1]) && reArr[i-1] !== ')') {
                const randomNum = Math.floor(Math.random() * 6);
                result += reArr[i-1].repeat(randomNum);
            }
            else if (reArr[i] === '+' && this.isCharOrDigit(reArr[i-1]) && reArr[i-1] !== ')') {
                const randomNum = 1 + Math.floor(Math.random() * 5);
                result += reArr[i-1].repeat(randomNum);
            }
            else if (reArr[i] === '^' && this.isCharOrDigit(reArr[i-1]) && reArr[i-1] !== ')') {
                const repetitions = parseInt(reArr[i+1]);
                result += reArr[i-1].repeat(repetitions);
                i++;
            }
            else if (reArr[i] === '(' && reArr[i+2] === '|' && reArr[i+4] === ')') {
                const randomNum = Math.floor(Math.random() * 2);
                let selectedChar = randomNum === 0 ? reArr[i+1] : reArr[i+3];
                if (i+5 < reArr.length) {
                    if (reArr[i+5] === '^') {
                        const repetitions = parseInt(reArr[i+6]);
                        result += selectedChar.repeat(repetitions);
                        i = i+6;
                    } else if (reArr[i+5] === '?' || reArr[i+5] === '*' || reArr[i+5] === '+') {
                        const repetitions = this.getRepetitionCount(reArr[i+5]);
                        result += selectedChar.repeat(repetitions);
                        i = i+5;
                    } else {
                        result += selectedChar;
                        i = i+4;
                    }
                } else {
                    result += selectedChar;
                    i = i+4;
                }
            }
            else if (reArr[i] === '(' && reArr[i+2] === '|' && reArr[i+4] === '|' && reArr[i+6] === ')') {
                const randomNum = Math.floor(Math.random() * 3);
                let selectedChar = '';
                if (randomNum === 0) selectedChar = reArr[i+1];
                else if (randomNum === 1) selectedChar = reArr[i+3];
                else selectedChar = reArr[i+5];
                if (i+7 < reArr.length) {
                    if (reArr[i+7] === '^') {
                        const repetitions = parseInt(reArr[i+8]);
                        result += selectedChar.repeat(repetitions);
                        i = i+8;
                    } else if (reArr[i+7] === '?' || reArr[i+7] === '*' || reArr[i+7] === '+') {
                        const repetitions = this.getRepetitionCount(reArr[i+7]);
                        result += selectedChar.repeat(repetitions);
                        i = i+7;
                    } else {
                        result += selectedChar;
                        i = i+6;
                    }
                } else {
                    result += selectedChar;
                    i = i+6;
                }
            }
            else if (this.isCharOrDigit(reArr[i]) &&
                    (i === reArr.length-1 ||
                     !['?', '*', '+', '^'].includes(reArr[i+1]))) {
                result += reArr[i];
            }
        }
        return result;
    }

    public generateMultipleStrings(re: string, count: number): string[] {
        const results: string[] = [];
        for (let i = 0; i < count; i++) {
            results.push(this.generateString(re));
        }
        return results;
    }

    private isCharOrDigit(char: string): boolean {
        return /[a-zA-Z0-9]/.test(char);
    }

    private getRepetitionCount(operator: string): number {
        switch (operator) {
            case '?': return Math.floor(Math.random() * 2);
            case '*': return Math.floor(Math.random() * 6);
            case '+': return 1 + Math.floor(Math.random() * 5);
            default: return 1;
        }
    }

    public explainProcessing(re: string): string[] {
        const steps: string[] = [];
        steps.push(`Processing the regular expression: "${re}"`);

        const reArr = re.split('');
        let currentPos = 0;

        while (currentPos < reArr.length) {
            if (reArr[currentPos] === '?') {
                steps.push(`Step ${steps.length}: Found '?' operator after '${reArr[currentPos-1]}' - Character may appear 0 or 1 time`);
                currentPos++;
            }
            else if (reArr[currentPos] === '*') {
                steps.push(`Step ${steps.length}: Found '*' operator after '${reArr[currentPos-1]}' - Character may appear 0 to 5 times`);
                currentPos++;
            }
            else if (reArr[currentPos] === '+') {
                steps.push(`Step ${steps.length}: Found '+' operator after '${reArr[currentPos-1]}' - Character may appear 1 to 5 times`);
                currentPos++;
            }
            else if (reArr[currentPos] === '^') {
                steps.push(`Step ${steps.length}: Found '^${reArr[currentPos+1]}' operator after '${reArr[currentPos-1]}' - Character appears exactly ${reArr[currentPos+1]} times`);
                currentPos += 2;
            }
            else if (reArr[currentPos] === '(') {
                let closePos = currentPos + 1;
                while (closePos < reArr.length && reArr[closePos] !== ')') {
                    closePos++;
                }

                const options = reArr.slice(currentPos + 1, closePos).join('').split('|');
                steps.push(`Step ${steps.length}: Found alternation group (${options.join('|')}) - Will randomly select one option`);

                if (closePos + 1 < reArr.length) {
                    if (reArr[closePos + 1] === '^') {
                        steps.push(`Step ${steps.length}: The selected option will be repeated exactly ${reArr[closePos + 2]} times`);
                    } else if (['?', '*', '+'].includes(reArr[closePos + 1])) {
                        steps.push(`Step ${steps.length}: The selected option will be repeated according to the '${reArr[closePos + 1]}' operator`);
                    }
                }

                currentPos = closePos + 1;
            }
            else {
                if (this.isCharOrDigit(reArr[currentPos])) {
                    if (currentPos > 0 && reArr[currentPos-1] === '^') {
                        currentPos++;
                        continue;
                    }
                    steps.push(`Step ${steps.length}: Found character '${reArr[currentPos]}'`);
                }
                currentPos++;
            }
        }

        steps.push(`Step ${steps.length}: Generation complete`);
        return steps;
    }
}