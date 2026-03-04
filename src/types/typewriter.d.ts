declare module 'typewriter-effect/dist/core' {
  interface TypewriterOptions {
    strings?: string[];
    autoStart?: boolean;
    loop?: boolean;
    delay?: number | 'natural';
    deleteSpeed?: number | 'natural';
    cursor?: string;
    wrapperClassName?: string;
    cursorClassName?: string;
    skipAddStyles?: boolean;
    devMode?: boolean;
  }

  class Typewriter {
    constructor(element: Element | string, options?: TypewriterOptions);
    start(): this;
    stop(): this;
    typeString(string: string): this;
    deleteAll(speed?: number): this;
    deleteChars(amount: number): this;
    pauseFor(ms: number): this;
    changeDelay(delay: number): this;
    changeDeleteSpeed(speed: number): this;
  }

  export default Typewriter;
}
