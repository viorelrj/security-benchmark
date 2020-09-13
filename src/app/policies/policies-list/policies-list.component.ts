import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-policies-list',
  templateUrl: './policies-list.component.html',
  styleUrls: ['./policies-list.component.scss']
})
export class PoliciesListComponent implements OnInit {
  @Input()filenames: string;

  constructor() { }

  ngOnInit(): void {
  }
}
