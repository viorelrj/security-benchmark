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

  importPolicy(name: string, data: string): void {
    this.policiesService.importPolicy(name, data).subscribe(() => {
      //
    });
  }

  handleFileInput(files: FileList): void {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.policiesService.importPolicy(file.path, file.name).subscribe();
    }
  }

  ngOnInit(): void {
    this.policiesService.state.promise.then(() => {
      this.policiesService.getPolicyListOnce().subscribe(res => this.filenames = res)
      this.policiesService.getPolicyList().subscribe(res => this.filenames = res);
    })
  }
}
