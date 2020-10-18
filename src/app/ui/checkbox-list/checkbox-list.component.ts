import { Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';

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
  state: {[key: string]: boolean}

  // Should implement this as a pipe later
  getKeys(): string[] {
    return Object.keys(this.state) || [];
  }

  ngOnInit(): void {
  }

  ngOnChanges(change: SimpleChanges) {
    this.state = {}
    this.list.forEach((key) => this.state[key] = false);
  }

  public getSelected(): string[] {
    return Object.keys(this.state).filter(key => this.state[key]);
  }
}
