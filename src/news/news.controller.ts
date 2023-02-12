import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Put
} from "@nestjs/common";
import { News, NewsEdit, NewsService } from "./news.service";
import { CommentsService } from "./comments/comments.service";
import { renderNewsAll } from "../views/news/news-all";
import { renderTemplate } from "../views/template";

@Controller("news")
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly commentsService: CommentsService
  ) {
  }

  @Get("/api/details/:id")
  get(@Param("id") id: string): News {
    let idInt = parseInt(id);
    const news = this.newsService.find(idInt);
    const comments = this.commentsService.find(idInt);
    return { ...news, comments };
  }

  @Get("/api/all")
  getAll(): News[] {
    const news = this.newsService.getAll();
    return news;
  }

  @Get("/all")
  getAllView() {
    const news = this.newsService.getAll();
    const content = renderNewsAll(news);
    return renderTemplate(
      content, 
      {title: "List of news", description: "The coolest news in the world"}
    );
  }

  @Post("/api")
  create(@Body() news: News): News {
    return this.newsService.create(news);
  }

  @Put("/api/:id")
  edit(@Param("id") id: string, @Body() news: NewsEdit): News {
    const idInt = parseInt(id);
    return this.newsService.edit(idInt, news);
  }

  @Delete("api//:id")
  remove(@Param("id") id: string): string {
    let idInt = parseInt(id);
    const isRemoved = this.newsService.remove(idInt);
    return isRemoved ? "News were deleted" : "Invalid ID passed";
  }
}
