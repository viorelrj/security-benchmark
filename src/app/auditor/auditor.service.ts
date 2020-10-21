import { Injectable } from '@angular/core';
import { ElectronService } from 'app/core/services';
import { PerlRegexService } from 'app/core/services/perl-regex/perl-regex.service';
import { FileService } from 'app/shared/services/file.service';
import { promises } from 'dns';
import { stderr } from 'process';
import { IPolicy } from '../core/interfaces/policy';

@Injectable({
  providedIn: 'root'
})
export class AuditorService {
  rootDir = '/usr/local';

  constructor(
    private fileService: FileService,
    private electronService: ElectronService,
    private regexService: PerlRegexService
  ) { }

  private sanitize(cmd: string) {
    cmd = cmd.replace('/etc', `${this.rootDir}/etc`);
    return cmd;
  }

  audit(src: IPolicy): Promise<{[key: string]: boolean}> {
    console.log(src);

    return new Promise((resolve, reject) => {
      const results = {};

      Object.values(src.checks).forEach(element => {
        this.dispatch(element).then(res => results[element.description] = res)
      });

      const promises = Object.values(src.checks)
        .map(element => this.dispatch(element)
          .then(res => ({
            key: element.description,
            result: res
          }))
        );

      Promise.all(promises)
        .then(values => values.forEach(item => results[item.key] = item.result))
        .then( () => resolve(results) );
    });
  }

  private dispatch(item: { [key: string]: string }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (item.type === 'CMD_EXEC') {
        this.assertCommand(item.cmd, item.expect).then(response => resolve(response))
      } else if (item.type === 'FILE_CONTENT_CHECK') {
        this.assertFileContent(item.file, item.regex, item.expect).then(response => resolve(response));
      } else if (item.type === 'FILE_CHECK') {
        this.assertFile(item).then(response => resolve(response));
      } else {
        resolve(false);
      }
    })
  }

  private assertFile(item: {[key: string]: string}): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (item.group) {
        this.electronService.childProcess.exec(
          `stat -f %g ${this.sanitize(item.file)} | id | cut -d' ' -f2`,
          (err, stdout, stderr) => {
            let name = /\([^()]{1,}\)/.exec(stdout)[0];
            name = name.slice(1, name.length - 1);
            resolve(name == item.group);
          }
        )
      }
      if (item.owner) {
        this.electronService.childProcess.exec(
          `stat -f %g ${this.sanitize(item.file)} | id | cut -d' ' -f1`,
          (err, stdout, stderr) => {
            let name = /\([^()]{1,}\)/.exec(stdout)[0];
            name = name.slice(1, name.length - 1);
            resolve(name == item.owner);
          }
        )
      }
      if (item.mask) {
        this.electronService.childProcess.exec(
          `stat -f %A ${this.sanitize(item.file)}`,
          (err, stdout, stderr) => {
            resolve(name == item.mask);
          }
        )
      }
    });
  }

  private assertFileContent(file: string, regex: string, expect: string): Promise<boolean> {
    file = this.sanitize(file);

    return new Promise((resolve, reject) => {
      this.electronService.childProcess.exec(`cat ${file}`, (err, stdout, stderr) => {
        stdout.split('\n').forEach(item => {
          if (this.regexService.exec(item.trim(), regex, 'i')) {
            resolve(true);
          }
        });
        resolve(false);
      });
    });
  }

  private assertCommand(cmd: string, expect: string): Promise<boolean> {
    cmd = this.sanitize(cmd);
    
    return new Promise((res, rej) => {
      this.electronService.childProcess.exec(cmd, (err, stdout, stderr) => {
        if (!stderr && this.regexService.exec(stdout, expect, 'i')) {
          res(true);
        } else {
          res(false);
        }
      })
    });
  }
}
