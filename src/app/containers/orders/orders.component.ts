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
    console.log('created');
    console.log(element);
    if (element) {
      this.isBarcodeDisplay = true;
      JsBarcode("#barcode", this.barcodeSummary);
      // here you get access only when element is rendered (or destroyed)
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

  barcodeSummary = 0;
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
      this.selectedRows.set(order.id, false);
      order.isCheck = false;
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
      console.log(this.yearFilter);
      if (filter === undefined || filter === null) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }
      return new Date(value).getMonth() == filter.getMonth() && new Date(value).getFullYear() == filter.getFullYear();
    }
  }

  onCheckBoxChange(isCheck, id) {
    this.orders.find((order) => order.id == id).isCheck = (isCheck) ? true : false;
    this.selectedRows.set(id, isCheck);
    this.barcodeSummary += (isCheck) ? 1 : -1;
    (this.isBarcodeDisplay)? JsBarcode("#barcode", this.barcodeSummary):'';
    this.currentCheckBoxHeader = this.isHeaderChecked();
    if (this.isFilter) {
      this.checkBoxHeaderValues.set(1, this.currentCheckBoxHeader);
    } else {
      this.checkBoxHeaderValues.set(this.currentPage, this.currentCheckBoxHeader);
    }
    console.log(id);
  }

  onHeaderCheckBoxChange(isCheck: boolean) {
    this.checkBoxHeaderValues.set(this.currentPage, isCheck);
    this.togglePageCheckBoxes(isCheck);
    console.log('header checked');
  }
  togglePageCheckBoxes(isCheck: boolean) {
    if (!this.isFilter) {
      let firstItemIndex = (this.currentPage - 1) * this.rowPerPage;
      for (let index = firstItemIndex; index < firstItemIndex + 10; index++) {
        const currentOrder = this.orders[index];
        //check if this order is not an empty one.
        if (currentOrder.id != undefined) {
          this.selectedRows.set(currentOrder.id, isCheck);
          this.barcodeSummary += (isCheck) ? 1 : -1;
          (this.isBarcodeDisplay)? JsBarcode("#barcode", this.barcodeSummary):'';

          currentOrder.isCheck = isCheck;
        }
      }
      console.log('no filter!')
    } else {
      console.log('filter!')
      this.filterResult.forEach((item) => {
        this.selectedRows.set(item.id, isCheck);
        this.barcodeSummary += (isCheck) ? 1 : -1;
        (this.isBarcodeDisplay)? JsBarcode("#barcode", this.barcodeSummary):'';

        item.isCheck = isCheck;
      })
    }
  }

  isHeaderChecked(): boolean {
    let checkValues = true;
    if (!this.isFilter) {
      let firstItemIndex = (this.currentPage - 1) * this.rowPerPage;
      for (let index = firstItemIndex; index < firstItemIndex + 10; index++) {
        const currentOrder = this.orders[index];
        //check if this order is not an empty one.
        if (currentOrder.id != undefined) {
          if (!this.selectedRows.get(currentOrder.id)) {
            console.log(currentOrder);
            console.log(this.selectedRows);
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
      this.orders.forEach((order) => {
        JsBarcode(`#b${order.id}`, order.id, {
          height: 25
        });
      });
      let pageButton = $('.ui-paginator-pages').find('a').get()[0];
      pageButton.click();
    });
    $('.ui-table-caption').addClass('flexPosition');
    this.dt.onFilter.subscribe((filter) => {
      console.log('filter');
      console.log(filter);
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
  cancelOrder() {
    this.cancelEmitter.emit(Array.from(this.selectedRows.keys()));
  }
  ngOnChanges(change) {
    console.log(change);
  }
}
