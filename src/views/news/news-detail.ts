import { News } from '../../news/news.service';
import { CreateCommentDto } from 'src/news/comments/dtos/create_comment_dto';

export function renderNewsDetail(
  news: News,
  comment: CreateCommentDto[],
): string {
  return `
    <div class="container">
      <img src="${news.cover}" alt="">
      <h1>${news.title}</h1>
      <div>${news.description}</div>
      <div class="text-muted">Avtor: ${news.author}</div>

      ${comment ? renderNewsComments(comment) : 'Net kommentarijev'}
    </div>
  `;
}

function renderNewsComments(comments: CreateCommentDto[]): string {
  let html = '';

  for (const comment of comments) {
    html += `
      <div class="row">
        <div class="col-lg-1">
          ${
            comment?.avatar
              ? `<img src="${comment.avatar}" style="background: #ccc; width: 75px; height: 75px; overflow: hidden; object-fit: cover"/>`
              : '<div style="background: #ccc; width: 75px; height: 75px; overflow: hidden;" class="rounded-lg"></div>'
          }
        </div>

        <div class="col-lg-8">
          <div>${comment.author}</div>
          <div>${comment.message}</div>
        </div>
      </div>
    `;
  }

  return html;
}
