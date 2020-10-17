import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileService } from '../shared/services/file.service';
import { IPolicyNode, PolicyFormatterService } from './policy-formatter.service';

import { ReadyState } from '../core/ready-state';

@Injectable({
  providedIn: 'root'
})
export class PoliciesService {
  state = new ReadyState();
  baseDir: string;

  constructor(
    private fileService: FileService,
    private policyFormatterService: PolicyFormatterService
  ) {
    this.init();
  }

  init(): void {
    this.fileService.state.promise.then(() => {
      this.baseDir = `${this.fileService.appDataDir}/policy-audits/policies`
      this.fileService.readDir(this.baseDir).catch(
        () => this.fileService.makeDir(this.baseDir)
      ).then(() => this.state.resolve())
    })
  }

  getPolicyListOnce(): Promise<string[]> {
    return this.fileService.readDir(this.baseDir);
  }

  removePolicy(name: string): Promise<void> {
    return this.fileService.removeFile(`${this.baseDir}/${name}`)
  }

  importPolicy(path: string, name: string): Promise<void> {
    return this.fileService.copyFile(path, `${this.baseDir}/${name}`)
  }

  getPolicyList(): Observable<string[]> {
    return this.fileService.watchDirAll(this.baseDir);
  }

  getPolicyItemContent(name: string): Promise<IPolicyNode> {
    return this.fileService.readFile(`${this.baseDir}/${name}`).then(
      (res) => this.policyFormatterService.format(res)
    )
  }
}
