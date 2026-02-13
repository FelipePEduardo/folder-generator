import { LayersType } from './@types/layersType';

export function generateLayers(captalizedName: string): LayersType[] {
  return [
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
              fileContent: `import { inject, injectable } from 'inversify';\nimport { Request } from '@tbdcagro/tbdc-lib';\n\nimport { I${captalizedName}Controller } from '../contracts/I${captalizedName}.Controller';\n\n@injectable()\nexport class ${captalizedName}Controller implements I${captalizedName}Controller {\n  async handle(req: Request) {\n    throw new Error('Method not implemented.');\n  }\n}`,
            },
          ],
        },
      ],
      files: [
        {
          fileName: 'routes.ts',
          fileContent: `import { Router } from 'express';\nimport { httpStatus, routerHandler } from '@tbdcagro/tbdc-lib';\nimport AppContainer from '@shared/inversify.config';\nimport { I${captalizedName}Controller } from './contracts/I${captalizedName}.Controller';\nimport authMiddleware from '@shared/api/middlewares/authMiddleware';\n\nconst ${captalizedName}Controller = AppContainer.get(I${captalizedName}Controller);\n\nconst ${captalizedName}Router = Router();\n${captalizedName}Router.use(authMiddleware);\n\n${captalizedName}Router.get('/handle', routerHandler(${captalizedName}Controller, 'handle', { status: httpStatus.OK }));`,
        },
      ],
    },
    {
      folderName: 'application',
      childFolder: [
        {
          folderName: 'contracts',
          childFolder: [
            { folderName: 'consumer' },
            { folderName: 'use-cases' },
          ],
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
              childFolder: [{ folderName: 'publisher' }],
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
              fileContent: `export default abstract class ${captalizedName}Mapper {\n  static mapHandle(query: any): any {\n    return query;\n  }\n}`,
            },
          ],
        },
        {
          folderName: 'repositories',
          files: [
            {
              fileName: `${captalizedName}.Repository.ts`,
              fileContent: `import { injectable } from 'inversify';\nimport { I${captalizedName}Repository } from '../../domain/repositories/I${captalizedName}.Repository';\nimport BaseRepository from '@shared/infraestructure/database/Base.Respository';\n\n@injectable()\nexport class ${captalizedName}Repository extends BaseRepository implements I${captalizedName}Repository {\n  async handle(query: QueryOptions, contextParams: ContextParams) {\n    throw new Error('Method not implemented.');\n  } \n}`,
            },
          ],
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
          fileContent: `import { ContainerModule, interfaces } from 'inversify';\nimport { QueryOptions, ContextParams } from '@tbdcagro/tbdc-lib';\n\nimport { I${captalizedName}Controller } from '../api/contracts/I${captalizedName}.Controller';\n\nimport { ${captalizedName}Controller } from '../api/controllers/${captalizedName}.Controller';\n\nimport { I${captalizedName}Repository } from '../domain/repositories/I${captalizedName}.Repository';\n\nimport { ${captalizedName}Repository } from '../infra/repositories/${captalizedName}.Repository';\n\nexport const ${captalizedName}Module = new ContainerModule((bind: interfaces.Bind) => {\n  /* Controllers */\n  bind(I${captalizedName}Controller).to(${captalizedName}Controller);\n  /* Repositories */\n  bind(I${captalizedName}Repository).to(${captalizedName}Repository);\n});`,
        },
      ],
    },
    {
      folderName: 'test',
      childFolder: [{ folderName: 'mocks' }],
    },
  ];
}
