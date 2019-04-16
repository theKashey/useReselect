import * as React from 'react';
import {runInScope, setCacheInitializer} from './createSelector';

let stack: any[] = [];

const initializeCacheFromHooks = () => {
  const cache = React.useState(() => new WeakMap())[0];
  stack.push(cache);
  return cache;
};

const initializeCacheFromStack = (stackOverride: any[]) => () => {
  const cache = stackOverride[stack.length];
  stack.push(cache);
  return cache;
};

interface useReselect {
  <T>(cb: () => T, stack?: any[]): T;

  getStack(): any[];
}

interface useReReselect extends useReselect {

}

export function useReselect<T>(cb: () => T, stackOverride?: any[]): T {
  stack = [];
  if (stackOverride) {
    setCacheInitializer(initializeCacheFromStack(stackOverride));
  } else {
    setCacheInitializer(initializeCacheFromHooks);
  }
  const result = runInScope(cb);
  return result;
}

useReselect.getStack = () => stack;


export function useReReselect<T>(cb: () => T, stackOverride?: any[]): T {
  stack = [];
  if (stackOverride) {
    setCacheInitializer(initializeCacheFromStack(stackOverride));
  } else {
    setCacheInitializer(initializeCacheFromHooks);
  }
  return cb();
}

useReReselect.getStack = () => stack;