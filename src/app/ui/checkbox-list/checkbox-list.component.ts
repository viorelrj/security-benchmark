import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

interface ICheckBoxListState {
  [key: string]: boolean;
}

@Component({
  selector: 'app-checkbox-list',
  templateUrl: './checkbox-list.component.html',
  styleUrls: ['./checkbox-list.component.scss']
})
export class CheckboxListComponent implements OnInit, OnChanges {
  constructor() { }

  @Input() list: string[];
  @Input() hasFilter: boolean;

  state: {[key: string]: boolean}
  keysToShow: string[] = [];
  filterQuery: string;
  globalVal = false;


  ngOnInit(): void {
  }

  handleFilterUpdate(): void {
    const reg = new RegExp(this.filterQuery, 'i');
    this.keysToShow = Object.keys(this.state).filter(key => reg.test(key));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.list) {
      this.state = {}
      changes.list.currentValue.forEach((key) => this.state[key] = false);
      this.keysToShow = Object.keys(this.state);
    }
  }

  toggle() {
    this.globalVal = !this.globalVal;
    for (const key in this.state) {
      this.state[key] = this.globalVal;
    }
  }

  public getSelected(): string[] {
    return Object.keys(this.state).filter(key => this.state[key]);
  }
}
