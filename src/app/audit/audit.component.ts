import { Component, OnInit } from '@angular/core';
import { AuditService } from './audit.service';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss']
})
export class AuditComponent implements OnInit {
  filenames: string[];

  constructor(
    private auditService: AuditService
  ) { }


  refreshPolicies(): void {
    this.auditService.getPolicyList().subscribe(res => {
      this.filenames = res;
    });
  }
  
  removePolicy(name: string): void {
    this.auditService.removePolicy(name).subscribe(() => {
      //
    })
  }

  importPolicy(name: string, data: string): void {
    this.auditService.importPolicy(name, data).subscribe(() => {
      //
    });
  }

  handleFileInput(files: FileList): void {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.auditService.importPolicy(file.path, file.name).subscribe();
    }
  }

  ngOnInit(): void {
    this.auditService.state.promise.then(() => {
      this.auditService.getPolicyListOnce().subscribe(res => this.filenames = res)
      this.auditService.getPolicyList().subscribe(res => this.filenames = res);
    })
  }
}
