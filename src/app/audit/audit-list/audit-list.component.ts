import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-audit-list',
  templateUrl: './audit-list.component.html',
  styleUrls: ['./audit-list.component.scss']
})
export class AuditListComponent implements OnInit {
  @Input()filenames: string;

  constructor() { }

  ngOnInit(): void {
  }
}
