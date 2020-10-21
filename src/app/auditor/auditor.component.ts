import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auditor',
  templateUrl: './auditor.component.html',
  styleUrls: ['./auditor.component.scss']
})
export class AuditorComponent implements OnInit {
  items: {[key: string]: boolean} = {};
  keys = [];
  constructor() { }

  ngOnInit(): void {
    if (this.modalData && this.modalData.getResults) {
      this.modalData.getResults().then(res => {
        this.items = res;
        this.getKeys();
        console.log(res);
      });
    }
  }

  getKeys(): string[] {
    this.keys = this.items? Object.keys(this.items) : []
  }

}
