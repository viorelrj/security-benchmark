export class ReadyState {
  public resolve: () => void;
  public reject: () => void;
  public promise: Promise<boolean>;
  public isReady = false;
  
  constructor() {
    this.promise = new Promise<boolean>((res, rej) => {
      this.resolve = () => {
        this.isReady = true;
        res();
      };
      this.reject = () => {
        this.isReady = false;
        rej();
      };
    });
  }
}