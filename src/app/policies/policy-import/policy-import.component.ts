import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ButtonComponent } from 'app/ui/button/button.component';
import { CheckboxListComponent } from 'app/ui/checkbox-list/checkbox-list.component';
import { IModalChildProps } from 'app/ui/modal/modal.service';
import { IpcMain } from 'electron';
import { PoliciesService } from '../policies.service';
import { IPolicy } from '../../core/interfaces/policy';

@Component({
  selector: 'app-policy-import',
  templateUrl: './policy-import.component.html',
  styleUrls: ['./policy-import.component.scss']
})
export class PolicyImportComponent implements OnInit {
  constructor(
    private policiesService: PoliciesService
  ) { }

  @Input() modalData?: IModalChildProps;
  importPath: string;
  importFileName: string;
  outFileName: string;
  checks = [] as string[];
  @ViewChild(CheckboxListComponent) checkboxList: CheckboxListComponent;
  content: IPolicy;

  ngOnInit(): void {
  }

  handleFileInput(files: FileList): void {
    if (!files.length) {
      return;
    }
    const file = files[0];
    this.importPath = file.path;
    this.importFileName = file.name;
    this.handleFileLoad();
  }

  handleFileLoad(): void {
    this.policiesService.getAdaptedPolicy(this.importPath).then(
      res => {
        this.content = res;
        this.checks = Object.keys(res.checks)
      }
    )
  }

  handleImport(): void {
    if (!this.policiesService.state.isReady) {
      return;
    }
    if (!this.outFileName || !this.content) {
      return;
    }

    this.policiesService.importAdaptedPolicy(this.content, this.checkboxList.getSelected(), this.outFileName);
  }
}
