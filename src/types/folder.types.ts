export interface BaseData {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  url: string | null;
}

export interface FolderDB extends BaseData {
  parentId: number | null;
}

export interface CompleteFolder extends FolderDB {
  subFolders: FolderDB[];
  files: FileDB[];
}

export interface FileDB extends BaseData {
  folderId: number;
  type: string;
  size: number;
}
