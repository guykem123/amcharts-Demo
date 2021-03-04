import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-menu-selector',
  templateUrl: './menu-selector.component.html',
  styleUrls: ['./menu-selector.component.css']
})
export class MenuSelectorComponent implements OnInit {

  @Input() options: { name: string; }[];
  @Input() currentSelected: { name: string; };
  @Input() labelStr: String;
  @Output() selectedItem: EventEmitter<string> = new EventEmitter();

  isOpen: boolean;


  constructor() {
   
   }

  ngOnInit(): void {
    console.log(this.options)
  }

  onMenuSelectedClick() {
    this.isOpen = !this.isOpen;
  }

  selectItem(item) {
    console.log(item)
    this.currentSelected = item;
    this.selectedItem.emit(item.name);
  }

}
