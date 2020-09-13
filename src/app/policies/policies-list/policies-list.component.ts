import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-policies-list',
  templateUrl: './policies-list.component.html',
  styleUrls: ['./policies-list.component.scss']
})
export class PoliciesListComponent implements OnInit {
  @Input()filenames: string;
  @Output() itemClick: EventEmitter<string>;

  constructor() { }

  ngOnInit(): void {
  }
}
