import { Component, Input, OnInit } from '@angular/core';
import { PoliciesService } from '../policies.service';

@Component({
  selector: 'app-policies-item',
  templateUrl: './policies-item.component.html',
  styleUrls: ['./policies-item.component.scss']
})
export class PoliciesItemComponent implements OnInit {
  @Input() content: string;

  constructor(
    private policiesService: PoliciesService
  ) { }

  handleClick(ev) {
    console.log(ev);
  }

  ngOnInit(): void {
    this.policiesService.state.promise.then(() => {
      // this.policiesService.
    })
  }

}
