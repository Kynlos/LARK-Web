import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { UserFile } from '../models/UserFile';
import { User } from '../models/User';
import { FileStorageService } from '../services/FileStorageService';
import { v4 as uuidv4 } from 'uuid';
import { createReadStream, createWriteStream } from 'fs';
import { join } from 'path';
import { pipeline } from 'stream/promises';
import archiver from 'archiver';
import mime from 'mime-types';

export class FileController {
  private fileRepository = getRepository(UserFile);
  private fileStorageService = FileStorageService.getInstance();

  async listFiles(req: Request, res: Response) {
    try {
      const { path = '/' } = req.query;
      const userId = req.user.id;

      const files = await this.fileRepository.find({
        where: { userId, path },
        order: {
          isDirectory: 'DESC',
          name: 'ASC',
        },
      });

      return res.json({ files, totalCount: files.length });
    } catch (error) {
      console.error('Error listing files:', error);
      return res.status(500).json({ message: 'Failed to list files' });
    }
  }

  async createFile(req: Request, res: Response) {
    try {
      const { name, path, content, isDirectory } = req.body;
      const userId = req.user.id;

      const file = this.fileRepository.create({
        id: uuidv4(),
        name,
        path,
        content: isDirectory ? null : content,
        size: isDirectory ? 0 : Buffer.from(content).length,
        isDirectory,
        userId,
      });

      await this.fileRepository.save(file);
      return res.json({ success: true, file });
    } catch (error) {
      console.error('Error creating file:', error);
      return res.status(500).json({ message: 'Failed to create file' });
    }
  }

