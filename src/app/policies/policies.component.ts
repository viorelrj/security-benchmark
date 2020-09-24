import { Component, OnInit } from '@angular/core';
import { ModalService } from 'app/ui/modal/modal.service';
import { PoliciesService } from './policies.service';
import { PolicyImportComponent } from './policy-import/policy-import.component';

@Component({
  selector: 'app-policies',
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.scss']
})
export class PoliciesComponent implements OnInit {
  filenames: string[];

  constructor(
    private policiesService: PoliciesService,
    private modalService: ModalService
  ) { }


  refreshPolicies(): void {
    this.policiesService.getPolicyList().subscribe(res => {
      this.filenames = res;
    });
  }
  
  removePolicy(name: string): void {
    this.policiesService.removePolicy(name);
  }

  openImportModal(): void {
    this.modalService.showModal(PolicyImportComponent, {finalize: () => this.modalService.closeModal()});
  }

  ngOnInit(): void {
    this.policiesService.state.promise.then(
      () => this.policiesService.getPolicyListOnce()
    ).then(
      res => {
        this.filenames = res;
        this.policiesService.getPolicyList().subscribe(res => this.filenames = res)
      }
    );
  }
}
