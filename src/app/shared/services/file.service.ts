import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject, Subscriber } from 'rxjs';
import { subscribeOn } from 'rxjs/operators';
import { ReadyState } from '../../core/ready-state';
const fs = window.require('fs');


@Injectable({
  providedIn: 'root'
})
export class FileService {
  public state = new ReadyState();

  constructor(
    private ngZone: NgZone
  ) {
    this.state.resolve();
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
      fs.readdir(src, {}, (err, files: string[]) => {
        this.emitSingle(subscriber, files, err);
      });
    })
  }

  makeDir(src: string): Observable<void> {
    return new Observable(subscriber => {
      fs.mkdir(src, {}, (err:Error) => this.emitSingle(subscriber, null, err))
    })
  }

  removeFile(src: string): Observable<void> {
    return new Observable(subscriber => {
      fs.unlink(src, (err:Error) => this.emitSingle(subscriber, null, err));
    })
  }

  writeFile(src: string, data:string): Observable<void> {
    return new Observable(subscriber => {
      fs.writeFile(src, data, {}, (err:Error) => this.emitSingle(subscriber, null, err));
    })
  }

  copyFile(src: string, dest: string): Observable<void> {
    return new Observable(subscriber => {
      fs.copyFile(src, dest, (err: Error) => this.emitSingle(subscriber, null, err));
    })
  }

  readFile(src: string): Observable<string> {
    return new Observable(subscriber => {
      fs.readFile(src, (err, data) => this.emitSingle(subscriber, data, err));
    })
  }

  watchDir(src: string): Observable<string> {
    return new Observable(subscriber => {
      fs.watch(src, {}, (type: any, file: string)  => {
        this.ngZone.run(() => {
          subscriber.next(file);
        });
      });
    })
  }

  watchDirAll(src: string): Observable<string[]> {
    return new Observable(subscriber => {
      fs.watch(src, {}, () => {
        fs.readdir(src, {}, (err, files: string[]) => {
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

