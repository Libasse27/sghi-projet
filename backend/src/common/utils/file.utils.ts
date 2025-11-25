import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);
const mkdirAsync = promisify(fs.mkdir);
const statAsync = promisify(fs.stat);

export class FileUtils {
  /**
   * Get file extension
   */
  static getExtension(filename: string): string {
    return path.extname(filename).toLowerCase();
  }

  /**
   * Get filename without extension
   */
  static getFilenameWithoutExtension(filename: string): string {
    return path.basename(filename, path.extname(filename));
  }

  /**
   * Check if file exists
   */
  static fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  /**
   * Check if directory exists
   */
  static directoryExists(dirPath: string): boolean {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  }

  /**
   * Create directory if it doesn't exist
   */
  static async ensureDirectory(dirPath: string): Promise<void> {
    if (!this.directoryExists(dirPath)) {
      await mkdirAsync(dirPath, { recursive: true });
    }
  }

  /**
   * Read file as string
   */
  static async readFile(filePath: string): Promise<string> {
    return await readFileAsync(filePath, 'utf8');
  }

  /**
   * Write string to file
   */
  static async writeFile(filePath: string, content: string): Promise<void> {
    const dirPath = path.dirname(filePath);
    await this.ensureDirectory(dirPath);
    await writeFileAsync(filePath, content, 'utf8');
  }

  /**
   * Delete file
   */
  static async deleteFile(filePath: string): Promise<void> {
    if (this.fileExists(filePath)) {
      await unlinkAsync(filePath);
    }
  }

  /**
   * Get file size in bytes
   */
  static async getFileSize(filePath: string): Promise<number> {
    const stats = await statAsync(filePath);
    return stats.size;
  }

  /**
   * Format file size to human readable format
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Validate file type by extension
   */
  static isValidFileType(filename: string, allowedExtensions: string[]): boolean {
    const extension = this.getExtension(filename);
    return allowedExtensions.map((ext) => ext.toLowerCase()).includes(extension);
  }

  /**
   * Validate image file
   */
  static isImageFile(filename: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    return this.isValidFileType(filename, imageExtensions);
  }

  /**
   * Validate document file
   */
  static isDocumentFile(filename: string): boolean {
    const documentExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'];
    return this.isValidFileType(filename, documentExtensions);
  }

  /**
   * Generate unique filename
   */
  static generateUniqueFilename(originalFilename: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = this.getExtension(originalFilename);
    const basename = this.getFilenameWithoutExtension(originalFilename);

    return `${basename}-${timestamp}-${randomString}${extension}`;
  }

  /**
   * Sanitize filename (remove special characters)
   */
  static sanitizeFilename(filename: string): string {
    const extension = this.getExtension(filename);
    const basename = this.getFilenameWithoutExtension(filename);

    // Remove special characters and replace spaces with underscores
    const sanitized = basename
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');

    return sanitized + extension;
  }

  /**
   * Get MIME type from extension
   */
  static getMimeType(filename: string): string {
    const extension = this.getExtension(filename);

    const mimeTypes: { [key: string]: string } = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.ppt': 'application/vnd.ms-powerpoint',
      '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      '.txt': 'text/plain',
      '.csv': 'text/csv',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.bmp': 'image/bmp',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.json': 'application/json',
      '.xml': 'application/xml',
      '.zip': 'application/zip',
      '.rar': 'application/x-rar-compressed',
      '.mp4': 'video/mp4',
      '.mp3': 'audio/mpeg',
    };

    return mimeTypes[extension] || 'application/octet-stream';
  }

  /**
   * Read file as Base64
   */
  static async readFileAsBase64(filePath: string): Promise<string> {
    const buffer = await readFileAsync(filePath);
    return buffer.toString('base64');
  }

  /**
   * Write Base64 to file
   */
  static async writeBase64ToFile(filePath: string, base64Data: string): Promise<void> {
    const buffer = Buffer.from(base64Data, 'base64');
    const dirPath = path.dirname(filePath);
    await this.ensureDirectory(dirPath);
    await writeFileAsync(filePath, buffer);
  }

  /**
   * Copy file
   */
  static async copyFile(sourcePath: string, destinationPath: string): Promise<void> {
    const dirPath = path.dirname(destinationPath);
    await this.ensureDirectory(dirPath);
    await fs.promises.copyFile(sourcePath, destinationPath);
  }

  /**
   * Move file
   */
  static async moveFile(sourcePath: string, destinationPath: string): Promise<void> {
    await this.copyFile(sourcePath, destinationPath);
    await this.deleteFile(sourcePath);
  }

  /**
   * List files in directory
   */
  static async listFiles(dirPath: string, extension?: string): Promise<string[]> {
    if (!this.directoryExists(dirPath)) {
      return [];
    }

    const files = await fs.promises.readdir(dirPath);

    if (extension) {
      return files.filter((file) => this.getExtension(file) === extension);
    }

    return files;
  }

  /**
   * Get file creation date
   */
  static async getFileCreationDate(filePath: string): Promise<Date> {
    const stats = await statAsync(filePath);
    return stats.birthtime;
  }

  /**
   * Get file modification date
   */
  static async getFileModificationDate(filePath: string): Promise<Date> {
    const stats = await statAsync(filePath);
    return stats.mtime;
  }
}
