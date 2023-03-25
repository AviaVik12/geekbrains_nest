import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UsersEntity } from '../users/users.entity';
import { CommentsEntity } from './comments/comments.entity';

@Entity('news')
export class NewsEntity {
  @ApiProperty({ example: 1, description: 'Identifikator novosti' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Novostj pro kotov',
    description: 'Zagolovok novosti',
  })
  @Column('text')
  title: string;

  @ApiProperty({
    example: 'Koty klassnyje i milyje...',
    description: 'Opisanije novosti',
  })
  @Column('text')
  description: string;

  @ApiProperty({
    example:
      'http://localhost:3000/news_static/2eafd6f1-e2c3-4f8c-a5eb-ac13d0a6d0d8.png',
    description: 'Obloƶka novosti',
  })
  @Column('text', { nullable: true })
  cover: string;

  @OneToMany(() => CommentsEntity, (comments) => comments.news)
  comments: CommentsEntity;

  // @ManyToOne(() => CategoriesEntity, (category) => category.news)
  // category: CategoriesEntity;

  @ManyToOne(() => UsersEntity, (user) => user.news)
  user: UsersEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
