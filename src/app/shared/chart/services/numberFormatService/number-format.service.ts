import { removeIndex } from '@amcharts/amcharts4/.internal/core/utils/Array';
import { NumberFormatter } from '@amcharts/amcharts4/core';
import { CurrencyPipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NumberFormatService {
  currencySymbol: string;

  constructor(private currency: CurrencyPipe) {
    this.currencySymbol = this.currency.transform(1)[0];
  }

  getCostString(cost: number): string {
    if (!cost)
      return '0';
    const splitNumber = cost.toString().split('e');
    if (splitNumber[1]) {
      const isDivide = splitNumber[1][0] == "-";
      if (isDivide) {
        const eAmount = parseInt(splitNumber[1].match(/\d+/g)[0]);
        //this part is to change e-10 to 0.00000000000
        const scientificNumbersParsed = Array.from(Array(eAmount).keys()).map((_, i) => i == 0 ? '0.' : '0').join('');
        //this part is to change 1.1 to 11
        const cost = splitNumber[0].replace('.', '').slice(0, 3);
        // at the end we change 1.1e-10 to 0.0000000000011
        return scientificNumbersParsed + cost;
      }
      else {
        return this.precise(cost);
      }
    }
    else {
      return cost.toString();
    }
  }

  private precise(x): string {
    return Number.parseFloat(x).toPrecision();
  }

  format(numberText: string, currencySymbol?: string, fullNumber?: boolean, fullReminder?: boolean): string {
    try {
      numberText = this.getCostString(Number(numberText));
      const minus = numberText.includes("-") ? "-" : "";
      numberText = numberText.replace("-", "");
      const num = parseFloat(numberText);
      currencySymbol = currencySymbol != null ? currencySymbol : ""
      const formatted = this.getNumberFormatted(minus, currencySymbol, num, fullNumber, fullReminder);
      const amountRegex = new RegExp(`^-\\${this.currencySymbol}?0$`);
      if (formatted.match(amountRegex)) {//in case of -0 or -$0
        return formatted.replace("-", "");
      }
      return formatted;
    }
    catch {
      return "";
    }
  }

  getNumberFormatted(minus: string, currencySymbol: string, num: number, fullNumber: boolean, fullReminder: boolean) {

    if (fullNumber)
      return `${minus}${currencySymbol}${this.setTextNumber(num, "", true, fullReminder)}`;
    if (num >= 1000000)
      return `${minus}${currencySymbol}${this.setTextNumber(num / 1000000, "M", false, fullReminder)}`;
    else if (num >= 1000)
      return `${minus}${currencySymbol}${this.setTextNumber(num / 1000, "K", false, fullReminder)}`;
    else
      return `${minus}${currencySymbol}${this.setTextNumber(num, "", false, fullReminder)}`;
  }

  private setTextNumber(num, key, showRemainder?: boolean, showAllReminder?: boolean) {
    const values = { amount: 0 };
    const numText: string = this.getCostString(num);
    const arr = numText.split('.'); //split number to amount and remainder e.g. [100,12423423] from 100.12423423
    const amount = parseInt(arr[0]);
    values.amount = amount;
    let remainder = "";
    if (num > 100) {
      remainder = showRemainder ? this.getReminder(2, arr[1], values) : "";
    }
    else {
      remainder = showRemainder ? this.getReminder(2, arr[1], values) : this.getReminder(1, arr[1], values);
    }
    remainder = showAllReminder ? arr[1] ? `.${arr[1]}` : '' : remainder;
    const textNumber = `${values.amount}${remainder}${key}`;
    return textNumber;
  }

  private getReminder(amountFromPoint: number, remainder: string, values: { amount: number; }): string {
    if (amountFromPoint && remainder && amountFromPoint <= remainder.length) {
      const anyValue = parseInt(remainder);
      if (anyValue) {
        const divider = Math.pow(10, amountFromPoint);
        let remainderNum = parseFloat(`1.${remainder}`);
        remainderNum = Math.round(remainderNum * divider) / divider;
        if (remainderNum.toString().includes(".")) {
          let remainderStr = remainderNum.toString().split('.')[1];
          while (remainderStr.length < amountFromPoint) {
            remainderStr += '0';
          }
          return `.${remainderStr}`;
        }
        else {
          values.amount += remainderNum > 1 ? 1 : 0;
          return '';
        }
      }
    }
    return "";
  }
}
