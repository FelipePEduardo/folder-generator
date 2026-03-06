import { LayersType } from '../@types/layersType';

export const generateApplicationLayer = (): LayersType => ({
  folderName: 'application',
  childFolder: [
    {
      folderName: 'contracts',
      childFolder: [
        {
          folderName: 'broker',
          childFolder: [
            {
              folderName: 'consumer',
            },
            {
              folderName: 'publisher',
            },
          ],
        },
        { folderName: 'use-cases' },
      ],
    },
    {
      folderName: 'use-cases',
    },
  ],
});
