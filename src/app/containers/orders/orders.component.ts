import { Component, OnInit, OnChanges, ViewChild, IterableDiffers, Input, Output, EventEmitter } from '@angular/core';
import { FilterUtils } from 'primeng/utils';
import { Paginator, Table } from 'primeng';
declare var JsBarcode: any;

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],

})
export class OrdersComponent implements OnInit {
  @ViewChild('dt', { static: true }) dt: Table;
  @ViewChild('barcode', { static: false }) set userContent(element) {
    if (element) {
      this.isBarcodeDisplay = true;
      JsBarcode("#barcode", this.selectedRows.size);
      // here you get access only when element is rendered (or destroyed)
    } else {
      this.isBarcodeDisplay = false;

    }
  }

  @Input() orders;
  @Output() cancelEmitter = new EventEmitter<any[]>();

  cols: any[];

  yearFilter: boolean = false;

  lastItemsAdded;

  dateValue;

  selectedRows = new Map<string, boolean>();

  currentPage = 1;

  lastPage;

  checkBoxHeaderValues = new Map<number, boolean>();

  rowPerPage = 10;

  currentCheckBoxHeader = false;

  isBarcodeDisplay = false;

  filter = false; //show filter tr.
  isFilter = false; //is filter activated.
  filterResult = []; //filtered items.

  constructor() {
  }
  paginate(pageEvent) {
    let currentPage = pageEvent.first / pageEvent.rows + 1;
    if (this.lastPage != currentPage) {
      this.currentPage = currentPage;
      this.currentCheckBoxHeader = this.checkBoxHeaderValues.get(this.currentPage);
      //rows per page * pages.
      let TotalNumber = currentPage * pageEvent.rows;
      //allItems - rows per page * pages (full page scenario).
      // if result is smaller then zero - some empty rows are required.
      let itemsToAdd = ((this.orders.length - TotalNumber) >= 0) ? 0 : Math.abs(this.orders.length - TotalNumber);
      if (!itemsToAdd) { //if empty row should be spliced.
        this.orders.splice(this.orders.length - this.lastItemsAdded, this.lastItemsAdded);
      }
      for (let index = 0; index < itemsToAdd; index++) {
        this.orders.push({});
      }
      this.lastPage = currentPage;
    }
    $(document).ready(() => {
      this.loopOnCurrentPage((item) => {
        if (item) {
          if (item.status == 'waiting') {
            JsBarcode(`#b${item.id}`, item.id, {
              height: 25
            });
          }
        }
      });
    });
  }

