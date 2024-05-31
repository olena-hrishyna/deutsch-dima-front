import { MatPaginatorIntl } from '@angular/material/paginator';
import { Injectable } from '@angular/core';

@Injectable()
export class MyPaginatorIntl extends MatPaginatorIntl {
  public override itemsPerPageLabel = 'Слов на странице:';
  public override nextPageLabel = 'Следующая страница';
  public override previousPageLabel = 'Предыдущая страница';
  public override firstPageLabel = 'Первая страница';
  public override lastPageLabel = 'Последняя страница';
  public override getRangeLabel = function (
    page: number,
    pageSize: number,
    length: number
  ): string {
    if (length === 0 || pageSize === 0) {
      return `0 из ${length}`;
    }

    length = Math.max(length, 0);

    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;

    return `${startIndex + 1} – ${endIndex} из ${length}`;
  };
}
