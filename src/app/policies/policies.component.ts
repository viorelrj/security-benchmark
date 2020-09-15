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
    this.policiesService.removePolicy(name).subscribe(() => {
      //
    })
  }

  ngOnInit(): void {
    this.policiesService.state.promise.then(() => {
      setTimeout(
        () => this.policiesService.getPolicyListOnce().subscribe(res => {
          this.filenames = res
          setTimeout(() => this.policiesService.getPolicyList().subscribe(res => this.filenames = res), 500);
        }), 500)
    })
  }
}
