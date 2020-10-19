import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ButtonComponent } from 'app/ui/button/button.component';
import { CheckboxListComponent } from 'app/ui/checkbox-list/checkbox-list.component';
import { IModalChildProps } from 'app/ui/modal/modal.service';
import { PoliciesService } from '../policies.service';

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

  handleFileLoad() {
    this.policiesService.getAdaptedPolicy(this.importPath).then(
      res => this.checks = Object.keys(res.checks)
    )
  }

  handleImport(): void {
    console.log(this.checkboxList.getSelected());
    // if (!this.policiesService.state.isReady) {
    //   return;
    // }

    // if (!this.importPath || !this.outFileName) {
    //   return;
    // }

    // this.policiesService.importPolicy(this.importPath, this.outFileName);
    
    // if (this.modalData && this.modalData.finalize) {
    //   this.modalData.finalize();
    // }
  }
}
