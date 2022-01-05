class TimeLogger {
  static ticks = {};
  static getTicks() {
    return this.ticks;
  }
  static start(funcName) {
    if (this.ticks[funcName] === undefined) this.ticks[funcName] = { total: 0 };
    this.ticks[funcName].start = new Date().getTime();
  }
  static end(funcName) {
    const funcTick = this.ticks[funcName];
    funcTick.end = new Date().getTime();
    funcTick.total += funcTick.end - funcTick.start;
  }
  static erase(funcName) {
    if (this.ticks[funcName] === undefined) this.ticks[funcName] = {};
    this.ticks[funcName].total = 0;
  }
  static async logFunc(func, funcName) {
    let t1 = new Date().getTime();
    const res = await func();
    let t2 = new Date().getTime();
    if (this.ticks[funcName] === undefined) this.ticks[funcName] = 0;
    this.ticks[funcName] += t2 - t1;
    return res;
  }
  static init() {
    this.ticks = {};
  }
  static log() {
    // console.log("TimeLogger", this.ticks);
  }
}

export default TimeLogger;
