type typeCallback = (currentDate: number[]) => void;

enum DateMark {
  YEAR = 'YEAR',
  MONTH = 'MONTH',
  DAY = 'DAY'
}

interface IDatePicker {
  getCurrentDate(): number[];
  watch(callback: typeCallback): void;
}

export default class DatePicker implements IDatePicker {

  private yearArr: number[];
  private monthArr: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  private dayArr: number[];
  private currentDate: number[] = new Array<number>(3);
  private callback: typeCallback;

  private oYearWrapper: HTMLElement = document.querySelector('.year-wrapper')!;
  private oMonthWrapper: HTMLElement = document.querySelector('.month-wrapper')!;
  private oDayWrapper: HTMLElement = document.querySelector('.day-wrapper')!;

  constructor (yearArr: number[], currentDate: number[]) {
    const [ year, month ] = this.currentDate;
    this.yearArr = yearArr;
    this.dayArr = this.createDayArr(year, month);
    this.currentDate = currentDate;

    this.bindEvent();
    this.initDOM();
  }
  watch(callback: typeCallback) {
    typeof callback === 'function' && (this.callback = callback);
  }

  private bindEvent () {
    this.oYearWrapper.addEventListener('scrollend', this.setCurrentDate.bind(this, this.oYearWrapper, 'YEAR'), false);
    this.oMonthWrapper.addEventListener('scrollend', this.setCurrentDate.bind(this, this.oMonthWrapper, 'MONTH'), false);
    this.oDayWrapper.addEventListener('scrollend', this.setCurrentDate.bind(this, this.oDayWrapper, 'DAY'), false);
  }

  private initDOM () {
    const [ year, month ] = this.currentDate;
    this.createItems(this.oYearWrapper, this.yearArr);
    this.createItems(this.oMonthWrapper, this.monthArr);
    this.createItems(this.oDayWrapper, this.dayArr);
    this.initCurrentDate(this.currentDate);
  }

  private initCurrentDate ([ year, month, day ]: typeof this.currentDate) {
    const yearIndex = this.yearArr.indexOf(year);
    const monthIndex = this.monthArr.indexOf(month);
    const dayIndex = this.dayArr.indexOf(day);
    
    setScrollY(this.oYearWrapper, yearIndex);
    setScrollY(this.oMonthWrapper, monthIndex);
    setScrollY(this.oDayWrapper, dayIndex);
  }

  public getCurrentDate (): number[] {
    return this.currentDate;
  }

  private setCurrentDate (wrapper: HTMLElement, field: DateMark) {
    const index = wrapper.scrollTop / 50;
    const [ year, month ] = this.currentDate;

    switch (field) {
      case DateMark.YEAR:
        this.currentDate[0] = this.yearArr[index];
        this.dayArr = this.createDayArr(year, month);
        this.createItems(this.oDayWrapper, this.dayArr);
        this.callback(this.currentDate);
        break;
      case DateMark.MONTH:
        this.currentDate[1] = this.monthArr[index];
        this.dayArr = this.createDayArr(year, month);
        this.createItems(this.oDayWrapper, this.dayArr);
        this.callback(this.currentDate);
        break;
      case DateMark.DAY:
        this.currentDate[2] = this.dayArr[index];
        this.callback(this.currentDate);
        break;
      default:
        break;
    }
  }

  private createItems (wrapper: HTMLElement, arr: number[]) {
    const oFrag = document.createDocumentFragment();
    const oScrollWrapper = wrapper.querySelector('.scroll-wrapper')!;

    for (let i = 0; i < 2; i ++) {
      const oItem = createPlaceholder();
      oFrag.appendChild(oItem);
    }

    arr.forEach(year => {
      const oItem = document.createElement('div');

      oItem.innerText = year + '';
      oItem.setAttribute('data-num', year + '');
      oItem.classList.add('item');

      oFrag.appendChild(oItem);
    })

    for (let i = 0; i < 2; i ++) {
      const oItem = createPlaceholder();
      oFrag.appendChild(oItem);
    }
    
    oScrollWrapper.innerHTML = '';
    oScrollWrapper.appendChild(oFrag);
  }

  private createDayArr (year: number, month: number): number[] {
    const count = getDayCount(year, month);
    const arr: number[] = [];

    for (let i = 1; i <= count; i ++) {
      arr.push(i);
    }

    return arr;
  }
}

function getDayCount (year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function setScrollY (wrapper: HTMLElement, index: number) {
  wrapper.scrollTo(0, index * 50);
}

function createPlaceholder () {
  const oItem = document.createElement('div');
  oItem.classList.add('item');

  return oItem;
}