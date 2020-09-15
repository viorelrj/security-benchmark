import { Component, OnInit } from '@angular/core';
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

  importPath: string;
  importFileName: string;
  outFileName: string;

  ngOnInit(): void {
  }

  handleFileInput(files: FileList): void {
    const file = files[0];
    this.importPath = file.path;
    this.importFileName = file.name;
  }

  handleImport(): void {
    if (!this.policiesService.state.isReady) {
      return;
    }

    if (!this.importPath || !this.outFileName) {
      return;
    }

    this.policiesService.importPolicy(this.importPath, this.outFileName).subscribe();
  }
}
