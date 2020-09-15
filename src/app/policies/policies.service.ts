import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FileService } from '../shared/services/file.service';

import { ReadyState } from '../core/ready-state';

@Injectable({
  providedIn: 'root'
})
export class PoliciesService {
  state = new ReadyState();
  baseDir: string;

  constructor(
    private fileService: FileService
  ) {
    this.init();
  }

  init(): void {
    this.fileService.state.promise.then(() => {
      this.baseDir = `${this.fileService.appDataDir}/policy-audits/policies`
      this.fileService.readDir(this.baseDir).pipe(
        catchError(() => of(
          this.fileService.makeDir(this.baseDir).subscribe(() => this.state.resolve())
        ))
      ).subscribe(() => {
        this.state.resolve();
      })
    })
  }

  getPolicyListOnce(): Observable<string[]> {
    return this.fileService.readDir(this.baseDir);
  }

  removePolicy(name: string): Observable<void> {
    return this.fileService.removeFile(`${this.baseDir}/${name}`).pipe(
      catchError(() => throwError('No audit to remove') )
    )
  }

  importPolicy(path: string, name: string): Observable<void> {
    return this.fileService.copyFile(path, `${this.baseDir}/${name}`)
  }

  getPolicyList(): Observable<string[]> {
    return this.fileService.watchDirAll(this.baseDir);
  }

  getPolicyItemContent(name: string): Observable<string> {
    return this.fileService.readFile(`${this.baseDir}/${name}`);
  }
}
