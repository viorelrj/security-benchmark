import { Component, OnInit } from '@angular/core';
import { PoliciesService } from './policies.service';

@Component({
  selector: 'app-policies',
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.scss']
})
export class PoliciesComponent implements OnInit {
  filenames: string[];

  constructor(
    private policiesService: PoliciesService
  ) { }


  refreshPolicies(): void {
    this.policiesService.getPolicyList().subscribe(res => {
      this.filenames = res;
    });
  }
  
  removePolicy(name: string): void {
    this.policiesService.removePolicy(name);
  }

  ngOnInit(): void {
    this.policiesService.state.promise.then(
      () => this.policiesService.getPolicyListOnce()
    ).then(
      res => {
        this.filenames = res;
        this.policiesService.getPolicyList().subscribe(res => this.filenames = res)
      }
    )
  }
}
