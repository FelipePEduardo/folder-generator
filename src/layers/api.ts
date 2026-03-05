export const generateApiLayer = (captalizedName: string) => ({
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
});
