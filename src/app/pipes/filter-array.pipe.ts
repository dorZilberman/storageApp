import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterArray',
})
export class FilterArrayPipe implements PipeTransform {

  transform(items: Array<any>, callback?: (item: any) => boolean) {
    if (items && callback && Array.isArray(items)) {
      if (items.length > 0) {
        let res = items.filter(item => callback(item));
        return res;
      }
    }
    return items;
  }
}
