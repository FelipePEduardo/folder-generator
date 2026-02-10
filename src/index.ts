#!/usr/bin/env node

import { program } from 'commander';
import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import type { LayersType } from './@types/layersType.js';

program
  .version('1.0.0')
  .description('CLI para gerar módulos de backend')
  .argument('<name>', 'Nome do módulo a ser criado')
  .action((name: string) => {
    // process.cwd() garante que a pasta será criada onde você digitar o comando
    let captalizedName: string;

    if (name.startsWith(name[0]!.toUpperCase())) {
      captalizedName = name;
    } else {
      captalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    }

    const lowerCaseName = name.toLowerCase();

    const targetDir = path.join(
      process.cwd(),
      'apps',
      'backend',
      'server',
      'modules',
      lowerCaseName,
    );

    if (fs.existsSync(targetDir)) {
      console.log(chalk.red(`❌ Erro: O módulo "${lowerCaseName}" já existe!`));
      return;
    }

    const layers: LayersType[] = [
      {
        folderName: 'api',
        childFolder: [
          {
            folderName: 'contracts',
            files: [
              {
                fileName: `I${captalizedName}.Controller.ts`,
                fileContent: `import { Request } from '@tbdcagro/tbdc-lib';\n\nexport abstract class I${captalizedName}Controller {\n  abstract handle(req: Request): Promise<${captalizedName}Controller['handle']['response']>;\n}`,
              },
            ],
          },
          {
            folderName: 'controllers',
            files: [
              {
                fileName: `${captalizedName}.Controller.ts`,
                fileContent: `import { inject, injectable } from 'inversify';\nimport { Request } from '@tbdcagro/tbdc-lib';\n\nimport { getRequestInfo } from '@shared/api/helpers/getRequestInfo';\nimport { I${captalizedName}Controller } from './contracts/I${captalizedName}.Controller'\n\n@injectable()\nexport class ${captalizedName}Controller implements I${captalizedName}Controller {\n  constructor() {}\n\n  async handle(req: Request) {\n    const { query, contextParams } = getRequestInfo(req);\n\n    return { useCase: 'useCase' } \n  }\n}`,
              },
            ],
          },
        ],
        files: [
          {
            fileName: 'routes.ts',
            fileContent: `import { Router } from 'express';\nimport { httpStatus, routerHandler } from '@tbdcagro/tbdc-lib';\nimport AppContainer from '@shared/inversify.config';\nimport I${captalizedName}Controller from './contracts/I${captalizedName}.Controller';\nimport authMiddleware from '@shared/api/middlewares/authMiddleware';\n\nconst ${captalizedName}Controller = AppContainer.get(I${captalizedName}Controller);\n\nconst ${captalizedName}Router = Router();\n${captalizedName}Router.use(authMiddleware);\n\n${captalizedName}Router.get('/handle', routerHandler(${captalizedName}Controller, 'handle', { status: httpStatus.OK }));`,
          },
        ],
      },
      {
        folderName: 'application',
        childFolder: [
          {
            folderName: 'contracts',
          },
          {
            folderName: 'use-cases',
          },
        ],
      },
      {
        folderName: 'domain',
        childFolder: [
          { folderName: 'daos' },
          { folderName: 'entities' },
          {
            folderName: 'repositories',
            files: [
              {
                fileName: `I${captalizedName}.Repository.ts`,
                fileContent: `import { QueryOptions, ContextParams } from '@tbdcagro/tbdc-lib';\n\nexport abstract class I${captalizedName}Repository {\n  abstract handle(query: QueryOptions, contextParams: ContextParams): Promise<any>;\n}`,
              },
            ],
          },
        ],
      },
      {
        folderName: 'infra',
        childFolder: [
          {
            folderName: 'broker',
            childFolder: [
              { folderName: 'consumer' },
              {
                folderName: 'interfaces',
                childFolder: [
                  { folderName: 'consumer' },
                  { folderName: 'publisher' },
                ],
              },
              { folderName: 'publisher' },
            ],
          },
          {
            folderName: 'daos',
          },
          {
            folderName: 'mappers',
            files: [
              {
                fileName: `${captalizedName}.Mapper.ts`,
                fileContent: `export default abstract class ${captalizedName}Mapper {\n   static mapHandle(query: any): any {\n   return query\n  }\n}`,
              },
            ],
          },
          {
            folderName: 'repositories',
            files: [{ fileName: `${captalizedName}.Repository.ts` }],
          },
          {
            folderName: 'types',
          },
        ],
      },
      {
        folderName: 'ioc',
        files: [
          {
            fileName: 'index.ts',
            fileContent: `import { ContainerModule, interfaces } from 'inversify';\n\nimport { I${captalizedName}Controller } from '../api/contracts/I${captalizedName}.Controller';\n\nimport { ${captalizedName}Controller } from '../api/controllers/${captalizedName}.Controller';\n\nimport { I${captalizedName}Repository } from '../domain/repositories/I${captalizedName}.Repository';\n\nimport { ${captalizedName}Repository } from '../infra/repositories/${captalizedName}.Repository';\n\nexport const ${captalizedName}Module = new ContainerModule((bind: interfaces.Bind) => {\n  /* Controllers */\n  bind(I${captalizedName}Controller).to(${captalizedName}Controller);\n  /* Repositories */\n  bind(I${captalizedName}Repository).to(${captalizedName}Repository);\n})`,
          },
        ],
      },
      {
        folderName: 'test',
        childFolder: [{ folderName: 'mocks' }],
      },
    ];

    try {
      function recursiveFolder(folder: LayersType, folderPaths: string[]) {
        const folderPath = path.join(...folderPaths);

        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
        }

        if (folder.files?.length) {
          folder.files.forEach((file) => {
            fs.writeFileSync(
              path.join(folderPath, file.fileName ?? ''),
              file.fileContent ?? '',
            );
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

      console.log(
        chalk.green.bold(`\n🚀 Módulo "${name}" gerado com sucesso em:`),
      );
      console.log(chalk.cyan(targetDir));
    } catch (err) {
      console.error(chalk.red('Errinho ao criar pastas:'), err);
    }
  });

program.parse(process.argv);
