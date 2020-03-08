import { Component, OnInit, OnChanges, ViewChild, IterableDiffers, Input, Output, EventEmitter } from '@angular/core';
import { FilterUtils } from 'primeng/utils';
import { Table } from 'primeng';
declare var JsBarcode: any;

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],

})
export class OrdersComponent implements OnInit {
  //primeNG table
  @ViewChild('dt', { static: true }) dt: Table;
  //fire when component is rendered or have been removed.
  @ViewChild('barcode', { static: false }) set userContent(element) {
    // here you get access only when element is rendered 
    if (element) {
      this.isSummaryBarcodeDisplay = true;
      JsBarcode("#barcode", this.selectedRows.size);
    } else {
      //component have been removed from dom. 
      this.isSummaryBarcodeDisplay = false;
    }
  }

  @Input() set _orders(value){
    this.orders = value;
    this.lastTimeAdded = null;
  }
  @Output() cancelEmitter = new EventEmitter<any[]>();

  cols: any[];
  orders;
  yearFilter: boolean = false; //indication for fliter cancel icon.

  dateValue: Date; //varible for date value. used to get null when canceling filter.

  selectedRows = new Map<string, boolean>(); //key - order id | value -  true.

  currentPage = 1;

  lastPage; //the previous page the user were on.

  lastTimeAdded; //the previous blank items added counter.

  checkBoxHeaderValues = new Map<number, boolean>(); //key - pageNumber | value - is checked.

  @Input() rowPerPage;

  currentCheckBoxHeader = false;

  isSummaryBarcodeDisplay = false;

  showFilterTr = false; //show filter tr.
  isFilter = false; //is filter activated.
  filterResult = []; //filtered items.

  constructor() {
  }

  paginate(pageEvent) {
    let currentPage = (pageEvent.first / pageEvent.rows) + 1;
    if (this.lastPage != currentPage) {
      if (this.lastTimeAdded > 0) {
        console.log('all items ' + this.orders.length);
        console.log('items to splice ' + this.lastTimeAdded);
        console.log('splice from ' + (this.orders.length - this.lastTimeAdded - 1));
        this.orders.splice(this.orders.length - this.lastTimeAdded);
        console.log('after splice result');
        console.log(this.orders);
        this.lastTimeAdded = 0;
      }
      this.currentPage = currentPage;
      this.currentCheckBoxHeader = this.checkBoxHeaderValues.get(this.currentPage);
      //all items - rows per page * pages (full page scenario).
      // if result is smaller then zero - some empty rows are required.
      let itemsToAdd = (this.currentPage * pageEvent.rows) - this.dt._totalRecords;
      console.log('full page senerio sum ' + this.currentPage * pageEvent.rows);
      console.log('all orders ' + this.dt._totalRecords);
      console.log('items to add ' + itemsToAdd);

      for (let index = 0; index < itemsToAdd; index++) {
        this.orders.push({});
      }
      console.log('current oreders');
      console.log(this.orders);
      this.lastPage = currentPage;
      this.lastTimeAdded = itemsToAdd;
    }
    this.currentCheckBoxHeader = this.isHeaderChecked();
    if (this.isFilter) {
      this.checkBoxHeaderValues.set(1, this.currentCheckBoxHeader);
    } else {
      this.checkBoxHeaderValues.set(this.currentPage, this.currentCheckBoxHeader);
    }
    //generate barcode for each order (if the orders is still in 'waiting' mode).
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

    this.cols = [
      { field: 'id', header: 'id' },
      { field: 'orderdate', header: 'orderdate' },
      { field: 'produniqkey', header: 'produniqkey' },
      { field: 'comments', header: 'comments' }
    ];
    //custome filter (primeNg API) - date filter.
    FilterUtils['Date'] = (value: Date, filter: Date): boolean => {
      this.yearFilter = false;
      if (filter === undefined || filter === null) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }
      return new Date(value).getMonth() == filter.getMonth() && new Date(value).getFullYear() == filter.getFullYear();
    }
  }
  //generic funtion for loop the current page orders.
  loopOnCurrentPage(func: Function) {
    let firstItemIndex = (this.currentPage - 1) * this.rowPerPage;
    for (let index = firstItemIndex; index < firstItemIndex + this.rowPerPage; index++) {
      const currentOrder = (this.isFilter) ? this.filterResult[index] : this.orders[index];
      func(currentOrder);
    }
  }

  onCheckBoxChange(isCheck, id) {
    if (isCheck) {
      this.selectedRows.set(id, isCheck)
    } else {
      this.selectedRows.delete(id);
    }
    //generate summary barcode.
    (this.isSummaryBarcodeDisplay) ? JsBarcode("#barcode", this.selectedRows.size) : '';
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
      this.loopOnCurrentPage((item) => {
        //check if this order is not an empty one.
        if (item.id != undefined) {
          if (isCheck) {
            this.selectedRows.set(item.id, true);
          } else {
            this.selectedRows.delete(item.id);
          }
        }
      });

    } else {
      this.filterResult.forEach((item) => {
        if (isCheck) {
          this.selectedRows.set(item.id, true);
        } else {
          this.selectedRows.delete(item.id);
        }
      });
    }
    //generate summary barcode.
    (this.isSummaryBarcodeDisplay) ? JsBarcode("#barcode", this.selectedRows.size) : '';
  }

  isHeaderChecked(): boolean {
    let checkValues = true;
    if (!this.isFilter) {
      this.loopOnCurrentPage((item) => {
        if (item.id != undefined) {
          if (!this.selectedRows.get(item.id)) {
            checkValues = false;
          }
        }
      });
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
    $('.ui-table-caption').addClass('flexPosition');
    //on filter fire (PrimeNg API)
    this.dt.onFilter.subscribe((filter) => {
      if (Object.keys(filter.filters).length !== 0) {
        this.isFilter = true;
        this.filterResult = filter.filteredValue; //filterd items.
        this.currentCheckBoxHeader = (this.filterResult.length == 0) ? false : this.isHeaderChecked();
        this.checkBoxHeaderValues.set(this.currentPage, this.currentCheckBoxHeader);
      } else {
        this.isFilter = false;
        this.currentCheckBoxHeader = this.isHeaderChecked();
        this.checkBoxHeaderValues.set(this.currentPage, this.currentCheckBoxHeader);
      }

      $(document).ready(() => {
        this.lastPage = null;
        let pageButton = $('.ui-paginator-pages').find('a').get()[0];
        pageButton.click();
      });
    });
  }
  cancelOrder(id) {
    //specific order canceld.
    if (id) {
      this.cancelEmitter.emit([id]);
      this.selectedRows.delete(id);
    } else { //some orders to cancel (checkBox's).
      let selectedArray = Array.from(this.selectedRows.keys()); //map => array.
      this.cancelEmitter.emit(selectedArray);
      selectedArray.forEach((id) => {
        this.selectedRows.delete(id); //delete orders from summary barcode.
      });
    }
  }
  ngOnChanges(change) {
    $(document).ready(() => {
      this.lastPage = null;
      let pageButton = $('.ui-paginator-pages').find('a').get()[0];
      pageButton.click();
    });
  }
}
