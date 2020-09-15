import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { ReadyState } from '../../core/ready-state';
import { ElectronService } from '../../core/services/electron/electron.service';


@Injectable({
  providedIn: 'root'
})
export class FileService {
  public state = new ReadyState();
  public appDataDir: string;

  constructor(
    private ngZone: NgZone,
    private electronService: ElectronService
  ) {
    this.electronService.state.promise.then(
      () => {
        this.appDataDir = electronService.appDir;
        this.state.resolve()
      }
    )
  }

  readDir(src: string): Promise<string[]> {
    return this.electronService.fs.promises.readdir(src);
  }

  makeDir(src: string): Promise<void> {
    return this.electronService.fs.promises.mkdir(src, {recursive: true})
  }

  removeFile(src: string): Promise<void> {
    return this.electronService.fs.promises.unlink(src);
  }

  writeFile(src: string, data:string): Promise<void> {
    return this.electronService.fs.promises.writeFile(src, data);
  }

  copyFile(src: string, dest: string): Promise<void> {
    return this.electronService.fs.promises.copyFile(src, dest);
  }

  readFile(src: string): Promise<string> {
    return this.electronService.fs.promises.readFile(src, 'utf8');
  }

  watchDir(src: string): Observable<string> {
    return new Observable(subscriber => {
      this.electronService.fs.watch(src, {}, (type: any, file: string)  => {
        this.ngZone.run(() => {
          subscriber.next(file);
        });
      });
    })
  }

  watchDirAll(src: string): Observable<string[]> {
    return new Observable(subscriber => {
      this.electronService.fs.watch(src, {}, () => {
        this.electronService.fs.readdir(src, {}, (err, files: string[]) => {
          this.ngZone.run(() => {
            if (err) {
              subscriber.error(err);
            }
            subscriber.next(files);
          });
        });
      });
    })
  }
}

