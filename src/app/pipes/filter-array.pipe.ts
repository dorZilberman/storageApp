import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterArray',
})
export class FilterArrayPipe implements PipeTransform {

  transform(items: Array<any>, callback?: (item: any) => boolean) {
    console.log('input array');
    console.log(items);
    if (!items || !callback || !Array.isArray(items)) {
    } else if (items.length > 0){
      console.log(items[0]);
      let res = items.filter(item => callback(item));
      console.log('res');
      console.log(res);
      return res;
    }
    return items;
  }
}
