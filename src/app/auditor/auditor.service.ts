import { Injectable } from '@angular/core';
import { ElectronService } from 'app/core/services';
import { PerlRegexService } from 'app/core/services/perl-regex/perl-regex.service';
import { FileService } from 'app/shared/services/file.service';
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

  private localize(cmd: string) {
    cmd = cmd.replace('/etc', `${this.rootDir}/etc`);
    return cmd;
  }

  audit(src: IPolicy): void {
    console.log(src);
    
    console.log(this.regexService.exec('EMAIL: test@example.com', '^email: [a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$', 'i'));
    // console.log(pregex.match('EMAIL: test@example.com', '^email: [a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$', 'i'));

    Object.values(src.checks).forEach(element => this.dispatch(element));
  }

  private dispatch(item: { [key: string]: string }): void {
    if (item.type === 'CMD_EXEC') {
      this.assertCommand(item.cmd, item.expect).then(res => console.log(res))
    } else if (item.type === 'FILE_CONTENT_CHECK') {
      //
    } else if (item.type === 'FILE_CHECK') {
      //
    }
  }

  private assertCommand(cmd: string, expect: string): Promise<boolean> {
    cmd = this.localize(cmd);
    
    return new Promise((res, rej) => {
      this.electronService.childProcess.exec(cmd, (err, stdout, stderr) => {
        if (!stderr && stdout === expect) {
          res(true);
        } else {
          res(false);
        }
      })
    });
  }
}
