export const generateIOCLayer = (captalizedName: string) => ({
  folderName: 'ioc',
  files: [
    {
      fileName: 'index.ts',
      fileContent: `import { ContainerModule, interfaces } from 'inversify';\nimport { QueryOptions, ContextParams } from '@tbdcagro/tbdc-lib';\n\nimport { I${captalizedName}Controller } from '../api/contracts/I${captalizedName}.Controller';\n\nimport { ${captalizedName}Controller } from '../api/controllers/${captalizedName}.Controller';\n\nimport { I${captalizedName}Repository } from '../domain/repositories/I${captalizedName}.Repository';\n\nimport { ${captalizedName}Repository } from '../infra/repositories/${captalizedName}.Repository';\n\nexport const ${captalizedName}Module = new ContainerModule((bind: interfaces.Bind) => {\n  /* Controllers */\n  bind(I${captalizedName}Controller).to(${captalizedName}Controller);\n  /* Repositories */\n  bind(I${captalizedName}Repository).to(${captalizedName}Repository);\n});`,
    },
  ],
});
