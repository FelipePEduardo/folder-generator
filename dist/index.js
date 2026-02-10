#!/usr/bin/env node
import { program } from 'commander';
import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import { generateLayers } from './layers.js';
program
    .version('1.0.0')
    .description('CLI para gerar módulos de backend')
    .argument('<name>', 'Nome do módulo a ser criado')
    .action((name) => {
    // process.cwd() garante que a pasta será criada onde você digitar o comando
    let captalizedName;
    if (name.startsWith(name[0].toUpperCase())) {
        captalizedName = name;
    }
    else {
        captalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    }
    const lowerCaseName = name.toLowerCase();
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
        layers.forEach((folder) => {
            let folderPaths = [targetDir, folder.folderName];
            recursiveFolder(folder, folderPaths);
            folderPaths = [];
        });
        console.log(chalk.green.bold(`\n🚀 Módulo "${name}" gerado com sucesso em:`));
        console.log(chalk.cyan(targetDir));
    }
    catch (err) {
        console.error(chalk.red('Errinho ao criar pastas:'), err);
    }
});
program.parse(process.argv);
