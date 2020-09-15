import { Injectable, NgZone } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
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

  private emitSingle<T>(subscriber: Subscriber<T>, value:T, error: Error) {
    if (error) {
      subscriber.error(error);
    }
    this.ngZone.run(() => {
      subscriber.next(value);
      subscriber.complete();
      subscriber.unsubscribe();
    })
  }

  readDir(src: string): Observable<string[]> {
    return new Observable(subscriber => {
      this.electronService.fs.readdir(src, {}, (err, files: string[]) => {
        this.emitSingle(subscriber, files, err);
      });
    })
  }

  makeDir(src: string): Observable<void> {
    return new Observable(subscriber => {
      this.electronService.fs.mkdir(src, {recursive: true}, (err:Error) => this.emitSingle(subscriber, null, err))
    })
  }

  removeFile(src: string): Observable<void> {
    return new Observable(subscriber => {
      this.electronService.fs.unlink(src, (err:Error) => this.emitSingle(subscriber, null, err));
    })
  }

  writeFile(src: string, data:string): Observable<void> {
    return new Observable(subscriber => {
      this.electronService.fs.writeFile(src, data, {}, (err:Error) => this.emitSingle(subscriber, null, err));
    })
  }

  copyFile(src: string, dest: string): Observable<void> {
    return new Observable(subscriber => {
      this.electronService.fs.copyFile(src, dest, (err: Error) => this.emitSingle(subscriber, null, err));
    })
  }

  readFile(src: string): Observable<string> {
    return new Observable(subscriber => {
      this.electronService.fs.readFile(src, 'utf8', (err, data:string) => this.emitSingle(subscriber, data, err));
    })
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

