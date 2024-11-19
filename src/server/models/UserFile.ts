import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class UserFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  path: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'bigint' })
  size: number;

  @Column()
  isDirectory: boolean;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ nullable: true })
  publicUrl: string;

  @Column({ nullable: true })
  mimeType: string;

  @Column({ nullable: true })
  parentId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
