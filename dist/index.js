#!/usr/bin/env node
import { program } from 'commander';
import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import { generateLayers } from './layers/index.js';
function captalizeName(splittedName) {
    return splittedName
        .map((name) => {
        if (name.startsWith(name[0].toUpperCase())) {
            return name;
        }
        return name.charAt(0).toUpperCase() + name.slice(1);
    })
        .join('');
}
function transformName(name) {
    const splittedName = name.split('-');
    const captalizedName = captalizeName(splittedName);
    return { captalizedName, lowerCaseName: name.toLowerCase() };
}
program
    .version('1.0.0')
    .description('CLI para gerar módulos de backend')
    .argument('<name>', 'Nome do módulo a ser criado')
    .action((name) => {
    // process.cwd() garante que a pasta será criada onde você digitar o comando
    const { captalizedName, lowerCaseName } = transformName(name);
    const targetDir = path.join(process.cwd(), 'apps', 'backend', 'server', 'modules', lowerCaseName);
    if (fs.existsSync(targetDir)) {
        console.log(chalk.red(`❌ Erro: O módulo "${lowerCaseName}" já existe!`));
        return;
    }
    try {
        const layers = generateLayers(captalizedName);
        function recursiveFolder(folder, folderPaths) {
            const folderPath = path.join(...folderPaths);
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }
            if (folder.files?.length) {
                folder.files.forEach((file) => {
                    fs.writeFileSync(path.join(folderPath, file.fileName ?? ''), file.fileContent ?? '');
                });
            }
            if (folder.childFolder?.length) {
                folder.childFolder.forEach((child) => {
                    recursiveFolder(child, [...folderPaths, child.folderName]);
                });
            }
        }
        layers.forEach((folder) => recursiveFolder(folder, [targetDir, folder.folderName]));
        console.log(chalk.green.bold(`\n🚀 Módulo "${name}" gerado com sucesso em:`));
        console.log(chalk.cyan(targetDir));
    }
    catch (err) {
        console.error(chalk.red('Erro ao criar pastas:'), err);
    }
});
program.parse(process.argv);
