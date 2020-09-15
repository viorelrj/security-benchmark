import { Component, Input, OnInit } from '@angular/core';
import { PoliciesService } from '../policies.service';

@Component({
  selector: 'app-policies-item',
  templateUrl: './policies-item.component.html',
  styleUrls: ['./policies-item.component.scss']
})
export class PoliciesItemComponent implements OnInit {
  @Input() fileName: string;

  constructor(
    private policiesService: PoliciesService
  ) { }

  handleShow(): void {
    if (!this.policiesService.state.isReady) {
      return;
    }

    this.policiesService.getPolicyItemContent(this.fileName).then((res) => console.log(res));
  }

  handleRemove(): void {
    if (!this.policiesService.state.isReady) {
      return;
    }

    this.policiesService.removePolicy(this.fileName);
  }

  ngOnInit(): void {
  }

}
