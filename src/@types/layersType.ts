export type LayersType = {
  folderName: string;
  childFolder?: LayersType[];
  files?: Array<{
    fileName?: string;
    fileContent?: string;
  }>;
};
