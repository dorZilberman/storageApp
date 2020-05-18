import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
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
      JsBarcode("#barcode", this.selectedRows.size, {
        width: 5,
        text: `ברקוד המכיל ${this.selectedRows.size} מוצרים`
      });
    } else {
      //component have been removed from dom.
      this.isSummaryBarcodeDisplay = false;
    }
  }

  @Input() orders;
  @Output() cancelEmitter = new EventEmitter<any[]>();

  cols: any[];
  yearFilter: boolean = false; //indication for fliter cancel icon.

  dateValue: Date; //varible for date value. used to get null when canceling filter.

  selectedRows = new Map<string, boolean>(); //key - order id | value -  true.

  currentPage = 1;

  lastPage; //the previous page the user were on.

  checkBoxHeaderValues = new Map<number, boolean>(); //key - pageNumber | value - is checked.

  @Input() rowsPerPage;

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
      this.currentPage = currentPage;
      this.currentCheckBoxHeader = this.checkBoxHeaderValues.get(this.currentPage);
      //all items - rows per page * pages (full page scenario).
      // if result is smaller then zero - some empty rows are required.
      this.lastPage = currentPage;
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
            if (Number(item.id)) {
              JsBarcode(`#b${item.id}`, `05012345678${item.produniqekey}`, {
                text: item.produniqekey, 
                height: 100,
                width: 2,
                marginTop: 15,
                fontSize: 30,
              });
            }
          }
        }
      });
    });
  }

  ngOnInit() {
    if (!this.orders) {
      alert('connection error');
      this.orders = [
        { "id": "99", "orderdate": "2019-12-30T22:00:00.000Z", "produniqekey": "1234", "comments": "sup sup sup sup sup" }, { "id": "8", "orderdate": "2019-12-30T22:00:00.000Z", "produniqekey": "25", "comments": null }, { "id": "18", "orderdate": "2020-01-01T22:00:00.000Z", "produniqekey": "1234", "comments": "מהר" }, { "id": "12", "orderdate": "2020-01-01T22:00:00.000Z", "produniqekey": "18", "comments": null },
        { "id": "23", "orderdate": "2020-01-01T22:00:00.000Z", "produniqekey": "1113", "comments": "שיהיה מהר" },
      ];
    }

    this.cols = [
      { field: 'comments', header: 'הערות'},
      { field: 'produniqekey', header: 'מק"ט'},
      { field: 'orderdate', header: 'תאריך הזמנה'},
      { field: 'id', header: 'מספר הזמנה'}
    ];
    //custome filter (primeNg API) - date filter.
    FilterUtils['Date'] = (value: string, filter: Date): boolean => {
      let values = value.split('/');
      let temp = values[0];
      values[0] = values[1];
      values[1] = temp;
      value = values.join('/');
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
    let firstItemIndex = (this.currentPage - 1) * this.rowsPerPage;
    for (let index = firstItemIndex; index < firstItemIndex + this.rowsPerPage; index++) {
      const currentOrder = (this.isFilter) ? this.filterResult[index] : this.orders[index];
      if (currentOrder) {
        func(currentOrder);
      }
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
        }
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
  cancelOrder(id?) {
    //specific order canceld.
    if (id) {
      this.cancelEmitter.emit([id]);
      this.selectedRows.delete(id);
    } else { //some orders to cancel (checkBox's).
      let selectedArray = Array.from(this.selectedRows.keys()); //map => array.
      this.cancelEmitter.emit(selectedArray);
      selectedArray.forEach((orderId) => {
        this.selectedRows.delete(orderId); //delete orders from summary barcode.
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
