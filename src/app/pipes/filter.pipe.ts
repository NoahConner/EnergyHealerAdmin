import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(value: any[], searchText: string): any[] {
    if (!searchText) {
      return value;
    }

    const filteredRows = value?.filter((item) => {
      const itemString = JSON.stringify(item).toLowerCase();
      return itemString.includes(searchText.toLowerCase());
    });

    if (!filteredRows || filteredRows.length === 0) {
      return [];
    }

    // Add logic to display 'mints' when item?.time is falsy
    const result = filteredRows.map((item) => {
      if (!item?.time) {
        return { ...item, time: 'mints' };
      }
      return item;
    });

    return result;
  }
}
