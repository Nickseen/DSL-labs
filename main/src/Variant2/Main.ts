import { RegexGenerator } from './Regular_expressions';

class RegexDemo {
    private generator: RegexGenerator;

    constructor() {
        this.generator = new RegexGenerator();
    }

    public run(): void {
        const regexes = [
            'M?N^2(O|P)^3Q*R+',
            '(X|Y|Z)^38+(9|0)',
            '(H|i)(J|K)L*N?'
        ];

        regexes.forEach((regex, index) => {
            console.log(`\nRegular Expression ${index + 1}: ${regex}`);
            console.log("\nProcessing Steps:");
            const steps = this.generator.explainProcessing(regex);
            steps.forEach(step => console.log(step));
            console.log("\nGenerated Strings:");
            const generatedStrings = this.generator.generateMultipleStrings(regex, 5);
            generatedStrings.forEach((str, i) => console.log(`${i + 1}. ${str}`));
            console.log("\n-------------------");
        });
    }
}

const demo = new RegexDemo();
demo.run();