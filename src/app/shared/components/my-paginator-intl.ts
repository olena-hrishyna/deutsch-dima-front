import { MatPaginatorIntl } from '@angular/material/paginator';
import { Injectable } from '@angular/core';

@Injectable()
export class MyPaginatorIntl extends MatPaginatorIntl {
  public override itemsPerPageLabel = 'Слів на сторінці:';
  public override nextPageLabel = 'Наступна сторінка';
  public override previousPageLabel = 'Попередня сторінка';
  public override firstPageLabel = 'Перша сторінка';
  public override lastPageLabel = 'Остання сторінка';
  public override getRangeLabel = function (
    page: number,
    pageSize: number,
    length: number
  ): string {
    if (length === 0 || pageSize === 0) {
      return `0 з ${length}`;
    }

    length = Math.max(length, 0);

    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;

    return `${startIndex + 1} – ${endIndex} з ${length}`;
  };
}
