export const generateApplicationLayer = () => ({
  folderName: 'application',
  childFolder: [
    {
      folderName: 'contracts',
      childFolder: [{ folderName: 'broker' }, { folderName: 'use-cases' }],
    },
    {
      folderName: 'use-cases',
    },
  ],
});
