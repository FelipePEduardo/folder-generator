export const generateInfraestructureLayer = (captalizedName) => ({
    folderName: 'infra',
    childFolder: [
        {
            folderName: 'broker',
            childFolder: [{ folderName: 'consumer' }, { folderName: 'publisher' }],
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
});
