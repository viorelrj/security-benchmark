import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileService } from '../shared/services/file.service';
import { PolicyFormatterService } from './policy-formatter.service';
import { IPolicy } from '../core/interfaces/policy';

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

  readNessusPolicy(path: string): Promise<string> {
    return this.fileService.readFile(path);
  }

  savePolicy(name: string, data: string): Promise<void> {
    return this.fileService.writeFile(`${this.baseDir}/${name}.json`, data);
  }

  getPolicyList(): Observable<string[]> {
    return this.fileService.watchDirAll(this.baseDir);
  }

  importAdaptedPolicy(content: IPolicy, selected: string[], name: string): Promise<void> {
    return this.policyFormatterService.filter(content, selected).then(
      res => this.savePolicy(name, JSON.stringify(res))
    );
  }

  getLocalPolicy(name: string): Promise<IPolicy> {
    return this.fileService.readFile(`${this.baseDir}/${name}`).then(res => JSON.parse(res));
  }

  getAdaptedPolicy(path: string): Promise<IPolicy> {
    return this.fileService.readFile(path).then(
      (res) => this.policyFormatterService.format(res)
    )
  }
}