  async readFile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const file = await this.fileRepository.findOne({
        where: { id, userId },
      });

      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }

      if (file.isDirectory) {
        return res.status(400).json({ message: 'Cannot read directory content' });
      }

      const content = await this.fileStorageService.readFile(file);
      res.setHeader('Content-Type', file.mimeType || 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
      res.send(content);
    } catch (error) {
      console.error('Error reading file:', error);
      return res.status(500).json({ message: 'Failed to read file' });
    }
  }

  async updateFile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, content, isPublic } = req.body;
      const userId = req.user.id;

      const file = await this.fileRepository.findOne({
        where: { id, userId },
      });

      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }

      if (name) file.name = name;
      if (content !== undefined) {
        file.content = content;
        file.size = Buffer.from(content).length;
      }
      if (isPublic !== undefined) {
        file.isPublic = isPublic;
        if (isPublic) {
          file.publicUrl = await this.fileStorageService.generatePublicUrl(file);
        } else {
          file.publicUrl = null;
        }
      }

      await this.fileRepository.save(file);
      return res.json({ success: true, file });
    } catch (error) {
      console.error('Error updating file:', error);
      return res.status(500).json({ message: 'Failed to update file' });
    }
  }

  async deleteFile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const file = await this.fileRepository.findOne({
        where: { id, userId },
      });

      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }

      if (file.isDirectory) {
        // Delete all files in directory
        await this.fileRepository.delete({
          userId,
          path: new RegExp(`^${file.path}/${file.name}/`),
        });
      }

      await this.fileRepository.remove(file);
      return res.json({ success: true });
    } catch (error) {
      console.error('Error deleting file:', error);
      return res.status(500).json({ message: 'Failed to delete file' });
    }
  }

  async shareFile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const file = await this.fileRepository.findOne({
        where: { id, userId },
      });

      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }

      file.isPublic = true;
      file.publicUrl = await this.fileStorageService.generatePublicUrl(file);
      await this.fileRepository.save(file);

      return res.json({ publicUrl: file.publicUrl });
    } catch (error) {
      console.error('Error sharing file:', error);
      return res.status(500).json({ message: 'Failed to share file' });
    }
  }

  async unshareFile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const file = await this.fileRepository.findOne({
        where: { id, userId },
      });

      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }

      file.isPublic = false;
      file.publicUrl = null;
      await this.fileRepository.save(file);

      return res.json({ success: true });
    } catch (error) {
      console.error('Error unsharing file:', error);
      return res.status(500).json({ message: 'Failed to unshare file' });
    }
  }

  async downloadFile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { asZip, includeChildren } = req.query;
      const userId = req.user.id;

      const file = await this.fileRepository.findOne({
        where: { id, userId },
      });

      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }

      if (file.isDirectory && !asZip) {
        return res.status(400).json({ message: 'Cannot download directory without zip option' });
      }

      if (asZip) {
        const archive = archiver('zip', { zlib: { level: 9 } });
        res.attachment(`${file.name}.zip`);
        archive.pipe(res);

        if (file.isDirectory && includeChildren) {
          const children = await this.fileRepository.find({
            where: {
              userId,
              path: new RegExp(`^${file.path}/${file.name}/`),
            },
          });

          for (const child of children) {
            if (!child.isDirectory) {
              const content = await this.fileStorageService.readFile(child);
              archive.append(content, {
                name: child.path.replace(`${file.path}/${file.name}/`, '') + '/' + child.name,
              });
            }
          }
        } else {
          const content = await this.fileStorageService.readFile(file);
          archive.append(content, { name: file.name });
        }

        await archive.finalize();
      } else {
        const content = await this.fileStorageService.readFile(file);
        res.setHeader('Content-Type', file.mimeType || 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
        res.send(content);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      return res.status(500).json({ message: 'Failed to download file' });
    }
  }

  async uploadFile(req: Request, res: Response) {
    try {
      const { path } = req.body;
      const userId = req.user.id;
      const uploadedFile = req.file;

      if (!uploadedFile) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const file = this.fileRepository.create({
        id: uuidv4(),
        name: uploadedFile.originalname,
        path,
        content: await uploadedFile.buffer.toString(),
        size: uploadedFile.size,
        isDirectory: false,
        userId,
        mimeType: uploadedFile.mimetype,
      });

      await this.fileRepository.save(file);
      await this.fileStorageService.saveFile(file, uploadedFile.buffer);
      return res.json({ success: true, file });
    } catch (error) {
      console.error('Error uploading file:', error);
      return res.status(500).json({ message: 'Failed to upload file' });
    }
  }

  async moveFile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { newPath } = req.body;
      const userId = req.user.id;

      const file = await this.fileRepository.findOne({
        where: { id, userId },
      });

      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }

      file.path = newPath;
      await this.fileRepository.save(file);

      if (file.isDirectory) {
        // Update paths of all children
        const children = await this.fileRepository.find({
          where: {
            userId,
            path: new RegExp(`^${file.path}/${file.name}/`),
          },
        });

        for (const child of children) {
          child.path = child.path.replace(file.path, newPath);
          await this.fileRepository.save(child);
        }
      }

      return res.json({ success: true, file });
    } catch (error) {
      console.error('Error moving file:', error);
      return res.status(500).json({ message: 'Failed to move file' });
    }
  }

  async copyFile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { newPath } = req.body;
      const userId = req.user.id;

      const file = await this.fileRepository.findOne({
        where: { id, userId },
      });

      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }

      const newFile = this.fileRepository.create({
        ...file,
        id: uuidv4(),
        path: newPath,
        isPublic: false,
        publicUrl: null,
      });

      await this.fileRepository.save(newFile);

      if (file.isDirectory) {
        // Copy all children
        const children = await this.fileRepository.find({
          where: {
            userId,
            path: new RegExp(`^${file.path}/${file.name}/`),
          },
        });

        for (const child of children) {
          const newChild = this.fileRepository.create({
            ...child,
            id: uuidv4(),
            path: child.path.replace(file.path, newPath),
            isPublic: false,
            publicUrl: null,
          });
          await this.fileRepository.save(newChild);
        }
      }

      return res.json({ success: true, file: newFile });
    } catch (error) {
      console.error('Error copying file:', error);
      return res.status(500).json({ message: 'Failed to copy file' });
    }
  }

  async exportUserFiles(req: Request, res: Response) {
    try {
      const userId = req.user.id;

      const files = await this.fileRepository.find({
        where: { userId },
      });

      const archive = archiver('zip', { zlib: { level: 9 } });
      res.attachment('user_files.zip');
      archive.pipe(res);

      for (const file of files) {
        if (!file.isDirectory) {
          const content = await this.fileStorageService.readFile(file);
          archive.append(content, {
            name: `${file.path}/${file.name}`.replace(/^\/+/, ''),
          });
        }
      }

      await archive.finalize();
    } catch (error) {
      console.error('Error exporting files:', error);
      return res.status(500).json({ message: 'Failed to export files' });
    }
  }
}
