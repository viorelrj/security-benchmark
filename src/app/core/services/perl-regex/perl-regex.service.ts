// This file is basically ripped of from here: https://www.npmjs.com/package/perl-regex
// Couldn't make angular/electron behave with importing this library normally

import { Injectable } from '@angular/core';
import { ElectronService } from '../electron/electron.service';

@Injectable({
  providedIn: 'root'
})
export class PerlRegexService {
  private cp: any;
  private sprintf: any;

  constructor(
    private electronService: ElectronService
  ) {
    this.cp = this.electronService.childProcess;
    this.sprintf = this.electronService.sprintf;
  }

  match(str: string, regex: RegExp|string, options: string): boolean {
    const perlMatchCommand =
      'perl -nle ' +
      '\'@res = m/%s/%s; ' +
      'print ($& ne "")\'';

    try {
      if ((typeof (options) === 'undefined') || (options === null)) {
        options = ''; // default option
      }

      if (regex instanceof RegExp) {
        const regexStr = regex.toString();
        regex = regexStr.match(/^\/(.*)\/\w*$/)[1];
        options = regexStr.match(/^\/.*\/(\w*)$/)[1];
      }

      let escapedString = str.toString().replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      escapedString = escapedString.replace(/\n/g, '\xff');
      // Escape the $ sign here
      escapedString = escapedString.replace(/\$/g, '\\$');
      regex = regex.toString().replace(/'/g, '\\\'');
      regex = regex.replace(/\\n/g, '\xff');
      const matchCommand = this.sprintf(perlMatchCommand, regex, options);
      let match = this.cp.execSync(this.sprintf('echo "%s"|%s', escapedString, matchCommand));

      match = match.toString('utf8').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      if (match == "1\n") {
        return true;
      }

      return false;
    } catch (exception) {
      return false;
    }
  }

  exec(str: string, regex: RegExp|string, options): unknown[]|null {
    const perlExecCommand =
      'perl -nle ' +
      '\'@res = m/%s/%s; ' +
      '$,="\n"; ' +
      'if ($& ne "") { ' +
      'print $&; ' +
      'if ((scalar(@res) > 1) || ($1 ne "")) { print @res } ' +
      '}\'';

    try {
      if ((typeof (options) === 'undefined') || (options === null)) {
        options = ''; // default option
      }

      if (regex instanceof RegExp) {
        const regexStr = regex.toString();
        regex = regexStr.match(/^\/(.*)\/\w*$/)[1];
        options = regexStr.match(/^\/.*\/(\w*)$/)[1];
      }

      let escapedString = str.toString().replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      escapedString = escapedString.replace(/\n/g, '\xff');
      // Escape the $ sign here
      escapedString = escapedString.replace(/\$/g, '\\$');
      regex = regex.toString().replace(/'/g, '\\\'');
      regex = regex.replace(/\\n/g, '\xff');
      const execCommand = this.sprintf(perlExecCommand, regex, options);
      let match = this.cp.execSync(this.sprintf('echo "%s"|%s', escapedString, execCommand));

      match = match.toString('utf8').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      match = match.split("\n");
      match.pop(); // remove the last newline character.

      if (match.length == 0) {
        return null;
      }

      for (let index = 0; index < match.length; ++index) {
        match[index] = match[index].toString().replace(/\xff/g, "\n");
      }

      return match;
    } catch (exception) {
      return null;
    }
  }
}
