import { exec } from 'child_process';
import { writeFileSync } from 'fs';

export function generateImage(dotCode: string, outputFile: string): Promise<void> {
    return new Promise((resolve, reject) => {
        // Сохраняем DOT-код во временный файл
        const dotFilePath = './temp.dot';
        writeFileSync(dotFilePath, dotCode);

        // Вызываем Graphviz для генерации изображения
        exec(`dot -Tpng ${dotFilePath} -o ${outputFile}`, (error, stdout, stderr) => {
            if (error) {
                reject(`Error generating image: ${stderr}`);
            } else {
                resolve();
            }
        });
    });
}