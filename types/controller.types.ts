export interface FileCore {
  name: string;
  userId: number;
  url: string;
  folderId: number;
  type: string;
  size: number;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface AppError extends Error {
  status?: number;
}
