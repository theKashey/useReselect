import {boxed} from 'kashe';
// @ts-ignore
import {createSelectorCreator, defaultMemoize} from "./reselect";

export type WeakStorage = WeakMap<any, any>;

let GLOBAL_RESELECT_CACHE: WeakStorage | undefined;
let LAST_GLOBAL_RESELECT_CACHE: WeakStorage | undefined;

const sharedCache = new WeakMap();

const initializeSharedCache = () => sharedCache;

let initializeCache: () => WeakStorage = initializeSharedCache;
let depth = 0;
let objectCounter = 0;

const pushSelector = () => {
  depth++;
};

const popSelector = () => {
  depth--;
  return depth;
};

export const resetStack = () => {
  depth = 0;
  GLOBAL_RESELECT_CACHE = undefined;
  initializeCache = initializeSharedCache;
};

export const setCacheInitializer = (cb: () => WeakStorage) => {
  initializeCache = cb;
};

export const getLastCache = () => LAST_GLOBAL_RESELECT_CACHE;

const getCacheEntryFor = (fn: any) => {
  const v = GLOBAL_RESELECT_CACHE!.get(fn);
  if (v) {
    return v;
  }
  const newValue = {id: objectCounter++};
  console.log('create cache for', objectCounter, fn);
  GLOBAL_RESELECT_CACHE!.set(fn, newValue);
  return newValue;
};

export function dimensionMemoize(func: any): any {
  console.log('create cache for', func);
  const fn = boxed(defaultMemoize(func));
  return function (...args: any) {
    return fn(getCacheEntryFor(func), ...args);
  }
};

export const runInScope = (fn: any) => {
  if (!GLOBAL_RESELECT_CACHE) {
    // first selectors reads a shared variable from a fiber.
    GLOBAL_RESELECT_CACHE = initializeCache();
  }
  try {
    pushSelector();

    return fn();
  } finally {
    if (!popSelector()) {
      LAST_GLOBAL_RESELECT_CACHE = GLOBAL_RESELECT_CACHE!;
      GLOBAL_RESELECT_CACHE = undefined;
    }
  }
};

export const createSelector = (...args: any[]) => {
  const selector = createSelectorCreator(dimensionMemoize)(...args);

  return (...args: any[]) => runInScope(() => selector(...args));
};