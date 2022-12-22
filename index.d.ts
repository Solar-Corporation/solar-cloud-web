/* tslint:disable */
/* eslint-disable */

/* auto-generated by NAPI-RS */

export interface UserDir {
  uuid: string;
  storage: number;
}
export interface UserFile {
  buffer: Buffer;
  filePath: string;
  mimeType?: string;
  seeTime?: number;
  size?: number;
}
export interface FileTree {
  name: string;
  path: string;
  size: string;
  fileType: string;
  mimeType: string;
  isDir: boolean;
  isFavorite: boolean;
  seeTime: number;
}
export class FileService {
  /**
   * Метод проверяет, хватает ли места на диске.
   * Если места хватает, то создаёт папку пользователя.
   */
  static createUserDir(user: UserDir, basePath: string): Promise<string>
  /** Метод сохраняет файл в папку пользователя */
  static saveFile(file: UserFile, uuid: string, basePath: string): Promise<void>
  /** Метод получения файла по пути */
  static getFile(path: string): Promise<UserFile>

  /** Метод возвращает файлы, которые находятся в директории по заданному пути */
  static getFileTree(path: string, basePath: string): Promise<Array<FileTree>>
  static rename(path: string, newPath: string): Promise<void>
}
