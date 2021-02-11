import { NumberFormatter } from '@amcharts/amcharts4/core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NumberFormatService {

  format(numberText: string, currencySymbol?: string): string {
    try {
      const num = parseFloat(numberText);
      currencySymbol = currencySymbol || '$'
      if (num > 1000000)
        return `${currencySymbol}${this.setTextNumber(num / 1000000, "M")}`;
      else if (num > 1000)
        return `${currencySymbol}${this.setTextNumber(num / 1000, "K")}`;
      else
        return `${currencySymbol}${this.setTextNumber(num, "")}`;
    }
    catch {
      return "";
    }
  }

  private setTextNumber(num, key, showRemainder?: boolean) {
    const numText: string = num.toString();
    const arr = numText.split('.'); //split number to amount and remainder e.g. [100,12423423] from 100.12423423
    const amount = parseInt(arr[0]);
    let remainder = "";
    if (num > 100) {
      remainder = showRemainder ? this.getReminder(2, arr[1]) : "";
    }
    else {
      remainder = showRemainder ? this.getReminder(2, arr[1]) : this.getReminder(1, arr[1]);
    }
    return `${amount}${remainder}${key}`;
  }

  private getReminder(amountFromPoint: number, remainder: string): string {
    if (amountFromPoint && remainder && amountFromPoint <= remainder.length) {
      const remainderNum = parseInt(remainder.substr(0, amountFromPoint));
      if (remainderNum)
        return `.${remainder.substr(0, amountFromPoint)}`;
    }
    return "";
  }

  constructor() {
  }
}
