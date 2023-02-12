import { Injectable } from '@nestjs/common';
import { Comment } from './comments/comments.service';

export interface News {
  id?: number;
  title: string;
  description: string;
  author: string;
  countView?: number;
  comments?: Comment[];
  cover?: string;
}

export interface NewsEdit {
  title?: string;
  description?: string;
  author?: string;
  countView?: number;
  cover?: string;
}

export function getRandomInt(min: number = 1, max: number = 9999): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

@Injectable()
export class NewsService {
  private readonly news: News[] = [
    {
      id: 1,
      title: 'Our first news',
      description: 'Yay! Our first news',
      author: 'Vladislav',
      countView: 12,
      cover: 'https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg'
    },
  ];

  create(news: News): News {
    const id = getRandomInt(0, 99999);
    console.log(id);
    const finalNews = { ...news, id: id };
    this.news.push(finalNews);
    return finalNews;
  }

  find(id: News['id']): News | undefined {
    return this.news.find((news) => news.id === id);
  }

  getAll(): News[] {
    return this.news;
  }

  edit(id: number, news: NewsEdit): News | undefined {
    const indexEditableNews = this.news.findIndex((news) => news.id === id);

    if (indexEditableNews !== -1) {
      this.news[indexEditableNews] = {
        ...this.news[indexEditableNews],
        ...news,
      };

      return this.news[indexEditableNews];
    }

    return undefined;
  }

  remove(id: News['id']): boolean {
    const indexRemoveNews = this.news.findIndex((news) => news.id === id);

    if (indexRemoveNews !== -1) {
      this.news.splice(indexRemoveNews, 1);
      return true;
    }

    return false;
  }
}
