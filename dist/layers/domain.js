export const generateDomainLayer = (captalizedName) => ({
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
});
