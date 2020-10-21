import { Component, Input, OnInit } from '@angular/core';
import { AuditorComponent } from 'app/auditor/auditor.component';
import { AuditorService } from 'app/auditor/auditor.service';
import { ModalService } from 'app/ui/modal/modal.service';
import { PoliciesService } from '../policies.service';

@Component({
  selector: 'app-policies-item',
  templateUrl: './policies-item.component.html',
  styleUrls: ['./policies-item.component.scss']
})
export class PoliciesItemComponent implements OnInit {
  @Input() fileName: string;

  constructor(
    private policiesService: PoliciesService,
    private auditorService: AuditorService,
    private modalService: ModalService
  ) { }

  handleRemove(): void {
    if (!this.policiesService.state.isReady) {
      return;
    }

    this.policiesService.removePolicy(this.fileName);
  }

  handleExecute(): void {
    this.modalService.showModal(AuditorComponent, {
      getResults: () => this.policiesService.getLocalPolicy(this.fileName).then(res => this.auditorService.audit(res))
    });
  }

  ngOnInit(): void {
  }

}