  ngOnInit() {
    if (!this.orders) {
      alert('connection error');
      this.orders = [
        { "id": "99", "orderdate": "2019-12-30T22:00:00.000Z", "produniqkey": "1234", "comments": "sup sup sup sup sup" }, { "id": "8", "orderdate": "2019-12-30T22:00:00.000Z", "produniqkey": "25", "comments": null }, { "id": "18", "orderdate": "2020-01-01T22:00:00.000Z", "produniqkey": "1234", "comments": "מהר" }, { "id": "12", "orderdate": "2020-01-01T22:00:00.000Z", "produniqkey": "18", "comments": null },
        { "id": "23", "orderdate": "2020-01-01T22:00:00.000Z", "produniqkey": "1113", "comments": "שיהיה מהר" },
      ];
    }
    this.orders.forEach((order) => {
      // JsBarcode(`#${order.id}`, "Smallest width", {
      //   height: 25
      // });
      // order['isCheck'] = true;
    });


    this.cols = [
      { field: 'id', header: 'id' },
      { field: 'orderdate', header: 'orderdate' },
      { field: 'produniqkey', header: 'produniqkey' },
      { field: 'comments', header: 'comments' }
    ];

    FilterUtils['Date'] = (value: Date, filter: Date): boolean => {
      this.yearFilter = true;
      if (filter === undefined || filter === null) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }
      return new Date(value).getMonth() == filter.getMonth() && new Date(value).getFullYear() == filter.getFullYear();
    }
  }
  loopOnCurrentPage(func: Function) {
    let firstItemIndex = (this.currentPage - 1) * this.rowPerPage;
    for (let index = firstItemIndex; index < firstItemIndex + this.rowPerPage; index++) {
      const currentOrder = this.orders[index];
      func(currentOrder);
    }
  }

  onCheckBoxChange(isCheck, id) {
    if (isCheck) {
      this.selectedRows.set(id, isCheck)
    } else {
      this.selectedRows.delete(id);
    }
    (this.isBarcodeDisplay) ? JsBarcode("#barcode", this.selectedRows.size) : '';
    this.currentCheckBoxHeader = this.isHeaderChecked();
    if (this.isFilter) {
      this.checkBoxHeaderValues.set(1, this.currentCheckBoxHeader);
    } else {
      this.checkBoxHeaderValues.set(this.currentPage, this.currentCheckBoxHeader);
    }
  }

  onHeaderCheckBoxChange(isCheck: boolean) {
    this.checkBoxHeaderValues.set(this.currentPage, isCheck);
    this.togglePageCheckBoxes(isCheck);
  }
  togglePageCheckBoxes(isCheck: boolean) {
    if (!this.isFilter) {
      let firstItemIndex = (this.currentPage - 1) * this.rowPerPage;

      this.loopOnCurrentPage((item) => {
        //check if this order is not an empty one.
        if (item.id != undefined) {
          if (isCheck) {
            this.selectedRows.set(item.id, true);
          } else {
            this.selectedRows.delete(item.id);
          }
          (this.isBarcodeDisplay) ? JsBarcode("#barcode", this.selectedRows.size) : '';
        }
      });

      // for (let index = firstItemIndex; index < firstItemIndex + 10; index++) {
      //   const currentOrder = this.orders[index];
      //   //check if this order is not an empty one.
      //   if (currentOrder.id != undefined) {
      //     if (isCheck) {
      //       this.selectedRows.set(currentOrder.id, true);
      //     } else {
      //       this.selectedRows.delete(currentOrder.id);
      //     }
      //     (this.isBarcodeDisplay) ? JsBarcode("#barcode", this.selectedRows.size) : '';
      //   }
      // }
    } else {
      this.filterResult.forEach((item) => {
        if (isCheck) {
          this.selectedRows.set(item.id, true);
        } else {
          this.selectedRows.delete(item.id);
        }
      });
    }
    (this.isBarcodeDisplay) ? JsBarcode("#barcode", this.selectedRows.size) : '';
  }

  isHeaderChecked(): boolean {
    let checkValues = true;
    if (!this.isFilter) {
      let firstItemIndex = (this.currentPage - 1) * this.rowPerPage;
      for (let index = firstItemIndex; index < firstItemIndex + this.rowPerPage; index++) {
        const currentOrder = this.orders[index];
        //check if this order is not an empty one.
        if (currentOrder.id != undefined) {
          if (!this.selectedRows.get(currentOrder.id)) {
            checkValues = false;
          }
        }
      }
    } else {
      this.filterResult.forEach((item) => {
        if (!this.selectedRows.get(item.id)) {
          checkValues = false;
        };
      })
    }
    return checkValues;
  }

  ngAfterViewInit() {
    $(document).ready(() => {
      let pageButton = $('.ui-paginator-pages').find('a').get()[0];
      pageButton.click();
    });
    $('.ui-table-caption').addClass('flexPosition');
    this.dt.onFilter.subscribe((filter) => {
      if (filter.filters.global) {
        this.isFilter = true;
        this.filterResult = filter.filteredValue;
        this.currentCheckBoxHeader = (this.filterResult.length == 0) ? false : this.isHeaderChecked();
        this.checkBoxHeaderValues.set(this.currentPage, this.currentCheckBoxHeader);
      } else {
        this.isFilter = false;
        this.currentCheckBoxHeader = this.isHeaderChecked();
        this.checkBoxHeaderValues.set(this.currentPage, this.currentCheckBoxHeader);
      }
    });
    // this.dt.paginator.changePage(this.dt.getPage);
  }
  cancelOrder(id) {
    console.log(id);
    if (id) {
      this.cancelEmitter.emit([id]);
      this.selectedRows.delete(id);
    } else {
      let selectedArray = Array.from(this.selectedRows.keys());
      this.cancelEmitter.emit(selectedArray);
      selectedArray.forEach((id)=>{
        this.selectedRows.delete(id);
      });

    }
    console.log(Array.from(this.selectedRows.keys()));
  }
  ngOnChanges(change) {
    $(document).ready(() => {
      this.lastPage = null;
      let pageButton = $('.ui-paginator-pages').find('a').get()[0];
      pageButton.click();
    });
  }
}
