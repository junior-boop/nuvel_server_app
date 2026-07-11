var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/@instantdb/admin/node_modules/uuid/dist/esm-browser/regex.js
var regex_default;
var init_regex = __esm({
  "node_modules/@instantdb/admin/node_modules/uuid/dist/esm-browser/regex.js"() {
    regex_default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;
  }
});

// node_modules/@instantdb/admin/node_modules/uuid/dist/esm-browser/validate.js
function validate(uuid) {
  return typeof uuid === "string" && regex_default.test(uuid);
}
var validate_default;
var init_validate = __esm({
  "node_modules/@instantdb/admin/node_modules/uuid/dist/esm-browser/validate.js"() {
    init_regex();
    __name(validate, "validate");
    validate_default = validate;
  }
});

// node_modules/@instantdb/admin/node_modules/uuid/dist/esm-browser/index.js
var init_esm_browser = __esm({
  "node_modules/@instantdb/admin/node_modules/uuid/dist/esm-browser/index.js"() {
    init_validate();
  }
});

// node_modules/@instantdb/core/dist/esm/utils/weakHash.js
var init_weakHash = __esm({
  "node_modules/@instantdb/core/dist/esm/utils/weakHash.js"() {
  }
});

// node_modules/mutative/dist/mutative.esm.mjs
function has(target, key) {
  return target instanceof Map ? target.has(key) : Object.prototype.hasOwnProperty.call(target, key);
}
function getDescriptor(target, key) {
  if (key in target) {
    let prototype = Reflect.getPrototypeOf(target);
    while (prototype) {
      const descriptor = Reflect.getOwnPropertyDescriptor(prototype, key);
      if (descriptor)
        return descriptor;
      prototype = Reflect.getPrototypeOf(prototype);
    }
  }
  return;
}
function isBaseSetInstance(obj) {
  return Object.getPrototypeOf(obj) === Set.prototype;
}
function isBaseMapInstance(obj) {
  return Object.getPrototypeOf(obj) === Map.prototype;
}
function latest(proxyDraft) {
  var _a;
  return (_a = proxyDraft.copy) !== null && _a !== void 0 ? _a : proxyDraft.original;
}
function isDraft(target) {
  return !!getProxyDraft(target);
}
function getProxyDraft(value) {
  if (typeof value !== "object")
    return null;
  return value === null || value === void 0 ? void 0 : value[PROXY_DRAFT];
}
function getValue(value) {
  var _a;
  const proxyDraft = getProxyDraft(value);
  return proxyDraft ? (_a = proxyDraft.copy) !== null && _a !== void 0 ? _a : proxyDraft.original : value;
}
function isDraftable(value, options) {
  if (!value || typeof value !== "object")
    return false;
  let markResult;
  return Object.getPrototypeOf(value) === Object.prototype || Array.isArray(value) || value instanceof Map || value instanceof Set || !!(options === null || options === void 0 ? void 0 : options.mark) && ((markResult = options.mark(value, dataTypes)) === dataTypes.immutable || typeof markResult === "function");
}
function getPath2(target, path = []) {
  if (Object.hasOwnProperty.call(target, "key")) {
    const parentCopy = target.parent.copy;
    const proxyDraft = getProxyDraft(get(parentCopy, target.key));
    if (proxyDraft !== null && (proxyDraft === null || proxyDraft === void 0 ? void 0 : proxyDraft.original) !== target.original) {
      return null;
    }
    const isSet = target.parent.type === 3;
    const key = isSet ? Array.from(target.parent.setMap.keys()).indexOf(target.key) : target.key;
    if (!(isSet && parentCopy.size > key || has(parentCopy, key)))
      return null;
    path.push(key);
  }
  if (target.parent) {
    return getPath2(target.parent, path);
  }
  path.reverse();
  try {
    resolvePath(target.copy, path);
  } catch (e) {
    return null;
  }
  return path;
}
function getType(target) {
  if (Array.isArray(target))
    return 1;
  if (target instanceof Map)
    return 2;
  if (target instanceof Set)
    return 3;
  return 0;
}
function get(target, key) {
  return getType(target) === 2 ? target.get(key) : target[key];
}
function set(target, key, value) {
  const type = getType(target);
  if (type === 2) {
    target.set(key, value);
  } else {
    target[key] = value;
  }
}
function peek(target, key) {
  const state = getProxyDraft(target);
  const source = state ? latest(state) : target;
  return source[key];
}
function isEqual(x, y) {
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}
function revokeProxy(proxyDraft) {
  if (!proxyDraft)
    return;
  while (proxyDraft.finalities.revoke.length > 0) {
    const revoke = proxyDraft.finalities.revoke.pop();
    revoke();
  }
}
function escapePath(path, pathAsArray) {
  return pathAsArray ? path : [""].concat(path).map((_item) => {
    const item = `${_item}`;
    if (item.indexOf("/") === -1 && item.indexOf("~") === -1)
      return item;
    return item.replace(/~/g, "~0").replace(/\//g, "~1");
  }).join("/");
}
function resolvePath(base, path) {
  for (let index = 0; index < path.length - 1; index += 1) {
    const key = path[index];
    base = get(getType(base) === 3 ? Array.from(base) : base, key);
    if (typeof base !== "object") {
      throw new Error(`Cannot resolve patch at '${path.join("/")}'.`);
    }
  }
  return base;
}
function strictCopy(target) {
  const copy = Object.create(Object.getPrototypeOf(target));
  Reflect.ownKeys(target).forEach((key) => {
    let desc = Reflect.getOwnPropertyDescriptor(target, key);
    if (desc.enumerable && desc.configurable && desc.writable) {
      copy[key] = target[key];
      return;
    }
    if (!desc.writable) {
      desc.writable = true;
      desc.configurable = true;
    }
    if (desc.get || desc.set)
      desc = {
        configurable: true,
        writable: true,
        enumerable: desc.enumerable,
        value: target[key]
      };
    Reflect.defineProperty(copy, key, desc);
  });
  return copy;
}
function shallowCopy(original, options) {
  let markResult;
  if (Array.isArray(original)) {
    return Array.prototype.concat.call(original);
  } else if (original instanceof Set) {
    if (!isBaseSetInstance(original)) {
      const SubClass = Object.getPrototypeOf(original).constructor;
      return new SubClass(original.values());
    }
    return Set.prototype.difference ? Set.prototype.difference.call(original, /* @__PURE__ */ new Set()) : new Set(original.values());
  } else if (original instanceof Map) {
    if (!isBaseMapInstance(original)) {
      const SubClass = Object.getPrototypeOf(original).constructor;
      return new SubClass(original);
    }
    return new Map(original);
  } else if ((options === null || options === void 0 ? void 0 : options.mark) && (markResult = options.mark(original, dataTypes), markResult !== void 0) && markResult !== dataTypes.mutable) {
    if (markResult === dataTypes.immutable) {
      return strictCopy(original);
    } else if (typeof markResult === "function") {
      if (options.enablePatches || options.enableAutoFreeze) {
        throw new Error(`You can't use mark and patches or auto freeze together.`);
      }
      return markResult();
    }
    throw new Error(`Unsupported mark result: ${markResult}`);
  } else if (typeof original === "object" && Object.getPrototypeOf(original) === Object.prototype) {
    const copy = {};
    Object.keys(original).forEach((key) => {
      copy[key] = original[key];
    });
    Object.getOwnPropertySymbols(original).forEach((key) => {
      if (propIsEnum.call(original, key)) {
        copy[key] = original[key];
      }
    });
    return copy;
  } else {
    throw new Error(`Please check mark() to ensure that it is a stable marker draftable function.`);
  }
}
function ensureShallowCopy(target) {
  if (target.copy)
    return;
  target.copy = shallowCopy(target.original, target.options);
}
function deepClone(target) {
  if (!isDraftable(target))
    return getValue(target);
  if (Array.isArray(target))
    return target.map(deepClone);
  if (target instanceof Map) {
    const iterable = Array.from(target.entries()).map(([k, v]) => [
      k,
      deepClone(v)
    ]);
    if (!isBaseMapInstance(target)) {
      const SubClass = Object.getPrototypeOf(target).constructor;
      return new SubClass(iterable);
    }
    return new Map(iterable);
  }
  if (target instanceof Set) {
    const iterable = Array.from(target).map(deepClone);
    if (!isBaseSetInstance(target)) {
      const SubClass = Object.getPrototypeOf(target).constructor;
      return new SubClass(iterable);
    }
    return new Set(iterable);
  }
  const copy = Object.create(Object.getPrototypeOf(target));
  for (const key in target)
    copy[key] = deepClone(target[key]);
  return copy;
}
function cloneIfNeeded(target) {
  return isDraft(target) ? deepClone(target) : target;
}
function markChanged(proxyDraft) {
  var _a;
  proxyDraft.assignedMap = (_a = proxyDraft.assignedMap) !== null && _a !== void 0 ? _a : /* @__PURE__ */ new Map();
  if (!proxyDraft.operated) {
    proxyDraft.operated = true;
    if (proxyDraft.parent) {
      markChanged(proxyDraft.parent);
    }
  }
}
function throwFrozenError() {
  throw new Error("Cannot modify frozen object");
}
function deepFreeze(target, subKey, updatedValues, stack, keys) {
  {
    updatedValues = updatedValues !== null && updatedValues !== void 0 ? updatedValues : /* @__PURE__ */ new WeakMap();
    stack = stack !== null && stack !== void 0 ? stack : [];
    keys = keys !== null && keys !== void 0 ? keys : [];
    const value = updatedValues.has(target) ? updatedValues.get(target) : target;
    if (stack.length > 0) {
      const index = stack.indexOf(value);
      if (value && typeof value === "object" && index !== -1) {
        if (stack[0] === value) {
          throw new Error(`Forbids circular reference`);
        }
        throw new Error(`Forbids circular reference: ~/${keys.slice(0, index).map((key, index2) => {
          if (typeof key === "symbol")
            return `[${key.toString()}]`;
          const parent = stack[index2];
          if (typeof key === "object" && (parent instanceof Map || parent instanceof Set))
            return Array.from(parent.keys()).indexOf(key);
          return key;
        }).join("/")}`);
      }
      stack.push(value);
      keys.push(subKey);
    } else {
      stack.push(value);
    }
  }
  if (Object.isFrozen(target) || isDraft(target)) {
    {
      stack.pop();
      keys.pop();
    }
    return;
  }
  const type = getType(target);
  switch (type) {
    case 2:
      for (const [key, value] of target) {
        deepFreeze(key, key, updatedValues, stack, keys);
        deepFreeze(value, key, updatedValues, stack, keys);
      }
      target.set = target.clear = target.delete = throwFrozenError;
      break;
    case 3:
      for (const value of target) {
        deepFreeze(value, value, updatedValues, stack, keys);
      }
      target.add = target.clear = target.delete = throwFrozenError;
      break;
    case 1:
      Object.freeze(target);
      let index = 0;
      for (const value of target) {
        deepFreeze(value, index, updatedValues, stack, keys);
        index += 1;
      }
      break;
    default:
      Object.freeze(target);
      Object.keys(target).forEach((name) => {
        const value = target[name];
        deepFreeze(value, name, updatedValues, stack, keys);
      });
  }
  {
    stack.pop();
    keys.pop();
  }
}
function forEach(target, iter) {
  const type = getType(target);
  if (type === 0) {
    Reflect.ownKeys(target).forEach((key) => {
      iter(key, target[key], target);
    });
  } else if (type === 1) {
    let index = 0;
    for (const entry of target) {
      iter(index, entry, target);
      index += 1;
    }
  } else {
    target.forEach((entry, index) => iter(index, entry, target));
  }
}
function handleValue(target, handledSet, options) {
  if (isDraft(target) || !isDraftable(target, options) || handledSet.has(target) || Object.isFrozen(target))
    return;
  const isSet = target instanceof Set;
  const setMap = isSet ? /* @__PURE__ */ new Map() : void 0;
  handledSet.add(target);
  forEach(target, (key, value) => {
    var _a;
    if (isDraft(value)) {
      const proxyDraft = getProxyDraft(value);
      ensureShallowCopy(proxyDraft);
      const updatedValue = ((_a = proxyDraft.assignedMap) === null || _a === void 0 ? void 0 : _a.size) || proxyDraft.operated ? proxyDraft.copy : proxyDraft.original;
      set(isSet ? setMap : target, key, updatedValue);
    } else {
      handleValue(value, handledSet, options);
    }
  });
  if (setMap) {
    const set2 = target;
    const values = Array.from(set2);
    set2.clear();
    values.forEach((value) => {
      set2.add(setMap.has(value) ? setMap.get(value) : value);
    });
  }
}
function finalizeAssigned(proxyDraft, key) {
  const copy = proxyDraft.type === 3 ? proxyDraft.setMap : proxyDraft.copy;
  if (proxyDraft.finalities.revoke.length > 1 && proxyDraft.assignedMap.get(key) && copy) {
    handleValue(get(copy, key), proxyDraft.finalities.handledSet, proxyDraft.options);
  }
}
function finalizeSetValue(target) {
  if (target.type === 3 && target.copy) {
    target.copy.clear();
    target.setMap.forEach((value) => {
      target.copy.add(getValue(value));
    });
  }
}
function finalizePatches(target, generatePatches2, patches, inversePatches) {
  const shouldFinalize = target.operated && target.assignedMap && target.assignedMap.size > 0 && !target.finalized;
  if (shouldFinalize) {
    if (patches && inversePatches) {
      const basePath = getPath2(target);
      if (basePath) {
        generatePatches2(target, basePath, patches, inversePatches);
      }
    }
    target.finalized = true;
  }
}
function markFinalization(target, key, value, generatePatches2) {
  const proxyDraft = getProxyDraft(value);
  if (proxyDraft) {
    if (!proxyDraft.callbacks) {
      proxyDraft.callbacks = [];
    }
    proxyDraft.callbacks.push((patches, inversePatches) => {
      var _a;
      const copy = target.type === 3 ? target.setMap : target.copy;
      if (isEqual(get(copy, key), value)) {
        let updatedValue = proxyDraft.original;
        if (proxyDraft.copy) {
          updatedValue = proxyDraft.copy;
        }
        finalizeSetValue(target);
        finalizePatches(target, generatePatches2, patches, inversePatches);
        if (target.options.enableAutoFreeze) {
          target.options.updatedValues = (_a = target.options.updatedValues) !== null && _a !== void 0 ? _a : /* @__PURE__ */ new WeakMap();
          target.options.updatedValues.set(updatedValue, proxyDraft.original);
        }
        set(copy, key, updatedValue);
      }
    });
    if (target.options.enableAutoFreeze) {
      if (proxyDraft.finalities !== target.finalities) {
        target.options.enableAutoFreeze = false;
      }
    }
  }
  if (isDraftable(value, target.options)) {
    target.finalities.draft.push(() => {
      const copy = target.type === 3 ? target.setMap : target.copy;
      if (isEqual(get(copy, key), value)) {
        finalizeAssigned(target, key);
      }
    });
  }
}
function generateArrayPatches(proxyState, basePath, patches, inversePatches, pathAsArray) {
  let { original, assignedMap, options } = proxyState;
  let copy = proxyState.copy;
  if (copy.length < original.length) {
    [original, copy] = [copy, original];
    [patches, inversePatches] = [inversePatches, patches];
  }
  for (let index = 0; index < original.length; index += 1) {
    if (assignedMap.get(index.toString()) && copy[index] !== original[index]) {
      const _path = basePath.concat([index]);
      const path = escapePath(_path, pathAsArray);
      patches.push({
        op: Operation.Replace,
        path,
        // If it is a draft, it needs to be deep cloned, and it may also be non-draft.
        value: cloneIfNeeded(copy[index])
      });
      inversePatches.push({
        op: Operation.Replace,
        path,
        // If it is a draft, it needs to be deep cloned, and it may also be non-draft.
        value: cloneIfNeeded(original[index])
      });
    }
  }
  for (let index = original.length; index < copy.length; index += 1) {
    const _path = basePath.concat([index]);
    const path = escapePath(_path, pathAsArray);
    patches.push({
      op: Operation.Add,
      path,
      // If it is a draft, it needs to be deep cloned, and it may also be non-draft.
      value: cloneIfNeeded(copy[index])
    });
  }
  if (original.length < copy.length) {
    const { arrayLengthAssignment = true } = options.enablePatches;
    if (arrayLengthAssignment) {
      const _path = basePath.concat(["length"]);
      const path = escapePath(_path, pathAsArray);
      inversePatches.push({
        op: Operation.Replace,
        path,
        value: original.length
      });
    } else {
      for (let index = copy.length; original.length < index; index -= 1) {
        const _path = basePath.concat([index - 1]);
        const path = escapePath(_path, pathAsArray);
        inversePatches.push({
          op: Operation.Remove,
          path
        });
      }
    }
  }
}
function generatePatchesFromAssigned({ original, copy, assignedMap }, basePath, patches, inversePatches, pathAsArray) {
  assignedMap.forEach((assignedValue, key) => {
    const originalValue = get(original, key);
    const value = cloneIfNeeded(get(copy, key));
    const op = !assignedValue ? Operation.Remove : has(original, key) ? Operation.Replace : Operation.Add;
    if (isEqual(originalValue, value) && op === Operation.Replace)
      return;
    const _path = basePath.concat(key);
    const path = escapePath(_path, pathAsArray);
    patches.push(op === Operation.Remove ? { op, path } : { op, path, value });
    inversePatches.push(op === Operation.Add ? { op: Operation.Remove, path } : op === Operation.Remove ? { op: Operation.Add, path, value: originalValue } : { op: Operation.Replace, path, value: originalValue });
  });
}
function generateSetPatches({ original, copy }, basePath, patches, inversePatches, pathAsArray) {
  let index = 0;
  original.forEach((value) => {
    if (!copy.has(value)) {
      const _path = basePath.concat([index]);
      const path = escapePath(_path, pathAsArray);
      patches.push({
        op: Operation.Remove,
        path,
        value
      });
      inversePatches.unshift({
        op: Operation.Add,
        path,
        value
      });
    }
    index += 1;
  });
  index = 0;
  copy.forEach((value) => {
    if (!original.has(value)) {
      const _path = basePath.concat([index]);
      const path = escapePath(_path, pathAsArray);
      patches.push({
        op: Operation.Add,
        path,
        value
      });
      inversePatches.unshift({
        op: Operation.Remove,
        path,
        value
      });
    }
    index += 1;
  });
}
function generatePatches(proxyState, basePath, patches, inversePatches) {
  const { pathAsArray = true } = proxyState.options.enablePatches;
  switch (proxyState.type) {
    case 0:
    case 2:
      return generatePatchesFromAssigned(proxyState, basePath, patches, inversePatches, pathAsArray);
    case 1:
      return generateArrayPatches(proxyState, basePath, patches, inversePatches, pathAsArray);
    case 3:
      return generateSetPatches(proxyState, basePath, patches, inversePatches, pathAsArray);
  }
}
function createDraft(createDraftOptions) {
  const { original, parentDraft, key, finalities, options } = createDraftOptions;
  const type = getType(original);
  const proxyDraft = {
    type,
    finalized: false,
    parent: parentDraft,
    original,
    copy: null,
    proxy: null,
    finalities,
    options,
    // Mapping of draft Set items to their corresponding draft values.
    setMap: type === 3 ? new Map(original.entries()) : void 0
  };
  if (key || "key" in createDraftOptions) {
    proxyDraft.key = key;
  }
  const { proxy, revoke } = Proxy.revocable(type === 1 ? Object.assign([], proxyDraft) : proxyDraft, proxyHandler);
  finalities.revoke.push(revoke);
  proxyDraft.proxy = proxy;
  if (parentDraft) {
    const target = parentDraft;
    target.finalities.draft.push((patches, inversePatches) => {
      var _a, _b;
      const oldProxyDraft = getProxyDraft(proxy);
      let copy = target.type === 3 ? target.setMap : target.copy;
      const draft = get(copy, key);
      const proxyDraft2 = getProxyDraft(draft);
      if (proxyDraft2) {
        let updatedValue = proxyDraft2.original;
        if (proxyDraft2.operated) {
          updatedValue = getValue(draft);
        }
        finalizeSetValue(proxyDraft2);
        finalizePatches(proxyDraft2, generatePatches, patches, inversePatches);
        if (target.options.enableAutoFreeze) {
          target.options.updatedValues = (_a = target.options.updatedValues) !== null && _a !== void 0 ? _a : /* @__PURE__ */ new WeakMap();
          target.options.updatedValues.set(updatedValue, proxyDraft2.original);
        }
        set(copy, key, updatedValue);
      }
      (_b = oldProxyDraft.callbacks) === null || _b === void 0 ? void 0 : _b.forEach((callback) => {
        callback(patches, inversePatches);
      });
    });
  } else {
    const target = getProxyDraft(proxy);
    target.finalities.draft.push((patches, inversePatches) => {
      finalizeSetValue(target);
      finalizePatches(target, generatePatches, patches, inversePatches);
    });
  }
  return proxy;
}
function finalizeDraft(result, returnedValue, patches, inversePatches, enableAutoFreeze) {
  var _a;
  const proxyDraft = getProxyDraft(result);
  const original = (_a = proxyDraft === null || proxyDraft === void 0 ? void 0 : proxyDraft.original) !== null && _a !== void 0 ? _a : result;
  const hasReturnedValue = !!returnedValue.length;
  if (proxyDraft === null || proxyDraft === void 0 ? void 0 : proxyDraft.operated) {
    while (proxyDraft.finalities.draft.length > 0) {
      const finalize = proxyDraft.finalities.draft.pop();
      finalize(patches, inversePatches);
    }
  }
  const state = hasReturnedValue ? returnedValue[0] : proxyDraft ? proxyDraft.operated ? proxyDraft.copy : proxyDraft.original : result;
  if (proxyDraft)
    revokeProxy(proxyDraft);
  if (enableAutoFreeze) {
    deepFreeze(state, state, proxyDraft === null || proxyDraft === void 0 ? void 0 : proxyDraft.options.updatedValues);
  }
  return [
    state,
    patches && hasReturnedValue ? [{ op: Operation.Replace, path: [], value: returnedValue[0] }] : patches,
    inversePatches && hasReturnedValue ? [{ op: Operation.Replace, path: [], value: original }] : inversePatches
  ];
}
function draftify(baseState, options) {
  var _a;
  const finalities = {
    draft: [],
    revoke: [],
    handledSet: /* @__PURE__ */ new WeakSet(),
    draftsCache: /* @__PURE__ */ new WeakSet()
  };
  let patches;
  let inversePatches;
  if (options.enablePatches) {
    patches = [];
    inversePatches = [];
  }
  const isMutable = ((_a = options.mark) === null || _a === void 0 ? void 0 : _a.call(options, baseState, dataTypes)) === dataTypes.mutable || !isDraftable(baseState, options);
  const draft = isMutable ? baseState : createDraft({
    original: baseState,
    parentDraft: null,
    finalities,
    options
  });
  return [
    draft,
    (returnedValue = []) => {
      const [finalizedState, finalizedPatches, finalizedInversePatches] = finalizeDraft(draft, returnedValue, patches, inversePatches, options.enableAutoFreeze);
      return options.enablePatches ? [finalizedState, finalizedPatches, finalizedInversePatches] : finalizedState;
    }
  ];
}
function handleReturnValue(options) {
  const { rootDraft, value, useRawReturn = false, isRoot = true } = options;
  forEach(value, (key, item, source) => {
    const proxyDraft = getProxyDraft(item);
    if (proxyDraft && rootDraft && proxyDraft.finalities === rootDraft.finalities) {
      options.isContainDraft = true;
      const currentValue = proxyDraft.original;
      if (source instanceof Set) {
        const arr = Array.from(source);
        source.clear();
        arr.forEach((_item) => source.add(key === _item ? currentValue : _item));
      } else {
        set(source, key, currentValue);
      }
    } else if (typeof item === "object" && item !== null) {
      options.value = item;
      options.isRoot = false;
      handleReturnValue(options);
    }
  });
  if (isRoot) {
    if (!options.isContainDraft)
      console.warn(`The return value does not contain any draft, please use 'rawReturn()' to wrap the return value to improve performance.`);
    if (useRawReturn) {
      console.warn(`The return value contains drafts, please don't use 'rawReturn()' to wrap the return value.`);
    }
  }
}
function getCurrent(target) {
  var _a;
  const proxyDraft = getProxyDraft(target);
  if (!isDraftable(target, proxyDraft === null || proxyDraft === void 0 ? void 0 : proxyDraft.options))
    return target;
  const type = getType(target);
  if (proxyDraft && !proxyDraft.operated)
    return proxyDraft.original;
  let currentValue;
  function ensureShallowCopy2() {
    currentValue = type === 2 ? !isBaseMapInstance(target) ? new (Object.getPrototypeOf(target)).constructor(target) : new Map(target) : type === 3 ? Array.from(proxyDraft.setMap.values()) : shallowCopy(target, proxyDraft === null || proxyDraft === void 0 ? void 0 : proxyDraft.options);
  }
  __name(ensureShallowCopy2, "ensureShallowCopy");
  if (proxyDraft) {
    proxyDraft.finalized = true;
    try {
      ensureShallowCopy2();
    } finally {
      proxyDraft.finalized = false;
    }
  } else {
    currentValue = target;
  }
  forEach(currentValue, (key, value) => {
    if (proxyDraft && isEqual(get(proxyDraft.original, key), value))
      return;
    const newValue = getCurrent(value);
    if (newValue !== value) {
      if (currentValue === target)
        ensureShallowCopy2();
      set(currentValue, key, newValue);
    }
  });
  if (type === 3) {
    const value = (_a = proxyDraft === null || proxyDraft === void 0 ? void 0 : proxyDraft.original) !== null && _a !== void 0 ? _a : currentValue;
    return !isBaseSetInstance(value) ? new (Object.getPrototypeOf(value)).constructor(currentValue) : new Set(currentValue);
  }
  return currentValue;
}
function current(target) {
  if (!isDraft(target)) {
    throw new Error(`current() is only used for Draft, parameter: ${target}`);
  }
  return getCurrent(target);
}
var Operation, PROXY_DRAFT, RAW_RETURN_SYMBOL, iteratorSymbol, dataTypes, internal, propIsEnum, readable, checkReadable, mapHandler, mapHandlerKeys, getNextIterator, setHandler, setHandlerKeys, proxyHandler, makeCreator, create, constructorString;
var init_mutative_esm = __esm({
  "node_modules/mutative/dist/mutative.esm.mjs"() {
    Operation = {
      Remove: "remove",
      Replace: "replace",
      Add: "add"
    };
    PROXY_DRAFT = Symbol.for("__MUTATIVE_PROXY_DRAFT__");
    RAW_RETURN_SYMBOL = Symbol("__MUTATIVE_RAW_RETURN_SYMBOL__");
    iteratorSymbol = Symbol.iterator;
    dataTypes = {
      mutable: "mutable",
      immutable: "immutable"
    };
    internal = {};
    __name(has, "has");
    __name(getDescriptor, "getDescriptor");
    __name(isBaseSetInstance, "isBaseSetInstance");
    __name(isBaseMapInstance, "isBaseMapInstance");
    __name(latest, "latest");
    __name(isDraft, "isDraft");
    __name(getProxyDraft, "getProxyDraft");
    __name(getValue, "getValue");
    __name(isDraftable, "isDraftable");
    __name(getPath2, "getPath");
    __name(getType, "getType");
    __name(get, "get");
    __name(set, "set");
    __name(peek, "peek");
    __name(isEqual, "isEqual");
    __name(revokeProxy, "revokeProxy");
    __name(escapePath, "escapePath");
    __name(resolvePath, "resolvePath");
    __name(strictCopy, "strictCopy");
    propIsEnum = Object.prototype.propertyIsEnumerable;
    __name(shallowCopy, "shallowCopy");
    __name(ensureShallowCopy, "ensureShallowCopy");
    __name(deepClone, "deepClone");
    __name(cloneIfNeeded, "cloneIfNeeded");
    __name(markChanged, "markChanged");
    __name(throwFrozenError, "throwFrozenError");
    __name(deepFreeze, "deepFreeze");
    __name(forEach, "forEach");
    __name(handleValue, "handleValue");
    __name(finalizeAssigned, "finalizeAssigned");
    __name(finalizeSetValue, "finalizeSetValue");
    __name(finalizePatches, "finalizePatches");
    __name(markFinalization, "markFinalization");
    __name(generateArrayPatches, "generateArrayPatches");
    __name(generatePatchesFromAssigned, "generatePatchesFromAssigned");
    __name(generateSetPatches, "generateSetPatches");
    __name(generatePatches, "generatePatches");
    readable = false;
    checkReadable = /* @__PURE__ */ __name((value, options, ignoreCheckDraftable = false) => {
      if (typeof value === "object" && value !== null && (!isDraftable(value, options) || ignoreCheckDraftable) && !readable) {
        throw new Error(`Strict mode: Mutable data cannot be accessed directly, please use 'unsafe(callback)' wrap.`);
      }
    }, "checkReadable");
    mapHandler = {
      get size() {
        const current2 = latest(getProxyDraft(this));
        return current2.size;
      },
      has(key) {
        return latest(getProxyDraft(this)).has(key);
      },
      set(key, value) {
        const target = getProxyDraft(this);
        const source = latest(target);
        if (!source.has(key) || !isEqual(source.get(key), value)) {
          ensureShallowCopy(target);
          markChanged(target);
          target.assignedMap.set(key, true);
          target.copy.set(key, value);
          markFinalization(target, key, value, generatePatches);
        }
        return this;
      },
      delete(key) {
        if (!this.has(key)) {
          return false;
        }
        const target = getProxyDraft(this);
        ensureShallowCopy(target);
        markChanged(target);
        if (target.original.has(key)) {
          target.assignedMap.set(key, false);
        } else {
          target.assignedMap.delete(key);
        }
        target.copy.delete(key);
        return true;
      },
      clear() {
        const target = getProxyDraft(this);
        if (!this.size)
          return;
        ensureShallowCopy(target);
        markChanged(target);
        target.assignedMap = /* @__PURE__ */ new Map();
        for (const [key] of target.original) {
          target.assignedMap.set(key, false);
        }
        target.copy.clear();
      },
      forEach(callback, thisArg) {
        const target = getProxyDraft(this);
        latest(target).forEach((_value, _key) => {
          callback.call(thisArg, this.get(_key), _key, this);
        });
      },
      get(key) {
        var _a, _b;
        const target = getProxyDraft(this);
        const value = latest(target).get(key);
        const mutable = ((_b = (_a = target.options).mark) === null || _b === void 0 ? void 0 : _b.call(_a, value, dataTypes)) === dataTypes.mutable;
        if (target.options.strict) {
          checkReadable(value, target.options, mutable);
        }
        if (mutable) {
          return value;
        }
        if (target.finalized || !isDraftable(value, target.options)) {
          return value;
        }
        if (value !== target.original.get(key)) {
          return value;
        }
        const draft = internal.createDraft({
          original: value,
          parentDraft: target,
          key,
          finalities: target.finalities,
          options: target.options
        });
        ensureShallowCopy(target);
        target.copy.set(key, draft);
        return draft;
      },
      keys() {
        return latest(getProxyDraft(this)).keys();
      },
      values() {
        const iterator = this.keys();
        return {
          [iteratorSymbol]: () => this.values(),
          next: /* @__PURE__ */ __name(() => {
            const result = iterator.next();
            if (result.done)
              return result;
            const value = this.get(result.value);
            return {
              done: false,
              value
            };
          }, "next")
        };
      },
      entries() {
        const iterator = this.keys();
        return {
          [iteratorSymbol]: () => this.entries(),
          next: /* @__PURE__ */ __name(() => {
            const result = iterator.next();
            if (result.done)
              return result;
            const value = this.get(result.value);
            return {
              done: false,
              value: [result.value, value]
            };
          }, "next")
        };
      },
      [iteratorSymbol]() {
        return this.entries();
      }
    };
    mapHandlerKeys = Reflect.ownKeys(mapHandler);
    getNextIterator = /* @__PURE__ */ __name((target, iterator, { isValuesIterator }) => () => {
      var _a, _b;
      const result = iterator.next();
      if (result.done)
        return result;
      const key = result.value;
      let value = target.setMap.get(key);
      const currentDraft = getProxyDraft(value);
      const mutable = ((_b = (_a = target.options).mark) === null || _b === void 0 ? void 0 : _b.call(_a, value, dataTypes)) === dataTypes.mutable;
      if (target.options.strict) {
        checkReadable(key, target.options, mutable);
      }
      if (!mutable && !currentDraft && isDraftable(key, target.options) && !target.finalized && target.original.has(key)) {
        const proxy = internal.createDraft({
          original: key,
          parentDraft: target,
          key,
          finalities: target.finalities,
          options: target.options
        });
        target.setMap.set(key, proxy);
        value = proxy;
      } else if (currentDraft) {
        value = currentDraft.proxy;
      }
      return {
        done: false,
        value: isValuesIterator ? value : [value, value]
      };
    }, "getNextIterator");
    setHandler = {
      get size() {
        const target = getProxyDraft(this);
        return target.setMap.size;
      },
      has(value) {
        const target = getProxyDraft(this);
        if (target.setMap.has(value))
          return true;
        ensureShallowCopy(target);
        const valueProxyDraft = getProxyDraft(value);
        if (valueProxyDraft && target.setMap.has(valueProxyDraft.original))
          return true;
        return false;
      },
      add(value) {
        const target = getProxyDraft(this);
        if (!this.has(value)) {
          ensureShallowCopy(target);
          markChanged(target);
          target.assignedMap.set(value, true);
          target.setMap.set(value, value);
          markFinalization(target, value, value, generatePatches);
        }
        return this;
      },
      delete(value) {
        if (!this.has(value)) {
          return false;
        }
        const target = getProxyDraft(this);
        ensureShallowCopy(target);
        markChanged(target);
        const valueProxyDraft = getProxyDraft(value);
        if (valueProxyDraft && target.setMap.has(valueProxyDraft.original)) {
          target.assignedMap.set(valueProxyDraft.original, false);
          return target.setMap.delete(valueProxyDraft.original);
        }
        if (!valueProxyDraft && target.setMap.has(value)) {
          target.assignedMap.set(value, false);
        } else {
          target.assignedMap.delete(value);
        }
        return target.setMap.delete(value);
      },
      clear() {
        if (!this.size)
          return;
        const target = getProxyDraft(this);
        ensureShallowCopy(target);
        markChanged(target);
        for (const value of target.original) {
          target.assignedMap.set(value, false);
        }
        target.setMap.clear();
      },
      values() {
        const target = getProxyDraft(this);
        ensureShallowCopy(target);
        const iterator = target.setMap.keys();
        return {
          [Symbol.iterator]: () => this.values(),
          next: getNextIterator(target, iterator, { isValuesIterator: true })
        };
      },
      entries() {
        const target = getProxyDraft(this);
        ensureShallowCopy(target);
        const iterator = target.setMap.keys();
        return {
          [Symbol.iterator]: () => this.entries(),
          next: getNextIterator(target, iterator, {
            isValuesIterator: false
          })
        };
      },
      keys() {
        return this.values();
      },
      [iteratorSymbol]() {
        return this.values();
      },
      forEach(callback, thisArg) {
        const iterator = this.values();
        let result = iterator.next();
        while (!result.done) {
          callback.call(thisArg, result.value, result.value, this);
          result = iterator.next();
        }
      }
    };
    if (Set.prototype.difference) {
      Object.assign(setHandler, {
        intersection(other) {
          return Set.prototype.intersection.call(new Set(this.values()), other);
        },
        union(other) {
          return Set.prototype.union.call(new Set(this.values()), other);
        },
        difference(other) {
          return Set.prototype.difference.call(new Set(this.values()), other);
        },
        symmetricDifference(other) {
          return Set.prototype.symmetricDifference.call(new Set(this.values()), other);
        },
        isSubsetOf(other) {
          return Set.prototype.isSubsetOf.call(new Set(this.values()), other);
        },
        isSupersetOf(other) {
          return Set.prototype.isSupersetOf.call(new Set(this.values()), other);
        },
        isDisjointFrom(other) {
          return Set.prototype.isDisjointFrom.call(new Set(this.values()), other);
        }
      });
    }
    setHandlerKeys = Reflect.ownKeys(setHandler);
    proxyHandler = {
      get(target, key, receiver) {
        var _a, _b;
        const copy = (_a = target.copy) === null || _a === void 0 ? void 0 : _a[key];
        if (copy && target.finalities.draftsCache.has(copy)) {
          return copy;
        }
        if (key === PROXY_DRAFT)
          return target;
        let markResult;
        if (target.options.mark) {
          const value2 = key === "size" && (target.original instanceof Map || target.original instanceof Set) ? Reflect.get(target.original, key) : Reflect.get(target.original, key, receiver);
          markResult = target.options.mark(value2, dataTypes);
          if (markResult === dataTypes.mutable) {
            if (target.options.strict) {
              checkReadable(value2, target.options, true);
            }
            return value2;
          }
        }
        const source = latest(target);
        if (source instanceof Map && mapHandlerKeys.includes(key)) {
          if (key === "size") {
            return Object.getOwnPropertyDescriptor(mapHandler, "size").get.call(target.proxy);
          }
          const handle = mapHandler[key];
          return handle.bind(target.proxy);
        }
        if (source instanceof Set && setHandlerKeys.includes(key)) {
          if (key === "size") {
            return Object.getOwnPropertyDescriptor(setHandler, "size").get.call(target.proxy);
          }
          const handle = setHandler[key];
          return handle.bind(target.proxy);
        }
        if (!has(source, key)) {
          const desc = getDescriptor(source, key);
          return desc ? `value` in desc ? desc.value : (
            // !case: support for getter
            (_b = desc.get) === null || _b === void 0 ? void 0 : _b.call(target.proxy)
          ) : void 0;
        }
        const value = source[key];
        if (target.options.strict) {
          checkReadable(value, target.options);
        }
        if (target.finalized || !isDraftable(value, target.options)) {
          return value;
        }
        if (value === peek(target.original, key)) {
          ensureShallowCopy(target);
          target.copy[key] = createDraft({
            original: target.original[key],
            parentDraft: target,
            key: target.type === 1 ? Number(key) : key,
            finalities: target.finalities,
            options: target.options
          });
          if (typeof markResult === "function") {
            const subProxyDraft = getProxyDraft(target.copy[key]);
            ensureShallowCopy(subProxyDraft);
            markChanged(subProxyDraft);
            return subProxyDraft.copy;
          }
          return target.copy[key];
        }
        if (isDraft(value)) {
          target.finalities.draftsCache.add(value);
        }
        return value;
      },
      set(target, key, value) {
        var _a;
        if (target.type === 3 || target.type === 2) {
          throw new Error(`Map/Set draft does not support any property assignment.`);
        }
        let _key;
        if (target.type === 1 && key !== "length" && !(Number.isInteger(_key = Number(key)) && _key >= 0 && (key === 0 || _key === 0 || String(_key) === String(key)))) {
          throw new Error(`Only supports setting array indices and the 'length' property.`);
        }
        const desc = getDescriptor(latest(target), key);
        if (desc === null || desc === void 0 ? void 0 : desc.set) {
          desc.set.call(target.proxy, value);
          return true;
        }
        const current2 = peek(latest(target), key);
        const currentProxyDraft = getProxyDraft(current2);
        if (currentProxyDraft && isEqual(currentProxyDraft.original, value)) {
          target.copy[key] = value;
          target.assignedMap = (_a = target.assignedMap) !== null && _a !== void 0 ? _a : /* @__PURE__ */ new Map();
          target.assignedMap.set(key, false);
          return true;
        }
        if (isEqual(value, current2) && (value !== void 0 || has(target.original, key)))
          return true;
        ensureShallowCopy(target);
        markChanged(target);
        if (has(target.original, key) && isEqual(value, target.original[key])) {
          target.assignedMap.delete(key);
        } else {
          target.assignedMap.set(key, true);
        }
        target.copy[key] = value;
        markFinalization(target, key, value, generatePatches);
        return true;
      },
      has(target, key) {
        return key in latest(target);
      },
      ownKeys(target) {
        return Reflect.ownKeys(latest(target));
      },
      getOwnPropertyDescriptor(target, key) {
        const source = latest(target);
        const descriptor = Reflect.getOwnPropertyDescriptor(source, key);
        if (!descriptor)
          return descriptor;
        return {
          writable: true,
          configurable: target.type !== 1 || key !== "length",
          enumerable: descriptor.enumerable,
          value: source[key]
        };
      },
      getPrototypeOf(target) {
        return Reflect.getPrototypeOf(target.original);
      },
      setPrototypeOf() {
        throw new Error(`Cannot call 'setPrototypeOf()' on drafts`);
      },
      defineProperty() {
        throw new Error(`Cannot call 'defineProperty()' on drafts`);
      },
      deleteProperty(target, key) {
        var _a;
        if (target.type === 1) {
          return proxyHandler.set.call(this, target, key, void 0, target.proxy);
        }
        if (peek(target.original, key) !== void 0 || key in target.original) {
          ensureShallowCopy(target);
          markChanged(target);
          target.assignedMap.set(key, false);
        } else {
          target.assignedMap = (_a = target.assignedMap) !== null && _a !== void 0 ? _a : /* @__PURE__ */ new Map();
          target.assignedMap.delete(key);
        }
        if (target.copy)
          delete target.copy[key];
        return true;
      }
    };
    __name(createDraft, "createDraft");
    internal.createDraft = createDraft;
    __name(finalizeDraft, "finalizeDraft");
    __name(draftify, "draftify");
    __name(handleReturnValue, "handleReturnValue");
    __name(getCurrent, "getCurrent");
    __name(current, "current");
    makeCreator = /* @__PURE__ */ __name((arg) => {
      if (arg !== void 0 && Object.prototype.toString.call(arg) !== "[object Object]") {
        throw new Error(`Invalid options: ${String(arg)}, 'options' should be an object.`);
      }
      return /* @__PURE__ */ __name(function create2(arg0, arg1, arg2) {
        var _a, _b, _c;
        if (typeof arg0 === "function" && typeof arg1 !== "function") {
          return function(base2, ...args) {
            return create2(base2, (draft2) => arg0.call(this, draft2, ...args), arg1);
          };
        }
        const base = arg0;
        const mutate = arg1;
        let options = arg2;
        if (typeof arg1 !== "function") {
          options = arg1;
        }
        if (options !== void 0 && Object.prototype.toString.call(options) !== "[object Object]") {
          throw new Error(`Invalid options: ${options}, 'options' should be an object.`);
        }
        options = Object.assign(Object.assign({}, arg), options);
        const state = isDraft(base) ? current(base) : base;
        const mark = Array.isArray(options.mark) ? (value, types) => {
          for (const mark2 of options.mark) {
            if (typeof mark2 !== "function") {
              throw new Error(`Invalid mark: ${mark2}, 'mark' should be a function.`);
            }
            const result2 = mark2(value, types);
            if (result2) {
              return result2;
            }
          }
          return;
        } : options.mark;
        const enablePatches = (_a = options.enablePatches) !== null && _a !== void 0 ? _a : false;
        const strict = (_b = options.strict) !== null && _b !== void 0 ? _b : false;
        const enableAutoFreeze = (_c = options.enableAutoFreeze) !== null && _c !== void 0 ? _c : false;
        const _options = {
          enableAutoFreeze,
          mark,
          strict,
          enablePatches
        };
        if (!isDraftable(state, _options) && typeof state === "object" && state !== null) {
          throw new Error(`Invalid base state: create() only supports plain objects, arrays, Set, Map or using mark() to mark the state as immutable.`);
        }
        const [draft, finalize] = draftify(state, _options);
        if (typeof arg1 !== "function") {
          if (!isDraftable(state, _options)) {
            throw new Error(`Invalid base state: create() only supports plain objects, arrays, Set, Map or using mark() to mark the state as immutable.`);
          }
          return [draft, finalize];
        }
        let result;
        try {
          result = mutate(draft);
        } catch (error) {
          revokeProxy(getProxyDraft(draft));
          throw error;
        }
        const returnValue = /* @__PURE__ */ __name((value) => {
          const proxyDraft = getProxyDraft(draft);
          if (!isDraft(value)) {
            if (value !== void 0 && !isEqual(value, draft) && (proxyDraft === null || proxyDraft === void 0 ? void 0 : proxyDraft.operated)) {
              throw new Error(`Either the value is returned as a new non-draft value, or only the draft is modified without returning any value.`);
            }
            const rawReturnValue = value === null || value === void 0 ? void 0 : value[RAW_RETURN_SYMBOL];
            if (rawReturnValue) {
              const _value = rawReturnValue[0];
              if (_options.strict && typeof value === "object" && value !== null) {
                handleReturnValue({
                  rootDraft: proxyDraft,
                  value,
                  useRawReturn: true
                });
              }
              return finalize([_value]);
            }
            if (value !== void 0) {
              if (typeof value === "object" && value !== null) {
                handleReturnValue({ rootDraft: proxyDraft, value });
              }
              return finalize([value]);
            }
          }
          if (value === draft || value === void 0) {
            return finalize([]);
          }
          const returnedProxyDraft = getProxyDraft(value);
          if (_options === returnedProxyDraft.options) {
            if (returnedProxyDraft.operated) {
              throw new Error(`Cannot return a modified child draft.`);
            }
            return finalize([current(value)]);
          }
          return finalize([value]);
        }, "returnValue");
        if (result instanceof Promise) {
          return result.then(returnValue, (error) => {
            revokeProxy(getProxyDraft(draft));
            throw error;
          });
        }
        return returnValue(result);
      }, "create");
    }, "makeCreator");
    create = makeCreator();
    constructorString = Object.prototype.constructor.toString();
  }
});

// node_modules/@instantdb/core/dist/esm/utils/object.js
var init_object = __esm({
  "node_modules/@instantdb/core/dist/esm/utils/object.js"() {
  }
});

// node_modules/@instantdb/core/dist/esm/utils/pgtime.js
var init_pgtime = __esm({
  "node_modules/@instantdb/core/dist/esm/utils/pgtime.js"() {
  }
});

// node_modules/@instantdb/core/dist/esm/utils/dates.js
var init_dates = __esm({
  "node_modules/@instantdb/core/dist/esm/utils/dates.js"() {
    init_pgtime();
  }
});

// node_modules/@instantdb/core/dist/esm/store.js
var init_store = __esm({
  "node_modules/@instantdb/core/dist/esm/store.js"() {
    init_mutative_esm();
    init_object();
    init_dates();
  }
});

// node_modules/@instantdb/core/dist/esm/datalog.js
var init_datalog = __esm({
  "node_modules/@instantdb/core/dist/esm/datalog.js"() {
    init_store();
  }
});

// node_modules/@instantdb/core/node_modules/uuid/dist/esm-browser/regex.js
var regex_default2;
var init_regex2 = __esm({
  "node_modules/@instantdb/core/node_modules/uuid/dist/esm-browser/regex.js"() {
    regex_default2 = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;
  }
});

// node_modules/@instantdb/core/node_modules/uuid/dist/esm-browser/validate.js
function validate2(uuid) {
  return typeof uuid === "string" && regex_default2.test(uuid);
}
var validate_default2;
var init_validate2 = __esm({
  "node_modules/@instantdb/core/node_modules/uuid/dist/esm-browser/validate.js"() {
    init_regex2();
    __name(validate2, "validate");
    validate_default2 = validate2;
  }
});

// node_modules/@instantdb/core/node_modules/uuid/dist/esm-browser/stringify.js
function unsafeStringify2(arr, offset = 0) {
  return (byteToHex2[arr[offset + 0]] + byteToHex2[arr[offset + 1]] + byteToHex2[arr[offset + 2]] + byteToHex2[arr[offset + 3]] + "-" + byteToHex2[arr[offset + 4]] + byteToHex2[arr[offset + 5]] + "-" + byteToHex2[arr[offset + 6]] + byteToHex2[arr[offset + 7]] + "-" + byteToHex2[arr[offset + 8]] + byteToHex2[arr[offset + 9]] + "-" + byteToHex2[arr[offset + 10]] + byteToHex2[arr[offset + 11]] + byteToHex2[arr[offset + 12]] + byteToHex2[arr[offset + 13]] + byteToHex2[arr[offset + 14]] + byteToHex2[arr[offset + 15]]).toLowerCase();
}
var byteToHex2;
var init_stringify = __esm({
  "node_modules/@instantdb/core/node_modules/uuid/dist/esm-browser/stringify.js"() {
    byteToHex2 = [];
    for (let i2 = 0; i2 < 256; ++i2) {
      byteToHex2.push((i2 + 256).toString(16).slice(1));
    }
    __name(unsafeStringify2, "unsafeStringify");
  }
});

// node_modules/@instantdb/core/node_modules/uuid/dist/esm-browser/rng.js
function rng2() {
  if (!getRandomValues2) {
    if (typeof crypto === "undefined" || !crypto.getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
    getRandomValues2 = crypto.getRandomValues.bind(crypto);
  }
  return getRandomValues2(rnds82);
}
var getRandomValues2, rnds82;
var init_rng = __esm({
  "node_modules/@instantdb/core/node_modules/uuid/dist/esm-browser/rng.js"() {
    rnds82 = new Uint8Array(16);
    __name(rng2, "rng");
  }
});

// node_modules/@instantdb/core/node_modules/uuid/dist/esm-browser/native.js
var randomUUID2, native_default2;
var init_native = __esm({
  "node_modules/@instantdb/core/node_modules/uuid/dist/esm-browser/native.js"() {
    randomUUID2 = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
    native_default2 = { randomUUID: randomUUID2 };
  }
});

// node_modules/@instantdb/core/node_modules/uuid/dist/esm-browser/v4.js
function v42(options, buf, offset) {
  if (native_default2.randomUUID && !buf && !options) {
    return native_default2.randomUUID();
  }
  options = options || {};
  const rnds = options.random ?? options.rng?.() ?? rng2();
  if (rnds.length < 16) {
    throw new Error("Random bytes length must be >= 16");
  }
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    if (offset < 0 || offset + 16 > buf.length) {
      throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
    }
    for (let i2 = 0; i2 < 16; ++i2) {
      buf[offset + i2] = rnds[i2];
    }
    return buf;
  }
  return unsafeStringify2(rnds);
}
var v4_default2;
var init_v4 = __esm({
  "node_modules/@instantdb/core/node_modules/uuid/dist/esm-browser/v4.js"() {
    init_native();
    init_rng();
    init_stringify();
    __name(v42, "v4");
    v4_default2 = v42;
  }
});

// node_modules/@instantdb/core/node_modules/uuid/dist/esm-browser/index.js
var init_esm_browser2 = __esm({
  "node_modules/@instantdb/core/node_modules/uuid/dist/esm-browser/index.js"() {
    init_v4();
    init_validate2();
  }
});

// node_modules/@instantdb/core/dist/esm/utils/id.js
function id() {
  return v4_default2();
}
var id_default;
var init_id = __esm({
  "node_modules/@instantdb/core/dist/esm/utils/id.js"() {
    init_esm_browser2();
    __name(id, "id");
    id_default = id;
  }
});

// node_modules/@instantdb/core/dist/esm/utils/strings.js
function fallbackCompareStrings(a, b) {
  return a.localeCompare(b);
}
function makeCompareStringsFn() {
  let compareStrings = fallbackCompareStrings;
  if (typeof Intl === "object" && Intl.hasOwnProperty("Collator")) {
    try {
      const collator = Intl.Collator("en-US");
      compareStrings = collator.compare;
    } catch (_e) {
    }
  }
  return compareStrings;
}
var stringCompare;
var init_strings = __esm({
  "node_modules/@instantdb/core/dist/esm/utils/strings.js"() {
    __name(fallbackCompareStrings, "fallbackCompareStrings");
    __name(makeCompareStringsFn, "makeCompareStringsFn");
    stringCompare = makeCompareStringsFn();
  }
});

// node_modules/@instantdb/core/dist/esm/warningToggle.js
var init_warningToggle = __esm({
  "node_modules/@instantdb/core/dist/esm/warningToggle.js"() {
  }
});

// node_modules/@instantdb/core/dist/esm/instaql.js
var init_instaql = __esm({
  "node_modules/@instantdb/core/dist/esm/instaql.js"() {
    init_datalog();
    init_id();
    init_strings();
    init_store();
    init_warningToggle();
  }
});

// node_modules/@instantdb/core/dist/esm/instatx.js
function getAllTransactionChunkKeys() {
  const v = 1;
  const _dummy = {
    __etype: v,
    __ops: v,
    create: v,
    update: v,
    link: v,
    unlink: v,
    delete: v,
    merge: v,
    ruleParams: v
  };
  return new Set(Object.keys(_dummy));
}
function transactionChunk(etype, id2, prevOps) {
  const target = {
    __etype: etype,
    __ops: prevOps
  };
  return new Proxy(target, {
    get: /* @__PURE__ */ __name((_target, cmd) => {
      if (cmd === "__ops")
        return prevOps;
      if (cmd === "__etype")
        return etype;
      if (!allTransactionChunkKeys.has(cmd)) {
        return void 0;
      }
      return (args, opts) => {
        return transactionChunk(etype, id2, [
          ...prevOps,
          opts ? [cmd, etype, id2, args, opts] : [cmd, etype, id2, args]
        ]);
      };
    }, "get")
  });
}
function lookup(attribute, value) {
  return `lookup__${attribute}__${JSON.stringify(value)}`;
}
function isLookup(k) {
  return k.startsWith("lookup__");
}
function parseLookup(k) {
  const [_, attribute, ...vJSON] = k.split("__");
  return [attribute, JSON.parse(vJSON.join("__"))];
}
function etypeChunk(etype) {
  return new Proxy({
    __etype: etype
  }, {
    get(_target, cmd) {
      if (cmd === "lookup") {
        return (attrName, value) => transactionChunk(etype, parseLookup(lookup(attrName, value)), []);
      }
      if (cmd === "__etype")
        return etype;
      const id2 = cmd;
      if (isLookup(id2)) {
        return transactionChunk(etype, parseLookup(id2), []);
      }
      return transactionChunk(etype, id2, []);
    }
  });
}
function txInit() {
  return new Proxy({}, {
    get(_target, ns) {
      return etypeChunk(ns);
    }
  });
}
function getOps(x) {
  return x.__ops;
}
var allTransactionChunkKeys, tx;
var init_instatx = __esm({
  "node_modules/@instantdb/core/dist/esm/instatx.js"() {
    __name(getAllTransactionChunkKeys, "getAllTransactionChunkKeys");
    allTransactionChunkKeys = getAllTransactionChunkKeys();
    __name(transactionChunk, "transactionChunk");
    __name(lookup, "lookup");
    __name(isLookup, "isLookup");
    __name(parseLookup, "parseLookup");
    __name(etypeChunk, "etypeChunk");
    __name(txInit, "txInit");
    tx = txInit();
    __name(getOps, "getOps");
  }
});

// node_modules/@instantdb/core/dist/esm/instaml.js
var lookupProps, refLookupProps;
var init_instaml = __esm({
  "node_modules/@instantdb/core/dist/esm/instaml.js"() {
    init_store();
    init_instatx();
    init_object();
    init_dates();
    init_id();
    lookupProps = { "unique?": true, "index?": true };
    refLookupProps = {
      ...lookupProps,
      cardinality: "one"
    };
  }
});

// node_modules/@instantdb/core/dist/esm/utils/PersistedObject.js
var init_PersistedObject = __esm({
  "node_modules/@instantdb/core/dist/esm/utils/PersistedObject.js"() {
    init_mutative_esm();
  }
});

// node_modules/@instantdb/core/dist/esm/IndexedDBStorage.js
var init_IndexedDBStorage = __esm({
  "node_modules/@instantdb/core/dist/esm/IndexedDBStorage.js"() {
    init_PersistedObject();
  }
});

// node_modules/@instantdb/core/dist/esm/WindowNetworkListener.js
var init_WindowNetworkListener = __esm({
  "node_modules/@instantdb/core/dist/esm/WindowNetworkListener.js"() {
  }
});

// node_modules/@instantdb/core/dist/esm/InstantError.js
var InstantError;
var init_InstantError = __esm({
  "node_modules/@instantdb/core/dist/esm/InstantError.js"() {
    InstantError = class _InstantError extends Error {
      static {
        __name(this, "InstantError");
      }
      hint;
      constructor(message, hint) {
        super(message);
        this.hint = hint;
        const actualProto = new.target.prototype;
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(this, actualProto);
        }
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, _InstantError);
        }
        this.name = "InstantError";
      }
      get [Symbol.toStringTag]() {
        return "InstantError";
      }
    };
  }
});

// node_modules/@instantdb/core/dist/esm/utils/fetch.js
var InstantAPIError;
var init_fetch = __esm({
  "node_modules/@instantdb/core/dist/esm/utils/fetch.js"() {
    init_InstantError();
    InstantAPIError = class _InstantAPIError extends InstantError {
      static {
        __name(this, "InstantAPIError");
      }
      body;
      status;
      constructor(error) {
        const message = error.body?.message || `API Error (${error.status})`;
        super(message, error.body.hint);
        const actualProto = new.target.prototype;
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(this, actualProto);
        }
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, _InstantAPIError);
        }
        this.name = "InstantAPIError";
        this.status = error.status;
        this.body = error.body;
      }
      get [Symbol.toStringTag]() {
        return "InstantAPIError";
      }
    };
  }
});

// node_modules/@instantdb/core/dist/esm/authAPI.js
var init_authAPI = __esm({
  "node_modules/@instantdb/core/dist/esm/authAPI.js"() {
    init_fetch();
  }
});

// node_modules/@instantdb/core/dist/esm/StorageAPI.js
var init_StorageAPI = __esm({
  "node_modules/@instantdb/core/dist/esm/StorageAPI.js"() {
    init_fetch();
  }
});

// node_modules/@instantdb/core/dist/esm/utils/flags.js
var devBackend, instantLogs, devtoolLocalDashboard;
var init_flags = __esm({
  "node_modules/@instantdb/core/dist/esm/utils/flags.js"() {
    devBackend = false;
    instantLogs = false;
    devtoolLocalDashboard = false;
    if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
      devBackend = !!window.localStorage.getItem("devBackend");
      instantLogs = !!window.localStorage.getItem("__instantLogging");
      devtoolLocalDashboard = !!window.localStorage.getItem("__devtoolLocalDash");
    }
  }
});

// node_modules/@instantdb/core/dist/esm/utils/pick.js
var init_pick = __esm({
  "node_modules/@instantdb/core/dist/esm/utils/pick.js"() {
  }
});

// node_modules/@instantdb/core/dist/esm/presence.js
var init_presence = __esm({
  "node_modules/@instantdb/core/dist/esm/presence.js"() {
    init_pick();
    init_object();
  }
});

// node_modules/@instantdb/core/dist/esm/utils/Deferred.js
var init_Deferred = __esm({
  "node_modules/@instantdb/core/dist/esm/utils/Deferred.js"() {
  }
});

// node_modules/@instantdb/core/dist/esm/model/instaqlResult.js
var init_instaqlResult = __esm({
  "node_modules/@instantdb/core/dist/esm/model/instaqlResult.js"() {
  }
});

// node_modules/@instantdb/core/dist/esm/utils/linkIndex.js
var init_linkIndex = __esm({
  "node_modules/@instantdb/core/dist/esm/utils/linkIndex.js"() {
  }
});

// node_modules/@instantdb/version/dist/esm/version.js
var version;
var init_version = __esm({
  "node_modules/@instantdb/version/dist/esm/version.js"() {
    version = "v0.22.137";
  }
});

// node_modules/@instantdb/version/dist/esm/index.js
var init_esm = __esm({
  "node_modules/@instantdb/version/dist/esm/index.js"() {
    init_version();
  }
});

// node_modules/@instantdb/core/dist/esm/version.js
var version_default;
var init_version2 = __esm({
  "node_modules/@instantdb/core/dist/esm/version.js"() {
    init_esm();
    version_default = version;
  }
});

// node_modules/@instantdb/core/dist/esm/utils/log.js
var init_log = __esm({
  "node_modules/@instantdb/core/dist/esm/utils/log.js"() {
  }
});

// node_modules/@instantdb/core/dist/esm/schemaTypes.js
var DataAttrDef, EntityDef, InstantSchemaDef;
var init_schemaTypes = __esm({
  "node_modules/@instantdb/core/dist/esm/schemaTypes.js"() {
    DataAttrDef = class _DataAttrDef {
      static {
        __name(this, "DataAttrDef");
      }
      valueType;
      required;
      isIndexed;
      config;
      metadata = {};
      constructor(valueType, required, isIndexed, config = { indexed: false, unique: false }) {
        this.valueType = valueType;
        this.required = required;
        this.isIndexed = isIndexed;
        this.config = config;
      }
      /**
       * @deprecated Only use this temporarily for attributes that you want
       * to treat as required in frontend code but can’t yet mark as required
       * and enforced for backend
       */
      clientRequired() {
        return new _DataAttrDef(this.valueType, false, this.isIndexed, this.config);
      }
      optional() {
        return new _DataAttrDef(this.valueType, false, this.isIndexed, this.config);
      }
      unique() {
        return new _DataAttrDef(this.valueType, this.required, this.isIndexed, {
          ...this.config,
          unique: true
        });
      }
      indexed() {
        return new _DataAttrDef(this.valueType, this.required, true, {
          ...this.config,
          indexed: true
        });
      }
    };
    EntityDef = class _EntityDef {
      static {
        __name(this, "EntityDef");
      }
      attrs;
      links;
      constructor(attrs, links) {
        this.attrs = attrs;
        this.links = links;
      }
      asType() {
        return new _EntityDef(this.attrs, this.links);
      }
    };
    InstantSchemaDef = class _InstantSchemaDef {
      static {
        __name(this, "InstantSchemaDef");
      }
      entities;
      links;
      rooms;
      constructor(entities, links, rooms) {
        this.entities = entities;
        this.links = links;
        this.rooms = rooms;
      }
      /**
       * @deprecated
       * `withRoomSchema` is deprecated. Define your schema in `rooms` directly:
       *
       * @example
       * // Before:
       * const schema = i.schema({
       *   // ...
       * }).withRoomSchema<RoomSchema>()
       *
       * // After
       * const schema = i.schema({
       *  rooms: {
       *    // ...
       *  }
       * })
       *
       * @see https://instantdb.com/docs/presence-and-topics#typesafety
       */
      withRoomSchema() {
        return new _InstantSchemaDef(this.entities, this.links, {});
      }
    };
  }
});

// node_modules/@instantdb/core/dist/esm/queryValidation.js
var QueryValidationError, dollarSignKeys, getAttrType, isValidValueForType, validateOperator, validateWhereClauseValue, validateDotNotationAttribute, validateWhereClause, validateDollarObject, validateEntityInQuery, validateQuery;
var init_queryValidation = __esm({
  "node_modules/@instantdb/core/dist/esm/queryValidation.js"() {
    init_schemaTypes();
    init_esm_browser2();
    QueryValidationError = class extends Error {
      static {
        __name(this, "QueryValidationError");
      }
      constructor(message, path) {
        const fullMessage = path ? `At path '${path}': ${message}` : message;
        super(fullMessage);
        this.name = "QueryValidationError";
      }
    };
    dollarSignKeys = [
      "where",
      "order",
      "limit",
      "last",
      "first",
      "offset",
      "after",
      "before",
      "fields",
      "aggregate"
    ];
    getAttrType = /* @__PURE__ */ __name((attrDef) => {
      return attrDef.valueType || "unknown";
    }, "getAttrType");
    isValidValueForType = /* @__PURE__ */ __name((value, expectedType, isAnyType = false) => {
      if (isAnyType)
        return true;
      if (value === null || value === void 0)
        return true;
      switch (expectedType) {
        case "string":
          return typeof value === "string";
        case "number":
          return typeof value === "number" && !isNaN(value);
        case "boolean":
          return typeof value === "boolean";
        case "date":
          return value instanceof Date || typeof value === "string" || typeof value === "number";
        default:
          return true;
      }
    }, "isValidValueForType");
    validateOperator = /* @__PURE__ */ __name((op, opValue, expectedType, attrName, entityName, attrDef, path) => {
      const isAnyType = attrDef.valueType === "json";
      const assertValidValue = /* @__PURE__ */ __name((op2, expectedType2, opValue2) => {
        if (!isValidValueForType(opValue2, expectedType2, isAnyType)) {
          throw new QueryValidationError(`Invalid value for operator '${op2}' on attribute '${attrName}' in entity '${entityName}'. Expected ${expectedType2}, but received: ${typeof opValue2}`, path);
        }
      }, "assertValidValue");
      switch (op) {
        case "in":
        case "$in":
          if (!Array.isArray(opValue)) {
            throw new QueryValidationError(`Operator '${op}' for attribute '${attrName}' in entity '${entityName}' must be an array, but received: ${typeof opValue}`, path);
          }
          for (const item of opValue) {
            assertValidValue(op, expectedType, item);
          }
          break;
        case "$not":
        case "$ne":
        case "$gt":
        case "$lt":
        case "$gte":
        case "$lte":
          assertValidValue(op, expectedType, opValue);
          break;
        case "$like":
        case "$ilike":
          assertValidValue(op, "string", opValue);
          if (op === "$ilike") {
            if (!attrDef.isIndexed) {
              throw new QueryValidationError(`Operator '${op}' can only be used with indexed attributes, but '${attrName}' in entity '${entityName}' is not indexed`, path);
            }
          }
          break;
        case "$isNull":
          assertValidValue(op, "boolean", opValue);
          break;
        default:
          throw new QueryValidationError(`Unknown operator '${op}' for attribute '${attrName}' in entity '${entityName}'`, path);
      }
    }, "validateOperator");
    validateWhereClauseValue = /* @__PURE__ */ __name((value, attrName, attrDef, entityName, path) => {
      const expectedType = getAttrType(attrDef);
      const isAnyType = attrDef.valueType === "json";
      const isComplexObject = typeof value === "object" && value !== null && !Array.isArray(value);
      if (isComplexObject) {
        if (isAnyType) {
          return;
        }
        const operators = value;
        for (const [op, opValue] of Object.entries(operators)) {
          validateOperator(op, opValue, expectedType, attrName, entityName, attrDef, `${path}.${op}`);
        }
      } else {
        if (!isValidValueForType(value, expectedType, isAnyType)) {
          throw new QueryValidationError(`Invalid value for attribute '${attrName}' in entity '${entityName}'. Expected ${expectedType}, but received: ${typeof value}`, path);
        }
      }
    }, "validateWhereClauseValue");
    validateDotNotationAttribute = /* @__PURE__ */ __name((dotPath, value, startEntityName, schema2, path) => {
      const pathParts = dotPath.split(".");
      if (pathParts.length < 2) {
        throw new QueryValidationError(`Invalid dot notation path '${dotPath}'. Must contain at least one dot.`, path);
      }
      let currentEntityName = startEntityName;
      for (let i2 = 0; i2 < pathParts.length - 1; i2++) {
        const linkName = pathParts[i2];
        const currentEntity = schema2.entities[currentEntityName];
        if (!currentEntity) {
          throw new QueryValidationError(`Entity '${currentEntityName}' does not exist in schema while traversing dot notation path '${dotPath}'.`, path);
        }
        const link = currentEntity.links[linkName];
        if (!link) {
          const availableLinks = Object.keys(currentEntity.links);
          throw new QueryValidationError(`Link '${linkName}' does not exist on entity '${currentEntityName}' in dot notation path '${dotPath}'. Available links: ${availableLinks.length > 0 ? availableLinks.join(", ") : "none"}`, path);
        }
        currentEntityName = link.entityName;
      }
      const finalAttrName = pathParts[pathParts.length - 1];
      const finalEntity = schema2.entities[currentEntityName];
      if (!finalEntity) {
        throw new QueryValidationError(`Target entity '${currentEntityName}' does not exist in schema for dot notation path '${dotPath}'.`, path);
      }
      if (finalAttrName === "id") {
        if (typeof value == "string" && !validate_default2(value)) {
          throw new QueryValidationError(`Invalid value for id field in entity '${currentEntityName}'. Expected a UUID, but received: ${value}`, path);
        }
        validateWhereClauseValue(value, dotPath, new DataAttrDef("string", false, true), startEntityName, path);
        return;
      }
      const attrDef = finalEntity.attrs[finalAttrName];
      if (Object.keys(finalEntity.links).includes(finalAttrName)) {
        if (typeof value === "string" && !validate_default2(value)) {
          throw new QueryValidationError(`Invalid value for link '${finalAttrName}' in entity '${currentEntityName}'. Expected a UUID, but received: ${value}`, path);
        }
        validateWhereClauseValue(value, dotPath, new DataAttrDef("string", false, true), startEntityName, path);
        return;
      }
      if (!attrDef) {
        const availableAttrs = Object.keys(finalEntity.attrs);
        throw new QueryValidationError(`Attribute '${finalAttrName}' does not exist on entity '${currentEntityName}' in dot notation path '${dotPath}'. Available attributes: ${availableAttrs.length > 0 ? availableAttrs.join(", ") + ", id" : "id"}`, path);
      }
      validateWhereClauseValue(value, dotPath, attrDef, startEntityName, path);
    }, "validateDotNotationAttribute");
    validateWhereClause = /* @__PURE__ */ __name((whereClause, entityName, schema2, path) => {
      for (const [key, value] of Object.entries(whereClause)) {
        if (key === "or" || key === "and") {
          if (Array.isArray(value)) {
            for (const clause of value) {
              if (typeof clause === "object" && clause !== null) {
                validateWhereClause(clause, entityName, schema2, `${path}.${key}[${clause}]`);
              }
            }
          }
          continue;
        }
        if (key === "id") {
          validateWhereClauseValue(value, "id", new DataAttrDef("string", false, true), entityName, `${path}.id`);
          continue;
        }
        if (key.includes(".")) {
          validateDotNotationAttribute(key, value, entityName, schema2, `${path}.${key}`);
          continue;
        }
        const entityDef = schema2.entities[entityName];
        if (!entityDef)
          continue;
        const attrDef = entityDef.attrs[key];
        const linkDef = entityDef.links[key];
        if (!attrDef && !linkDef) {
          const availableAttrs = Object.keys(entityDef.attrs);
          const availableLinks = Object.keys(entityDef.links);
          throw new QueryValidationError(`Attribute or link '${key}' does not exist on entity '${entityName}'. Available attributes: ${availableAttrs.length > 0 ? availableAttrs.join(", ") : "none"}. Available links: ${availableLinks.length > 0 ? availableLinks.join(", ") : "none"}`, `${path}.${key}`);
        }
        if (attrDef) {
          validateWhereClauseValue(value, key, attrDef, entityName, `${path}.${key}`);
        } else if (linkDef) {
          if (typeof value === "string" && !validate_default2(value)) {
            throw new QueryValidationError(`Invalid value for link '${key}' in entity '${entityName}'. Expected a UUID, but received: ${value}`, `${path}.${key}`);
          }
          const syntheticAttrDef = new DataAttrDef("string", false, true);
          validateWhereClauseValue(value, key, syntheticAttrDef, entityName, `${path}.${key}`);
        }
      }
    }, "validateWhereClause");
    validateDollarObject = /* @__PURE__ */ __name((dollarObj, entityName, schema2, path, depth = 0) => {
      for (const key of Object.keys(dollarObj)) {
        if (!dollarSignKeys.includes(key)) {
          throw new QueryValidationError(`Invalid query parameter '${key}' in $ object. Valid parameters are: ${dollarSignKeys.join(", ")}. Found: ${key}`, path);
        }
      }
      const paginationParams = [
        // 'limit', // only supported client side
        "offset",
        "before",
        "after",
        "first",
        "last"
      ];
      for (const param of paginationParams) {
        if (dollarObj[param] !== void 0 && depth > 0) {
          throw new QueryValidationError(`'${param}' can only be used on top-level namespaces. It cannot be used in nested queries.`, path);
        }
      }
      if (dollarObj.where && schema2) {
        if (typeof dollarObj.where !== "object" || dollarObj.where === null) {
          throw new QueryValidationError(`'where' clause must be an object in entity '${entityName}', but received: ${typeof dollarObj.where}`, path ? `${path}.where` : void 0);
        }
        validateWhereClause(dollarObj.where, entityName, schema2, path ? `${path}.where` : "where");
      }
    }, "validateDollarObject");
    validateEntityInQuery = /* @__PURE__ */ __name((queryPart, entityName, schema2, path, depth = 0) => {
      if (!queryPart || typeof queryPart !== "object") {
        throw new QueryValidationError(`Query part for entity '${entityName}' must be an object, but received: ${typeof queryPart}`, path);
      }
      for (const key of Object.keys(queryPart)) {
        if (key !== "$") {
          if (schema2 && !(key in schema2.entities[entityName].links)) {
            const availableLinks = Object.keys(schema2.entities[entityName].links);
            throw new QueryValidationError(`Link '${key}' does not exist on entity '${entityName}'. Available links: ${availableLinks.length > 0 ? availableLinks.join(", ") : "none"}`, `${path}.${key}`);
          }
          const nestedQuery = queryPart[key];
          if (typeof nestedQuery === "object" && nestedQuery !== null) {
            const linkedEntityName = schema2?.entities[entityName].links[key]?.entityName;
            if (linkedEntityName) {
              validateEntityInQuery(nestedQuery, linkedEntityName, schema2, `${path}.${key}`, depth + 1);
            }
          }
        } else {
          const dollarObj = queryPart[key];
          if (typeof dollarObj !== "object" || dollarObj === null) {
            throw new QueryValidationError(`Query parameter '$' must be an object in entity '${entityName}', but received: ${typeof dollarObj}`, `${path}.$`);
          }
          validateDollarObject(dollarObj, entityName, schema2, `${path}.$`, depth);
        }
      }
    }, "validateEntityInQuery");
    validateQuery = /* @__PURE__ */ __name((q, schema2) => {
      if (typeof q !== "object" || q === null) {
        throw new QueryValidationError(`Query must be an object, but received: ${typeof q}${q === null ? " (null)" : ""}`);
      }
      if (Array.isArray(q)) {
        throw new QueryValidationError(`Query must be an object, but received: ${typeof q}`);
      }
      const queryObj = q;
      for (const topLevelKey of Object.keys(queryObj)) {
        if (Array.isArray(q[topLevelKey])) {
          throw new QueryValidationError(`Query keys must be strings, but found key of type: ${typeof topLevelKey}`, topLevelKey);
        }
        if (typeof topLevelKey !== "string") {
          throw new QueryValidationError(`Query keys must be strings, but found key of type: ${typeof topLevelKey}`, topLevelKey);
        }
        if (topLevelKey === "$$ruleParams") {
          continue;
        }
        if (schema2) {
          if (!schema2.entities[topLevelKey]) {
            const availableEntities = Object.keys(schema2.entities);
            throw new QueryValidationError(`Entity '${topLevelKey}' does not exist in schema. Available entities: ${availableEntities.length > 0 ? availableEntities.join(", ") : "none"}`, topLevelKey);
          }
        }
        validateEntityInQuery(queryObj[topLevelKey], topLevelKey, schema2, topLevelKey, 0);
      }
    }, "validateQuery");
  }
});

// node_modules/@instantdb/core/dist/esm/transactionValidation.js
var isValidEntityId, TransactionValidationError, formatAvailableOptions, createEntityNotFoundError, TYPE_VALIDATORS, isValidValueForAttr, validateEntityExists, validateDataOperation, validateLinkOperation, VALIDATION_STRATEGIES, validateOp, validateTransactions;
var init_transactionValidation = __esm({
  "node_modules/@instantdb/core/dist/esm/transactionValidation.js"() {
    init_instatx();
    init_esm_browser2();
    isValidEntityId = /* @__PURE__ */ __name((value) => {
      if (typeof value !== "string") {
        return false;
      }
      if (isLookup(value)) {
        return true;
      }
      return validate_default2(value);
    }, "isValidEntityId");
    TransactionValidationError = class extends Error {
      static {
        __name(this, "TransactionValidationError");
      }
      constructor(message) {
        super(message);
        this.name = "TransactionValidationError";
      }
    };
    formatAvailableOptions = /* @__PURE__ */ __name((items) => items.length > 0 ? items.join(", ") : "none", "formatAvailableOptions");
    createEntityNotFoundError = /* @__PURE__ */ __name((entityName, availableEntities) => new TransactionValidationError(`Entity '${entityName}' does not exist in schema. Available entities: ${formatAvailableOptions(availableEntities)}`), "createEntityNotFoundError");
    TYPE_VALIDATORS = {
      string: /* @__PURE__ */ __name((value) => typeof value === "string", "string"),
      number: /* @__PURE__ */ __name((value) => typeof value === "number" && !isNaN(value), "number"),
      boolean: /* @__PURE__ */ __name((value) => typeof value === "boolean", "boolean"),
      date: /* @__PURE__ */ __name((value) => value instanceof Date || typeof value === "string" || typeof value === "number", "date"),
      json: /* @__PURE__ */ __name(() => true, "json")
    };
    isValidValueForAttr = /* @__PURE__ */ __name((value, attrDef) => {
      if (value === null || value === void 0)
        return true;
      return TYPE_VALIDATORS[attrDef.valueType]?.(value) ?? false;
    }, "isValidValueForAttr");
    validateEntityExists = /* @__PURE__ */ __name((entityName, schema2) => {
      const entityDef = schema2.entities[entityName];
      if (!entityDef) {
        throw createEntityNotFoundError(entityName, Object.keys(schema2.entities));
      }
      return entityDef;
    }, "validateEntityExists");
    validateDataOperation = /* @__PURE__ */ __name((entityName, data, schema2) => {
      const entityDef = validateEntityExists(entityName, schema2);
      if (typeof data !== "object" || data === null) {
        throw new TransactionValidationError(`Arguments for data operation on entity '${entityName}' must be an object, but received: ${typeof data}`);
      }
      for (const [attrName, value] of Object.entries(data)) {
        if (attrName === "id")
          continue;
        const attrDef = entityDef.attrs[attrName];
        if (attrDef) {
          if (!isValidValueForAttr(value, attrDef)) {
            throw new TransactionValidationError(`Invalid value for attribute '${attrName}' in entity '${entityName}'. Expected ${attrDef.valueType}, but received: ${typeof value}`);
          }
        }
      }
    }, "validateDataOperation");
    validateLinkOperation = /* @__PURE__ */ __name((entityName, links, schema2) => {
      const entityDef = validateEntityExists(entityName, schema2);
      if (typeof links !== "object" || links === null) {
        throw new TransactionValidationError(`Arguments for link operation on entity '${entityName}' must be an object, but received: ${typeof links}`);
      }
      for (const [linkName, linkValue] of Object.entries(links)) {
        const link = entityDef.links[linkName];
        if (!link) {
          const availableLinks = Object.keys(entityDef.links);
          throw new TransactionValidationError(`Link '${linkName}' does not exist on entity '${entityName}'. Available links: ${formatAvailableOptions(availableLinks)}`);
        }
        if (linkValue !== null && linkValue !== void 0) {
          if (Array.isArray(linkValue)) {
            for (const linkReference of linkValue) {
              if (!isValidEntityId(linkReference)) {
                throw new TransactionValidationError(`Invalid entity ID in link '${linkName}' for entity '${entityName}'. Expected a UUID or a lookup, but received: ${linkReference}`);
              }
            }
          } else {
            if (!isValidEntityId(linkValue)) {
              throw new TransactionValidationError(`Invalid UUID in link '${linkName}' for entity '${entityName}'. Expected a UUID, but received: ${linkValue}`);
            }
          }
        }
      }
    }, "validateLinkOperation");
    VALIDATION_STRATEGIES = {
      create: validateDataOperation,
      update: validateDataOperation,
      merge: validateDataOperation,
      link: validateLinkOperation,
      unlink: validateLinkOperation,
      delete: /* @__PURE__ */ __name(() => {
      }, "delete")
    };
    validateOp = /* @__PURE__ */ __name((op, schema2) => {
      if (!schema2)
        return;
      const [action, entityName, _id, args] = op;
      if (!Array.isArray(_id)) {
        const isUuid = validate_default2(_id);
        if (!isUuid) {
          throw new TransactionValidationError(`Invalid id for entity '${entityName}'. Expected a UUID, but received: ${_id}`);
        }
      }
      if (typeof entityName !== "string") {
        throw new TransactionValidationError(`Entity name must be a string, but received: ${typeof entityName}`);
      }
      const validator = VALIDATION_STRATEGIES[action];
      if (validator && args !== void 0) {
        validator(entityName, args, schema2);
      }
    }, "validateOp");
    validateTransactions = /* @__PURE__ */ __name((inputChunks, schema2) => {
      const chunks = Array.isArray(inputChunks) ? inputChunks : [inputChunks];
      for (const txStep of chunks) {
        if (!txStep || typeof txStep !== "object") {
          throw new TransactionValidationError(`Transaction chunk must be an object, but received: ${typeof txStep}`);
        }
        if (!Array.isArray(txStep.__ops)) {
          throw new TransactionValidationError(`Transaction chunk must have __ops array, but received: ${typeof txStep.__ops}`);
        }
        for (const op of txStep.__ops) {
          if (!Array.isArray(op)) {
            throw new TransactionValidationError(`Transaction operation must be an array, but received: ${typeof op}`);
          }
          validateOp(op, schema2);
        }
      }
    }, "validateTransactions");
  }
});

// node_modules/@instantdb/core/dist/esm/Connection.js
var init_Connection = __esm({
  "node_modules/@instantdb/core/dist/esm/Connection.js"() {
  }
});

// node_modules/@instantdb/core/dist/esm/SyncTable.js
var CallbackEventType;
var init_SyncTable = __esm({
  "node_modules/@instantdb/core/dist/esm/SyncTable.js"() {
    init_PersistedObject();
    init_store();
    init_weakHash();
    init_id();
    init_instaql();
    (function(CallbackEventType2) {
      CallbackEventType2["InitialSyncBatch"] = "InitialSyncBatch";
      CallbackEventType2["InitialSyncComplete"] = "InitialSyncComplete";
      CallbackEventType2["LoadFromStorage"] = "LoadFromStorage";
      CallbackEventType2["SyncTransaction"] = "SyncTransaction";
      CallbackEventType2["Error"] = "Error";
    })(CallbackEventType || (CallbackEventType = {}));
  }
});

// node_modules/@instantdb/core/dist/esm/Reactor.js
var ONE_MIN_MS;
var init_Reactor = __esm({
  "node_modules/@instantdb/core/dist/esm/Reactor.js"() {
    init_weakHash();
    init_instaql();
    init_instaml();
    init_store();
    init_id();
    init_IndexedDBStorage();
    init_WindowNetworkListener();
    init_authAPI();
    init_StorageAPI();
    init_flags();
    init_presence();
    init_Deferred();
    init_PersistedObject();
    init_instaqlResult();
    init_object();
    init_linkIndex();
    init_version2();
    init_mutative_esm();
    init_log();
    init_queryValidation();
    init_transactionValidation();
    init_InstantError();
    init_fetch();
    init_Connection();
    init_SyncTable();
    ONE_MIN_MS = 1e3 * 60;
  }
});

// node_modules/@instantdb/core/dist/esm/schema.js
function graph(entities, links) {
  return new InstantSchemaDef(
    enrichEntitiesWithLinks(entities, links),
    // (XXX): LinksDef<any> stems from TypeScript’s inability to reconcile the
    // type EntitiesWithLinks<EntitiesWithoutLinks, Links> with
    // EntitiesWithoutLinks. TypeScript is strict about ensuring that types are
    // correctly aligned and does not allow for substituting a type that might
    // be broader or have additional properties.
    links,
    void 0
  );
}
function entity(attrs) {
  return new EntityDef(attrs, {});
}
function string() {
  return new DataAttrDef("string", true, false);
}
function number() {
  return new DataAttrDef("number", true, false);
}
function boolean() {
  return new DataAttrDef("boolean", true, false);
}
function date() {
  return new DataAttrDef("date", true, false);
}
function json() {
  return new DataAttrDef("json", true, false);
}
function any() {
  return new DataAttrDef("json", true, false);
}
function enrichEntitiesWithLinks(entities, links) {
  const linksIndex = { fwd: {}, rev: {} };
  for (const linkDef of Object.values(links)) {
    linksIndex.fwd[linkDef.forward.on] ||= {};
    linksIndex.rev[linkDef.reverse.on] ||= {};
    linksIndex.fwd[linkDef.forward.on][linkDef.forward.label] = {
      entityName: linkDef.reverse.on,
      cardinality: linkDef.forward.has
    };
    linksIndex.rev[linkDef.reverse.on][linkDef.reverse.label] = {
      entityName: linkDef.forward.on,
      cardinality: linkDef.reverse.has
    };
  }
  const enrichedEntities = Object.fromEntries(Object.entries(entities).map(([name, def]) => [
    name,
    new EntityDef(def.attrs, {
      ...linksIndex.fwd[name],
      ...linksIndex.rev[name]
    })
  ]));
  return enrichedEntities;
}
function schema({ entities, links, rooms }) {
  const linksDef = links ?? {};
  const roomsDef = rooms ?? {};
  return new InstantSchemaDef(
    enrichEntitiesWithLinks(entities, linksDef),
    // (XXX): LinksDef<any> stems from TypeScript's inability to reconcile the
    // type EntitiesWithLinks<EntitiesWithoutLinks, Links> with
    // EntitiesWithoutLinks. TypeScript is strict about ensuring that types are
    // correctly aligned and does not allow for substituting a type that might
    // be broader or have additional properties.
    linksDef,
    roomsDef
  );
}
var i;
var init_schema = __esm({
  "node_modules/@instantdb/core/dist/esm/schema.js"() {
    init_schemaTypes();
    __name(graph, "graph");
    __name(entity, "entity");
    __name(string, "string");
    __name(number, "number");
    __name(boolean, "boolean");
    __name(date, "date");
    __name(json, "json");
    __name(any, "any");
    __name(enrichEntitiesWithLinks, "enrichEntitiesWithLinks");
    __name(schema, "schema");
    i = {
      // constructs
      graph,
      schema,
      entity,
      // value types
      string,
      number,
      boolean,
      date,
      json,
      any
    };
  }
});

// node_modules/@instantdb/core/dist/esm/devtool.js
var init_devtool = __esm({
  "node_modules/@instantdb/core/dist/esm/devtool.js"() {
    init_flags();
  }
});

// node_modules/@instantdb/core/dist/esm/createRouteHandler.js
var init_createRouteHandler = __esm({
  "node_modules/@instantdb/core/dist/esm/createRouteHandler.js"() {
  }
});

// node_modules/@instantdb/core/dist/esm/parseSchemaFromJSON.js
var init_parseSchemaFromJSON = __esm({
  "node_modules/@instantdb/core/dist/esm/parseSchemaFromJSON.js"() {
    init_schema();
  }
});

// node_modules/@instantdb/core/dist/esm/framework.js
var isServer;
var init_framework = __esm({
  "node_modules/@instantdb/core/dist/esm/framework.js"() {
    init_esm2();
    init_store();
    init_instaql();
    init_linkIndex();
    isServer = typeof window === "undefined" || "Deno" in globalThis;
  }
});

// node_modules/@instantdb/core/dist/esm/index.js
function initSchemaHashStore() {
  globalThis.__instantDbSchemaHashStore = globalThis.__instantDbSchemaHashStore ?? /* @__PURE__ */ new WeakMap();
  return globalThis.__instantDbSchemaHashStore;
}
function initGlobalInstantCoreStore() {
  globalThis.__instantDbStore = globalThis.__instantDbStore ?? {};
  return globalThis.__instantDbStore;
}
var globalInstantCoreStore, schemaHashStore;
var init_esm2 = __esm({
  "node_modules/@instantdb/core/dist/esm/index.js"() {
    init_Reactor();
    init_instatx();
    init_weakHash();
    init_id();
    init_IndexedDBStorage();
    init_dates();
    init_WindowNetworkListener();
    init_schema();
    init_devtool();
    init_version2();
    init_queryValidation();
    init_transactionValidation();
    init_warningToggle();
    init_PersistedObject();
    init_createRouteHandler();
    init_parseSchemaFromJSON();
    init_framework();
    init_fetch();
    init_InstantError();
    init_SyncTable();
    __name(initSchemaHashStore, "initSchemaHashStore");
    __name(initGlobalInstantCoreStore, "initGlobalInstantCoreStore");
    globalInstantCoreStore = initGlobalInstantCoreStore();
    schemaHashStore = initSchemaHashStore();
  }
});

// node_modules/@instantdb/admin/dist/esm/version.js
var version_default2;
var init_version3 = __esm({
  "node_modules/@instantdb/admin/dist/esm/version.js"() {
    init_esm();
    version_default2 = version;
  }
});

// node_modules/eventsource-parser/dist/index.js
function noop(_arg) {
}
function createParser(callbacks) {
  if (typeof callbacks == "function")
    throw new TypeError(
      "`callbacks` must be an object, got a function instead. Did you mean `{onEvent: fn}`?"
    );
  const { onEvent = noop, onError = noop, onRetry = noop, onComment } = callbacks;
  let incompleteLine = "", isFirstChunk = true, id2, data = "", eventType = "";
  function feed(newChunk) {
    const chunk = isFirstChunk ? newChunk.replace(/^\xEF\xBB\xBF/, "") : newChunk, [complete, incomplete] = splitLines(`${incompleteLine}${chunk}`);
    for (const line of complete)
      parseLine(line);
    incompleteLine = incomplete, isFirstChunk = false;
  }
  __name(feed, "feed");
  function parseLine(line) {
    if (line === "") {
      dispatchEvent();
      return;
    }
    if (line.startsWith(":")) {
      onComment && onComment(line.slice(line.startsWith(": ") ? 2 : 1));
      return;
    }
    const fieldSeparatorIndex = line.indexOf(":");
    if (fieldSeparatorIndex !== -1) {
      const field = line.slice(0, fieldSeparatorIndex), offset = line[fieldSeparatorIndex + 1] === " " ? 2 : 1, value = line.slice(fieldSeparatorIndex + offset);
      processField(field, value, line);
      return;
    }
    processField(line, "", line);
  }
  __name(parseLine, "parseLine");
  function processField(field, value, line) {
    switch (field) {
      case "event":
        eventType = value;
        break;
      case "data":
        data = `${data}${value}
`;
        break;
      case "id":
        id2 = value.includes("\0") ? void 0 : value;
        break;
      case "retry":
        /^\d+$/.test(value) ? onRetry(parseInt(value, 10)) : onError(
          new ParseError(`Invalid \`retry\` value: "${value}"`, {
            type: "invalid-retry",
            value,
            line
          })
        );
        break;
      default:
        onError(
          new ParseError(
            `Unknown field "${field.length > 20 ? `${field.slice(0, 20)}\u2026` : field}"`,
            { type: "unknown-field", field, value, line }
          )
        );
        break;
    }
  }
  __name(processField, "processField");
  function dispatchEvent() {
    data.length > 0 && onEvent({
      id: id2,
      event: eventType || void 0,
      // If the data buffer's last character is a U+000A LINE FEED (LF) character,
      // then remove the last character from the data buffer.
      data: data.endsWith(`
`) ? data.slice(0, -1) : data
    }), id2 = void 0, data = "", eventType = "";
  }
  __name(dispatchEvent, "dispatchEvent");
  function reset(options = {}) {
    incompleteLine && options.consume && parseLine(incompleteLine), isFirstChunk = true, id2 = void 0, data = "", eventType = "", incompleteLine = "";
  }
  __name(reset, "reset");
  return { feed, reset };
}
function splitLines(chunk) {
  const lines = [];
  let incompleteLine = "", searchIndex = 0;
  for (; searchIndex < chunk.length; ) {
    const crIndex = chunk.indexOf("\r", searchIndex), lfIndex = chunk.indexOf(`
`, searchIndex);
    let lineEnd = -1;
    if (crIndex !== -1 && lfIndex !== -1 ? lineEnd = Math.min(crIndex, lfIndex) : crIndex !== -1 ? crIndex === chunk.length - 1 ? lineEnd = -1 : lineEnd = crIndex : lfIndex !== -1 && (lineEnd = lfIndex), lineEnd === -1) {
      incompleteLine = chunk.slice(searchIndex);
      break;
    } else {
      const line = chunk.slice(searchIndex, lineEnd);
      lines.push(line), searchIndex = lineEnd + 1, chunk[searchIndex - 1] === "\r" && chunk[searchIndex] === `
` && searchIndex++;
    }
  }
  return [lines, incompleteLine];
}
var ParseError;
var init_dist = __esm({
  "node_modules/eventsource-parser/dist/index.js"() {
    ParseError = class extends Error {
      static {
        __name(this, "ParseError");
      }
      constructor(message, options) {
        super(message), this.name = "ParseError", this.type = options.type, this.field = options.field, this.value = options.value, this.line = options.line;
      }
    };
    __name(noop, "noop");
    __name(createParser, "createParser");
    __name(splitLines, "splitLines");
  }
});

// node_modules/eventsource/dist/index.js
function syntaxError(message) {
  const DomException = globalThis.DOMException;
  return typeof DomException == "function" ? new DomException(message, "SyntaxError") : new SyntaxError(message);
}
function flattenError(err) {
  return err instanceof Error ? "errors" in err && Array.isArray(err.errors) ? err.errors.map(flattenError).join(", ") : "cause" in err && err.cause instanceof Error ? `${err}: ${flattenError(err.cause)}` : err.message : `${err}`;
}
function inspectableError(err) {
  return {
    type: err.type,
    message: err.message,
    code: err.code,
    defaultPrevented: err.defaultPrevented,
    cancelable: err.cancelable,
    timeStamp: err.timeStamp
  };
}
function getBaseURL() {
  const doc = "document" in globalThis ? globalThis.document : void 0;
  return doc && typeof doc == "object" && "baseURI" in doc && typeof doc.baseURI == "string" ? doc.baseURI : void 0;
}
var ErrorEvent, __typeError, __accessCheck, __privateGet, __privateAdd, __privateSet, __privateMethod, _readyState, _url, _redirectUrl, _withCredentials, _fetch, _reconnectInterval, _reconnectTimer, _lastEventId, _controller, _parser, _onError, _onMessage, _onOpen, _EventSource_instances, connect_fn, _onFetchResponse, _onFetchError, getRequestOptions_fn, _onEvent, _onRetryChange, failConnection_fn, scheduleReconnect_fn, _reconnect, EventSource;
var init_dist2 = __esm({
  "node_modules/eventsource/dist/index.js"() {
    init_dist();
    ErrorEvent = class extends Event {
      static {
        __name(this, "ErrorEvent");
      }
      /**
       * Constructs a new `ErrorEvent` instance. This is typically not called directly,
       * but rather emitted by the `EventSource` object when an error occurs.
       *
       * @param type - The type of the event (should be "error")
       * @param errorEventInitDict - Optional properties to include in the error event
       */
      constructor(type, errorEventInitDict) {
        var _a, _b;
        super(type), this.code = (_a = errorEventInitDict == null ? void 0 : errorEventInitDict.code) != null ? _a : void 0, this.message = (_b = errorEventInitDict == null ? void 0 : errorEventInitDict.message) != null ? _b : void 0;
      }
      /**
       * Node.js "hides" the `message` and `code` properties of the `ErrorEvent` instance,
       * when it is `console.log`'ed. This makes it harder to debug errors. To ease debugging,
       * we explicitly include the properties in the `inspect` method.
       *
       * This is automatically called by Node.js when you `console.log` an instance of this class.
       *
       * @param _depth - The current depth
       * @param options - The options passed to `util.inspect`
       * @param inspect - The inspect function to use (prevents having to import it from `util`)
       * @returns A string representation of the error
       */
      [Symbol.for("nodejs.util.inspect.custom")](_depth, options, inspect) {
        return inspect(inspectableError(this), options);
      }
      /**
       * Deno "hides" the `message` and `code` properties of the `ErrorEvent` instance,
       * when it is `console.log`'ed. This makes it harder to debug errors. To ease debugging,
       * we explicitly include the properties in the `inspect` method.
       *
       * This is automatically called by Deno when you `console.log` an instance of this class.
       *
       * @param inspect - The inspect function to use (prevents having to import it from `util`)
       * @param options - The options passed to `Deno.inspect`
       * @returns A string representation of the error
       */
      [Symbol.for("Deno.customInspect")](inspect, options) {
        return inspect(inspectableError(this), options);
      }
    };
    __name(syntaxError, "syntaxError");
    __name(flattenError, "flattenError");
    __name(inspectableError, "inspectableError");
    __typeError = /* @__PURE__ */ __name((msg) => {
      throw TypeError(msg);
    }, "__typeError");
    __accessCheck = /* @__PURE__ */ __name((obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg), "__accessCheck");
    __privateGet = /* @__PURE__ */ __name((obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj)), "__privateGet");
    __privateAdd = /* @__PURE__ */ __name((obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value), "__privateAdd");
    __privateSet = /* @__PURE__ */ __name((obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), member.set(obj, value), value), "__privateSet");
    __privateMethod = /* @__PURE__ */ __name((obj, member, method) => (__accessCheck(obj, member, "access private method"), method), "__privateMethod");
    EventSource = class extends EventTarget {
      static {
        __name(this, "EventSource");
      }
      constructor(url, eventSourceInitDict) {
        var _a, _b;
        super(), __privateAdd(this, _EventSource_instances), this.CONNECTING = 0, this.OPEN = 1, this.CLOSED = 2, __privateAdd(this, _readyState), __privateAdd(this, _url), __privateAdd(this, _redirectUrl), __privateAdd(this, _withCredentials), __privateAdd(this, _fetch), __privateAdd(this, _reconnectInterval), __privateAdd(this, _reconnectTimer), __privateAdd(this, _lastEventId, null), __privateAdd(this, _controller), __privateAdd(this, _parser), __privateAdd(this, _onError, null), __privateAdd(this, _onMessage, null), __privateAdd(this, _onOpen, null), __privateAdd(this, _onFetchResponse, async (response) => {
          var _a2;
          __privateGet(this, _parser).reset();
          const { body, redirected, status, headers } = response;
          if (status === 204) {
            __privateMethod(this, _EventSource_instances, failConnection_fn).call(this, "Server sent HTTP 204, not reconnecting", 204), this.close();
            return;
          }
          if (redirected ? __privateSet(this, _redirectUrl, new URL(response.url)) : __privateSet(this, _redirectUrl, void 0), status !== 200) {
            __privateMethod(this, _EventSource_instances, failConnection_fn).call(this, `Non-200 status code (${status})`, status);
            return;
          }
          if (!(headers.get("content-type") || "").startsWith("text/event-stream")) {
            __privateMethod(this, _EventSource_instances, failConnection_fn).call(this, 'Invalid content type, expected "text/event-stream"', status);
            return;
          }
          if (__privateGet(this, _readyState) === this.CLOSED)
            return;
          __privateSet(this, _readyState, this.OPEN);
          const openEvent = new Event("open");
          if ((_a2 = __privateGet(this, _onOpen)) == null || _a2.call(this, openEvent), this.dispatchEvent(openEvent), typeof body != "object" || !body || !("getReader" in body)) {
            __privateMethod(this, _EventSource_instances, failConnection_fn).call(this, "Invalid response body, expected a web ReadableStream", status), this.close();
            return;
          }
          const decoder = new TextDecoder(), reader = body.getReader();
          let open = true;
          do {
            const { done, value } = await reader.read();
            value && __privateGet(this, _parser).feed(decoder.decode(value, { stream: !done })), done && (open = false, __privateGet(this, _parser).reset(), __privateMethod(this, _EventSource_instances, scheduleReconnect_fn).call(this));
          } while (open);
        }), __privateAdd(this, _onFetchError, (err) => {
          __privateSet(this, _controller, void 0), !(err.name === "AbortError" || err.type === "aborted") && __privateMethod(this, _EventSource_instances, scheduleReconnect_fn).call(this, flattenError(err));
        }), __privateAdd(this, _onEvent, (event) => {
          typeof event.id == "string" && __privateSet(this, _lastEventId, event.id);
          const messageEvent = new MessageEvent(event.event || "message", {
            data: event.data,
            origin: __privateGet(this, _redirectUrl) ? __privateGet(this, _redirectUrl).origin : __privateGet(this, _url).origin,
            lastEventId: event.id || ""
          });
          __privateGet(this, _onMessage) && (!event.event || event.event === "message") && __privateGet(this, _onMessage).call(this, messageEvent), this.dispatchEvent(messageEvent);
        }), __privateAdd(this, _onRetryChange, (value) => {
          __privateSet(this, _reconnectInterval, value);
        }), __privateAdd(this, _reconnect, () => {
          __privateSet(this, _reconnectTimer, void 0), __privateGet(this, _readyState) === this.CONNECTING && __privateMethod(this, _EventSource_instances, connect_fn).call(this);
        });
        try {
          if (url instanceof URL)
            __privateSet(this, _url, url);
          else if (typeof url == "string")
            __privateSet(this, _url, new URL(url, getBaseURL()));
          else
            throw new Error("Invalid URL");
        } catch {
          throw syntaxError("An invalid or illegal string was specified");
        }
        __privateSet(this, _parser, createParser({
          onEvent: __privateGet(this, _onEvent),
          onRetry: __privateGet(this, _onRetryChange)
        })), __privateSet(this, _readyState, this.CONNECTING), __privateSet(this, _reconnectInterval, 3e3), __privateSet(this, _fetch, (_a = eventSourceInitDict == null ? void 0 : eventSourceInitDict.fetch) != null ? _a : globalThis.fetch), __privateSet(this, _withCredentials, (_b = eventSourceInitDict == null ? void 0 : eventSourceInitDict.withCredentials) != null ? _b : false), __privateMethod(this, _EventSource_instances, connect_fn).call(this);
      }
      /**
       * Returns the state of this EventSource object's connection. It can have the values described below.
       *
       * [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/readyState)
       *
       * Note: typed as `number` instead of `0 | 1 | 2` for compatibility with the `EventSource` interface,
       * defined in the TypeScript `dom` library.
       *
       * @public
       */
      get readyState() {
        return __privateGet(this, _readyState);
      }
      /**
       * Returns the URL providing the event stream.
       *
       * [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/url)
       *
       * @public
       */
      get url() {
        return __privateGet(this, _url).href;
      }
      /**
       * Returns true if the credentials mode for connection requests to the URL providing the event stream is set to "include", and false otherwise.
       *
       * [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/withCredentials)
       */
      get withCredentials() {
        return __privateGet(this, _withCredentials);
      }
      /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/error_event) */
      get onerror() {
        return __privateGet(this, _onError);
      }
      set onerror(value) {
        __privateSet(this, _onError, value);
      }
      /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/message_event) */
      get onmessage() {
        return __privateGet(this, _onMessage);
      }
      set onmessage(value) {
        __privateSet(this, _onMessage, value);
      }
      /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/open_event) */
      get onopen() {
        return __privateGet(this, _onOpen);
      }
      set onopen(value) {
        __privateSet(this, _onOpen, value);
      }
      addEventListener(type, listener, options) {
        const listen = listener;
        super.addEventListener(type, listen, options);
      }
      removeEventListener(type, listener, options) {
        const listen = listener;
        super.removeEventListener(type, listen, options);
      }
      /**
       * Aborts any instances of the fetch algorithm started for this EventSource object, and sets the readyState attribute to CLOSED.
       *
       * [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/close)
       *
       * @public
       */
      close() {
        __privateGet(this, _reconnectTimer) && clearTimeout(__privateGet(this, _reconnectTimer)), __privateGet(this, _readyState) !== this.CLOSED && (__privateGet(this, _controller) && __privateGet(this, _controller).abort(), __privateSet(this, _readyState, this.CLOSED), __privateSet(this, _controller, void 0));
      }
    };
    _readyState = /* @__PURE__ */ new WeakMap(), _url = /* @__PURE__ */ new WeakMap(), _redirectUrl = /* @__PURE__ */ new WeakMap(), _withCredentials = /* @__PURE__ */ new WeakMap(), _fetch = /* @__PURE__ */ new WeakMap(), _reconnectInterval = /* @__PURE__ */ new WeakMap(), _reconnectTimer = /* @__PURE__ */ new WeakMap(), _lastEventId = /* @__PURE__ */ new WeakMap(), _controller = /* @__PURE__ */ new WeakMap(), _parser = /* @__PURE__ */ new WeakMap(), _onError = /* @__PURE__ */ new WeakMap(), _onMessage = /* @__PURE__ */ new WeakMap(), _onOpen = /* @__PURE__ */ new WeakMap(), _EventSource_instances = /* @__PURE__ */ new WeakSet(), /**
    * Connect to the given URL and start receiving events
    *
    * @internal
    */
    connect_fn = /* @__PURE__ */ __name(function() {
      __privateSet(this, _readyState, this.CONNECTING), __privateSet(this, _controller, new AbortController()), __privateGet(this, _fetch)(__privateGet(this, _url), __privateMethod(this, _EventSource_instances, getRequestOptions_fn).call(this)).then(__privateGet(this, _onFetchResponse)).catch(__privateGet(this, _onFetchError));
    }, "connect_fn"), _onFetchResponse = /* @__PURE__ */ new WeakMap(), _onFetchError = /* @__PURE__ */ new WeakMap(), /**
    * Get request options for the `fetch()` request
    *
    * @returns The request options
    * @internal
    */
    getRequestOptions_fn = /* @__PURE__ */ __name(function() {
      var _a;
      const init2 = {
        // [spec] Let `corsAttributeState` be `Anonymous`…
        // [spec] …will have their mode set to "cors"…
        mode: "cors",
        redirect: "follow",
        headers: { Accept: "text/event-stream", ...__privateGet(this, _lastEventId) ? { "Last-Event-ID": __privateGet(this, _lastEventId) } : void 0 },
        cache: "no-store",
        signal: (_a = __privateGet(this, _controller)) == null ? void 0 : _a.signal
      };
      return "window" in globalThis && (init2.credentials = this.withCredentials ? "include" : "same-origin"), init2;
    }, "getRequestOptions_fn"), _onEvent = /* @__PURE__ */ new WeakMap(), _onRetryChange = /* @__PURE__ */ new WeakMap(), /**
    * Handles the process referred to in the EventSource specification as "failing a connection".
    *
    * @param error - The error causing the connection to fail
    * @param code - The HTTP status code, if available
    * @internal
    */
    failConnection_fn = /* @__PURE__ */ __name(function(message, code) {
      var _a;
      __privateGet(this, _readyState) !== this.CLOSED && __privateSet(this, _readyState, this.CLOSED);
      const errorEvent = new ErrorEvent("error", { code, message });
      (_a = __privateGet(this, _onError)) == null || _a.call(this, errorEvent), this.dispatchEvent(errorEvent);
    }, "failConnection_fn"), /**
    * Schedules a reconnection attempt against the EventSource endpoint.
    *
    * @param message - The error causing the connection to fail
    * @param code - The HTTP status code, if available
    * @internal
    */
    scheduleReconnect_fn = /* @__PURE__ */ __name(function(message, code) {
      var _a;
      if (__privateGet(this, _readyState) === this.CLOSED)
        return;
      __privateSet(this, _readyState, this.CONNECTING);
      const errorEvent = new ErrorEvent("error", { code, message });
      (_a = __privateGet(this, _onError)) == null || _a.call(this, errorEvent), this.dispatchEvent(errorEvent), __privateSet(this, _reconnectTimer, setTimeout(__privateGet(this, _reconnect), __privateGet(this, _reconnectInterval)));
    }, "scheduleReconnect_fn"), _reconnect = /* @__PURE__ */ new WeakMap(), /**
    * ReadyState representing an EventSource currently trying to connect
    *
    * @public
    */
    EventSource.CONNECTING = 0, /**
    * ReadyState representing an EventSource connection that is open (eg connected)
    *
    * @public
    */
    EventSource.OPEN = 1, /**
    * ReadyState representing an EventSource connection that is closed (eg disconnected)
    *
    * @public
    */
    EventSource.CLOSED = 2;
    Object.defineProperty(EventSource, Symbol.for("eventsource.supports-fetch-override"), {
      value: true,
      writable: false,
      configurable: false,
      enumerable: false
    });
    __name(getBaseURL, "getBaseURL");
  }
});

// node_modules/@instantdb/admin/dist/esm/subscribe.js
function makeAsyncIterator(subscribe2, subscribeOnClose, unsubscribe, readyState) {
  let wakeup = null;
  let closed = false;
  const backlog = [];
  const handler = /* @__PURE__ */ __name((data) => {
    backlog.push(data);
    if (backlog.length > 100) {
      backlog.shift();
    }
    if (wakeup) {
      wakeup();
      wakeup = null;
    }
  }, "handler");
  subscribe2(handler);
  const done = /* @__PURE__ */ __name(() => {
    unsubscribe(handler);
    return Promise.resolve({ done: true, value: void 0 });
  }, "done");
  const onClose = /* @__PURE__ */ __name(() => {
    closed = true;
    if (wakeup) {
      wakeup();
    }
    done();
  }, "onClose");
  subscribeOnClose(onClose);
  const next = /* @__PURE__ */ __name(async () => {
    while (true) {
      if (readyState() === "closed" || closed) {
        return done();
      }
      const nextValue = backlog.shift();
      if (nextValue) {
        return { value: nextValue, done: false };
      }
      const p = new Promise((resolve) => {
        wakeup = resolve;
      });
      await p;
    }
  }, "next");
  return {
    next,
    return: done,
    throw(error) {
      unsubscribe(handler);
      return Promise.reject(error);
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
function esReadyState(es) {
  switch (es.readyState) {
    case es.CLOSED: {
      return "closed";
    }
    case es.CONNECTING: {
      return "connecting";
    }
    case es.OPEN: {
      return "open";
    }
    default:
      return "connecting";
  }
}
function multiReadFetchResponse(r) {
  let p = null;
  return {
    ...r,
    text() {
      if (!p) {
        p = r.text();
      }
      return p;
    },
    json() {
      if (!p) {
        p = r.text();
      }
      return p.then((x) => JSON.parse(x));
    }
  };
}
function formatPageInfo(pageInfo) {
  if (!pageInfo) {
    return void 0;
  }
  const res = {};
  for (const [k, v] of Object.entries(pageInfo)) {
    res[k] = {
      startCursor: v["start-cursor"],
      endCursor: v["end-cursor"],
      hasNextPage: v["has-next-page?"],
      hasPreviousPage: v["has-previous-page?"]
    };
  }
  return res;
}
function subscribe(query3, cb, opts) {
  let fetchErrorResponse;
  let closed = false;
  const localConnectionId = id_default();
  const es = new EventSource(`${opts.apiURI}/admin/subscribe-query?local_connection_id=${localConnectionId}`, {
    fetch(input, init2) {
      fetchErrorResponse = null;
      return fetch(input, {
        ...init2,
        method: "POST",
        headers: opts.headers,
        body: JSON.stringify({
          query: query3,
          "inference?": opts.inference,
          versions: {
            "@instantdb/admin": version_default2,
            "@instantdb/core": version_default
          }
        })
      }).then((r) => {
        if (!r.ok) {
          fetchErrorResponse = multiReadFetchResponse(r);
        }
        return r;
      });
    }
  });
  const subscribers = [];
  const onCloseSubscribers = [];
  const subscribe2 = /* @__PURE__ */ __name((cb2) => {
    subscribers.push(cb2);
  }, "subscribe");
  const unsubscribe = /* @__PURE__ */ __name((cb2) => {
    subscribers.splice(subscribers.indexOf(cb2), 1);
  }, "unsubscribe");
  const subscribeOnClose = /* @__PURE__ */ __name((cb2) => {
    onCloseSubscribers.push(cb2);
  }, "subscribeOnClose");
  if (cb) {
    subscribe2(cb);
  }
  let sessionParams = null;
  function deliver(result) {
    if (closed) {
      return;
    }
    for (const sub of subscribers) {
      try {
        sub(result);
      } catch (e) {
        console.error("Error in subscribeQuery callback", e);
      }
    }
  }
  __name(deliver, "deliver");
  function handleMessage(msg) {
    switch (msg.op) {
      case "sse-init": {
        const machineId = msg["machine-id"];
        const sessionId = msg["session-id"];
        sessionParams = { machineId, sessionId };
        break;
      }
      case "add-query-ok": {
        deliver({
          type: "ok",
          data: msg.result,
          pageInfo: formatPageInfo(msg["result-meta"]?.["page-info"]),
          sessionInfo: sessionParams
        });
        break;
      }
      case "refresh-ok": {
        if (msg.computations.length) {
          deliver({
            type: "ok",
            data: msg.computations[0]["instaql-result"],
            pageInfo: formatPageInfo(msg.computations[0]["result-meta"]?.["page-info"]),
            sessionInfo: sessionParams
          });
        }
        break;
      }
      case "error": {
        deliver({
          type: "error",
          error: new InstantAPIError({ body: msg, status: msg.status }),
          get readyState() {
            return esReadyState(es);
          },
          get isClosed() {
            return esReadyState(es) === "closed";
          },
          sessionInfo: sessionParams
        });
        break;
      }
    }
  }
  __name(handleMessage, "handleMessage");
  es.onerror = (e) => {
    if (fetchErrorResponse) {
      fetchErrorResponse.text().then((t) => {
        let body = { type: void 0, message: t };
        try {
          body = JSON.parse(t);
        } catch (_e) {
        }
        deliver({
          type: "error",
          error: new InstantAPIError({
            status: fetchErrorResponse.status,
            body
          }),
          get readyState() {
            return esReadyState(es);
          },
          get isClosed() {
            return esReadyState(es) === "closed";
          },
          sessionInfo: sessionParams
        });
      });
    } else {
      const deliverError = /* @__PURE__ */ __name(() => {
        deliver({
          type: "error",
          error: new InstantAPIError({
            status: e.code || 500,
            body: {
              type: void 0,
              message: e.message || "Unknown error in subscribe query."
            }
          }),
          get readyState() {
            return esReadyState(es);
          },
          get isClosed() {
            return esReadyState(es) === "closed";
          },
          sessionInfo: sessionParams
        });
      }, "deliverError");
      if (es.readyState === EventSource.CLOSED) {
        deliverError();
        return;
      }
      setTimeout(() => {
        if (es.readyState !== EventSource.OPEN) {
          deliverError();
        }
      }, 5e3);
    }
  };
  es.onmessage = (e) => {
    handleMessage(JSON.parse(e.data));
  };
  const close = /* @__PURE__ */ __name(() => {
    closed = true;
    for (const sub of onCloseSubscribers) {
      try {
        sub();
      } catch (e) {
        console.error("Error in onClose callback", e);
      }
    }
    es.close();
  }, "close");
  return {
    close,
    [Symbol.iterator]: () => {
      throw new Error("subscribeQuery does not support synchronous iteration. Use `for await` instead.");
    },
    get sessionInfo() {
      return sessionParams;
    },
    get readyState() {
      return esReadyState(es);
    },
    get isClosed() {
      return esReadyState(es) === "closed";
    },
    [Symbol.asyncIterator]: makeAsyncIterator.bind(this, subscribe2, subscribeOnClose, unsubscribe, () => 1)
  };
}
var init_subscribe = __esm({
  "node_modules/@instantdb/admin/dist/esm/subscribe.js"() {
    init_dist2();
    init_version3();
    init_esm2();
    __name(makeAsyncIterator, "makeAsyncIterator");
    __name(esReadyState, "esReadyState");
    __name(multiReadFetchResponse, "multiReadFetchResponse");
    __name(formatPageInfo, "formatPageInfo");
    __name(subscribe, "subscribe");
  }
});

// node_modules/cookie/dist/index.js
var require_dist = __commonJS({
  "node_modules/cookie/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseCookie = parseCookie2;
    exports.parse = parseCookie2;
    exports.stringifyCookie = stringifyCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    exports.parseSetCookie = parseSetCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    var cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
    var cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
    var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
    var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
    var maxAgeRegExp = /^-?\d+$/;
    var __toString = Object.prototype.toString;
    var NullObject = /* @__PURE__ */ (() => {
      const C = /* @__PURE__ */ __name(function() {
      }, "C");
      C.prototype = /* @__PURE__ */ Object.create(null);
      return C;
    })();
    function parseCookie2(str, options) {
      const obj = new NullObject();
      const len = str.length;
      if (len < 2)
        return obj;
      const dec = options?.decode || decode3;
      let index = 0;
      do {
        const eqIdx = eqIndex(str, index, len);
        if (eqIdx === -1)
          break;
        const endIdx = endIndex(str, index, len);
        if (eqIdx > endIdx) {
          index = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        const key = valueSlice(str, index, eqIdx);
        if (obj[key] === void 0) {
          obj[key] = dec(valueSlice(str, eqIdx + 1, endIdx));
        }
        index = endIdx + 1;
      } while (index < len);
      return obj;
    }
    __name(parseCookie2, "parseCookie");
    function stringifyCookie(cookie, options) {
      const enc = options?.encode || encodeURIComponent;
      const cookieStrings = [];
      for (const name of Object.keys(cookie)) {
        const val = cookie[name];
        if (val === void 0)
          continue;
        if (!cookieNameRegExp.test(name)) {
          throw new TypeError(`cookie name is invalid: ${name}`);
        }
        const value = enc(val);
        if (!cookieValueRegExp.test(value)) {
          throw new TypeError(`cookie val is invalid: ${val}`);
        }
        cookieStrings.push(`${name}=${value}`);
      }
      return cookieStrings.join("; ");
    }
    __name(stringifyCookie, "stringifyCookie");
    function stringifySetCookie(_name, _val, _opts) {
      const cookie = typeof _name === "object" ? _name : { ..._opts, name: _name, value: String(_val) };
      const options = typeof _val === "object" ? _val : _opts;
      const enc = options?.encode || encodeURIComponent;
      if (!cookieNameRegExp.test(cookie.name)) {
        throw new TypeError(`argument name is invalid: ${cookie.name}`);
      }
      const value = cookie.value ? enc(cookie.value) : "";
      if (!cookieValueRegExp.test(value)) {
        throw new TypeError(`argument val is invalid: ${cookie.value}`);
      }
      let str = cookie.name + "=" + value;
      if (cookie.maxAge !== void 0) {
        if (!Number.isInteger(cookie.maxAge)) {
          throw new TypeError(`option maxAge is invalid: ${cookie.maxAge}`);
        }
        str += "; Max-Age=" + cookie.maxAge;
      }
      if (cookie.domain) {
        if (!domainValueRegExp.test(cookie.domain)) {
          throw new TypeError(`option domain is invalid: ${cookie.domain}`);
        }
        str += "; Domain=" + cookie.domain;
      }
      if (cookie.path) {
        if (!pathValueRegExp.test(cookie.path)) {
          throw new TypeError(`option path is invalid: ${cookie.path}`);
        }
        str += "; Path=" + cookie.path;
      }
      if (cookie.expires) {
        if (!isDate(cookie.expires) || !Number.isFinite(cookie.expires.valueOf())) {
          throw new TypeError(`option expires is invalid: ${cookie.expires}`);
        }
        str += "; Expires=" + cookie.expires.toUTCString();
      }
      if (cookie.httpOnly) {
        str += "; HttpOnly";
      }
      if (cookie.secure) {
        str += "; Secure";
      }
      if (cookie.partitioned) {
        str += "; Partitioned";
      }
      if (cookie.priority) {
        const priority = typeof cookie.priority === "string" ? cookie.priority.toLowerCase() : void 0;
        switch (priority) {
          case "low":
            str += "; Priority=Low";
            break;
          case "medium":
            str += "; Priority=Medium";
            break;
          case "high":
            str += "; Priority=High";
            break;
          default:
            throw new TypeError(`option priority is invalid: ${cookie.priority}`);
        }
      }
      if (cookie.sameSite) {
        const sameSite = typeof cookie.sameSite === "string" ? cookie.sameSite.toLowerCase() : cookie.sameSite;
        switch (sameSite) {
          case true:
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError(`option sameSite is invalid: ${cookie.sameSite}`);
        }
      }
      return str;
    }
    __name(stringifySetCookie, "stringifySetCookie");
    function parseSetCookie(str, options) {
      const dec = options?.decode || decode3;
      const len = str.length;
      const endIdx = endIndex(str, 0, len);
      const eqIdx = eqIndex(str, 0, endIdx);
      const setCookie = eqIdx === -1 ? { name: "", value: dec(valueSlice(str, 0, endIdx)) } : {
        name: valueSlice(str, 0, eqIdx),
        value: dec(valueSlice(str, eqIdx + 1, endIdx))
      };
      let index = endIdx + 1;
      while (index < len) {
        const endIdx2 = endIndex(str, index, len);
        const eqIdx2 = eqIndex(str, index, endIdx2);
        const attr = eqIdx2 === -1 ? valueSlice(str, index, endIdx2) : valueSlice(str, index, eqIdx2);
        const val = eqIdx2 === -1 ? void 0 : valueSlice(str, eqIdx2 + 1, endIdx2);
        switch (attr.toLowerCase()) {
          case "httponly":
            setCookie.httpOnly = true;
            break;
          case "secure":
            setCookie.secure = true;
            break;
          case "partitioned":
            setCookie.partitioned = true;
            break;
          case "domain":
            setCookie.domain = val;
            break;
          case "path":
            setCookie.path = val;
            break;
          case "max-age":
            if (val && maxAgeRegExp.test(val))
              setCookie.maxAge = Number(val);
            break;
          case "expires":
            if (!val)
              break;
            const date2 = new Date(val);
            if (Number.isFinite(date2.valueOf()))
              setCookie.expires = date2;
            break;
          case "priority":
            if (!val)
              break;
            const priority = val.toLowerCase();
            if (priority === "low" || priority === "medium" || priority === "high") {
              setCookie.priority = priority;
            }
            break;
          case "samesite":
            if (!val)
              break;
            const sameSite = val.toLowerCase();
            if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
              setCookie.sameSite = sameSite;
            }
            break;
        }
        index = endIdx2 + 1;
      }
      return setCookie;
    }
    __name(parseSetCookie, "parseSetCookie");
    function endIndex(str, min, len) {
      const index = str.indexOf(";", min);
      return index === -1 ? len : index;
    }
    __name(endIndex, "endIndex");
    function eqIndex(str, min, max) {
      const index = str.indexOf("=", min);
      return index < max ? index : -1;
    }
    __name(eqIndex, "eqIndex");
    function valueSlice(str, min, max) {
      let start = min;
      let end = max;
      do {
        const code = str.charCodeAt(start);
        if (code !== 32 && code !== 9)
          break;
      } while (++start < end);
      while (end > start) {
        const code = str.charCodeAt(end - 1);
        if (code !== 32 && code !== 9)
          break;
        end--;
      }
      return str.slice(start, end);
    }
    __name(valueSlice, "valueSlice");
    function decode3(str) {
      if (str.indexOf("%") === -1)
        return str;
      try {
        return decodeURIComponent(str);
      } catch (e) {
        return str;
      }
    }
    __name(decode3, "decode");
    function isDate(val) {
      return __toString.call(val) === "[object Date]";
    }
    __name(isDate, "isDate");
  }
});

// node_modules/@instantdb/admin/dist/esm/index.js
function instantConfigWithDefaults(config) {
  const defaultConfig = {
    apiURI: "https://api.instantdb.com"
  };
  const r = { ...defaultConfig, ...config };
  return r;
}
function withImpersonation(headers, opts) {
  if ("email" in opts) {
    headers["as-email"] = opts.email;
  } else if ("token" in opts) {
    headers["as-token"] = opts.token;
  } else if ("guest" in opts) {
    headers["as-guest"] = "true";
  }
  return headers;
}
function validateConfigAndImpersonation(config, impersonationOpts) {
  if (impersonationOpts && ("token" in impersonationOpts || "guest" in impersonationOpts)) {
    return;
  }
  if (config.adminToken) {
    return;
  }
  if (impersonationOpts && "email" in impersonationOpts) {
    throw new Error("Admin token required. To impersonate users with an email you must pass `adminToken` to `init`.");
  }
  throw new Error("Admin token required. To run this operation pass `adminToken` to `init`, or use `db.asUser`.");
}
function authorizedHeaders(config, impersonationOpts) {
  validateConfigAndImpersonation(config, impersonationOpts);
  const { adminToken, appId } = config;
  const headers = {
    "content-type": "application/json",
    "app-id": appId
  };
  if (adminToken) {
    headers.authorization = `Bearer ${adminToken}`;
  }
  return impersonationOpts ? withImpersonation(headers, impersonationOpts) : headers;
}
function isNextJSVersionThatCachesFetchByDefault() {
  return (
    // NextJS 13 onwards added a `__nextPatched` property to the fetch function
    fetch["__nextPatched"] && // NextJS 15 onwards _also_ added a global `next-patch` symbol.
    !globalThis[Symbol.for("next-patch")]
  );
}
function getDefaultFetchOpts() {
  return isNextJSVersionThatCachesFetchByDefault() ? { cache: "no-store" } : {};
}
async function jsonReject(rejectFn, res) {
  const body = await res.text();
  try {
    const json2 = JSON.parse(body);
    return rejectFn(new InstantAPIError({ status: res.status, body: json2 }));
  } catch (_e) {
    return rejectFn(new InstantAPIError({
      status: res.status,
      body: { type: void 0, message: body }
    }));
  }
}
async function jsonFetch2(input, init2) {
  const defaultFetchOpts = getDefaultFetchOpts();
  const headers = {
    ...init2?.headers || {},
    "Instant-Admin-Version": version_default2,
    "Instant-Core-Version": version_default
  };
  const res = await fetch(input, { ...defaultFetchOpts, ...init2, headers });
  if (res.status === 200) {
    const json2 = await res.json();
    return Promise.resolve(json2);
  }
  return jsonReject((x) => Promise.reject(x), res);
}
function init(config) {
  if (!config.appId || !validate_default(config.appId)) {
    console.warn("warning: Instant Admin DB must be initialized with a valid appId. Received: " + JSON.stringify(config.appId));
  }
  const configStrict = {
    ...config,
    appId: config.appId?.trim(),
    adminToken: config.adminToken?.trim(),
    useDateObjects: config.useDateObjects ?? false
  };
  return new InstantAdminDatabase(configStrict);
}
function steps(inputChunks) {
  const chunks = Array.isArray(inputChunks) ? inputChunks : [inputChunks];
  return chunks.flatMap(getOps);
}
var import_cookie3, Rooms, Auth, isNodeReadable, isWebReadable, Storage, InstantAdminDatabase;
var init_esm3 = __esm({
  "node_modules/@instantdb/admin/dist/esm/index.js"() {
    init_esm_browser();
    init_esm2();
    init_version3();
    init_subscribe();
    import_cookie3 = __toESM(require_dist(), 1);
    __name(instantConfigWithDefaults, "instantConfigWithDefaults");
    __name(withImpersonation, "withImpersonation");
    __name(validateConfigAndImpersonation, "validateConfigAndImpersonation");
    __name(authorizedHeaders, "authorizedHeaders");
    __name(isNextJSVersionThatCachesFetchByDefault, "isNextJSVersionThatCachesFetchByDefault");
    __name(getDefaultFetchOpts, "getDefaultFetchOpts");
    __name(jsonReject, "jsonReject");
    __name(jsonFetch2, "jsonFetch");
    __name(init, "init");
    __name(steps, "steps");
    Rooms = class {
      static {
        __name(this, "Rooms");
      }
      config;
      constructor(config) {
        this.config = config;
      }
      async getPresence(roomType, roomId) {
        const res = await jsonFetch2(`${this.config.apiURI}/admin/rooms/presence?room-type=${String(roomType)}&room-id=${roomId}`, {
          method: "GET",
          headers: authorizedHeaders(this.config)
        });
        return res.sessions || {};
      }
    };
    Auth = class {
      static {
        __name(this, "Auth");
      }
      config;
      constructor(config) {
        this.config = config;
        this.createToken = this.createToken.bind(this);
      }
      /**
       * Generates a magic code for the user with the given email.
       * This is useful if you want to use your own email provider
       * to send magic codes.
       *
       * @example
       *   // Generate a magic code
       *   const { code } = await db.auth.generateMagicCode({ email })
       *   // Send the magic code to the user with your own email provider
       *   await customEmailProvider.sendMagicCode(email, code)
       *
       * @see https://instantdb.com/docs/backend#custom-magic-codes
       */
      generateMagicCode = /* @__PURE__ */ __name(async (email) => {
        return jsonFetch2(`${this.config.apiURI}/admin/magic_code`, {
          method: "POST",
          headers: authorizedHeaders(this.config),
          body: JSON.stringify({ email })
        });
      }, "generateMagicCode");
      /**
       * Sends a magic code to the user with the given email.
       * This uses Instant's built-in email provider.
       *
       * @example
       *   // Send an email to user with magic code
       *   await db.auth.sendMagicCode({ email })
       *
       * @see https://instantdb.com/docs/backend#custom-magic-codes
       */
      sendMagicCode = /* @__PURE__ */ __name(async (email) => {
        return jsonFetch2(`${this.config.apiURI}/admin/send_magic_code`, {
          method: "POST",
          headers: authorizedHeaders(this.config),
          body: JSON.stringify({ email })
        });
      }, "sendMagicCode");
      /**
       * Verifies a magic code for the user with the given email.
       *
       * @example
       *   const user = await db.auth.verifyMagicCode({ email, code })
       *   console.log("Verified user:", user)
       *
       * @see https://instantdb.com/docs/backend#custom-magic-codes
       */
      verifyMagicCode = /* @__PURE__ */ __name(async (email, code) => {
        const { user } = await jsonFetch2(`${this.config.apiURI}/admin/verify_magic_code`, {
          method: "POST",
          headers: authorizedHeaders(this.config),
          body: JSON.stringify({ email, code })
        });
        return user;
      }, "verifyMagicCode");
      async createToken(input) {
        const body = typeof input === "string" ? { email: input } : input;
        const ret = await jsonFetch2(`${this.config.apiURI}/admin/refresh_tokens`, {
          method: "POST",
          headers: authorizedHeaders(this.config),
          body: JSON.stringify(body)
        });
        return ret.user.refresh_token;
      }
      /**
       * Verifies a given token and returns the associated user.
       *
       * This is often useful for writing custom endpoints, where you need
       * to authenticate users.
       *
       * @example
       *   app.post('/custom_endpoint', async (req, res) => {
       *     const user = await db.auth.verifyToken(req.headers['token'])
       *     if (!user) {
       *       return res.status(401).send('Uh oh, you are not authenticated')
       *     }
       *     // ...
       *   })
       * @see https://instantdb.com/docs/backend#custom-endpoints
       */
      verifyToken = /* @__PURE__ */ __name(async (token) => {
        const res = await jsonFetch2(`${this.config.apiURI}/runtime/auth/verify_refresh_token`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            "app-id": this.config.appId,
            "refresh-token": token
          })
        });
        return res.user;
      }, "verifyToken");
      /**
       * Retrieves an app user by id, email, or refresh token.
       *
       * @example
       *   try {
       *     const user = await db.auth.getUser({ email })
       *     console.log("Found user:", user)
       *   } catch (err) {
       *     console.error("Failed to retrieve user:", err.message);
       *   }
       *
       * @see https://instantdb.com/docs/backend#retrieve-a-user
       */
      getUser = /* @__PURE__ */ __name(async (params) => {
        const qs = Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");
        const response = await jsonFetch2(`${this.config.apiURI}/admin/users?${qs}`, {
          method: "GET",
          headers: authorizedHeaders(this.config)
        });
        return response.user;
      }, "getUser");
      /**
       * Deletes an app user by id, email, or refresh token.
       *
       * NB: This _only_ deletes the user; it does not delete all user data.
       * You will need to handle this manually.
       *
       * @example
       *   try {
       *     const deletedUser = await db.auth.deleteUser({ email })
       *     console.log("Deleted user:", deletedUser)
       *   } catch (err) {
       *     console.error("Failed to delete user:", err.message);
       *   }
       *
       * @see https://instantdb.com/docs/backend#delete-a-user
       */
      deleteUser = /* @__PURE__ */ __name(async (params) => {
        const qs = Object.entries(params).map(([k, v]) => `${k}=${v}`);
        const response = await jsonFetch2(`${this.config.apiURI}/admin/users?${qs}`, {
          method: "DELETE",
          headers: authorizedHeaders(this.config)
        });
        return response.deleted;
      }, "deleteUser");
      async signOut(input) {
        const params = typeof input === "string" ? { email: input } : input;
        const config = this.config;
        await jsonFetch2(`${config.apiURI}/admin/sign_out`, {
          method: "POST",
          headers: authorizedHeaders(config),
          body: JSON.stringify(params)
        });
      }
      /**
       * Get instant user from Request
       *
       * Reads cookies and gets a validated user
       * @param req The request containing a cookie synced with createInstantRouteHandler
       * @param opts Allow disabling validation of refresh token
       */
      getUserFromRequest = /* @__PURE__ */ __name(async (req, opts) => {
        const cookieHeader = req.headers.get("cookie") || "";
        const parsedCookie = (0, import_cookie3.parseCookie)(cookieHeader);
        const cookieName = "instant_user_" + this.config.appId;
        if (!parsedCookie[cookieName]) {
          return null;
        }
        const value = parsedCookie[cookieName];
        const user = JSON.parse(value);
        if (!user?.refresh_token) {
          return null;
        }
        if (opts?.disableValidation) {
          return user;
        }
        const verified = await this.verifyToken(user.refresh_token);
        return verified;
      }, "getUserFromRequest");
    };
    isNodeReadable = /* @__PURE__ */ __name((v) => v && typeof v === "object" && typeof v.pipe === "function" && typeof v.read === "function", "isNodeReadable");
    isWebReadable = /* @__PURE__ */ __name((v) => v && typeof v.getReader === "function", "isWebReadable");
    Storage = class {
      static {
        __name(this, "Storage");
      }
      config;
      impersonationOpts;
      constructor(config, impersonationOpts) {
        this.config = config;
        this.impersonationOpts = impersonationOpts;
      }
      /**
       * Uploads file at the provided path. Accepts a Buffer or a Readable stream.
       *
       * @see https://instantdb.com/docs/storage
       * @example
       *   const buffer = fs.readFileSync('demo.png');
       *   const isSuccess = await db.storage.uploadFile('photos/demo.png', buffer);
       */
      uploadFile = /* @__PURE__ */ __name(async (path, file, metadata = {}) => {
        const headers = {
          ...authorizedHeaders(this.config, this.impersonationOpts),
          path
        };
        if (metadata.contentDisposition) {
          headers["content-disposition"] = metadata.contentDisposition;
        }
        delete headers["content-type"];
        if (metadata.contentType) {
          headers["content-type"] = metadata.contentType;
        }
        let duplex;
        if (isNodeReadable(file)) {
          duplex = "half";
        }
        if (isNodeReadable(file) || isWebReadable(file)) {
          if (!metadata.fileSize) {
            throw new Error("fileSize is required in metadata when uploading streams");
          }
          headers["content-length"] = metadata.fileSize.toString();
        }
        let options = {
          method: "PUT",
          headers,
          body: file,
          ...duplex && { duplex }
        };
        return jsonFetch2(`${this.config.apiURI}/admin/storage/upload`, options);
      }, "uploadFile");
      /**
       * Deletes a file by its path name (e.g. "photos/demo.png").
       *
       * @see https://instantdb.com/docs/storage
       * @example
       *   await db.storage.delete("photos/demo.png");
       */
      delete = /* @__PURE__ */ __name(async (pathname) => {
        return jsonFetch2(`${this.config.apiURI}/admin/storage/files?filename=${encodeURIComponent(pathname)}`, {
          method: "DELETE",
          headers: authorizedHeaders(this.config, this.impersonationOpts)
        });
      }, "delete");
      /**
       * Deletes multiple files by their path names (e.g. "photos/demo.png", "essays/demo.txt").
       *
       * @see https://instantdb.com/docs/storage
       * @example
       *   await db.storage.deleteMany(["images/1.png", "images/2.png", "images/3.png"]);
       */
      deleteMany = /* @__PURE__ */ __name(async (pathnames) => {
        return jsonFetch2(`${this.config.apiURI}/admin/storage/files/delete`, {
          method: "POST",
          headers: authorizedHeaders(this.config, this.impersonationOpts),
          body: JSON.stringify({ filenames: pathnames })
        });
      }, "deleteMany");
      /**
       * @deprecated. This method will be removed in the future. Use `uploadFile`
       * instead
       */
      upload = /* @__PURE__ */ __name(async (pathname, file, metadata = {}) => {
        const { data: presignedUrl } = await jsonFetch2(`${this.config.apiURI}/admin/storage/signed-upload-url`, {
          method: "POST",
          headers: authorizedHeaders(this.config),
          body: JSON.stringify({
            app_id: this.config.appId,
            filename: pathname
          })
        });
        const headers = {};
        const contentType = metadata.contentType;
        if (contentType) {
          headers["Content-Type"] = contentType;
        }
        const { ok } = await fetch(presignedUrl, {
          method: "PUT",
          body: file,
          headers
        });
        return ok;
      }, "upload");
      /**
       * @deprecated. This method will be removed in the future. Use `query` instead
       * @example
       * const files = await db.query({ $files: {}})
       */
      list = /* @__PURE__ */ __name(async () => {
        const { data } = await jsonFetch2(`${this.config.apiURI}/admin/storage/files`, {
          method: "GET",
          headers: authorizedHeaders(this.config)
        });
        return data;
      }, "list");
      /**
       * @deprecated. getDownloadUrl will be removed in the future.
       * Use `query` instead to query and fetch for valid urls
       *
       * db.useQuery({
       *   $files: {
       *     $: {
       *       where: {
       *         path: "moop.png"
       *       }
       *     }
       *   }
       * })
       */
      getDownloadUrl = /* @__PURE__ */ __name(async (pathname) => {
        const { data } = await jsonFetch2(`${this.config.apiURI}/admin/storage/signed-download-url?app_id=${this.config.appId}&filename=${encodeURIComponent(pathname)}`, {
          method: "GET",
          headers: authorizedHeaders(this.config)
        });
        return data;
      }, "getDownloadUrl");
    };
    InstantAdminDatabase = class _InstantAdminDatabase {
      static {
        __name(this, "InstantAdminDatabase");
      }
      config;
      auth;
      storage;
      rooms;
      impersonationOpts;
      tx = txInit();
      constructor(_config) {
        this.config = instantConfigWithDefaults(_config);
        this.auth = new Auth(this.config);
        this.storage = new Storage(this.config, this.impersonationOpts);
        this.rooms = new Rooms(this.config);
      }
      /**
       * Sometimes you want to scope queries to a specific user.
       *
       * You can provide a user's auth token, email, or impersonate a guest.
       *
       * @see https://instantdb.com/docs/backend#impersonating-users
       * @example
       *  await db.asUser({email: "stopa@instantdb.com"}).query({ goals: {} })
       */
      asUser = /* @__PURE__ */ __name((opts) => {
        const newClient = new _InstantAdminDatabase({
          ...this.config
        });
        newClient.impersonationOpts = opts;
        newClient.storage = new Storage(this.config, opts);
        return newClient;
      }, "asUser");
      /**
       * Use this to query your data!
       *
       * @see https://instantdb.com/docs/instaql
       *
       * @example
       *  // fetch all goals
       *  await db.query({ goals: {} })
       *
       *  // goals where the title is "Get Fit"
       *  await db.query({ goals: { $: { where: { title: "Get Fit" } } } })
       *
       *  // all goals, _alongside_ their todos
       *  await db.query({ goals: { todos: {} } })
       */
      query = /* @__PURE__ */ __name((query3, opts = {}) => {
        if (query3 && opts && "ruleParams" in opts) {
          query3 = { $$ruleParams: opts["ruleParams"], ...query3 };
        }
        if (!this.config.disableValidation) {
          validateQuery(query3, this.config.schema);
        }
        const fetchOpts = opts.fetchOpts || {};
        const fetchOptsHeaders = fetchOpts["headers"] || {};
        return jsonFetch2(`${this.config.apiURI}/admin/query`, {
          ...fetchOpts,
          method: "POST",
          headers: {
            ...fetchOptsHeaders,
            ...authorizedHeaders(this.config, this.impersonationOpts)
          },
          body: JSON.stringify({
            query: query3,
            "inference?": !!this.config.schema
          })
        });
      }, "query");
      /**
       * Use this to to get a live view of your data!
       *
       * @see https://www.instantdb.com/docs/backend
       *
       * @example
       *  // create a subscription to a query
       *  const query = { goals: { $: { where: { title: "Get Fit" } } } }
       *  const sub = db.subscribeQuery(query);
       *
       *  // iterate through the results with an async iterator
       *  for await (const payload of sub) {
       *    if (payload.error) {
       *      console.log(payload.error);
       *      // Stop the subscription
       *      sub.close();
       *    } else {
       *      console.log(payload.data);
       *    }
       *  }
       *
       *  // Stop the subscription
       *  sub.close();
       *
       *  // Create a subscription with a callback
       *  const sub = db.subscribeQuery(query, (payload) => {
       *    if (payload.error) {
       *      console.log(payload.error);
       *      // Stop the subscription
       *      sub.close();
       *    } else {
       *      console.log(payload.data);
       *    }
       *  });
       */
      subscribeQuery(query3, cb, opts = {}) {
        if (query3 && opts && "ruleParams" in opts) {
          query3 = { $$ruleParams: opts["ruleParams"], ...query3 };
        }
        if (!this.config.disableValidation) {
          validateQuery(query3, this.config.schema);
        }
        const fetchOpts = opts.fetchOpts || {};
        const fetchOptsHeaders = fetchOpts["headers"] || {};
        const headers = {
          ...fetchOptsHeaders,
          ...authorizedHeaders(this.config, this.impersonationOpts)
        };
        const inference = !!this.config.schema;
        return subscribe(query3, cb, {
          headers,
          inference,
          apiURI: this.config.apiURI
        });
      }
      /**
       * Use this to write data! You can create, update, delete, and link objects
       *
       * @see https://instantdb.com/docs/instaml
       *
       * @example
       *   // Create a new object in the `goals` namespace
       *   const goalId = id();
       *   db.transact(db.tx.goals[goalId].update({title: "Get fit"}))
       *
       *   // Update the title
       *   db.transact(db.tx.goals[goalId].update({title: "Get super fit"}))
       *
       *   // Delete it
       *   db.transact(db.tx.goals[goalId].delete())
       *
       *   // Or create an association:
       *   todoId = id();
       *   db.transact([
       *    db.tx.todos[todoId].update({ title: 'Go on a run' }),
       *    db.tx.goals[goalId].link({todos: todoId}),
       *  ])
       */
      transact = /* @__PURE__ */ __name((inputChunks) => {
        if (!this.config.disableValidation) {
          validateTransactions(inputChunks, this.config.schema);
        }
        return jsonFetch2(`${this.config.apiURI}/admin/transact`, {
          method: "POST",
          headers: authorizedHeaders(this.config, this.impersonationOpts),
          body: JSON.stringify({
            steps: steps(inputChunks),
            "throw-on-missing-attrs?": !!this.config.schema
          })
        });
      }, "transact");
      /**
       * Like `query`, but returns debugging information
       * for permissions checks along with the result.
       * Useful for inspecting the values returned by the permissions checks.
       * Note, this will return debug information for *all* entities
       * that match the query's `where` clauses.
       *
       * Requires a user/guest context to be set with `asUser`,
       * since permissions checks are user-specific.
       *
       * Accepts an optional configuration object with a `rules` key.
       * The provided rules will override the rules in the database for the query.
       *
       * @see https://instantdb.com/docs/instaql
       *
       * @example
       *  await db.asUser({ guest: true }).debugQuery(
       *    { goals: {} },
       *    { rules: { goals: { allow: { read: "auth.id != null" } } }
       *  )
       */
      debugQuery = /* @__PURE__ */ __name(async (query3, opts) => {
        if (query3 && opts && "ruleParams" in opts) {
          query3 = { $$ruleParams: opts["ruleParams"], ...query3 };
        }
        const body = { query: query3, "rules-override": opts?.rules };
        if (opts?.ip) {
          body["ip-override"] = opts.ip;
        }
        if (opts?.origin) {
          body["origin-override"] = opts.origin;
        }
        const response = await jsonFetch2(`${this.config.apiURI}/admin/query_perms_check`, {
          method: "POST",
          headers: authorizedHeaders(this.config, this.impersonationOpts),
          body: JSON.stringify(body)
        });
        return {
          result: response.result,
          checkResults: response["check-results"]
        };
      }, "debugQuery");
      /**
       * Like `transact`, but does not write to the database.
       * Returns debugging information for permissions checks.
       * Useful for inspecting the values returned by the permissions checks.
       *
       * Requires a user/guest context to be set with `asUser`,
       * since permissions checks are user-specific.
       *
       * Accepts an optional configuration object with a `rules` key.
       * The provided rules will override the rules in the database for the duration of the transaction.
       *
       * @example
       *   const goalId = id();
       *   db.asUser({ guest: true }).debugTransact(
       *      [db.tx.goals[goalId].update({title: "Get fit"})],
       *      { rules: { goals: { allow: { update: "auth.id != null" } } }
       *   )
       */
      debugTransact = /* @__PURE__ */ __name((inputChunks, opts) => {
        const body = {
          steps: steps(inputChunks),
          "rules-override": opts?.rules,
          // @ts-expect-error because we're using a private API (for now)
          "dangerously-commit-tx": opts?.__dangerouslyCommit
        };
        if (opts?.ip) {
          body["ip-override"] = opts.ip;
        }
        if (opts?.origin) {
          body["origin-override"] = opts.origin;
        }
        return jsonFetch2(`${this.config.apiURI}/admin/transact_perms_check`, {
          method: "POST",
          headers: authorizedHeaders(this.config, this.impersonationOpts),
          body: JSON.stringify(body)
        });
      }, "debugTransact");
    };
  }
});

// utils/instant.ts
var instant_exports = {};
__export(instant_exports, {
  getDB: () => getDB,
  id: () => id_default
});
function getDB(env) {
  const schema2 = i.schema({
    entities: {
      articlesStats: i.entity({
        articleId: i.string().indexed(),
        commentCount: i.number(),
        likeCount: i.number(),
        viewCount: i.number(),
        lastCommentAt: i.date(),
        updatedAt: i.date(),
        shareCount: i.number(),
        signals: i.json()
      }),
      comments: i.entity({
        id: i.string().unique().indexed(),
        articleId: i.string().indexed(),
        creator: i.json(),
        content: i.string(),
        notes: i.number(),
        upvotes: i.json(),
        signals: i.json(),
        created: i.date().indexed(),
        modified: i.date().indexed()
      }),
      notifications: i.entity({
        id: i.string().unique().indexed(),
        recipientUserId: i.string().indexed(),
        type: i.string().indexed(),
        title: i.string(),
        body: i.string(),
        data: i.json(),
        read: i.boolean().indexed(),
        actorUserId: i.string().optional(),
        articleId: i.string().optional(),
        commentId: i.string().optional(),
        createdAt: i.date().indexed()
      })
    }
  });
  return init({
    appId: env.INSTANT_APP_ID,
    adminToken: env.INSTANT_ADMIN_TOKEN,
    schema: schema2
  });
}
var init_instant = __esm({
  "utils/instant.ts"() {
    "use strict";
    init_esm3();
    __name(getDB, "getDB");
  }
});

// node_modules/hono/dist/compose.js
var compose = /* @__PURE__ */ __name((middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i2) {
      if (i2 <= index) {
        throw new Error("next() called multiple times");
      }
      index = i2;
      let res;
      let isError = false;
      let handler;
      if (middleware[i2]) {
        handler = middleware[i2][0][0];
        context.req.routeIndex = i2;
      } else {
        handler = i2 === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context, () => dispatch(i2 + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context.error = err;
            res = await onError(err, context);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
    __name(dispatch, "dispatch");
  };
}, "compose");

// node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT = Symbol();

// node_modules/hono/dist/utils/body.js
var parseBody = /* @__PURE__ */ __name(async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
    return parseFormData(request, { all, dot });
  }
  return {};
}, "parseBody");
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
__name(parseFormData, "parseFormData");
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
__name(convertFormDataToBodyData, "convertFormDataToBodyData");
var handleParsingAllValues = /* @__PURE__ */ __name((form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      ;
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
}, "handleParsingAllValues");
var handleParsingNestedValues = /* @__PURE__ */ __name((form, key, value) => {
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
}, "handleParsingNestedValues");

// node_modules/hono/dist/utils/url.js
var splitPath = /* @__PURE__ */ __name((path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
}, "splitPath");
var splitRoutingPath = /* @__PURE__ */ __name((routePath) => {
  const { groups: groups2, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups2);
}, "splitRoutingPath");
var extractGroupsFromPath = /* @__PURE__ */ __name((path) => {
  const groups2 = [];
  path = path.replace(/\{[^}]+\}/g, (match, index) => {
    const mark = `@${index}`;
    groups2.push([mark, match]);
    return mark;
  });
  return { groups: groups2, path };
}, "extractGroupsFromPath");
var replaceGroupMarks = /* @__PURE__ */ __name((paths, groups2) => {
  for (let i2 = groups2.length - 1; i2 >= 0; i2--) {
    const [mark] = groups2[i2];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups2[i2][1]);
        break;
      }
    }
  }
  return paths;
}, "replaceGroupMarks");
var patternCache = {};
var getPattern = /* @__PURE__ */ __name((label, next) => {
  if (label === "*") {
    return "*";
  }
  const match = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match[1], new RegExp(`^${match[2]}(?=/${next})`)] : [label, match[1], new RegExp(`^${match[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
}, "getPattern");
var tryDecode = /* @__PURE__ */ __name((str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match) => {
      try {
        return decoder(match);
      } catch {
        return match;
      }
    });
  }
}, "tryDecode");
var tryDecodeURI = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURI), "tryDecodeURI");
var getPath = /* @__PURE__ */ __name((request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i2 = start;
  for (; i2 < url.length; i2++) {
    const charCode = url.charCodeAt(i2);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i2);
      const path = url.slice(start, queryIndex === -1 ? void 0 : queryIndex);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63) {
      break;
    }
  }
  return url.slice(start, i2);
}, "getPath");
var getPathNoStrict = /* @__PURE__ */ __name((request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
}, "getPathNoStrict");
var mergePath = /* @__PURE__ */ __name((base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
}, "mergePath");
var checkOptionalParameter = /* @__PURE__ */ __name((path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i2, a) => a.indexOf(v) === i2);
}, "checkOptionalParameter");
var _decodeURI = /* @__PURE__ */ __name((value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
}, "_decodeURI");
var _getQueryParam = /* @__PURE__ */ __name((url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf(`?${key}`, 8);
    if (keyIndex2 === -1) {
      keyIndex2 = url.indexOf(`&${key}`, 8);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
}, "_getQueryParam");
var getQueryParam = _getQueryParam;
var getQueryParams = /* @__PURE__ */ __name((url, key) => {
  return _getQueryParam(url, key, true);
}, "getQueryParams");
var decodeURIComponent_ = decodeURIComponent;

// node_modules/hono/dist/request.js
var tryDecodeURIComponent = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURIComponent_), "tryDecodeURIComponent");
var HonoRequest = class {
  static {
    __name(this, "HonoRequest");
  }
  raw;
  #validatedData;
  #matchResult;
  routeIndex = 0;
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param && /\%/.test(param) ? tryDecodeURIComponent(param) : param;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== void 0) {
        decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return this.bodyCache.parsedBody ??= await parseBody(this, options);
  }
  #cachedBody = /* @__PURE__ */ __name((key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw2[key]();
  }, "#cachedBody");
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  text() {
    return this.#cachedBody("text");
  }
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  blob() {
    return this.#cachedBody("blob");
  }
  formData() {
    return this.#cachedBody("formData");
  }
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = /* @__PURE__ */ __name((value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
}, "raw");
var resolveCallback = /* @__PURE__ */ __name(async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
}, "resolveCallback");

// node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = /* @__PURE__ */ __name((contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
}, "setDefaultContentType");
var Context = class {
  static {
    __name(this, "Context");
  }
  #rawRequest;
  #req;
  env = {};
  #var;
  finalized = false;
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  get res() {
    return this.#res ||= new Response(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  set res(_res) {
    if (this.#res && _res) {
      _res = new Response(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  render = /* @__PURE__ */ __name((...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  }, "render");
  setLayout = /* @__PURE__ */ __name((layout) => this.#layout = layout, "setLayout");
  getLayout = /* @__PURE__ */ __name(() => this.#layout, "getLayout");
  setRenderer = /* @__PURE__ */ __name((renderer) => {
    this.#renderer = renderer;
  }, "setRenderer");
  header = /* @__PURE__ */ __name((name, value, options) => {
    if (this.finalized) {
      this.#res = new Response(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
      headers.delete(name);
    } else if (options?.append) {
      headers.append(name, value);
    } else {
      headers.set(name, value);
    }
  }, "header");
  status = /* @__PURE__ */ __name((status) => {
    this.#status = status;
  }, "status");
  set = /* @__PURE__ */ __name((key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  }, "set");
  get = /* @__PURE__ */ __name((key) => {
    return this.#var ? this.#var.get(key) : void 0;
  }, "get");
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
    if (typeof arg === "object" && "headers" in arg) {
      const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
      for (const [key, value] of argHeaders) {
        if (key.toLowerCase() === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      for (const [k, v] of Object.entries(headers)) {
        if (typeof v === "string") {
          responseHeaders.set(k, v);
        } else {
          responseHeaders.delete(k);
          for (const v2 of v) {
            responseHeaders.append(k, v2);
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return new Response(data, { status, headers: responseHeaders });
  }
  newResponse = /* @__PURE__ */ __name((...args) => this.#newResponse(...args), "newResponse");
  body = /* @__PURE__ */ __name((data, arg, headers) => this.#newResponse(data, arg, headers), "body");
  text = /* @__PURE__ */ __name((text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
      text,
      arg,
      setDefaultContentType(TEXT_PLAIN, headers)
    );
  }, "text");
  json = /* @__PURE__ */ __name((object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType("application/json", headers)
    );
  }, "json");
  html = /* @__PURE__ */ __name((html, arg, headers) => {
    const res = /* @__PURE__ */ __name((html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers)), "res");
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  }, "html");
  redirect = /* @__PURE__ */ __name((location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  }, "redirect");
  notFound = /* @__PURE__ */ __name(() => {
    this.#notFoundHandler ??= () => new Response();
    return this.#notFoundHandler(this);
  }, "notFound");
};

// node_modules/hono/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
  static {
    __name(this, "UnsupportedPathError");
  }
};

// node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// node_modules/hono/dist/hono-base.js
var notFoundHandler = /* @__PURE__ */ __name((c) => {
  return c.text("404 Not Found", 404);
}, "notFoundHandler");
var errorHandler = /* @__PURE__ */ __name((err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
}, "errorHandler");
var Hono = class {
  static {
    __name(this, "Hono");
  }
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  router;
  getPath;
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  errorHandler = errorHandler;
  route(path, app2) {
    const subApp = this.basePath(path);
    app2.routes.map((r) => {
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = /* @__PURE__ */ __name(async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res, "handler");
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler);
    });
    return this;
  }
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  onError = /* @__PURE__ */ __name((handler) => {
    this.errorHandler = handler;
    return this;
  }, "onError");
  notFound = /* @__PURE__ */ __name((handler) => {
    this.#notFoundHandler = handler;
    return this;
  }, "notFound");
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = /* @__PURE__ */ __name((request) => request, "replaceRequest");
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = url.pathname.slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = /* @__PURE__ */ __name(async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    }, "handler");
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = { basePath: this._basePath, path, method, handler };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
    }
    const path = this.getPath(request, { env });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  fetch = /* @__PURE__ */ __name((request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  }, "fetch");
  request = /* @__PURE__ */ __name((input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  }, "request");
  fire = /* @__PURE__ */ __name(() => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  }, "fire");
};

// node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
__name(compareKey, "compareKey");
var Node = class {
  static {
    __name(this, "Node");
  }
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.#index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.#index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        if (regexpStr === ".*") {
          throw PATH_ERROR;
        }
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.#children[regexpStr];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[regexpStr] = new Node();
        if (name !== "") {
          node.#varIndex = context.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node.#varIndex]);
      }
    } else {
      node = this.#children[token];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[token] = new Node();
      }
    }
    node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.#index === "number") {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
  static {
    __name(this, "Trie");
  }
  #context = { varIndex: 0 };
  #root = new Node();
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups2 = [];
    for (let i2 = 0; ; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i2}`;
        groups2[i2] = [mark, m];
        i2++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i2 = groups2.length - 1; i2 >= 0; i2--) {
      const [mark] = groups2[i2];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups2[i2][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// node_modules/hono/dist/router/reg-exp-router/router.js
var emptyParam = [];
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    path === "*" ? "" : `^${path.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
__name(buildWildcardRegExp, "buildWildcardRegExp");
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
__name(clearWildcardRegExpCache, "clearWildcardRegExpCache");
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i2 = 0, j = -1, len = routesWithStaticPathFlag.length; i2 < len; i2++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i2];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i2 = 0, len = handlerData.length; i2 < len; i2++) {
    for (let j = 0, len2 = handlerData[i2].length; j < len2; j++) {
      const map = handlerData[i2][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i2 in indexReplacementMap) {
    handlerMap[i2] = handlerData[indexReplacementMap[i2]];
  }
  return [regexp, handlerMap, staticMap];
}
__name(buildMatcherFromPreprocessedRoutes, "buildMatcherFromPreprocessedRoutes");
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
__name(findMiddleware, "findMiddleware");
var RegExpRouter = class {
  static {
    __name(this, "RegExpRouter");
  }
  name = "RegExpRouter";
  #middleware;
  #routes;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      ;
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        });
      } else {
        middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach(
            (p) => re.test(p) && routes[m][p].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i2 = 0, len = paths.length; i2 < len; i2++) {
      const path2 = paths[i2];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          routes[m][path2] ||= [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ];
          routes[m][path2].push([handler, paramCount - len + i2 + 1]);
        }
      });
    }
  }
  match(method, path) {
    clearWildcardRegExpCache();
    const matchers = this.#buildAllMatchers();
    this.match = (method2, path2) => {
      const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
      const staticMatch = matcher[2][path2];
      if (staticMatch) {
        return staticMatch;
      }
      const match = path2.match(matcher[0]);
      if (!match) {
        return [[], emptyParam];
      }
      const index = match.indexOf("", 1);
      return [matcher[1][index], match];
    };
    return this.match(method, path);
  }
  #buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = void 0;
    return matchers;
  }
  #buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.#middleware, this.#routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
};

// node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = class {
  static {
    __name(this, "SmartRouter");
  }
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init2) {
    this.#routers = init2.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i2 = 0;
    let res;
    for (; i2 < len; i2++) {
      const router = routers[i2];
      try {
        for (let i22 = 0, len2 = routes.length; i22 < len2; i22++) {
          router.add(...routes[i22]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i2 === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};

// node_modules/hono/dist/router/trie-router/node.js
var emptyParams = /* @__PURE__ */ Object.create(null);
var Node2 = class {
  static {
    __name(this, "Node");
  }
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0 };
      this.#methods = [m];
    }
    this.#patterns = [];
  }
  insert(method, path, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i2 = 0, len = parts.length; i2 < len; i2++) {
      const p = parts[i2];
      const nextP = parts[i2 + 1];
      const pattern = getPattern(p, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p;
      if (key in curNode.#children) {
        curNode = curNode.#children[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      curNode.#children[key] = new Node2();
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key];
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: possibleKeys.filter((v, i2, a) => a.indexOf(v) === i2),
        score: this.#order
      }
    });
    return curNode;
  }
  #getHandlerSets(node, method, nodeParams, params) {
    const handlerSets = [];
    for (let i2 = 0, len = node.#methods.length; i2 < len; i2++) {
      const m = node.#methods[i2];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i22 = 0, len2 = handlerSet.possibleKeys.length; i22 < len2; i22++) {
            const key = handlerSet.possibleKeys[i22];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
    return handlerSets;
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    const curNodesQueue = [];
    for (let i2 = 0, len = parts.length; i2 < len; i2++) {
      const part = parts[i2];
      const isLast = i2 === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              handlerSets.push(
                ...this.#getHandlerSets(nextNode.#children["*"], method, node.#params)
              );
            }
            handlerSets.push(...this.#getHandlerSets(nextNode, method, node.#params));
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
          const pattern = node.#patterns[k];
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (pattern === "*") {
            const astNode = node.#children["*"];
            if (astNode) {
              handlerSets.push(...this.#getHandlerSets(astNode, method, node.#params));
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key, name, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = node.#children[key];
          const restPathString = parts.slice(i2).join("/");
          if (matcher instanceof RegExp) {
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              handlerSets.push(...this.#getHandlerSets(child, method, node.#params, params));
              if (Object.keys(child.#children).length) {
                child.#params = params;
                const componentCount = m[0].match(/\//)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              handlerSets.push(...this.#getHandlerSets(child, method, params, node.#params));
              if (child.#children["*"]) {
                handlerSets.push(
                  ...this.#getHandlerSets(child.#children["*"], method, params, node.#params)
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      curNodes = tempNodes.concat(curNodesQueue.shift() ?? []);
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
};

// node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  static {
    __name(this, "TrieRouter");
  }
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node2();
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i2 = 0, len = results.length; i2 < len; i2++) {
        this.#node.insert(method, results[i2], handler);
      }
      return;
    }
    this.#node.insert(method, path, handler);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  static {
    __name(this, "Hono");
  }
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};

// utils/simpleorm.ts
var SimpleORM = class {
  static {
    __name(this, "SimpleORM");
  }
  db;
  constructor(db2) {
    this.db = db2;
  }
  sanitizeParams(params) {
    return params.map((param) => {
      if (param === null || param === void 0) {
        return null;
      }
      if (param instanceof Date) {
        return param.toISOString();
      }
      if (typeof param === "boolean") {
        return param ? 1 : 0;
      }
      if (typeof param === "object" && param !== null) {
        return JSON.stringify(param);
      }
      return param;
    });
  }
  async query(sql, params = []) {
    try {
      const sanitizedParams = this.sanitizeParams(params);
      const stmt = this.db.prepare(sql);
      if (sanitizedParams.length === 0) {
        const result2 = await stmt.run();
        return result2.results || [];
      }
      const result = await stmt.bind(...sanitizedParams).all();
      if (!result.success) {
        throw new Error(result.error || "Query failed");
      }
      return result.results || [];
    } catch (error) {
      console.error("Query error:", error, "SQL:", sql, "Params:", params);
      throw error;
    }
  }
  // Méthode pour exécuter une seule ligne
  async get(sql, params = []) {
    try {
      const sanitizedParams = this.sanitizeParams(params);
      const stmt = this.db.prepare(sql);
      if (sanitizedParams.length === 0) {
        return await stmt.first();
      }
      const result = await stmt.bind(...sanitizedParams).first();
      return result || null;
    } catch (error) {
      console.error("Get error:", error, "SQL:", sql, "Params:", params);
      throw error;
    }
  }
  // Méthode pour exécuter des requêtes qui ne retournent pas de données
  async run(sql, params = []) {
    try {
      const sanitizedParams = this.sanitizeParams(params);
      const stmt = this.db.prepare(sql);
      if (sanitizedParams.length === 0) {
        const result2 = await stmt.run();
        return {
          lastInsertRowid: result2.meta.last_row_id,
          changes: result2.meta.changes
        };
      }
      const result = await stmt.bind(...sanitizedParams).run();
      if (!result.success) {
        throw new Error(result.error || "Run failed");
      }
      return {
        lastInsertRowid: result.meta.last_row_id,
        changes: result.meta.changes
      };
    } catch (error) {
      console.error("Run error:", error, "SQL:", sql, "Params:", params);
      throw error;
    }
  }
  // Méthode pour les transactions (batch)
  async transaction(statements) {
    try {
      const preparedStatements = statements.map((fn) => fn());
      const results = await this.db.batch(preparedStatements);
      for (const result of results) {
        if (!result.success) {
          throw new Error(result.error || "Transaction failed");
        }
      }
      return results;
    } catch (error) {
      console.error("Transaction error:", error);
      throw error;
    }
  }
  // Exécuter plusieurs statements SQL (DDL)
  async exec(sql) {
    try {
      const result = await this.db.exec(sql);
      console.log(
        `Executed ${result.count} statements in ${result.duration}ms`
      );
    } catch (error) {
      console.error("Exec error:", error);
      throw error;
    }
  }
  // Dump de la base de données
  async dump() {
    try {
      return await this.db.dump();
    } catch (error) {
      console.error("Dump error:", error);
      throw error;
    }
  }
  get isOpen() {
    return this.db !== null;
  }
  get name() {
    return "cloudflare-d1-database";
  }
};
var Model = class {
  static {
    __name(this, "Model");
  }
  tableName;
  orm;
  attributes;
  constructor(tableName, orm) {
    this.tableName = tableName;
    this.orm = orm;
    this.attributes = {};
  }
  // Créer la table
  static async createTable(tableName, columns, orm) {
    const columnDefs = Object.entries(columns).map(([name, type]) => `${name} ${type}`).join(", ");
    const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefs})`;
    return await orm.run(sql);
  }
  // Insérer un nouvel enregistrement
  static async create(tableName, data, orm) {
    const columns = Object.keys(data).join(", ");
    const placeholders = Object.keys(data).map(() => "?").join(", ");
    const values = Object.values(data);
    const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
    const result = await orm.run(sql, values);
    return { id: result.lastInsertRowid, ...data };
  }
  // Insérer plusieurs enregistrements (batch insert)
  static async createMany(tableName, dataArray, orm) {
    if (dataArray.length === 0) return [];
    const results = [];
    const statements = dataArray.map((data) => {
      const columns = Object.keys(data).join(", ");
      const placeholders = Object.keys(data).map(() => "?").join(", ");
      const values = Object.values(data);
      return () => {
        const stmt = orm["db"].prepare(
          `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`
        );
        return stmt.bind(...values);
      };
    });
    const batchResults = await orm.transaction(statements);
    dataArray.forEach((data, index) => {
      const batchResult = batchResults[index];
      results.push({
        id: batchResult.meta?.last_row_id,
        ...data
      });
    });
    return results;
  }
  // Trouver tous les enregistrements avec options avancées
  static async findAll(tableName, orm, options = {}) {
    const { where = {}, orderBy, limit, offset, include, select, count } = options;
    const selectClause = select && select.length > 0 ? select.join(", ") : "*";
    let sql = `SELECT ${selectClause} FROM ${tableName}`;
    let params = [];
    if (Object.keys(where).length > 0) {
      const whereClause = Object.keys(where).map((key) => `${key} = ?`).join(" AND ");
      sql += ` WHERE ${whereClause}`;
      params = Object.values(where);
    }
    if (orderBy) {
      const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
      const orderClauses = orderByArray.map((order) => `${order.column} ${order.direction || "ASC"}`).join(", ");
      sql += ` ORDER BY ${orderClauses}`;
    }
    if (limit) {
      sql += ` LIMIT ${limit}`;
    }
    if (offset) {
      sql += ` OFFSET ${offset}`;
    }
    let results = await orm.query(sql, params);
    if (include && results.length > 0) {
      results = await this.handleIncludes(tableName, results, include, orm);
    }
    if (count) {
      let countSql = `SELECT COUNT(*) as count FROM ${tableName}`;
      if (Object.keys(where).length > 0) {
        const whereClause = Object.keys(where).map((key) => `${key} = ?`).join(" AND ");
        countSql += ` WHERE ${whereClause}`;
      }
      const countResult = await orm.get(countSql, params);
      return { results, count: countResult.count };
    }
    return results;
  }
  // Trouver un enregistrement par ID avec options
  static async findById(tableName, id2, orm, options = {}) {
    const { include } = options;
    const sql = `SELECT * FROM ${tableName} WHERE id = ?`;
    let result = await orm.get(sql, [id2]);
    if (result && include) {
      const results = await this.handleIncludes(
        tableName,
        [result],
        include,
        orm
      );
      result = results[0];
    }
    return result;
  }
  // Trouver un seul enregistrement avec options
  static async findOne(tableName, options, orm) {
    const { where = {}, orderBy, include } = options;
    const whereClause = Object.keys(where).map((key) => `${key} = ?`).join(" AND ");
    let sql = `SELECT * FROM ${tableName} WHERE ${whereClause}`;
    const params = Object.values(where);
    if (orderBy) {
      const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
      const orderClauses = orderByArray.map((order) => `${order.column} ${order.direction || "ASC"}`).join(", ");
      sql += ` ORDER BY ${orderClauses}`;
    }
    sql += " LIMIT 1";
    let result = await orm.get(sql, params);
    if (result && include) {
      const results = await this.handleIncludes(
        tableName,
        [result],
        include,
        orm
      );
      result = results[0];
    }
    return result;
  }
  // async count(
  //   tableName: string,
  //   conditions: WhereConditions = {},
  //   orm: SimpleORM
  // ): Promise<number> {
  //   let sql = `SELECT COUNT(*) as count FROM ${tableName}`;
  //   const params: any[] = [];
  //   if (Object.keys(conditions).length > 0) {
  //     const whereClause = Object.entries(conditions)
  //       .map(([key]) => `${key} = ?`)
  //       .join(" AND ");
  //     sql += ` WHERE ${whereClause}`;
  //     params.push(...Object.values(conditions));
  //   }
  //   const result = await orm.get<{ count: number }>(sql, params);
  //   return result?.count || 0;
  // }
  // Vérifier si un enregistrement existe
  static async exists(tableName, conditions, orm) {
    const whereClause = Object.keys(conditions).map((key) => `${key} = ?`).join(" AND ");
    const sql = `SELECT 1 FROM ${tableName} WHERE ${whereClause} LIMIT 1`;
    const params = Object.values(conditions);
    const result = await orm.get(sql, params);
    return result !== null;
  }
  // Mettre à jour un enregistrement
  static async update(tableName, id2, data, orm) {
    const setClause = Object.keys(data).map((key) => `${key} = ?`).join(", ");
    const sql = `UPDATE ${tableName} SET ${setClause} WHERE id = ?`;
    const params = [...Object.values(data), id2];
    await orm.run(sql, params);
    return await this.findById(tableName, id2, orm);
  }
  // Mettre à jour avec conditions
  static async updateWhere(tableName, conditions, data, orm) {
    const setClause = Object.keys(data).map((key) => `${key} = ?`).join(", ");
    const whereClause = Object.keys(conditions).map((key) => `${key} = ?`).join(" AND ");
    const sql = `UPDATE ${tableName} SET ${setClause} WHERE ${whereClause}`;
    const params = [...Object.values(data), ...Object.values(conditions)];
    const result = await orm.run(sql, params);
    return result.changes;
  }
  // Incrémenter une colonne numérique
  static async increment(tableName, id2, column, value = 1, orm) {
    const sql = `UPDATE ${tableName} SET ${column} = ${column} + ? WHERE id = ?`;
    await orm.run(sql, [value, id2]);
    return await this.findById(tableName, id2, orm);
  }
  // Décrémenter une colonne numérique
  static async decrement(tableName, id2, column, value = 1, orm) {
    const sql = `UPDATE ${tableName} SET ${column} = ${column} - ? WHERE id = ?`;
    await orm.run(sql, [value, id2]);
    return await this.findById(tableName, id2, orm);
  }
  // Trouver ou créer un enregistrement
  static async findOrCreate(tableName, conditions, defaults = {}, orm) {
    const existing = await this.findOne(
      tableName,
      { where: conditions },
      orm
    );
    if (existing) {
      return { record: existing, created: false };
    }
    const newRecord = await this.create(
      tableName,
      { ...conditions, ...defaults },
      orm
    );
    return { record: newRecord, created: true };
  }
  // Supprimer un enregistrement
  static async delete(tableName, id2, orm) {
    const sql = `DELETE FROM ${tableName} WHERE id = ?`;
    const result = await orm.run(sql, [id2]);
    return result.changes > 0;
  }
  // Supprimer avec conditions
  static async deleteWhere(tableName, conditions, orm) {
    const whereClause = Object.keys(conditions).map((key) => `${key} = ?`).join(" AND ");
    const sql = `DELETE FROM ${tableName} WHERE ${whereClause}`;
    const params = Object.values(conditions);
    const result = await orm.run(sql, params);
    return result.changes;
  }
  // INSERT OR REPLACE (Upsert)
  static async upsert(tableName, data, orm) {
    const columns = Object.keys(data).join(", ");
    const placeholders = Object.keys(data).map(() => "?").join(", ");
    const values = Object.values(data);
    const sql = `INSERT OR REPLACE INTO ${tableName} (${columns}) VALUES (${placeholders})`;
    const result = await orm.run(sql, values);
    return { id: result.lastInsertRowid || data.id, ...data };
  }
  static async upsertWithCoalesce(tableName, data, orm) {
    const columns = Object.keys(data);
    const values = Object.values(data);
    if (data.id !== void 0) {
      const targetId = data.id;
      const nonIdColumns = columns.filter((col) => col !== "id");
      const nonIdValues = nonIdColumns.map((col) => data[col]);
      const coalescePlaceholders = nonIdColumns.map(() => "?").join(", ");
      const allColumns = `id, ${nonIdColumns.join(", ")}`;
      const allPlaceholders = `COALESCE((SELECT id FROM ${tableName} WHERE id = ?), ?), ${coalescePlaceholders}`;
      const sql2 = `INSERT OR REPLACE INTO ${tableName} (${allColumns}) VALUES (${allPlaceholders})`;
      const params = [targetId, targetId, ...nonIdValues];
      await orm.run(sql2, params);
      return { id: targetId, ...data };
    }
    const placeholders = columns.map(() => "?").join(", ");
    const sql = `INSERT OR REPLACE INTO ${tableName} (${columns.join(
      ", "
    )}) VALUES (${placeholders})`;
    const result = await orm.run(sql, values);
    return { id: result.lastInsertRowid, ...data };
  }
  // Compter les enregistrements
  static async count(tableName, conditions = {}, orm) {
    let sql = `SELECT COUNT(*) as count FROM ${tableName}`;
    let params = [];
    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions).map((key) => `${key} = ?`).join(" AND ");
      sql += ` WHERE ${whereClause}`;
      params = Object.values(conditions);
    }
    const result = await orm.get(sql, params);
    return result?.count || 0;
  }
  /**
   * Méthode améliorée pour gérer les relations (includes)
   * Support pour hasMany, hasOne, et belongsTo
   * Si count est activé, retourne à la fois les données ET le count
   */
  static async handleIncludes(tableName, results, include, orm) {
    if (results.length === 0) return results;
    const includeArray = Array.isArray(include) ? include : [include];
    for (const includeOption of includeArray) {
      const {
        model: includeTable,
        foreignKey,
        localKey = "id",
        as,
        type = "hasMany",
        where: extraWhere = {},
        select,
        count = false
        // Si true, ajoute aussi le count en plus des données
      } = includeOption;
      const relationName = as || includeTable;
      const countName = `${relationName}Count`;
      let idsToQuery;
      let queryColumn;
      let mapColumn;
      if (type === "belongsTo" || type === "hasOne" && results.some((r) => r[foreignKey] !== void 0)) {
        idsToQuery = [
          ...new Set(
            results.map((row) => row[foreignKey]).filter(Boolean)
          )
        ];
        queryColumn = localKey;
        mapColumn = localKey;
      } else {
        idsToQuery = [
          ...new Set(
            results.map((row) => row[localKey]).filter(Boolean)
          )
        ];
        queryColumn = foreignKey;
        mapColumn = foreignKey;
      }
      if (idsToQuery.length === 0) {
        results.forEach((row) => {
          row[relationName] = type === "hasMany" ? [] : null;
          if (count) {
            row[countName] = 0;
          }
        });
        continue;
      }
      const placeholders = idsToQuery.map(() => "?").join(", ");
      let whereClauses = [`${queryColumn} IN (${placeholders})`];
      let params = [...idsToQuery];
      if (Object.keys(extraWhere).length > 0) {
        const extraConditions = Object.keys(extraWhere).map((key) => `${key} = ?`).join(" AND ");
        whereClauses.push(extraConditions);
        params.push(...Object.values(extraWhere));
      }
      const selectClause = select && select.length > 0 ? select.join(", ") : "*";
      const relatedSql = `SELECT ${selectClause} FROM ${includeTable} WHERE ${whereClauses.join(
        " AND "
      )}`;
      const relatedData = await orm.query(relatedSql, params);
      if (type === "hasMany") {
        const relatedMap = /* @__PURE__ */ new Map();
        relatedData.forEach((item) => {
          const key = item[mapColumn];
          if (!relatedMap.has(key)) {
            relatedMap.set(key, []);
          }
          relatedMap.get(key).push(item);
        });
        results.forEach((row) => {
          const keyValue = row[localKey];
          const relatedItems = relatedMap.get(keyValue) || [];
          row[relationName] = relatedItems;
          if (count) {
            row[countName] = relatedItems.length;
          }
        });
      } else if (type === "hasOne" || type === "belongsTo") {
        const relatedMap = /* @__PURE__ */ new Map();
        relatedData.forEach((item) => {
          const key = item[mapColumn];
          if (!relatedMap.has(key)) {
            relatedMap.set(key, item);
          }
        });
        results.forEach((row) => {
          const keyValue = type === "belongsTo" ? row[foreignKey] : row[localKey];
          const relatedItem = relatedMap.get(keyValue) || null;
          row[relationName] = relatedItem;
          if (count) {
            row[countName] = relatedItem ? 1 : 0;
          }
        });
      }
    }
    return results;
  }
  /**
   * Nouvelle méthode pour les relations belongsTo inversées
   * (quand la clé étrangère est dans la table principale)
   */
  static async handleBelongsToIncludes(tableName, results, include, orm) {
    if (results.length === 0) return results;
    const includeArray = Array.isArray(include) ? include : [include];
    for (const includeOption of includeArray) {
      const {
        model: includeTable,
        foreignKey,
        // Dans ce cas, c'est la colonne dans la table actuelle
        localKey = "id",
        // Dans ce cas, c'est la PK de la table liée
        as,
        where: extraWhere = {},
        select
      } = includeOption;
      const relationName = as || includeTable;
      const foreignIds = [
        ...new Set(
          results.map((row) => row[foreignKey]).filter(Boolean)
        )
      ];
      if (foreignIds.length === 0) {
        results.forEach((row) => {
          row[relationName] = null;
        });
        continue;
      }
      const selectClause = select && select.length > 0 ? select.join(", ") : "*";
      const placeholders = foreignIds.map(() => "?").join(", ");
      let whereClauses = [`${localKey} IN (${placeholders})`];
      let params = [...foreignIds];
      if (Object.keys(extraWhere).length > 0) {
        const extraConditions = Object.keys(extraWhere).map((key) => `${key} = ?`).join(" AND ");
        whereClauses.push(extraConditions);
        params.push(...Object.values(extraWhere));
      }
      const relatedSql = `SELECT ${selectClause} FROM ${includeTable} WHERE ${whereClauses.join(
        " AND "
      )}`;
      const relatedData = await orm.query(relatedSql, params);
      const relatedMap = /* @__PURE__ */ new Map();
      relatedData.forEach((item) => {
        const key = item[localKey];
        relatedMap.set(key, item);
      });
      results.forEach((row) => {
        const foreignId = row[foreignKey];
        row[relationName] = relatedMap.get(foreignId) || null;
      });
    }
    return results;
  }
};
var ModelFactory = class {
  static {
    __name(this, "ModelFactory");
  }
  orm;
  constructor(orm) {
    this.orm = orm;
  }
  createModel(tableName, schema2, sampleData) {
    const orm = this.orm;
    const generateMetadata = /* @__PURE__ */ __name(() => {
      const keys = {};
      const types = {};
      if (Object.keys(schema2).length > 0) {
        Object.keys(schema2).forEach((key) => {
          keys[key] = key;
          const sqlType = schema2[key].toUpperCase();
          if (sqlType.includes("INTEGER") || sqlType.includes("INT")) {
            types[key] = "number";
          } else if (sqlType.includes("TEXT") || sqlType.includes("VARCHAR")) {
            types[key] = "string";
          } else if (sqlType.includes("BOOLEAN") || sqlType.includes("BOOL")) {
            types[key] = "boolean";
          } else if (sqlType.includes("DATE") || sqlType.includes("TIME")) {
            types[key] = "date";
          } else {
            types[key] = "any";
          }
        });
      }
      if (sampleData) {
        Object.keys(sampleData).forEach((key) => {
          keys[key] = key;
          const value = sampleData[key];
          if (typeof value === "string") {
            types[key] = "string";
          } else if (typeof value === "number") {
            types[key] = "number";
          } else if (typeof value === "boolean") {
            types[key] = "boolean";
          } else if (value instanceof Date) {
            types[key] = "date";
          } else {
            types[key] = "any";
          }
        });
      }
      return { keys, types };
    }, "generateMetadata");
    const metadata = generateMetadata();
    class QueryBuilderImpl {
      constructor(tableName2, orm2) {
        this.tableName = tableName2;
        this.orm = orm2;
      }
      static {
        __name(this, "QueryBuilderImpl");
      }
      options = {};
      where(conditions) {
        this.options.where = { ...this.options.where, ...conditions };
        return this;
      }
      orderBy(column, direction = "ASC") {
        const orderBy = { column, direction };
        if (this.options.orderBy) {
          this.options.orderBy = Array.isArray(this.options.orderBy) ? [...this.options.orderBy, orderBy] : [this.options.orderBy, orderBy];
        } else {
          this.options.orderBy = orderBy;
        }
        return this;
      }
      limit(limit) {
        this.options.limit = limit;
        return this;
      }
      offset(offset) {
        this.options.offset = offset;
        return this;
      }
      include(options) {
        if (this.options.include) {
          const currentIncludes = Array.isArray(this.options.include) ? this.options.include : [this.options.include];
          const newIncludes = Array.isArray(options) ? options : [options];
          this.options.include = [...currentIncludes, ...newIncludes];
        } else {
          this.options.include = options;
        }
        return this;
      }
      async findAll() {
        return await Model.findAll(this.tableName, this.orm, this.options);
      }
      async findOne() {
        return await Model.findOne(this.tableName, this.options, this.orm);
      }
      async count() {
        const { where = {} } = this.options;
        return await Model.count(this.tableName, where, this.orm);
      }
    }
    class GeneratedModel {
      static {
        __name(this, "GeneratedModel");
      }
      conditions = {};
      constructor(data = {}) {
        Object.assign(this, data);
      }
      // Méthodes d'instance - Asynchrones
      async save() {
        if (this.id) {
          const result = await Model.update(
            tableName,
            this.id,
            this,
            orm
          );
          if (result) Object.assign(this, result);
          return result;
        } else {
          const result = await Model.create(
            tableName,
            this,
            orm
          );
          this.id = result.id;
          Object.assign(this, result);
          return result;
        }
      }
      async delete() {
        if (this.id) {
          return await Model.delete(tableName, this.id, orm);
        }
        return false;
      }
      // Méthodes statiques - CRUD de base (maintenant asynchrones)
      static async createTable() {
        return await Model.createTable(tableName, schema2, orm);
      }
      static async create(data) {
        return await Model.create(tableName, data, orm);
      }
      static async createMany(dataArray) {
        return await Model.createMany(tableName, dataArray, orm);
      }
      static async findAll(options = {}) {
        return await Model.findAll(tableName, orm, options);
      }
      static async findById(id2, options = {}) {
        return await Model.findById(tableName, id2, orm, options);
      }
      static async findOne(options) {
        return await Model.findOne(tableName, options, orm);
      }
      async count() {
        return Model.count(tableName, this.condition, orm);
      }
      static async exists(conditions) {
        return await Model.exists(tableName, conditions, orm);
      }
      static async findOrCreate(conditions, defaults = {}) {
        return await Model.findOrCreate(
          tableName,
          conditions,
          defaults,
          orm
        );
      }
      static async update(id2, data) {
        return await Model.update(tableName, id2, data, orm);
      }
      static async updateWhere(conditions, data) {
        return await Model.updateWhere(tableName, conditions, data, orm);
      }
      static async increment(id2, column, value = 1) {
        return await Model.increment(tableName, id2, column, value, orm);
      }
      static async decrement(id2, column, value = 1) {
        return await Model.decrement(tableName, id2, column, value, orm);
      }
      static async delete(id2) {
        return await Model.delete(tableName, id2, orm);
      }
      static async deleteWhere(conditions) {
        return await Model.deleteWhere(tableName, conditions, orm);
      }
      static async upsert(data) {
        return await Model.upsert(tableName, data, orm);
      }
      static async upsertWithCoalesce(data) {
        return await Model.upsertWithCoalesce(tableName, data, orm);
      }
      static async count(conditions = {}) {
        return await Model.count(tableName, conditions, orm);
      }
      // Query Builder methods - Méthodes fluides
      static where(conditions) {
        return new QueryBuilderImpl(tableName, orm).where(conditions);
      }
      static orderBy(column, direction = "ASC") {
        return new QueryBuilderImpl(tableName, orm).orderBy(column, direction);
      }
      static limit(limit) {
        return new QueryBuilderImpl(tableName, orm).limit(limit);
      }
      static offset(offset) {
        return new QueryBuilderImpl(tableName, orm).offset(offset);
      }
      static include(options) {
        return new QueryBuilderImpl(tableName, orm).include(options);
      }
      // Métadonnées exportées
      static keys = metadata.keys;
      static types = metadata.types;
      static tableName = tableName;
      static orm = orm;
    }
    return GeneratedModel;
  }
};

// utils/function.ts
var db = /* @__PURE__ */ __name((env) => {
  const orm = new SimpleORM(env.DB);
  const database = new ModelFactory(orm);
  return database;
}, "db");
var function_default = db;

// utils/tables.ts
var UsersAccount = /* @__PURE__ */ __name((env) => {
  const users2 = function_default(env).createModel("users", {
    id: "TEXT PRIMARY KEY NOT NULL",
    name: "TEXT NOT NULL",
    email: "TEXT NOT NULL UNIQUE",
    first_name: "TEXT NOT NULL",
    // @ts-ignore
    church_status: "TEXT NOT NULL DEFAULT Member",
    association: "TEXT NULL",
    biography: "TEXT NULL",
    photo: "TEXT NULL",
    lastlogin: "TEXT NULL",
    lastlogout: "TEXT NULL",
    created: "DATETIME DEFAULT CURRENT_TIMESTAMP",
    modified: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    country: "TEXT NULL"
  });
  (async () => await users2.createTable())();
  return users2;
}, "UsersAccount");
var Notes = /* @__PURE__ */ __name((env) => {
  const userNotes = function_default(env).createModel(`notes`, {
    id: "TEXT PRIMARY KEY",
    body: "TEXT",
    creator: "TEXT",
    pinned: "INTEGER",
    archived: "INTEGER",
    grouped: "TEXT NULL",
    created: "DATETIME DEFAULT CURRENT_TIMESTAMP",
    modified: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    lastSyncUpdate: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    html: "TEXT NULL",
    publishId: "TEXT NULL",
    // le texte qui entre dans cet element c'est l'Id de la publication, la date de la dernier mise a jour et le la version de la publication.
    // @ts-ignore
    clientversion: "INTEGER NOT NULL DEFAULT 0",
    lastSyncedAt: "TEXT",
    // NOUVEAU
    deviceId: "TEXT",
    // NOUVEAU
    version: "INTEGER NOT NULL DEFAULT 1"
    // NOUVEAU
  });
  (async () => await userNotes.createTable())();
  return userNotes;
}, "Notes");
var Publish = /* @__PURE__ */ __name((env) => {
  const userNotes = function_default(env).createModel(`publish`, {
    id: "TEXT PRIMARY KEY",
    userid: "TEXT",
    body: "TEXT",
    createdAt: "DATETIME DEFAULT CURRENT_TIMESTAMP",
    updatedAt: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    title: "TEXT NULL",
    appreciation: "TEXT NULL",
    imageurl: "TEXT NULL",
    noteid: "TEXT NULL",
    topic: "TEXT NULL",
    description: "TEXT NULL",
    // @ts-ignore
    version: "INT NOT NULL DEFAULT 1"
  });
  (async () => await userNotes.createTable())();
  return userNotes;
}, "Publish");
var Articles = /* @__PURE__ */ __name((env) => {
  const articles = function_default(env).createModel("articles", {
    id: "TEXT PRIMARY KEY NOT NULL",
    userid: "TEXT NOT NULL",
    imageurl: "TEXT",
    noteid: "TEXT NOT NULL",
    body: "TEXT NOT NULL",
    description: "TEXT NOT NULL",
    title: "TEXT NOT NULL",
    topic: "TEXT",
    appreciation: "TEXT NOT NULL UNIQUE",
    createdAt: "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP",
    updatedAt: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    // @ts-ignore
    version: "INT NOT NULL DEFAULT 1"
  });
  (async () => await articles.createTable())();
  return articles;
}, "Articles");
var Comments = /* @__PURE__ */ __name((env) => {
  const comments2 = function_default(env).createModel("comments", {
    id: "TEXT PRIMARY KEY NOT NULL",
    articleId: "TEXT NOT NULL",
    content: "TEXT NOT NULL",
    // @ts-ignore
    notes: "INTEGER NOT NULL DEFAULT 0",
    creator: "TEXT NOT NULL",
    // @ts-ignore
    upvotes: "TEXT NOT NULL DEFAULT '[]'",
    // JSON array of userids who upvoted
    // @ts-ignore
    signals: "TEXT NOT NULL DEFAULT '[]'",
    // JSON array of userids who reported
    created: "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP",
    modified: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
  });
  (async () => await comments2.createTable())();
  return comments2;
}, "Comments");
var GroupsTable = /* @__PURE__ */ __name((env) => {
  const grouped = function_default(env).createModel("groupes", {
    id: "TEXT PRIMARY KEY NOT NULL",
    userid: "TEXT NOT NULL",
    name: "TEXT NOT NULL",
    lastSyncUpdate: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    lastSyncedAt: "TEXT",
    // NOUVEAU
    deviceId: "TEXT",
    // NOUVEAU
    // @ts-ignore
    version: "INT NOT NULL DEFAULT 1",
    created: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    modified: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
  });
  (async () => await grouped.createTable())();
  return grouped;
}, "GroupsTable");
var ImagesTable = /* @__PURE__ */ __name((env) => {
  const Images = function_default(env).createModel("images", {
    id: "TEXT PRIMARY KEY NOT NULL",
    userid: "TEXT NOT NULL",
    name: "TEXT NOT NULL",
    mineType: "TEXT NOT NULL",
    url: "TEXT NOT NULL",
    size: "INTEGER NOT NULL",
    created: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    modified: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
  });
  (async () => await Images.createTable())();
  return Images;
}, "ImagesTable");
var Appreciations = /* @__PURE__ */ __name((env) => {
  const appreciations = function_default(env).createModel("appreciations", {
    id: "TEXT PRIMARY KEY NOT NULL",
    articleId: "TEXT NOT NULL",
    userid: "TEXT NOT NULL"
  });
  (async () => await appreciations.createTable())();
  return appreciations;
}, "Appreciations");
var SyncEventsTable = /* @__PURE__ */ __name((env) => {
  const syncEvents = function_default(env).createModel("sync_events", {
    id: "TEXT PRIMARY KEY NOT NULL",
    userId: "TEXT NOT NULL",
    deviceId: "TEXT NOT NULL",
    entityType: "TEXT NOT NULL",
    entityId: "TEXT NOT NULL",
    action: "TEXT NOT NULL",
    data: "TEXT NOT NULL",
    timestamp: "TEXT NOT NULL",
    synced: "INTEGER NOT NULL DEFAULT 0",
    created: "TEXT NOT NULL"
  });
  (async () => await syncEvents.createTable())();
  return syncEvents;
}, "SyncEventsTable");
var CountryTable = /* @__PURE__ */ __name((env) => {
  const countryTable = function_default(env).createModel("countries", {
    id: "TEXT PRIMARY KEY NOT NULL",
    name: "TEXT NOT NULL",
    code_2: "TEXT NOT NULL",
    code_3: "TEXT NOT NULL",
    phoneCode: "TEXT NOT NULL"
  });
  (async () => await countryTable.createTable())();
  return countryTable;
}, "CountryTable");
var TokenBlacklistTable = /* @__PURE__ */ __name((env) => {
  const tokenBlacklist = function_default(env).createModel("token_blacklist", {
    id: "TEXT PRIMARY KEY NOT NULL",
    token: "TEXT NOT NULL UNIQUE",
    userId: "TEXT NOT NULL",
    revokedAt: "TEXT NOT NULL",
    expiresAt: "TEXT NOT NULL"
  });
  (async () => await tokenBlacklist.createTable())();
  return tokenBlacklist;
}, "TokenBlacklistTable");
var SyncStateTable = /* @__PURE__ */ __name((env) => {
  const syncState2 = function_default(env).createModel("sync_state", {
    // @ts-ignore — composite PK enforced manually below
    table_name: "TEXT NOT NULL",
    element_id: "TEXT NOT NULL",
    // @ts-ignore
    version: "INTEGER NOT NULL DEFAULT 1",
    updatedAt: "TEXT NOT NULL",
    updatedBy: "TEXT NOT NULL",
    // @ts-ignore
    deleted: "INTEGER NOT NULL DEFAULT 0"
  });
  (async () => {
    const D1 = env.DB;
    if (!D1) return;
    try {
      await D1.exec(
        "CREATE TABLE IF NOT EXISTS sync_state (table_name TEXT NOT NULL, element_id TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1, updatedAt TEXT NOT NULL, updatedBy TEXT NOT NULL, deleted INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (table_name, element_id))"
      );
      await D1.exec("CREATE INDEX IF NOT EXISTS idx_sync_state_version ON sync_state(version)");
      await D1.exec("CREATE INDEX IF NOT EXISTS idx_sync_state_table ON sync_state(table_name)");
    } catch (e) {
      console.log("[sync_state] table init error:", e);
    }
  })();
  return syncState2;
}, "SyncStateTable");
var PushTokensTable = /* @__PURE__ */ __name((env) => {
  const pushTokens = function_default(env).createModel("push_tokens", {
    id: "TEXT PRIMARY KEY NOT NULL",
    userid: "TEXT NOT NULL",
    token: "TEXT NOT NULL UNIQUE",
    platform: "TEXT NOT NULL",
    deviceId: "TEXT NOT NULL",
    created: "DATETIME DEFAULT CURRENT_TIMESTAMP",
    modified: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
  });
  (async () => await pushTokens.createTable())();
  return pushTokens;
}, "PushTokensTable");
var HistoryTable = /* @__PURE__ */ __name((env) => {
  const historyTable = function_default(env).createModel("history", {
    id: "TEXT PRIMARY KEY NOT NULL",
    articleid: "TEXT NOT NULL",
    articleImage: "TEXT NOT NULL",
    articleTitle: "TEXT NOT NULL",
    articleCreatedAt: "TEXT NOT NULL",
    userid: "TEXT NOT NULL",
    lastReading: "TEXT NOT NULL"
  });
  (async () => await historyTable.createTable())();
  return historyTable;
}, "HistoryTable");

// node_modules/uuid/dist/stringify.js
var byteToHex = [];
for (let i2 = 0; i2 < 256; ++i2) {
  byteToHex.push((i2 + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}
__name(unsafeStringify, "unsafeStringify");

// node_modules/uuid/dist/rng.js
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    if (typeof crypto === "undefined" || !crypto.getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
    getRandomValues = crypto.getRandomValues.bind(crypto);
  }
  return getRandomValues(rnds8);
}
__name(rng, "rng");

// node_modules/uuid/dist/native.js
var randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var native_default = { randomUUID };

// node_modules/uuid/dist/v4.js
function _v4(options, buf, offset) {
  options = options || {};
  const rnds = options.random ?? options.rng?.() ?? rng();
  if (rnds.length < 16) {
    throw new Error("Random bytes length must be >= 16");
  }
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    if (offset < 0 || offset + 16 > buf.length) {
      throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
    }
    for (let i2 = 0; i2 < 16; ++i2) {
      buf[offset + i2] = rnds[i2];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
__name(_v4, "_v4");
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  return _v4(options, buf, offset);
}
__name(v4, "v4");
var v4_default = v4;

// src/routes/users.ts
var users = new Hono2();
users.get("/", async ({ json: json2, env, res }) => {
  await UsersAccount(env).createTable();
  const Users = UsersAccount(env);
  console.log("je suis dans la joie");
  return json2(await Users.findAll({
    select: ["id", "email", "name", "first_name", "photo", "biography"]
  }));
});
users.get("/:userid", async ({ json: json2, env, res, req }) => {
  const { userid } = req.param();
  await UsersAccount(env).createTable();
  const Users = UsersAccount(env);
  return json2(
    await Users.findOne({
      where: {
        id: userid
      }
    })
  );
});
users.get("/:userid/notes", async ({ json: json2, env, res, req }) => {
  const { userid } = req.param();
  await UsersAccount(env).createTable();
  const Users = UsersAccount(env);
  const Notes2 = Notes(env);
  const Groups = GroupsTable(env);
  const user = await Users.findOne({
    where: {
      id: userid
    }
  });
  const notes2 = await Notes2.findAll({
    where: {
      creator: userid
    },
    count: true
  });
  const groups2 = await Groups.findAll({
    where: {
      userid
    },
    count: true
  });
  return json2({
    ...user,
    notes: notes2,
    groups: groups2
  });
});
users.post("/signin", async ({ req, res, json: json2, env }) => {
  await UsersAccount(env).createTable();
  const Users = UsersAccount(env);
  const Notes2 = Notes(env);
  const user = await req.json();
  try {
    const check_user_exist = await Users.findOne({
      where: {
        email: user.email
      }
    });
    if (check_user_exist) {
      const modifiedUser = await Users.update(check_user_exist.id, {
        ...check_user_exist,
        modified: (/* @__PURE__ */ new Date()).toISOString()
      });
      if (modifiedUser) {
        const notes2 = await Notes2.findAll({
          where: {
            creator: modifiedUser?.id
          },
          count: true
        });
        return json2({
          message: "cet utilisateur existe deja",
          data: {
            ...modifiedUser,
            notes: {
              count: notes2.count
            }
          }
        });
      }
    }
    const data = await Users.create({
      id: v4_default(),
      ...user,
      created: (/* @__PURE__ */ new Date()).toISOString(),
      modified: (/* @__PURE__ */ new Date()).toISOString()
    });
    return json2({
      message: "un utilisateur a ete cree",
      data: {
        ...data,
        notes: {
          count: 0
        }
      }
    });
  } catch (error) {
    console.log(error);
    return json2({
      message: "il y a une erreur " + error,
      data: null
    });
  }
});
users.put("/:userId/update-infos", async ({ req, res, env, json: json2 }) => {
  const Users = UsersAccount(env);
  const userinfo = await req.json();
  const { userId } = req.param();
  console.log(userinfo);
  try {
    const data = await Users.updateWhere(
      { id: userId },
      {
        ...userinfo,
        modified: (/* @__PURE__ */ new Date()).toISOString()
      }
    );
    return json2({
      message: "un utilisateur a ete cree",
      data
    });
  } catch (error) {
    console.log(error);
    return json2({
      message: "il y a une erreur " + error,
      data: null
    });
  }
});
var users_default = users;

// node_modules/hono/dist/utils/encode.js
var decodeBase64Url = /* @__PURE__ */ __name((str) => {
  return decodeBase64(str.replace(/_|-/g, (m) => ({ _: "/", "-": "+" })[m] ?? m));
}, "decodeBase64Url");
var encodeBase64Url = /* @__PURE__ */ __name((buf) => encodeBase64(buf).replace(/\/|\+/g, (m) => ({ "/": "_", "+": "-" })[m] ?? m), "encodeBase64Url");
var encodeBase64 = /* @__PURE__ */ __name((buf) => {
  let binary = "";
  const bytes = new Uint8Array(buf);
  for (let i2 = 0, len = bytes.length; i2 < len; i2++) {
    binary += String.fromCharCode(bytes[i2]);
  }
  return btoa(binary);
}, "encodeBase64");
var decodeBase64 = /* @__PURE__ */ __name((str) => {
  const binary = atob(str);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  const half = binary.length / 2;
  for (let i2 = 0, j = binary.length - 1; i2 <= half; i2++, j--) {
    bytes[i2] = binary.charCodeAt(i2);
    bytes[j] = binary.charCodeAt(j);
  }
  return bytes;
}, "decodeBase64");

// node_modules/hono/dist/utils/jwt/jwa.js
var AlgorithmTypes = /* @__PURE__ */ ((AlgorithmTypes2) => {
  AlgorithmTypes2["HS256"] = "HS256";
  AlgorithmTypes2["HS384"] = "HS384";
  AlgorithmTypes2["HS512"] = "HS512";
  AlgorithmTypes2["RS256"] = "RS256";
  AlgorithmTypes2["RS384"] = "RS384";
  AlgorithmTypes2["RS512"] = "RS512";
  AlgorithmTypes2["PS256"] = "PS256";
  AlgorithmTypes2["PS384"] = "PS384";
  AlgorithmTypes2["PS512"] = "PS512";
  AlgorithmTypes2["ES256"] = "ES256";
  AlgorithmTypes2["ES384"] = "ES384";
  AlgorithmTypes2["ES512"] = "ES512";
  AlgorithmTypes2["EdDSA"] = "EdDSA";
  return AlgorithmTypes2;
})(AlgorithmTypes || {});

// node_modules/hono/dist/helper/adapter/index.js
var knownUserAgents = {
  deno: "Deno",
  bun: "Bun",
  workerd: "Cloudflare-Workers",
  node: "Node.js"
};
var getRuntimeKey = /* @__PURE__ */ __name(() => {
  const global = globalThis;
  const userAgentSupported = typeof navigator !== "undefined" && true;
  if (userAgentSupported) {
    for (const [runtimeKey, userAgent] of Object.entries(knownUserAgents)) {
      if (checkUserAgentEquals(userAgent)) {
        return runtimeKey;
      }
    }
  }
  if (typeof global?.EdgeRuntime === "string") {
    return "edge-light";
  }
  if (global?.fastly !== void 0) {
    return "fastly";
  }
  if (global?.process?.release?.name === "node") {
    return "node";
  }
  return "other";
}, "getRuntimeKey");
var checkUserAgentEquals = /* @__PURE__ */ __name((platform) => {
  const userAgent = "Cloudflare-Workers";
  return userAgent.startsWith(platform);
}, "checkUserAgentEquals");

// node_modules/hono/dist/utils/jwt/types.js
var JwtAlgorithmNotImplemented = class extends Error {
  static {
    __name(this, "JwtAlgorithmNotImplemented");
  }
  constructor(alg) {
    super(`${alg} is not an implemented algorithm`);
    this.name = "JwtAlgorithmNotImplemented";
  }
};
var JwtTokenInvalid = class extends Error {
  static {
    __name(this, "JwtTokenInvalid");
  }
  constructor(token) {
    super(`invalid JWT token: ${token}`);
    this.name = "JwtTokenInvalid";
  }
};
var JwtTokenNotBefore = class extends Error {
  static {
    __name(this, "JwtTokenNotBefore");
  }
  constructor(token) {
    super(`token (${token}) is being used before it's valid`);
    this.name = "JwtTokenNotBefore";
  }
};
var JwtTokenExpired = class extends Error {
  static {
    __name(this, "JwtTokenExpired");
  }
  constructor(token) {
    super(`token (${token}) expired`);
    this.name = "JwtTokenExpired";
  }
};
var JwtTokenIssuedAt = class extends Error {
  static {
    __name(this, "JwtTokenIssuedAt");
  }
  constructor(currentTimestamp, iat) {
    super(
      `Invalid "iat" claim, must be a valid number lower than "${currentTimestamp}" (iat: "${iat}")`
    );
    this.name = "JwtTokenIssuedAt";
  }
};
var JwtTokenIssuer = class extends Error {
  static {
    __name(this, "JwtTokenIssuer");
  }
  constructor(expected, iss) {
    super(`expected issuer "${expected}", got ${iss ? `"${iss}"` : "none"} `);
    this.name = "JwtTokenIssuer";
  }
};
var JwtHeaderInvalid = class extends Error {
  static {
    __name(this, "JwtHeaderInvalid");
  }
  constructor(header) {
    super(`jwt header is invalid: ${JSON.stringify(header)}`);
    this.name = "JwtHeaderInvalid";
  }
};
var JwtHeaderRequiresKid = class extends Error {
  static {
    __name(this, "JwtHeaderRequiresKid");
  }
  constructor(header) {
    super(`required "kid" in jwt header: ${JSON.stringify(header)}`);
    this.name = "JwtHeaderRequiresKid";
  }
};
var JwtTokenSignatureMismatched = class extends Error {
  static {
    __name(this, "JwtTokenSignatureMismatched");
  }
  constructor(token) {
    super(`token(${token}) signature mismatched`);
    this.name = "JwtTokenSignatureMismatched";
  }
};
var CryptoKeyUsage = /* @__PURE__ */ ((CryptoKeyUsage2) => {
  CryptoKeyUsage2["Encrypt"] = "encrypt";
  CryptoKeyUsage2["Decrypt"] = "decrypt";
  CryptoKeyUsage2["Sign"] = "sign";
  CryptoKeyUsage2["Verify"] = "verify";
  CryptoKeyUsage2["DeriveKey"] = "deriveKey";
  CryptoKeyUsage2["DeriveBits"] = "deriveBits";
  CryptoKeyUsage2["WrapKey"] = "wrapKey";
  CryptoKeyUsage2["UnwrapKey"] = "unwrapKey";
  return CryptoKeyUsage2;
})(CryptoKeyUsage || {});

// node_modules/hono/dist/utils/jwt/utf8.js
var utf8Encoder = new TextEncoder();
var utf8Decoder = new TextDecoder();

// node_modules/hono/dist/utils/jwt/jws.js
async function signing(privateKey, alg, data) {
  const algorithm = getKeyAlgorithm(alg);
  const cryptoKey = await importPrivateKey(privateKey, algorithm);
  return await crypto.subtle.sign(algorithm, cryptoKey, data);
}
__name(signing, "signing");
async function verifying(publicKey, alg, signature, data) {
  const algorithm = getKeyAlgorithm(alg);
  const cryptoKey = await importPublicKey(publicKey, algorithm);
  return await crypto.subtle.verify(algorithm, cryptoKey, signature, data);
}
__name(verifying, "verifying");
function pemToBinary(pem) {
  return decodeBase64(pem.replace(/-+(BEGIN|END).*/g, "").replace(/\s/g, ""));
}
__name(pemToBinary, "pemToBinary");
async function importPrivateKey(key, alg) {
  if (!crypto.subtle || !crypto.subtle.importKey) {
    throw new Error("`crypto.subtle.importKey` is undefined. JWT auth middleware requires it.");
  }
  if (isCryptoKey(key)) {
    if (key.type !== "private" && key.type !== "secret") {
      throw new Error(
        `unexpected key type: CryptoKey.type is ${key.type}, expected private or secret`
      );
    }
    return key;
  }
  const usages = [CryptoKeyUsage.Sign];
  if (typeof key === "object") {
    return await crypto.subtle.importKey("jwk", key, alg, false, usages);
  }
  if (key.includes("PRIVATE")) {
    return await crypto.subtle.importKey("pkcs8", pemToBinary(key), alg, false, usages);
  }
  return await crypto.subtle.importKey("raw", utf8Encoder.encode(key), alg, false, usages);
}
__name(importPrivateKey, "importPrivateKey");
async function importPublicKey(key, alg) {
  if (!crypto.subtle || !crypto.subtle.importKey) {
    throw new Error("`crypto.subtle.importKey` is undefined. JWT auth middleware requires it.");
  }
  if (isCryptoKey(key)) {
    if (key.type === "public" || key.type === "secret") {
      return key;
    }
    key = await exportPublicJwkFrom(key);
  }
  if (typeof key === "string" && key.includes("PRIVATE")) {
    const privateKey = await crypto.subtle.importKey("pkcs8", pemToBinary(key), alg, true, [
      CryptoKeyUsage.Sign
    ]);
    key = await exportPublicJwkFrom(privateKey);
  }
  const usages = [CryptoKeyUsage.Verify];
  if (typeof key === "object") {
    return await crypto.subtle.importKey("jwk", key, alg, false, usages);
  }
  if (key.includes("PUBLIC")) {
    return await crypto.subtle.importKey("spki", pemToBinary(key), alg, false, usages);
  }
  return await crypto.subtle.importKey("raw", utf8Encoder.encode(key), alg, false, usages);
}
__name(importPublicKey, "importPublicKey");
async function exportPublicJwkFrom(privateKey) {
  if (privateKey.type !== "private") {
    throw new Error(`unexpected key type: ${privateKey.type}`);
  }
  if (!privateKey.extractable) {
    throw new Error("unexpected private key is unextractable");
  }
  const jwk = await crypto.subtle.exportKey("jwk", privateKey);
  const { kty } = jwk;
  const { alg, e, n } = jwk;
  const { crv, x, y } = jwk;
  return { kty, alg, e, n, crv, x, y, key_ops: [CryptoKeyUsage.Verify] };
}
__name(exportPublicJwkFrom, "exportPublicJwkFrom");
function getKeyAlgorithm(name) {
  switch (name) {
    case "HS256":
      return {
        name: "HMAC",
        hash: {
          name: "SHA-256"
        }
      };
    case "HS384":
      return {
        name: "HMAC",
        hash: {
          name: "SHA-384"
        }
      };
    case "HS512":
      return {
        name: "HMAC",
        hash: {
          name: "SHA-512"
        }
      };
    case "RS256":
      return {
        name: "RSASSA-PKCS1-v1_5",
        hash: {
          name: "SHA-256"
        }
      };
    case "RS384":
      return {
        name: "RSASSA-PKCS1-v1_5",
        hash: {
          name: "SHA-384"
        }
      };
    case "RS512":
      return {
        name: "RSASSA-PKCS1-v1_5",
        hash: {
          name: "SHA-512"
        }
      };
    case "PS256":
      return {
        name: "RSA-PSS",
        hash: {
          name: "SHA-256"
        },
        saltLength: 32
      };
    case "PS384":
      return {
        name: "RSA-PSS",
        hash: {
          name: "SHA-384"
        },
        saltLength: 48
      };
    case "PS512":
      return {
        name: "RSA-PSS",
        hash: {
          name: "SHA-512"
        },
        saltLength: 64
      };
    case "ES256":
      return {
        name: "ECDSA",
        hash: {
          name: "SHA-256"
        },
        namedCurve: "P-256"
      };
    case "ES384":
      return {
        name: "ECDSA",
        hash: {
          name: "SHA-384"
        },
        namedCurve: "P-384"
      };
    case "ES512":
      return {
        name: "ECDSA",
        hash: {
          name: "SHA-512"
        },
        namedCurve: "P-521"
      };
    case "EdDSA":
      return {
        name: "Ed25519",
        namedCurve: "Ed25519"
      };
    default:
      throw new JwtAlgorithmNotImplemented(name);
  }
}
__name(getKeyAlgorithm, "getKeyAlgorithm");
function isCryptoKey(key) {
  const runtime = getRuntimeKey();
  if (runtime === "node" && !!crypto.webcrypto) {
    return key instanceof crypto.webcrypto.CryptoKey;
  }
  return key instanceof CryptoKey;
}
__name(isCryptoKey, "isCryptoKey");

// node_modules/hono/dist/utils/jwt/jwt.js
var encodeJwtPart = /* @__PURE__ */ __name((part) => encodeBase64Url(utf8Encoder.encode(JSON.stringify(part)).buffer).replace(/=/g, ""), "encodeJwtPart");
var encodeSignaturePart = /* @__PURE__ */ __name((buf) => encodeBase64Url(buf).replace(/=/g, ""), "encodeSignaturePart");
var decodeJwtPart = /* @__PURE__ */ __name((part) => JSON.parse(utf8Decoder.decode(decodeBase64Url(part))), "decodeJwtPart");
function isTokenHeader(obj) {
  if (typeof obj === "object" && obj !== null) {
    const objWithAlg = obj;
    return "alg" in objWithAlg && Object.values(AlgorithmTypes).includes(objWithAlg.alg) && (!("typ" in objWithAlg) || objWithAlg.typ === "JWT");
  }
  return false;
}
__name(isTokenHeader, "isTokenHeader");
var sign = /* @__PURE__ */ __name(async (payload, privateKey, alg = "HS256") => {
  const encodedPayload = encodeJwtPart(payload);
  let encodedHeader;
  if (typeof privateKey === "object" && "alg" in privateKey) {
    alg = privateKey.alg;
    encodedHeader = encodeJwtPart({ alg, typ: "JWT", kid: privateKey.kid });
  } else {
    encodedHeader = encodeJwtPart({ alg, typ: "JWT" });
  }
  const partialToken = `${encodedHeader}.${encodedPayload}`;
  const signaturePart = await signing(privateKey, alg, utf8Encoder.encode(partialToken));
  const signature = encodeSignaturePart(signaturePart);
  return `${partialToken}.${signature}`;
}, "sign");
var verify = /* @__PURE__ */ __name(async (token, publicKey, algOrOptions) => {
  const optsIn = typeof algOrOptions === "string" ? { alg: algOrOptions } : algOrOptions || {};
  const opts = {
    alg: optsIn.alg ?? "HS256",
    iss: optsIn.iss,
    nbf: optsIn.nbf ?? true,
    exp: optsIn.exp ?? true,
    iat: optsIn.iat ?? true
  };
  const tokenParts = token.split(".");
  if (tokenParts.length !== 3) {
    throw new JwtTokenInvalid(token);
  }
  const { header, payload } = decode(token);
  if (!isTokenHeader(header)) {
    throw new JwtHeaderInvalid(header);
  }
  const now = Date.now() / 1e3 | 0;
  if (opts.nbf && payload.nbf && payload.nbf > now) {
    throw new JwtTokenNotBefore(token);
  }
  if (opts.exp && payload.exp && payload.exp <= now) {
    throw new JwtTokenExpired(token);
  }
  if (opts.iat && payload.iat && now < payload.iat) {
    throw new JwtTokenIssuedAt(now, payload.iat);
  }
  if (opts.iss) {
    if (!payload.iss) {
      throw new JwtTokenIssuer(opts.iss, null);
    }
    if (typeof opts.iss === "string" && payload.iss !== opts.iss) {
      throw new JwtTokenIssuer(opts.iss, payload.iss);
    }
    if (opts.iss instanceof RegExp && !opts.iss.test(payload.iss)) {
      throw new JwtTokenIssuer(opts.iss, payload.iss);
    }
  }
  const headerPayload = token.substring(0, token.lastIndexOf("."));
  const verified = await verifying(
    publicKey,
    opts.alg,
    decodeBase64Url(tokenParts[2]),
    utf8Encoder.encode(headerPayload)
  );
  if (!verified) {
    throw new JwtTokenSignatureMismatched(token);
  }
  return payload;
}, "verify");
var verifyWithJwks = /* @__PURE__ */ __name(async (token, options, init2) => {
  const verifyOpts = options.verification || {};
  const header = decodeHeader(token);
  if (!isTokenHeader(header)) {
    throw new JwtHeaderInvalid(header);
  }
  if (!header.kid) {
    throw new JwtHeaderRequiresKid(header);
  }
  if (options.jwks_uri) {
    const response = await fetch(options.jwks_uri, init2);
    if (!response.ok) {
      throw new Error(`failed to fetch JWKS from ${options.jwks_uri}`);
    }
    const data = await response.json();
    if (!data.keys) {
      throw new Error('invalid JWKS response. "keys" field is missing');
    }
    if (!Array.isArray(data.keys)) {
      throw new Error('invalid JWKS response. "keys" field is not an array');
    }
    if (options.keys) {
      options.keys.push(...data.keys);
    } else {
      options.keys = data.keys;
    }
  } else if (!options.keys) {
    throw new Error('verifyWithJwks requires options for either "keys" or "jwks_uri" or both');
  }
  const matchingKey = options.keys.find((key) => key.kid === header.kid);
  if (!matchingKey) {
    throw new JwtTokenInvalid(token);
  }
  return await verify(token, matchingKey, {
    alg: matchingKey.alg || header.alg,
    ...verifyOpts
  });
}, "verifyWithJwks");
var decode = /* @__PURE__ */ __name((token) => {
  try {
    const [h, p] = token.split(".");
    const header = decodeJwtPart(h);
    const payload = decodeJwtPart(p);
    return {
      header,
      payload
    };
  } catch {
    throw new JwtTokenInvalid(token);
  }
}, "decode");
var decodeHeader = /* @__PURE__ */ __name((token) => {
  try {
    const [h] = token.split(".");
    return decodeJwtPart(h);
  } catch {
    throw new JwtTokenInvalid(token);
  }
}, "decodeHeader");

// node_modules/hono/dist/utils/jwt/index.js
var Jwt = { sign, verify, decode, verifyWithJwks };

// node_modules/hono/dist/middleware/jwt/jwt.js
var verifyWithJwks2 = Jwt.verifyWithJwks;
var verify2 = Jwt.verify;
var decode2 = Jwt.decode;
var sign2 = Jwt.sign;

// src/utils/jwt.ts
var ACCESS_TOKEN_EXPIRY = 15 * 60;
var REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60;
var JWTService = class {
  static {
    __name(this, "JWTService");
  }
  static JWT_SECRET;
  // Méthode statique pour initialiser le secret
  static initialize(secret) {
    if (!secret) {
      throw new Error("JWT_SECRET is required");
    }
    this.JWT_SECRET = secret;
  }
  static async generateAccessToken(userId, email, role) {
    if (!this.JWT_SECRET) {
      throw new Error("JWTService not initialized. Call JWTService.initialize() first.");
    }
    const payload = {
      userId,
      email,
      role,
      type: "access",
      iat: Math.floor(Date.now() / 1e3),
      exp: Math.floor(Date.now() / 1e3) + ACCESS_TOKEN_EXPIRY
    };
    return await sign2(payload, this.JWT_SECRET);
  }
  /**
   * Générer un refresh token (longue durée - 7 jours)
   */
  static async generateRefreshToken(userId, email) {
    if (!this.JWT_SECRET) {
      throw new Error("JWTService not initialized. Call JWTService.initialize() first.");
    }
    const payload = {
      userId,
      email,
      type: "refresh",
      iat: Math.floor(Date.now() / 1e3),
      exp: Math.floor(Date.now() / 1e3) + REFRESH_TOKEN_EXPIRY
    };
    return await sign2(payload, this.JWT_SECRET);
  }
  /**
   * Générer une paire complète (access + refresh)
   */
  static async generateTokenPair(userId, email, role) {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(userId, email, role),
      this.generateRefreshToken(userId, email)
    ]);
    return {
      accessToken,
      refreshToken,
      expiresIn: ACCESS_TOKEN_EXPIRY
    };
  }
  /**
   * Vérifier et décoder un token
   */
  static async verifyToken(token) {
    if (!this.JWT_SECRET) {
      throw new Error("JWTService not initialized. Call JWTService.initialize() first.");
    }
    try {
      const payload = await verify2(token, this.JWT_SECRET);
      return payload;
    } catch (error) {
      console.error("[JWT] Token invalide:", error);
      return null;
    }
  }
  /**
   * Extraire le token du header Authorization
   * Format attendu: "Bearer <token>"
   */
  static extractToken(authHeader) {
    if (!authHeader) return null;
    const parts = authHeader.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      return parts[1];
    }
    return null;
  }
};

// src/utils/tokenBlacklist.ts
var TokenBlacklist = class {
  static {
    __name(this, "TokenBlacklist");
  }
  env;
  constructor(env) {
    this.env = env;
  }
  /**
   * Ajouter un token à la blacklist
   */
  async add(token, userId, expiresAt) {
    try {
      const Blacklist = TokenBlacklistTable(this.env);
      await Blacklist.create({
        id: v4_default(),
        token,
        userId,
        revokedAt: (/* @__PURE__ */ new Date()).toISOString(),
        expiresAt: new Date(expiresAt * 1e3).toISOString()
      });
      console.log("[Blacklist] Token r\xE9voqu\xE9");
    } catch (error) {
      console.error("[Blacklist] Erreur ajout:", error);
    }
  }
  /**
   * Vérifier si un token est blacklisté
   */
  async isBlacklisted(token) {
    try {
      const Blacklist = TokenBlacklistTable(this.env);
      const result = await Blacklist.findOne({
        where: { token }
      });
      return !!result;
    } catch (error) {
      console.error("[Blacklist] Erreur v\xE9rification:", error);
      return false;
    }
  }
  /**
   * Nettoyer les tokens expirés (cron job quotidien)
   */
  async cleanup() {
    try {
      const Blacklist = TokenBlacklistTable(this.env);
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const allTokens = await Blacklist.findAll();
      let deleted = 0;
      for (const token of allTokens) {
        if (token.expiresAt < now) {
          await Blacklist.delete(token.id);
          deleted++;
        }
      }
      console.log(`[Blacklist] ${deleted} tokens expir\xE9s supprim\xE9s`);
      return deleted;
    } catch (error) {
      console.error("[Blacklist] Erreur cleanup:", error);
      return 0;
    }
  }
};

// src/middleware/authMiddleware.ts
var authMiddleware = /* @__PURE__ */ __name(async (c, next) => {
  const JWT_SECRET = c.env.JWT_SECRET;
  JWTService.initialize(JWT_SECRET);
  try {
    const authHeader = c.req.header("Authorization");
    const token = JWTService.extractToken(authHeader);
    if (!token) {
      return c.json({ error: "Token manquant" }, 401);
    }
    const blacklist = new TokenBlacklist(c.env);
    if (await blacklist.isBlacklisted(token)) {
      return c.json({ error: "Token r\xE9voqu\xE9" }, 401);
    }
    const payload = await JWTService.verifyToken(token);
    if (!payload || payload.type !== "access") {
      return c.json({ error: "Token invalide ou expir\xE9" }, 401);
    }
    c.set("user", {
      userId: payload.userId,
      email: payload.email,
      role: payload.role
    });
    await next();
  } catch (error) {
    console.error("[Auth Middleware] Erreur:", error);
    return c.json({ error: "Erreur authentification" }, 500);
  }
}, "authMiddleware");
var optionalAuth = /* @__PURE__ */ __name(async (c, next) => {
  const JWT_SECRET = c.env.JWT_SECRET;
  JWTService.initialize(JWT_SECRET);
  try {
    const token = JWTService.extractToken(c.req.header("Authorization"));
    if (token) {
      const payload = await JWTService.verifyToken(token);
      if (payload?.type === "access") {
        c.set("user", {
          userId: payload.userId,
          email: payload.email,
          role: payload.role
        });
      }
    }
  } catch {
  }
  await next();
}, "optionalAuth");

// src/routes/articles.ts
init_instant();

// utils/syncState.ts
var getDB2 = /* @__PURE__ */ __name((env) => {
  const D1 = env.DB;
  return D1 ?? null;
}, "getDB");
var bumpVersion = /* @__PURE__ */ __name(async (env, table, elementId, updatedBy, updatedAt = (/* @__PURE__ */ new Date()).toISOString()) => {
  const D1 = getDB2(env);
  if (!D1) return 0;
  try {
    await D1.prepare(
      `INSERT INTO sync_state (table_name, element_id, version, updatedAt, updatedBy, deleted)
       VALUES (?, ?, 1, ?, ?, 0)
       ON CONFLICT(table_name, element_id) DO UPDATE SET
         version = version + 1,
         updatedAt = excluded.updatedAt,
         updatedBy = excluded.updatedBy,
         deleted = 0`
    ).bind(table, elementId, updatedAt, updatedBy).run();
    const row = await D1.prepare(
      `SELECT version FROM sync_state WHERE table_name = ? AND element_id = ?`
    ).bind(table, elementId).first();
    return row?.version ?? 0;
  } catch (e) {
    console.log("[sync_state] bumpVersion error:", table, elementId, e);
    return 0;
  }
}, "bumpVersion");
var getSyncState = /* @__PURE__ */ __name(async (env, table, elementId) => {
  const D1 = getDB2(env);
  if (!D1) return null;
  try {
    return await D1.prepare(
      `SELECT version, updatedAt, updatedBy, deleted FROM sync_state WHERE table_name = ? AND element_id = ?`
    ).bind(table, elementId).first();
  } catch (e) {
    console.log("[sync_state] getSyncState error:", e);
    return null;
  }
}, "getSyncState");
var arbitrateLWW = /* @__PURE__ */ __name(async (env, table, elementId, clientUpdatedAt, clientUpdatedBy) => {
  const current2 = await getSyncState(env, table, elementId);
  if (!current2) {
    return {
      applied: "client",
      currentVersion: 0,
      currentUpdatedAt: clientUpdatedAt,
      currentUpdatedBy: clientUpdatedBy
    };
  }
  const clientWins = clientUpdatedAt > current2.updatedAt || clientUpdatedAt === current2.updatedAt && clientUpdatedBy > current2.updatedBy;
  return {
    applied: clientWins ? "client" : "server",
    currentVersion: current2.version,
    currentUpdatedAt: current2.updatedAt,
    currentUpdatedBy: current2.updatedBy
  };
}, "arbitrateLWW");
var SEEDABLE = [
  { table: "notes", tsColumn: "COALESCE(modified, created, datetime('now'))" },
  { table: "groupes", tsColumn: "COALESCE(modified, created, datetime('now'))" },
  { table: "articles", tsColumn: "COALESCE(updatedAt, createdAt, datetime('now'))" },
  { table: "publish", tsColumn: "COALESCE(updatedAt, createdAt, datetime('now'))" },
  { table: "comments", tsColumn: "COALESCE(modified, created, datetime('now'))" },
  { table: "appreciations", tsColumn: "datetime('now')" }
];
var seedIfEmpty = /* @__PURE__ */ __name(async (env) => {
  const D1 = getDB2(env);
  if (!D1) return null;
  try {
    const countRow = await D1.prepare(`SELECT COUNT(*) as n FROM sync_state`).first();
    if ((countRow?.n ?? 0) > 0) {
      return { seeded: 0 };
    }
    let total = 0;
    for (const { table, tsColumn } of SEEDABLE) {
      try {
        const tableExists = await D1.prepare(
          `SELECT name FROM sqlite_master WHERE type='table' AND name = ?`
        ).bind(table).first();
        if (!tableExists) continue;
        const res = await D1.prepare(
          `INSERT INTO sync_state (table_name, element_id, version, updatedAt, updatedBy, deleted)
           SELECT ?, id, 1, ${tsColumn}, 'bootstrap', 0
           FROM ${table}
           WHERE NOT EXISTS (
             SELECT 1 FROM sync_state s
             WHERE s.table_name = ? AND s.element_id = ${table}.id
           )`
        ).bind(table, table).run();
        const inserted = res.meta?.changes ?? 0;
        total += inserted;
        console.log(`[sync_state seed] ${table}: ${inserted} rows`);
      } catch (e) {
        console.log(`[sync_state seed] ${table} failed:`, e);
      }
    }
    return { seeded: total };
  } catch (e) {
    console.log("[sync_state seed] global error:", e);
    return null;
  }
}, "seedIfEmpty");
var seededOnce = false;
var ensureSeed = /* @__PURE__ */ __name(async (env) => {
  if (seededOnce) return;
  seededOnce = true;
  await seedIfEmpty(env);
}, "ensureSeed");

// src/routes/articles.ts
var article = new Hono2();
var Article = /* @__PURE__ */ __name((env) => {
  (async () => await Articles(env).createTable())();
  return Articles(env);
}, "Article");
article.get("/", async ({ json: json2, env, res }) => {
  const Articles2 = Publish(env);
  const db2 = getDB(env);
  return json2(
    await Articles2.findAll({
      orderBy: { column: "createdAt", direction: "DESC" },
      select: ["id", "userid", "title", "description", "imageurl", "noteid", "topic", "createdAt", "updatedAt"],
      include: {
        model: "users",
        as: "user",
        foreignKey: "userid",
        localKey: "id",
        type: "belongsTo",
        select: ["id", "name", "email", "church_status", "first_name", "photo"]
      }
    })
  );
});
article.get("/check", async ({ json: json2, env, res }) => {
  const db2 = getDB(env);
  const Articles2 = Publish(env);
  const createdArticleStats = /* @__PURE__ */ __name(async (articleId) => {
    try {
      const articleStats = await db2.transact(db2.tx.articlesStats[id_default()].create({
        articleId,
        commentCount: 0,
        likeCount: 0,
        viewCount: 0,
        lastCommentAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date(),
        shareCount: 0,
        signals: []
      }));
      return articleStats.clientId;
    } catch (error) {
      console.log(error);
    }
  }, "createdArticleStats");
  for (let i2 = 0; i2 < (await Articles2.findAll()).length; i2++) {
    const artId = (await Articles2.findAll())[i2].id;
    const article2 = await Articles2.findById(artId);
    const check = await db2.query({
      articlesStats: {
        $: {
          where: {
            articleId: article2?.id
          }
        }
      }
    });
    if (check.articlesStats?.length === 0) {
      await createdArticleStats(article2?.id);
    }
  }
  return json2({
    message: "done"
  });
});
article.get("/stats", async ({ json: json2, env, res }) => {
  const db2 = getDB(env);
  const stats = await db2.query({
    articlesStats: {
      $: {
        limit: 7
        // Similar to limit, order is limited to top-level namespaces right now
      }
    }
  });
  const sortedArticles = stats.articlesStats.sort((a, b) => b.viewCount - a.viewCount);
  const topArticles = await Promise.all(sortedArticles.map(async (articles) => {
    const Articles2 = Publish(env);
    try {
      const article2 = await Articles2.findById(articles.articleId, {
        include: {
          model: "users",
          as: "user",
          foreignKey: "userid",
          localKey: "id",
          type: "belongsTo",
          select: ["id", "name", "email", "church_status", "first_name", "photo"]
        }
      });
      const lightArticle = article2 ? (() => {
        const { body, appreciation: appreciation2, ...rest } = article2;
        return rest;
      })() : null;
      return {
        ...articles,
        article: lightArticle
      };
    } catch (error) {
      console.log("[Articles] Error:", error);
      return {
        ...articles,
        article: null
      };
    }
  }));
  return json2({
    stats: topArticles
  });
});
article.get("/:articleid", optionalAuth, async ({ json: json2, env, text, req, status, get: get2 }) => {
  const { articleid } = req.param();
  const Articles2 = Publish(env);
  const history2 = HistoryTable(env);
  const user = get2("user");
  try {
    const articleData = await Articles2.findById(articleid, {
      include: {
        model: "users",
        as: "user",
        foreignKey: "userid",
        localKey: "id",
        type: "belongsTo",
        select: ["id", "name", "email", "church_status", "first_name", "photo"]
      }
    });
    if (!articleData) {
      status(404);
      return json2({ error: "Article non trouv\xE9" });
    }
    if (user?.userId) {
      const existingHistory = await history2.findAll({
        where: {
          articleid,
          userid: user.userId
        }
      });
      if (existingHistory && existingHistory.length > 0) {
        await history2.update(existingHistory[0].id, {
          lastReading: (/* @__PURE__ */ new Date()).toISOString()
        });
      } else {
        await history2.create({
          id: v4_default(),
          articleid,
          articleImage: articleData?.imageurl ?? "",
          articleTitle: articleData?.title ?? "",
          articleCreatedAt: articleData?.createdAt ?? (/* @__PURE__ */ new Date()).toISOString(),
          userid: user.userId,
          lastReading: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    }
    return json2({
      success: true,
      article: articleData,
      historyTracked: !!user?.userId
      // Indique si l'historique a été suivi
    });
  } catch (error) {
    console.log("[Articles] Error:", error);
    status(500);
    return json2({
      error: "Erreur serveur",
      details: error instanceof Error ? error.message : "Erreur inconnue"
    });
  }
});
article.get("/userid/:userid", async ({ json: json2, env, text, req }) => {
  const { userid } = req.param();
  const Articles2 = Article(env);
  const results = await Articles2.findAll({
    where: {
      userid
    }
  });
  return json2(results);
});
article.post("/:userid/doc/:articleid", async ({ json: json2, env, req, status }) => {
  const { userid, articleid } = req.param();
  const article2 = await req.json();
  const Articles2 = Publish(env);
  try {
    const result = await Articles2.create({
      id: articleid,
      userid,
      title: article2.title,
      description: article2.description,
      appreciation: "[]",
      imageurl: article2.imageurl,
      noteid: article2.noteid,
      body: article2.body,
      topic: article2.topic,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    const syncVersion = await bumpVersion(env, "publish", articleid, userid);
    return json2({
      status: `/articles 200 OK succes`,
      data: result,
      syncVersion
    });
  } catch (err) {
    console.log("il a y une erreur : ", err);
    status(500);
    return json2({
      status: `/articles 500 Error`,
      error: JSON.stringify(err)
    });
  }
});
article.put("/:userid/doc/:articleid", async ({ json: json2, env, req, status }) => {
  const { articleid, userid } = req.param();
  const article2 = await req.json();
  const Articles2 = Article(env);
  try {
    const clientUpdatedAt = article2._updatedAt ?? (/* @__PURE__ */ new Date()).toISOString();
    const decision = await arbitrateLWW(env, "articles", articleid, clientUpdatedAt, userid);
    if (decision.applied === "server") {
      const canonical = await Articles2.findById(articleid);
      return json2({
        status: `/articles 200 OK conflict`,
        applied: "server",
        currentVersion: decision.currentVersion,
        canonical
      });
    }
    const result = await Articles2.updateWhere(
      { userid },
      {
        id: articleid,
        userid,
        title: article2.title,
        description: article2.description,
        appreciation: "[]",
        imageurl: article2.imageurl,
        noteid: article2.noteid,
        topic: article2.topic,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    );
    const syncVersion = await bumpVersion(env, "articles", articleid, userid);
    return json2({
      status: `/articles 200 OK succes`,
      data: result,
      syncVersion
    });
  } catch (err) {
    console.log("il a y une erreur : ", err);
    status(500);
    return json2({
      status: `/articles 500 Error`,
      error: err
    });
  }
});
var articles_default = article;

// src/routes/notes.ts
var notes = new Hono2();
notes.get("/", async ({ json: json2, env, res }) => {
  const Notes2 = Notes(env);
  const Synced = SyncEventsTable(env);
  console.log("je suis dans la joie");
  return json2({
    notes: await Notes2.findAll({
      select: ["creator", "id", "modified", "body", "pinned"],
      include: {
        model: "Users",
        as: "user",
        foreignKey: "creator",
        localKey: "id",
        type: "belongsTo"
      }
    }),
    sync_event: await Synced.findAll()
  });
});
notes.get("/sync/:userid", async ({ json: json2, req, res, env }) => {
  const { userid } = req.param();
  const query3 = req.queries();
  const Synced = SyncEventsTable(env);
  const result = await Synced.findAll({
    where: {
      userId: userid
    }
  });
  return json2({
    message: "userid " + userid,
    data: result,
    query: query3
  });
});
notes.get("/:creator", async ({ json: json2, req, env }) => {
  const Notes2 = Notes(env);
  const { creator } = req.param();
  const result = await Notes2.findAll({
    where: {
      creator
    }
  });
  return json2({
    data: result
  });
});
notes.post("/:id", async ({ json: json2, req, env }) => {
  const Notes2 = Notes(env);
  const Synced = SyncEventsTable(env);
  const { id: id2 } = req.param();
  const data = await req.json();
  const check = await Notes2.findOne({
    where: {
      id: id2
    }
  });
  if (check) {
    const clientUpdatedAt = data._updatedAt ?? (/* @__PURE__ */ new Date()).toISOString();
    const decision = await arbitrateLWW(
      env,
      "notes",
      data.id,
      clientUpdatedAt,
      data.creator
    );
    if (decision.applied === "server") {
      return json2({
        message: "server wins",
        applied: "server",
        sucess: false,
        currentVersion: decision.currentVersion,
        canonical: check
      });
    }
    const result2 = await Notes2.updateWhere(
      {
        id: data.id
      },
      {
        ...data,
        clientversion: data.version || 1,
        lastSyncUpdate: (/* @__PURE__ */ new Date()).toISOString(),
        version: check.version + 1
      }
    );
    Synced.create({
      id: v4_default(),
      userId: data.creator,
      entityId: data.id,
      entityType: "note",
      action: "updated",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      synced: 0
    });
    const newVersion2 = await bumpVersion(env, "notes", data.id, data.creator);
    return json2({
      message: "note updated",
      check,
      sucess: true,
      result: result2,
      syncVersion: newVersion2
    });
  }
  const object = {
    ...data,
    clientversion: data.version || 1,
    lastSyncUpdate: (/* @__PURE__ */ new Date()).toISOString(),
    version: 1
  };
  const result = await Notes2.create(object);
  Synced.create({
    id: v4_default(),
    userId: data.creator,
    entityId: result.id,
    entityType: "note",
    action: "created",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    synced: 0
  });
  const newVersion = await bumpVersion(env, "notes", result.id, data.creator);
  return json2({
    message: "note created",
    sucess: true,
    result,
    syncVersion: newVersion
  });
});
var notes_default = notes;

// src/images_rename.ts
var Millisecond = /* @__PURE__ */ __name((millisecond, seconds) => {
  if (millisecond < 10) return `${seconds}000${millisecond}`;
  if (millisecond < 100) return `${seconds}00${millisecond}`;
  if (millisecond < 1e3) return `${seconds}0${millisecond}`;
  return `${seconds}${millisecond}`;
}, "Millisecond");
function MinutesTime() {
  const date2 = /* @__PURE__ */ new Date();
  const getHour = date2.getHours();
  const getMinute = date2.getMinutes();
  const getMillisecond = date2.getMilliseconds();
  const getSecond = date2.getSeconds();
  const minuteConverts = getHour * 60 + getMinute;
  const seconds = Millisecond(getMillisecond, getSecond);
  if (minuteConverts < 10) return `${seconds}000${minuteConverts}`;
  if (minuteConverts < 100) return `${seconds}00${minuteConverts}`;
  if (minuteConverts < 1e3) return `${seconds}0${minuteConverts}`;
  return `${seconds}${minuteConverts}`;
}
__name(MinutesTime, "MinutesTime");
function DateForme() {
  const date2 = /* @__PURE__ */ new Date();
  const getDate = date2.getDate();
  const getMonth = date2.getMonth();
  const getYears = date2.getFullYear();
  const day = getDate < 10 ? `0${getDate}` : getDate;
  const month = getMonth < 10 ? `0${getMonth}` : getMonth;
  return `${day}${month}${getYears}`;
}
__name(DateForme, "DateForme");
function Metadata_images(image) {
  const object = {};
  object.size = image.size;
  object.minetype = image.type;
  object.lastmodified = image.lastModified;
  object.originalname = image.name;
  let imagetitre = `IMG${MinutesTime()}-${DateForme()}`;
  switch (image.type) {
    case "image/jpeg":
      object.name = imagetitre + ".jpg";
      return object;
    case "image/png":
      object.name = imagetitre + ".png";
      return object;
  }
}
__name(Metadata_images, "Metadata_images");

// src/images.ts
var images = new Hono2();
images.get("/", ({ json: json2, env, res }) => {
  return json2({
    messgae: "je suis dans la place"
  });
});
images.post("/:userid", async ({ req, res, json: json2, env, text, status }) => {
  const bucket = env.STORAGE;
  const { images: images2 } = await req.parseBody();
  const { userid } = req.param();
  const Image = ImagesTable(env);
  const hostname = new URL(req.url).host;
  try {
    const metadata = Metadata_images(images2);
    const object = {
      ...metadata,
      path: "/" + metadata?.name,
      createdAt: Date.now(),
      key: v4_default()
    };
    const key = `images/${object.name}`;
    await bucket.put(key, images2, {
      customMetadata: {
        name: object.name,
        size: object.size,
        type: object.minetype,
        lastModified: object.lastmodified
      },
      httpMetadata: {
        contentType: object.minetype
      }
    });
    const save = await Image.create({
      id: v4_default(),
      name: object.name,
      userid,
      size: object.size,
      mineType: object.minetype,
      url: `${hostname}/image/g/${object.name}`,
      created: (/* @__PURE__ */ new Date()).toISOString(),
      modified: (/* @__PURE__ */ new Date()).toISOString()
    });
    return json2(save);
  } catch (error) {
    console.log(error);
    status(500);
    return text("il y a une erreur " + error);
  }
});
images.get("/g/:name", async ({ json: json2, env, res, req }) => {
  const { name } = req.param();
  const bucket = env.STORAGE;
  const key = `images/${name}`;
  const files = await bucket.get(key);
  if (files === null) {
    return json2("il y n'a pas ce fichier");
  }
  const headers = new Headers();
  files.writeHttpMetadata(headers);
  headers.set("etag", files.httpEtag);
  return new Response(files.body, { headers });
});
var images_default = images;

// src/routes/groups.ts
var groups = new Hono2();
groups.get("/", async ({ json: json2, env, res }) => {
  const Groups = GroupsTable(env);
  const Synced = SyncEventsTable(env);
  console.log("je suis dans la joie");
  return json2({
    groupes: await Groups.findAll(),
    sync_event: await Synced.findAll()
  });
});
groups.get("/sync/:userid", async ({ json: json2, req, res, env }) => {
  const { userid } = req.param();
  const query3 = req.queries();
  const Synced = SyncEventsTable(env);
  const result = await Synced.findAll({
    where: {
      userId: userid
    }
  });
  return json2({
    message: "userid " + userid,
    sync: result,
    query: query3
  });
});
groups.get("/:userid", async ({ json: json2, req, env }) => {
  const Groups = GroupsTable(env);
  const { userid } = req.param();
  const result = await Groups.findAll({
    where: {
      userid
    }
  });
  return json2({
    data: result
  });
});
groups.post("/:id", async ({ json: json2, req, env }) => {
  const Groups = GroupsTable(env);
  const Synced = SyncEventsTable(env);
  const { id: id2 } = req.param();
  const data = await req.json();
  const check = await Groups.findOne({
    where: {
      id: data.id
    }
  });
  if (check) {
    const clientUpdatedAt = data._updatedAt ?? (/* @__PURE__ */ new Date()).toISOString();
    const decision = await arbitrateLWW(
      env,
      "groupes",
      data.id,
      clientUpdatedAt,
      data.userid
    );
    if (decision.applied === "server") {
      return json2({
        applied: "server",
        sucess: false,
        currentVersion: decision.currentVersion,
        canonical: check
      });
    }
    const result2 = await Groups.updateWhere(
      {
        id: data.id
      },
      {
        ...data,
        userid: id2,
        lastSyncUpdate: (/* @__PURE__ */ new Date()).toISOString(),
        version: check.version + 1
      }
    );
    Synced.create({
      id: v4_default(),
      userId: data.userid,
      entityId: data.id,
      entityType: "group",
      action: "updated",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      synced: 0
    });
    const newVersion2 = await bumpVersion(env, "groupes", data.id, data.userid);
    return json2({
      sucess: true,
      syncVersion: newVersion2
    });
  }
  const object = {
    ...data,
    userid: data.userid,
    lastSyncUpdate: (/* @__PURE__ */ new Date()).toISOString(),
    version: 1
  };
  const result = await Groups.create(object);
  Synced.create({
    id: v4_default(),
    userId: data.userid,
    entityId: result.id,
    entityType: "group",
    action: "created",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    synced: 0
  });
  const newVersion = await bumpVersion(env, "groupes", result.id, data.userid);
  return json2({
    sucess: true,
    syncVersion: newVersion
  });
});
var groups_default = groups;

// src/routes/bible.ts
var bible = new Hono2();
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i2 = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i2)).toFixed(dm)) + " " + sizes[i2];
}
__name(formatBytes, "formatBytes");
bible.get("/", async ({ json: json2, env, res }) => {
  const listed = await env.STORAGE.list({
    prefix: "bibles/"
  });
  const jsonFiles = listed.objects.filter(
    (obj) => obj.key.toLowerCase().endsWith(".json")
  );
  const count = jsonFiles.length;
  const filesInfo = jsonFiles.map((file) => ({
    nom: file.key,
    taille: file.size,
    tailleFormatee: formatBytes(file.size),
    derniereModification: file.uploaded
  }));
  const tailleTotal = jsonFiles.reduce((sum, file) => sum + file.size, 0);
  const response = {
    nombreFichiersJSON: count,
    tailleTotale: formatBytes(tailleTotal),
    fichiers: filesInfo
  };
  return new Response(JSON.stringify(response, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
});
bible.get("/version", async ({ json: json2, req, res, env, status }) => {
  const query3 = req.query("name");
  try {
    const obj = await env.STORAGE.get(query3);
    const content = await obj?.text();
    const bibleData = JSON.parse(content);
    return json2({
      name: bibleData.metadata.name,
      shortname: bibleData.metadata.shortname,
      module: bibleData.metadata.module,
      year: bibleData.metadata.year,
      metadata: bibleData.metadata,
      verset: bibleData.verses.length,
      lien: "/download?name=bibles/" + bibleData.metadata.module + ".json"
    });
  } catch (error) {
    console.log(error);
    status(500);
    return json2({
      error
    });
  }
});
bible.get("/download", async ({ json: json2, req, res, env, status }) => {
  const query3 = req.query("name");
  try {
    const obj = await env.STORAGE.get(query3);
    const content = await obj?.text();
    const bibleData = JSON.parse(content);
    return json2({
      shortname: bibleData.metadata.shortname,
      year: bibleData.metadata.year,
      verset: bibleData.verses.length,
      content: bibleData.verses
    });
  } catch (error) {
    console.log(error);
    status(500);
    return json2({
      error
    });
  }
});
var bible_default = bible;

// node_modules/hono/dist/utils/stream.js
var StreamingApi = class {
  static {
    __name(this, "StreamingApi");
  }
  writer;
  encoder;
  writable;
  abortSubscribers = [];
  responseReadable;
  aborted = false;
  closed = false;
  constructor(writable, _readable) {
    this.writable = writable;
    this.writer = writable.getWriter();
    this.encoder = new TextEncoder();
    const reader = _readable.getReader();
    this.abortSubscribers.push(async () => {
      await reader.cancel();
    });
    this.responseReadable = new ReadableStream({
      async pull(controller) {
        const { done, value } = await reader.read();
        done ? controller.close() : controller.enqueue(value);
      },
      cancel: /* @__PURE__ */ __name(() => {
        this.abort();
      }, "cancel")
    });
  }
  async write(input) {
    try {
      if (typeof input === "string") {
        input = this.encoder.encode(input);
      }
      await this.writer.write(input);
    } catch {
    }
    return this;
  }
  async writeln(input) {
    await this.write(input + "\n");
    return this;
  }
  sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }
  async close() {
    try {
      await this.writer.close();
    } catch {
    }
    this.closed = true;
  }
  async pipe(body) {
    this.writer.releaseLock();
    await body.pipeTo(this.writable, { preventClose: true });
    this.writer = this.writable.getWriter();
  }
  onAbort(listener) {
    this.abortSubscribers.push(listener);
  }
  abort() {
    if (!this.aborted) {
      this.aborted = true;
      this.abortSubscribers.forEach((subscriber) => subscriber());
    }
  }
};

// node_modules/hono/dist/helper/streaming/utils.js
var isOldBunVersion = /* @__PURE__ */ __name(() => {
  const version2 = typeof Bun !== "undefined" ? Bun.version : void 0;
  if (version2 === void 0) {
    return false;
  }
  const result = version2.startsWith("1.1") || version2.startsWith("1.0") || version2.startsWith("0.");
  isOldBunVersion = /* @__PURE__ */ __name(() => result, "isOldBunVersion");
  return result;
}, "isOldBunVersion");

// node_modules/hono/dist/helper/streaming/sse.js
var SSEStreamingApi = class extends StreamingApi {
  static {
    __name(this, "SSEStreamingApi");
  }
  constructor(writable, readable2) {
    super(writable, readable2);
  }
  async writeSSE(message) {
    const data = await resolveCallback(message.data, HtmlEscapedCallbackPhase.Stringify, false, {});
    const dataLines = data.split("\n").map((line) => {
      return `data: ${line}`;
    }).join("\n");
    const sseData = [
      message.event && `event: ${message.event}`,
      dataLines,
      message.id && `id: ${message.id}`,
      message.retry && `retry: ${message.retry}`
    ].filter(Boolean).join("\n") + "\n\n";
    await this.write(sseData);
  }
};
var run = /* @__PURE__ */ __name(async (stream2, cb, onError) => {
  try {
    await cb(stream2);
  } catch (e) {
    if (e instanceof Error && onError) {
      await onError(e, stream2);
      await stream2.writeSSE({
        event: "error",
        data: e.message
      });
    } else {
      console.error(e);
    }
  } finally {
    stream2.close();
  }
}, "run");
var contextStash = /* @__PURE__ */ new WeakMap();
var streamSSE = /* @__PURE__ */ __name((c, cb, onError) => {
  const { readable: readable2, writable } = new TransformStream();
  const stream2 = new SSEStreamingApi(writable, readable2);
  if (isOldBunVersion()) {
    c.req.raw.signal.addEventListener("abort", () => {
      if (!stream2.closed) {
        stream2.abort();
      }
    });
  }
  contextStash.set(stream2.responseReadable, c);
  c.header("Transfer-Encoding", "chunked");
  c.header("Content-Type", "text/event-stream");
  c.header("Cache-Control", "no-cache");
  c.header("Connection", "keep-alive");
  run(stream2, cb, onError);
  return c.newResponse(stream2.responseReadable);
}, "streamSSE");

// src/routes/comments.ts
var comments = new Hono2();
var sleep = /* @__PURE__ */ __name((ms) => new Promise((resolve) => setTimeout(resolve, ms)), "sleep");
comments.get("/:articleId/ws", async (c) => {
  const { articleId } = c.req.param();
  try {
    const id2 = c.env.COMMENTS_DO.idFromName(articleId);
    const stub = c.env.COMMENTS_DO.get(id2);
    const url = new URL(c.req.url);
    url.searchParams.set("articleId", articleId);
    return stub.fetch(url.toString(), c.req.raw);
  } catch (err) {
    console.error("[Comments] Error connecting to Durable Object:", err);
    return new Response("Error connecting to WebSocket", { status: 500 });
  }
});
comments.get("/:articleId/stream", async (c) => {
  const { articleId } = c.req.param();
  return streamSSE(c, async (stream2) => {
    const CommentsModel = Comments(c.env);
    let id2 = 0;
    let lastCheck = Date.now();
    try {
      await stream2.writeSSE({
        data: JSON.stringify({
          type: "connected",
          message: "Connected to comments stream",
          articleId
        }),
        event: "connected",
        id: String(id2++)
      });
      while (true) {
        if (c.req.raw.signal.aborted) {
          console.log(`Client disconnected from article ${articleId}`);
          break;
        }
        try {
          const newComments = await CommentsModel.findAll({
            where: { articleId },
            orderBy: { column: "created", direction: "DESC" }
          });
          const recentComments = newComments.filter((comment) => {
            const commentTime = new Date(comment.created || Date.now()).getTime();
            return commentTime > lastCheck;
          });
          if (recentComments.length > 0) {
            await stream2.writeSSE({
              data: JSON.stringify({
                type: "new_comments",
                comments: recentComments,
                count: recentComments.length
              }),
              event: "update",
              id: String(id2++)
            });
          }
          lastCheck = Date.now();
          await stream2.writeSSE({
            data: JSON.stringify({ type: "ping", timestamp: Date.now() }),
            event: "ping",
            id: String(id2++)
          });
        } catch (error) {
          console.error("Error in SSE stream:", error);
        }
        await sleep(3e3);
      }
    } catch (error) {
      console.error("Fatal error in SSE stream:", error);
    }
  });
});
comments.get("/:articleId/poll", async ({ json: json2, env, req }) => {
  const CommentsModel = Comments(env);
  const { articleId } = req.param();
  const since = req.query("since") || Date.now() - 6e4;
  try {
    const allComments = await CommentsModel.findAll({
      where: { articleId },
      orderBy: { column: "created", direction: "DESC" }
    });
    const newComments = allComments.filter((comment) => {
      const commentTime = new Date(comment.created || 0).getTime();
      return commentTime > parseInt(String(since));
    });
    return json2({
      articleId,
      comments: newComments,
      allComments,
      count: newComments.length,
      totalCount: allComments.length,
      timestamp: Date.now()
    });
  } catch (error) {
    return json2({
      error: "Failed to poll comments",
      details: String(error)
    }, 500);
  }
});
comments.get("/:articleId", async ({ json: json2, env, req }) => {
  const CommentsModel = Comments(env);
  const { articleId } = req.param();
  try {
    const allComments = await CommentsModel.findAll({
      where: { articleId }
    });
    const visibleComments = allComments.filter((comment) => {
      let signalsCount = 0;
      try {
        signalsCount = JSON.parse(comment.signals || "[]").length;
      } catch {
        signalsCount = 0;
      }
      return signalsCount < 5;
    });
    const sortedComments = visibleComments.sort((a, b) => {
      let upvotesA = 0;
      let upvotesB = 0;
      try {
        upvotesA = JSON.parse(a.upvotes || "[]").length;
      } catch {
        upvotesA = 0;
      }
      try {
        upvotesB = JSON.parse(b.upvotes || "[]").length;
      } catch {
        upvotesB = 0;
      }
      if (upvotesB !== upvotesA) {
        return upvotesB - upvotesA;
      }
      const dateA = new Date(a.modified || a.created).getTime();
      const dateB = new Date(b.modified || b.created).getTime();
      return dateB - dateA;
    });
    return json2({
      articleId,
      comments: sortedComments,
      count: sortedComments.length,
      totalComments: allComments.length,
      // Inclut les commentaires masqués
      hiddenComments: allComments.length - sortedComments.length
      // Nombre de masqués
    });
  } catch (error) {
    return json2({
      error: "Failed to fetch comments",
      details: String(error)
    }, 500);
  }
});
comments.post("/:articleId", async ({ json: json2, env, req, status }) => {
  const CommentsModel = Comments(env);
  const { articleId } = req.param();
  const url = new URL(req.url);
  try {
    const body = await req.json();
    const newComment = await CommentsModel.create({
      id: v4_default(),
      articleId,
      content: body.content || "",
      creator: body.creator || "",
      notes: 0,
      upvotes: "[]",
      // Init avec tableau vide
      signals: "[]",
      // Init avec tableau vide
      created: (/* @__PURE__ */ new Date()).toISOString(),
      modified: (/* @__PURE__ */ new Date()).toISOString()
    });
    try {
      const id2 = env.COMMENTS_DO.idFromName(articleId);
      const stub = env.COMMENTS_DO.get(id2);
      await stub.fetch("http://dummy/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "comment_added",
          comment: newComment
        })
      });
    } catch (err) {
      console.error("[Comments] Error notifying Durable Object:", err);
    }
    return json2({
      success: true,
      comment: newComment
    });
  } catch (error) {
    status(500);
    return json2({
      success: false,
      error: String(error)
    });
  }
});
comments.delete("/:articleId/:commentId", async ({ json: json2, env, req, status }) => {
  const CommentsModel = Comments(env);
  const { commentId } = req.param();
  try {
    const deleted = await CommentsModel.delete(commentId);
    if (deleted) {
      return json2({ success: true, message: "Comment deleted" });
    } else {
      status(404);
      return json2({ success: false, message: "Comment not found" });
    }
  } catch (error) {
    status(500);
    return json2({ success: false, error: String(error) });
  }
});
comments.post("/:articleId/:commentId/upvote", async ({ json: json2, env, req, status }) => {
  const CommentsModel = Comments(env);
  const { commentId } = req.param();
  const { userid } = await req.json();
  try {
    const comment = await CommentsModel.findById(commentId);
    if (!comment) {
      status(404);
      return json2({ success: false, message: "Comment not found" });
    }
    let upvotes = [];
    try {
      upvotes = JSON.parse(comment.upvotes || "[]");
    } catch {
      upvotes = [];
    }
    const index = upvotes.indexOf(userid);
    if (index > -1) {
      upvotes.splice(index, 1);
    } else {
      upvotes.push(userid);
    }
    const updated = await CommentsModel.update(commentId, {
      upvotes: JSON.stringify(upvotes),
      modified: (/* @__PURE__ */ new Date()).toISOString()
    });
    try {
      const { articleId } = req.param();
      const id2 = env.COMMENTS_DO.idFromName(articleId);
      const stub = env.COMMENTS_DO.get(id2);
      const updatedComment = await CommentsModel.findById(commentId);
      await stub.fetch("http://dummy/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "comment_updated",
          comment: updatedComment
        })
      });
    } catch (err) {
      console.error("[Comments] Error notifying Durable Object:", err);
    }
    return json2({
      success: true,
      action: index > -1 ? "removed" : "added",
      upvotesCount: upvotes.length,
      upvotes
    });
  } catch (error) {
    status(500);
    return json2({ success: false, error: String(error) });
  }
});
comments.post("/:articleId/:commentId/signal", async ({ json: json2, env, req, status }) => {
  const CommentsModel = Comments(env);
  const { commentId } = req.param();
  const { userid } = await req.json();
  try {
    const comment = await CommentsModel.findById(commentId);
    if (!comment) {
      status(404);
      return json2({ success: false, message: "Comment not found" });
    }
    let signals = [];
    try {
      signals = JSON.parse(comment.signals || "[]");
    } catch {
      signals = [];
    }
    const index = signals.indexOf(userid);
    if (index > -1) {
      signals.splice(index, 1);
    } else {
      signals.push(userid);
    }
    const updated = await CommentsModel.update(commentId, {
      signals: JSON.stringify(signals),
      modified: (/* @__PURE__ */ new Date()).toISOString()
    });
    try {
      const { articleId } = req.param();
      const id2 = env.COMMENTS_DO.idFromName(articleId);
      const stub = env.COMMENTS_DO.get(id2);
      const updatedComment = await CommentsModel.findById(commentId);
      await stub.fetch("http://dummy/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "comment_updated",
          comment: updatedComment
        })
      });
    } catch (err) {
      console.error("[Comments] Error notifying Durable Object:", err);
    }
    return json2({
      success: true,
      action: index > -1 ? "removed" : "added",
      signalsCount: signals.length,
      signals
    });
  } catch (error) {
    status(500);
    return json2({ success: false, error: String(error) });
  }
});
comments.get("/:articleId/:commentId/stats", async ({ json: json2, env, req, status }) => {
  const CommentsModel = Comments(env);
  const { commentId } = req.param();
  try {
    const comment = await CommentsModel.findById(commentId);
    if (!comment) {
      status(404);
      return json2({ success: false, message: "Comment not found" });
    }
    let upvotes = [];
    let signals = [];
    try {
      upvotes = JSON.parse(comment.upvotes || "[]");
      signals = JSON.parse(comment.signals || "[]");
    } catch {
      upvotes = [];
      signals = [];
    }
    return json2({
      success: true,
      commentId: comment.id,
      upvotesCount: upvotes.length,
      signalsCount: signals.length,
      upvotes,
      signals
    });
  } catch (error) {
    status(500);
    return json2({ success: false, error: String(error) });
  }
});
comments.get("/:articleId/reported", async ({ json: json2, env, req, status }) => {
  const CommentsModel = Comments(env);
  const { articleId } = req.param();
  try {
    const allComments = await CommentsModel.findAll({
      where: { articleId }
    });
    const reportedComments = allComments.filter((comment) => {
      let signalsCount = 0;
      try {
        signalsCount = JSON.parse(comment.signals || "[]").length;
      } catch {
        signalsCount = 0;
      }
      return signalsCount >= 5;
    }).map((comment) => {
      let signalsCount = 0;
      try {
        signalsCount = JSON.parse(comment.signals || "[]").length;
      } catch {
        signalsCount = 0;
      }
      return {
        ...comment,
        signalsCount
        // Ajouter pour faciliter l'affichage
      };
    });
    reportedComments.sort((a, b) => b.signalsCount - a.signalsCount);
    return json2({
      articleId,
      reportedComments,
      count: reportedComments.length
    });
  } catch (error) {
    status(500);
    return json2({
      error: "Failed to fetch reported comments",
      details: String(error)
    });
  }
});
var comments_default = comments;

// src/routes/appreciation.ts
var appreciation = new Hono2();
var sleep2 = /* @__PURE__ */ __name((ms) => new Promise((resolve) => setTimeout(resolve, ms)), "sleep");
appreciation.get("/:articleId/ws", async (c) => {
  const { articleId } = c.req.param();
  try {
    const id2 = c.env.APPRECIATIONS_DO.idFromName(articleId);
    const stub = c.env.APPRECIATIONS_DO.get(id2);
    const url = new URL(c.req.url);
    url.searchParams.set("articleId", articleId);
    return stub.fetch(url.toString(), c.req.raw);
  } catch (err) {
    console.error("[Appreciations] Error connecting to Durable Object:", err);
    return new Response("Error connecting to WebSocket", { status: 500 });
  }
});
appreciation.get("/:articleId/stream", async (c) => {
  const { articleId } = c.req.param();
  return streamSSE(c, async (stream2) => {
    const AppreciationsModel = Appreciations(c.env);
    let id2 = 0;
    let lastCheck = Date.now();
    try {
      const initialAppreciations = await AppreciationsModel.findAll({
        where: { articleId }
      });
      await stream2.writeSSE({
        data: JSON.stringify({
          type: "connected",
          message: "Connected to appreciations stream",
          articleId,
          count: initialAppreciations.length,
          appreciations: initialAppreciations
        }),
        event: "connected",
        id: String(id2++)
      });
      while (true) {
        if (c.req.raw.signal.aborted) {
          console.log(`Client disconnected from article ${articleId}`);
          break;
        }
        try {
          const allAppreciations = await AppreciationsModel.findAll({
            where: { articleId }
          });
          await stream2.writeSSE({
            data: JSON.stringify({
              type: "update",
              count: allAppreciations.length,
              appreciations: allAppreciations
            }),
            event: "update",
            id: String(id2++)
          });
          lastCheck = Date.now();
          await stream2.writeSSE({
            data: JSON.stringify({ type: "ping", timestamp: Date.now() }),
            event: "ping",
            id: String(id2++)
          });
        } catch (error) {
          console.error("Error in SSE stream:", error);
        }
        await sleep2(5e3);
      }
    } catch (error) {
      console.error("Fatal error in SSE stream:", error);
    }
  });
});
appreciation.get("/:articleId", async ({ json: json2, env, req }) => {
  const AppreciationsModel = Appreciations(env);
  const { articleId } = req.param();
  try {
    const allAppreciations = await AppreciationsModel.findAll({
      where: { articleId }
    });
    return json2({
      articleId,
      appreciations: allAppreciations,
      count: allAppreciations.length
    });
  } catch (error) {
    return json2({
      error: "Failed to fetch appreciations",
      details: String(error)
    }, 500);
  }
});
appreciation.post("/:articleId", async ({ json: json2, env, req, status }) => {
  const AppreciationsModel = Appreciations(env);
  const { articleId } = req.param();
  try {
    const body = await req.json();
    const existing = await AppreciationsModel.findOne({
      where: {
        articleId,
        userid: body.userid || ""
      }
    });
    if (existing) {
      return json2({
        success: false,
        message: "User has already liked this article",
        appreciation: existing
      }, 400);
    }
    const newAppreciation = await AppreciationsModel.create({
      id: v4_default(),
      articleId,
      userid: body.userid || ""
    });
    return json2({
      success: true,
      appreciation: newAppreciation,
      message: "Like added successfully"
    });
  } catch (error) {
    status(500);
    return json2({
      success: false,
      error: String(error)
    });
  }
});
appreciation.delete("/:articleId/:userid", async ({ json: json2, env, req, status }) => {
  const AppreciationsModel = Appreciations(env);
  const { articleId, userid } = req.param();
  try {
    const appreciation2 = await AppreciationsModel.findOne({
      where: {
        articleId,
        userid
      }
    });
    if (!appreciation2) {
      status(404);
      return json2({
        success: false,
        message: "Appreciation not found"
      });
    }
    const deleted = await AppreciationsModel.delete(appreciation2.id);
    if (deleted) {
      return json2({
        success: true,
        message: "Like removed successfully"
      });
    } else {
      status(500);
      return json2({
        success: false,
        message: "Failed to delete appreciation"
      });
    }
  } catch (error) {
    status(500);
    return json2({ success: false, error: String(error) });
  }
});
appreciation.post("/:articleId/toggle", async ({ json: json2, env, req, status }) => {
  const AppreciationsModel = Appreciations(env);
  const { articleId } = req.param();
  try {
    const body = await req.json();
    const userid = body.userid || "";
    const existing = await AppreciationsModel.findOne({
      where: {
        articleId,
        userid
      }
    });
    if (existing) {
      await AppreciationsModel.delete(existing.id);
      try {
        const id2 = env.APPRECIATIONS_DO.idFromName(articleId);
        const stub = env.APPRECIATIONS_DO.get(id2);
        await stub.fetch("http://dummy/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "like_toggled",
            userid,
            action: "removed"
          })
        });
      } catch (err) {
        console.error("[Appreciations] Error notifying Durable Object:", err);
      }
      return json2({
        success: true,
        action: "removed",
        message: "Like removed successfully"
      });
    } else {
      const newAppreciation = await AppreciationsModel.create({
        id: v4_default(),
        articleId,
        userid
      });
      try {
        const id2 = env.APPRECIATIONS_DO.idFromName(articleId);
        const stub = env.APPRECIATIONS_DO.get(id2);
        await stub.fetch("http://dummy/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "like_toggled",
            userid,
            action: "added"
          })
        });
      } catch (err) {
        console.error("[Appreciations] Error notifying Durable Object:", err);
      }
      return json2({
        success: true,
        action: "added",
        appreciation: newAppreciation,
        message: "Like added successfully"
      });
    }
  } catch (error) {
    status(500);
    return json2({
      success: false,
      error: String(error)
    });
  }
});
var appreciation_default = appreciation;

// list_contries.ts
var PAYS = [
  {
    name: "Afghanistan",
    topLevelDomain: [".af"],
    alpha2Code: "AF",
    alpha3Code: "AFG",
    callingCodes: ["93"],
    capital: "Kabul",
    altSpellings: ["AF", "Af\u0121\u0101nist\u0101n"],
    region: "Asia",
    subregion: "Southern Asia",
    population: 27657145,
    latlng: [33, 65],
    demonym: "Afghan",
    area: 652230,
    gini: 27.8,
    timezones: ["UTC+04:30"],
    borders: ["IRN", "PAK", "TKM", "UZB", "TJK", "CHN"],
    nativeName: "\u0627\u0641\u063A\u0627\u0646\u0633\u062A\u0627\u0646",
    numericCode: "004",
    currencies: [
      {
        code: "AFN",
        name: "Afghan afghani",
        symbol: "\u060B"
      }
    ],
    languages: [
      {
        iso639_1: "ps",
        iso639_2: "pus",
        name: "Pashto",
        nativeName: "\u067E\u069A\u062A\u0648"
      },
      {
        iso639_1: "uz",
        iso639_2: "uzb",
        name: "Uzbek",
        nativeName: "O\u02BBzbek"
      },
      {
        iso639_1: "tk",
        iso639_2: "tuk",
        name: "Turkmen",
        nativeName: "T\xFCrkmen"
      }
    ],
    translations: {
      de: "Afghanistan",
      es: "Afganist\xE1n",
      fr: "Afghanistan",
      ja: "\u30A2\u30D5\u30AC\u30CB\u30B9\u30BF\u30F3",
      it: "Afghanistan",
      br: "Afeganist\xE3o",
      pt: "Afeganist\xE3o",
      nl: "Afghanistan",
      hr: "Afganistan",
      fa: "\u0627\u0641\u063A\u0627\u0646\u0633\u062A\u0627\u0646"
    },
    flag: "https://restcountries.eu/data/afg.svg",
    regionalBlocs: [
      {
        acronym: "SAARC",
        name: "South Asian Association for Regional Cooperation",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "AFG"
  },
  {
    name: "\xC5land Islands",
    topLevelDomain: [".ax"],
    alpha2Code: "AX",
    alpha3Code: "ALA",
    callingCodes: ["358"],
    capital: "Mariehamn",
    altSpellings: ["AX", "Aaland", "Aland", "Ahvenanmaa"],
    region: "Europe",
    subregion: "Northern Europe",
    population: 28875,
    latlng: [60.116667, 19.9],
    demonym: "\xC5landish",
    area: 1580,
    gini: null,
    timezones: ["UTC+02:00"],
    borders: [],
    nativeName: "\xC5land",
    numericCode: "248",
    currencies: [
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      }
    ],
    languages: [
      {
        iso639_1: "sv",
        iso639_2: "swe",
        name: "Swedish",
        nativeName: "svenska"
      }
    ],
    translations: {
      de: "\xC5land",
      es: "Alandia",
      fr: "\xC5land",
      ja: "\u30AA\u30FC\u30E9\u30F3\u30C9\u8AF8\u5CF6",
      it: "Isole Aland",
      br: "Ilhas de Aland",
      pt: "Ilhas de Aland",
      nl: "\xC5landeilanden",
      hr: "\xC5landski otoci",
      fa: "\u062C\u0632\u0627\u06CC\u0631 \u0627\u0644\u0646\u062F"
    },
    flag: "https://restcountries.eu/data/ala.svg",
    regionalBlocs: [
      {
        acronym: "EU",
        name: "European Union",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: ""
  },
  {
    name: "Albania",
    topLevelDomain: [".al"],
    alpha2Code: "AL",
    alpha3Code: "ALB",
    callingCodes: ["355"],
    capital: "Tirana",
    altSpellings: ["AL", "Shqip\xEBri", "Shqip\xEBria", "Shqipnia"],
    region: "Europe",
    subregion: "Southern Europe",
    population: 2886026,
    latlng: [41, 20],
    demonym: "Albanian",
    area: 28748,
    gini: 34.5,
    timezones: ["UTC+01:00"],
    borders: ["MNE", "GRC", "MKD", "KOS"],
    nativeName: "Shqip\xEBria",
    numericCode: "008",
    currencies: [
      {
        code: "ALL",
        name: "Albanian lek",
        symbol: "L"
      }
    ],
    languages: [
      {
        iso639_1: "sq",
        iso639_2: "sqi",
        name: "Albanian",
        nativeName: "Shqip"
      }
    ],
    translations: {
      de: "Albanien",
      es: "Albania",
      fr: "Albanie",
      ja: "\u30A2\u30EB\u30D0\u30CB\u30A2",
      it: "Albania",
      br: "Alb\xE2nia",
      pt: "Alb\xE2nia",
      nl: "Albani\xEB",
      hr: "Albanija",
      fa: "\u0622\u0644\u0628\u0627\u0646\u06CC"
    },
    flag: "https://restcountries.eu/data/alb.svg",
    regionalBlocs: [
      {
        acronym: "CEFTA",
        name: "Central European Free Trade Agreement",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "ALB"
  },
  {
    name: "Algeria",
    topLevelDomain: [".dz"],
    alpha2Code: "DZ",
    alpha3Code: "DZA",
    callingCodes: ["213"],
    capital: "Algiers",
    altSpellings: ["DZ", "Dzayer", "Alg\xE9rie"],
    region: "Africa",
    subregion: "Northern Africa",
    population: 404e5,
    latlng: [28, 3],
    demonym: "Algerian",
    area: 2381741,
    gini: 35.3,
    timezones: ["UTC+01:00"],
    borders: ["TUN", "LBY", "NER", "ESH", "MRT", "MLI", "MAR"],
    nativeName: "\u0627\u0644\u062C\u0632\u0627\u0626\u0631",
    numericCode: "012",
    currencies: [
      {
        code: "DZD",
        name: "Algerian dinar",
        symbol: "\u062F.\u062C"
      }
    ],
    languages: [
      {
        iso639_1: "ar",
        iso639_2: "ara",
        name: "Arabic",
        nativeName: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"
      }
    ],
    translations: {
      de: "Algerien",
      es: "Argelia",
      fr: "Alg\xE9rie",
      ja: "\u30A2\u30EB\u30B8\u30A7\u30EA\u30A2",
      it: "Algeria",
      br: "Arg\xE9lia",
      pt: "Arg\xE9lia",
      nl: "Algerije",
      hr: "Al\u017Eir",
      fa: "\u0627\u0644\u062C\u0632\u0627\u06CC\u0631"
    },
    flag: "https://restcountries.eu/data/dza.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      },
      {
        acronym: "AL",
        name: "Arab League",
        otherAcronyms: [],
        otherNames: [
          "\u062C\u0627\u0645\u0639\u0629 \u0627\u0644\u062F\u0648\u0644 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
          "J\u0101mi\u02BBat ad-Duwal al-\u02BBArab\u012Byah",
          "League of Arab States"
        ]
      }
    ],
    cioc: "ALG"
  },
  {
    name: "American Samoa",
    topLevelDomain: [".as"],
    alpha2Code: "AS",
    alpha3Code: "ASM",
    callingCodes: ["1684"],
    capital: "Pago Pago",
    altSpellings: ["AS", "Amerika S\u0101moa", "Amelika S\u0101moa", "S\u0101moa Amelika"],
    region: "Oceania",
    subregion: "Polynesia",
    population: 57100,
    latlng: [-14.33333333, -170],
    demonym: "American Samoan",
    area: 199,
    gini: null,
    timezones: ["UTC-11:00"],
    borders: [],
    nativeName: "American Samoa",
    numericCode: "016",
    currencies: [
      {
        code: "USD",
        name: "United State Dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      },
      {
        iso639_1: "sm",
        iso639_2: "smo",
        name: "Samoan",
        nativeName: "gagana fa'a Samoa"
      }
    ],
    translations: {
      de: "Amerikanisch-Samoa",
      es: "Samoa Americana",
      fr: "Samoa am\xE9ricaines",
      ja: "\u30A2\u30E1\u30EA\u30AB\u9818\u30B5\u30E2\u30A2",
      it: "Samoa Americane",
      br: "Samoa Americana",
      pt: "Samoa Americana",
      nl: "Amerikaans Samoa",
      hr: "Ameri\u010Dka Samoa",
      fa: "\u0633\u0627\u0645\u0648\u0622\u06CC \u0622\u0645\u0631\u06CC\u06A9\u0627"
    },
    flag: "https://restcountries.eu/data/asm.svg",
    regionalBlocs: [],
    cioc: "ASA"
  },
  {
    name: "Andorra",
    topLevelDomain: [".ad"],
    alpha2Code: "AD",
    alpha3Code: "AND",
    callingCodes: ["376"],
    capital: "Andorra la Vella",
    altSpellings: ["AD", "Principality of Andorra", "Principat d'Andorra"],
    region: "Europe",
    subregion: "Southern Europe",
    population: 78014,
    latlng: [42.5, 1.5],
    demonym: "Andorran",
    area: 468,
    gini: null,
    timezones: ["UTC+01:00"],
    borders: ["FRA", "ESP"],
    nativeName: "Andorra",
    numericCode: "020",
    currencies: [
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      }
    ],
    languages: [
      {
        iso639_1: "ca",
        iso639_2: "cat",
        name: "Catalan",
        nativeName: "catal\xE0"
      }
    ],
    translations: {
      de: "Andorra",
      es: "Andorra",
      fr: "Andorre",
      ja: "\u30A2\u30F3\u30C9\u30E9",
      it: "Andorra",
      br: "Andorra",
      pt: "Andorra",
      nl: "Andorra",
      hr: "Andora",
      fa: "\u0622\u0646\u062F\u0648\u0631\u0627"
    },
    flag: "https://restcountries.eu/data/and.svg",
    regionalBlocs: [],
    cioc: "AND"
  },
  {
    name: "Angola",
    topLevelDomain: [".ao"],
    alpha2Code: "AO",
    alpha3Code: "AGO",
    callingCodes: ["244"],
    capital: "Luanda",
    altSpellings: ["AO", "Rep\xFAblica de Angola", "\u0281\u025Bpublika de an'\u0261\u0254la"],
    region: "Africa",
    subregion: "Middle Africa",
    population: 25868e3,
    latlng: [-12.5, 18.5],
    demonym: "Angolan",
    area: 1246700,
    gini: 58.6,
    timezones: ["UTC+01:00"],
    borders: ["COG", "COD", "ZMB", "NAM"],
    nativeName: "Angola",
    numericCode: "024",
    currencies: [
      {
        code: "AOA",
        name: "Angolan kwanza",
        symbol: "Kz"
      }
    ],
    languages: [
      {
        iso639_1: "pt",
        iso639_2: "por",
        name: "Portuguese",
        nativeName: "Portugu\xEAs"
      }
    ],
    translations: {
      de: "Angola",
      es: "Angola",
      fr: "Angola",
      ja: "\u30A2\u30F3\u30B4\u30E9",
      it: "Angola",
      br: "Angola",
      pt: "Angola",
      nl: "Angola",
      hr: "Angola",
      fa: "\u0622\u0646\u06AF\u0648\u0644\u0627"
    },
    flag: "https://restcountries.eu/data/ago.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "ANG"
  },
  {
    name: "Anguilla",
    topLevelDomain: [".ai"],
    alpha2Code: "AI",
    alpha3Code: "AIA",
    callingCodes: ["1264"],
    capital: "The Valley",
    altSpellings: ["AI"],
    region: "Americas",
    subregion: "Caribbean",
    population: 13452,
    latlng: [18.25, -63.16666666],
    demonym: "Anguillian",
    area: 91,
    gini: null,
    timezones: ["UTC-04:00"],
    borders: [],
    nativeName: "Anguilla",
    numericCode: "660",
    currencies: [
      {
        code: "XCD",
        name: "East Caribbean dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Anguilla",
      es: "Anguilla",
      fr: "Anguilla",
      ja: "\u30A2\u30F3\u30AE\u30E9",
      it: "Anguilla",
      br: "Anguila",
      pt: "Anguila",
      nl: "Anguilla",
      hr: "Angvila",
      fa: "\u0622\u0646\u06AF\u0648\u06CC\u0644\u0627"
    },
    flag: "https://restcountries.eu/data/aia.svg",
    regionalBlocs: [],
    cioc: ""
  },
  {
    name: "Antarctica",
    topLevelDomain: [".aq"],
    alpha2Code: "AQ",
    alpha3Code: "ATA",
    callingCodes: ["672"],
    capital: "",
    altSpellings: [],
    region: "Polar",
    subregion: "",
    population: 1e3,
    latlng: [-74.65, 4.48],
    demonym: "",
    area: 14e6,
    gini: null,
    timezones: [
      "UTC-03:00",
      "UTC+03:00",
      "UTC+05:00",
      "UTC+06:00",
      "UTC+07:00",
      "UTC+08:00",
      "UTC+10:00",
      "UTC+12:00"
    ],
    borders: [],
    nativeName: "Antarctica",
    numericCode: "010",
    currencies: [
      {
        code: "AUD",
        name: "Australian dollar",
        symbol: "$"
      },
      {
        code: "GBP",
        name: "British pound",
        symbol: "\xA3"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      },
      {
        iso639_1: "ru",
        iso639_2: "rus",
        name: "Russian",
        nativeName: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439"
      }
    ],
    translations: {
      de: "Antarktika",
      es: "Ant\xE1rtida",
      fr: "Antarctique",
      ja: "\u5357\u6975\u5927\u9678",
      it: "Antartide",
      br: "Ant\xE1rtida",
      pt: "Ant\xE1rctida",
      nl: "Antarctica",
      hr: "Antarktika",
      fa: "\u062C\u0646\u0648\u0628\u06AF\u0627\u0646"
    },
    flag: "https://restcountries.eu/data/ata.svg",
    regionalBlocs: [],
    cioc: ""
  },
  {
    name: "Antigua and Barbuda",
    topLevelDomain: [".ag"],
    alpha2Code: "AG",
    alpha3Code: "ATG",
    callingCodes: ["1268"],
    capital: "Saint John's",
    altSpellings: ["AG"],
    region: "Americas",
    subregion: "Caribbean",
    population: 86295,
    latlng: [17.05, -61.8],
    demonym: "Antiguan, Barbudan",
    area: 442,
    gini: null,
    timezones: ["UTC-04:00"],
    borders: [],
    nativeName: "Antigua and Barbuda",
    numericCode: "028",
    currencies: [
      {
        code: "XCD",
        name: "East Caribbean dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Antigua und Barbuda",
      es: "Antigua y Barbuda",
      fr: "Antigua-et-Barbuda",
      ja: "\u30A2\u30F3\u30C6\u30A3\u30B0\u30A2\u30FB\u30D0\u30FC\u30D6\u30FC\u30C0",
      it: "Antigua e Barbuda",
      br: "Ant\xEDgua e Barbuda",
      pt: "Ant\xEDgua e Barbuda",
      nl: "Antigua en Barbuda",
      hr: "Antigva i Barbuda",
      fa: "\u0622\u0646\u062A\u06CC\u06AF\u0648\u0627 \u0648 \u0628\u0627\u0631\u0628\u0648\u062F\u0627"
    },
    flag: "https://restcountries.eu/data/atg.svg",
    regionalBlocs: [
      {
        acronym: "CARICOM",
        name: "Caribbean Community",
        otherAcronyms: [],
        otherNames: [
          "Comunidad del Caribe",
          "Communaut\xE9 Carib\xE9enne",
          "Caribische Gemeenschap"
        ]
      }
    ],
    cioc: "ANT"
  },
  {
    name: "Argentina",
    topLevelDomain: [".ar"],
    alpha2Code: "AR",
    alpha3Code: "ARG",
    callingCodes: ["54"],
    capital: "Buenos Aires",
    altSpellings: ["AR", "Argentine Republic", "Rep\xFAblica Argentina"],
    region: "Americas",
    subregion: "South America",
    population: 43590400,
    latlng: [-34, -64],
    demonym: "Argentinean",
    area: 2780400,
    gini: 44.5,
    timezones: ["UTC-03:00"],
    borders: ["BOL", "BRA", "CHL", "PRY", "URY"],
    nativeName: "Argentina",
    numericCode: "032",
    currencies: [
      {
        code: "ARS",
        name: "Argentine peso",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "es",
        iso639_2: "spa",
        name: "Spanish",
        nativeName: "Espa\xF1ol"
      },
      {
        iso639_1: "gn",
        iso639_2: "grn",
        name: "Guaran\xED",
        nativeName: "Ava\xF1e'\u1EBD"
      }
    ],
    translations: {
      de: "Argentinien",
      es: "Argentina",
      fr: "Argentine",
      ja: "\u30A2\u30EB\u30BC\u30F3\u30C1\u30F3",
      it: "Argentina",
      br: "Argentina",
      pt: "Argentina",
      nl: "Argentini\xEB",
      hr: "Argentina",
      fa: "\u0622\u0631\u0698\u0627\u0646\u062A\u06CC\u0646"
    },
    flag: "https://restcountries.eu/data/arg.svg",
    regionalBlocs: [
      {
        acronym: "USAN",
        name: "Union of South American Nations",
        otherAcronyms: ["UNASUR", "UNASUL", "UZAN"],
        otherNames: [
          "Uni\xF3n de Naciones Suramericanas",
          "Uni\xE3o de Na\xE7\xF5es Sul-Americanas",
          "Unie van Zuid-Amerikaanse Naties",
          "South American Union"
        ]
      }
    ],
    cioc: "ARG"
  },
  {
    name: "Armenia",
    topLevelDomain: [".am"],
    alpha2Code: "AM",
    alpha3Code: "ARM",
    callingCodes: ["374"],
    capital: "Yerevan",
    altSpellings: [
      "AM",
      "Hayastan",
      "Republic of Armenia",
      "\u0540\u0561\u0575\u0561\u057D\u057F\u0561\u0576\u056B \u0540\u0561\u0576\u0580\u0561\u057A\u0565\u057F\u0578\u0582\u0569\u0575\u0578\u0582\u0576"
    ],
    region: "Asia",
    subregion: "Western Asia",
    population: 2994400,
    latlng: [40, 45],
    demonym: "Armenian",
    area: 29743,
    gini: 30.9,
    timezones: ["UTC+04:00"],
    borders: ["AZE", "GEO", "IRN", "TUR"],
    nativeName: "\u0540\u0561\u0575\u0561\u057D\u057F\u0561\u0576",
    numericCode: "051",
    currencies: [
      {
        code: "AMD",
        name: "Armenian dram",
        symbol: null
      }
    ],
    languages: [
      {
        iso639_1: "hy",
        iso639_2: "hye",
        name: "Armenian",
        nativeName: "\u0540\u0561\u0575\u0565\u0580\u0565\u0576"
      },
      {
        iso639_1: "ru",
        iso639_2: "rus",
        name: "Russian",
        nativeName: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439"
      }
    ],
    translations: {
      de: "Armenien",
      es: "Armenia",
      fr: "Arm\xE9nie",
      ja: "\u30A2\u30EB\u30E1\u30CB\u30A2",
      it: "Armenia",
      br: "Arm\xEAnia",
      pt: "Arm\xE9nia",
      nl: "Armeni\xEB",
      hr: "Armenija",
      fa: "\u0627\u0631\u0645\u0646\u0633\u062A\u0627\u0646"
    },
    flag: "https://restcountries.eu/data/arm.svg",
    regionalBlocs: [
      {
        acronym: "EEU",
        name: "Eurasian Economic Union",
        otherAcronyms: ["EAEU"],
        otherNames: []
      }
    ],
    cioc: "ARM"
  },
  {
    name: "Aruba",
    topLevelDomain: [".aw"],
    alpha2Code: "AW",
    alpha3Code: "ABW",
    callingCodes: ["297"],
    capital: "Oranjestad",
    altSpellings: ["AW"],
    region: "Americas",
    subregion: "Caribbean",
    population: 107394,
    latlng: [12.5, -69.96666666],
    demonym: "Aruban",
    area: 180,
    gini: null,
    timezones: ["UTC-04:00"],
    borders: [],
    nativeName: "Aruba",
    numericCode: "533",
    currencies: [
      {
        code: "AWG",
        name: "Aruban florin",
        symbol: "\u0192"
      }
    ],
    languages: [
      {
        iso639_1: "nl",
        iso639_2: "nld",
        name: "Dutch",
        nativeName: "Nederlands"
      },
      {
        iso639_1: "pa",
        iso639_2: "pan",
        name: "(Eastern) Punjabi",
        nativeName: "\u0A2A\u0A70\u0A1C\u0A3E\u0A2C\u0A40"
      }
    ],
    translations: {
      de: "Aruba",
      es: "Aruba",
      fr: "Aruba",
      ja: "\u30A2\u30EB\u30D0",
      it: "Aruba",
      br: "Aruba",
      pt: "Aruba",
      nl: "Aruba",
      hr: "Aruba",
      fa: "\u0622\u0631\u0648\u0628\u0627"
    },
    flag: "https://restcountries.eu/data/abw.svg",
    regionalBlocs: [],
    cioc: "ARU"
  },
  {
    name: "Australia",
    topLevelDomain: [".au"],
    alpha2Code: "AU",
    alpha3Code: "AUS",
    callingCodes: ["61"],
    capital: "Canberra",
    altSpellings: ["AU"],
    region: "Oceania",
    subregion: "Australia and New Zealand",
    population: 24117360,
    latlng: [-27, 133],
    demonym: "Australian",
    area: 7692024,
    gini: 30.5,
    timezones: [
      "UTC+05:00",
      "UTC+06:30",
      "UTC+07:00",
      "UTC+08:00",
      "UTC+09:30",
      "UTC+10:00",
      "UTC+10:30",
      "UTC+11:30"
    ],
    borders: [],
    nativeName: "Australia",
    numericCode: "036",
    currencies: [
      {
        code: "AUD",
        name: "Australian dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Australien",
      es: "Australia",
      fr: "Australie",
      ja: "\u30AA\u30FC\u30B9\u30C8\u30E9\u30EA\u30A2",
      it: "Australia",
      br: "Austr\xE1lia",
      pt: "Austr\xE1lia",
      nl: "Australi\xEB",
      hr: "Australija",
      fa: "\u0627\u0633\u062A\u0631\u0627\u0644\u06CC\u0627"
    },
    flag: "https://restcountries.eu/data/aus.svg",
    regionalBlocs: [],
    cioc: "AUS"
  },
  {
    name: "Austria",
    topLevelDomain: [".at"],
    alpha2Code: "AT",
    alpha3Code: "AUT",
    callingCodes: ["43"],
    capital: "Vienna",
    altSpellings: ["AT", "\xD6sterreich", "Osterreich", "Oesterreich"],
    region: "Europe",
    subregion: "Western Europe",
    population: 8725931,
    latlng: [47.33333333, 13.33333333],
    demonym: "Austrian",
    area: 83871,
    gini: 26,
    timezones: ["UTC+01:00"],
    borders: ["CZE", "DEU", "HUN", "ITA", "LIE", "SVK", "SVN", "CHE"],
    nativeName: "\xD6sterreich",
    numericCode: "040",
    currencies: [
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      }
    ],
    languages: [
      {
        iso639_1: "de",
        iso639_2: "deu",
        name: "German",
        nativeName: "Deutsch"
      }
    ],
    translations: {
      de: "\xD6sterreich",
      es: "Austria",
      fr: "Autriche",
      ja: "\u30AA\u30FC\u30B9\u30C8\u30EA\u30A2",
      it: "Austria",
      br: "\xE1ustria",
      pt: "\xE1ustria",
      nl: "Oostenrijk",
      hr: "Austrija",
      fa: "\u0627\u062A\u0631\u06CC\u0634"
    },
    flag: "https://restcountries.eu/data/aut.svg",
    regionalBlocs: [
      {
        acronym: "EU",
        name: "European Union",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "AUT"
  },
  {
    name: "Azerbaijan",
    topLevelDomain: [".az"],
    alpha2Code: "AZ",
    alpha3Code: "AZE",
    callingCodes: ["994"],
    capital: "Baku",
    altSpellings: ["AZ", "Republic of Azerbaijan", "Az\u0259rbaycan Respublikas\u0131"],
    region: "Asia",
    subregion: "Western Asia",
    population: 9730500,
    latlng: [40.5, 47.5],
    demonym: "Azerbaijani",
    area: 86600,
    gini: 33.7,
    timezones: ["UTC+04:00"],
    borders: ["ARM", "GEO", "IRN", "RUS", "TUR"],
    nativeName: "Az\u0259rbaycan",
    numericCode: "031",
    currencies: [
      {
        code: "AZN",
        name: "Azerbaijani manat",
        symbol: null
      }
    ],
    languages: [
      {
        iso639_1: "az",
        iso639_2: "aze",
        name: "Azerbaijani",
        nativeName: "az\u0259rbaycan dili"
      }
    ],
    translations: {
      de: "Aserbaidschan",
      es: "Azerbaiy\xE1n",
      fr: "Azerba\xEFdjan",
      ja: "\u30A2\u30BC\u30EB\u30D0\u30A4\u30B8\u30E3\u30F3",
      it: "Azerbaijan",
      br: "Azerbaij\xE3o",
      pt: "Azerbaij\xE3o",
      nl: "Azerbeidzjan",
      hr: "Azerbajd\u017Ean",
      fa: "\u0622\u0630\u0631\u0628\u0627\u06CC\u062C\u0627\u0646"
    },
    flag: "https://restcountries.eu/data/aze.svg",
    regionalBlocs: [],
    cioc: "AZE"
  },
  {
    name: "Bahamas",
    topLevelDomain: [".bs"],
    alpha2Code: "BS",
    alpha3Code: "BHS",
    callingCodes: ["1242"],
    capital: "Nassau",
    altSpellings: ["BS", "Commonwealth of the Bahamas"],
    region: "Americas",
    subregion: "Caribbean",
    population: 378040,
    latlng: [24.25, -76],
    demonym: "Bahamian",
    area: 13943,
    gini: null,
    timezones: ["UTC-05:00"],
    borders: [],
    nativeName: "Bahamas",
    numericCode: "044",
    currencies: [
      {
        code: "BSD",
        name: "Bahamian dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Bahamas",
      es: "Bahamas",
      fr: "Bahamas",
      ja: "\u30D0\u30CF\u30DE",
      it: "Bahamas",
      br: "Bahamas",
      pt: "Baamas",
      nl: "Bahama\u2019s",
      hr: "Bahami",
      fa: "\u0628\u0627\u0647\u0627\u0645\u0627"
    },
    flag: "https://restcountries.eu/data/bhs.svg",
    regionalBlocs: [
      {
        acronym: "CARICOM",
        name: "Caribbean Community",
        otherAcronyms: [],
        otherNames: [
          "Comunidad del Caribe",
          "Communaut\xE9 Carib\xE9enne",
          "Caribische Gemeenschap"
        ]
      }
    ],
    cioc: "BAH"
  },
  {
    name: "Bahrain",
    topLevelDomain: [".bh"],
    alpha2Code: "BH",
    alpha3Code: "BHR",
    callingCodes: ["973"],
    capital: "Manama",
    altSpellings: ["BH", "Kingdom of Bahrain", "Mamlakat al-Ba\u1E25rayn"],
    region: "Asia",
    subregion: "Western Asia",
    population: 1404900,
    latlng: [26, 50.55],
    demonym: "Bahraini",
    area: 765,
    gini: null,
    timezones: ["UTC+03:00"],
    borders: [],
    nativeName: "\u200F\u0627\u0644\u0628\u062D\u0631\u064A\u0646",
    numericCode: "048",
    currencies: [
      {
        code: "BHD",
        name: "Bahraini dinar",
        symbol: ".\u062F.\u0628"
      }
    ],
    languages: [
      {
        iso639_1: "ar",
        iso639_2: "ara",
        name: "Arabic",
        nativeName: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"
      }
    ],
    translations: {
      de: "Bahrain",
      es: "Bahrein",
      fr: "Bahre\xEFn",
      ja: "\u30D0\u30FC\u30EC\u30FC\u30F3",
      it: "Bahrein",
      br: "Bahrein",
      pt: "Bar\xE9m",
      nl: "Bahrein",
      hr: "Bahrein",
      fa: "\u0628\u062D\u0631\u06CC\u0646"
    },
    flag: "https://restcountries.eu/data/bhr.svg",
    regionalBlocs: [
      {
        acronym: "AL",
        name: "Arab League",
        otherAcronyms: [],
        otherNames: [
          "\u062C\u0627\u0645\u0639\u0629 \u0627\u0644\u062F\u0648\u0644 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
          "J\u0101mi\u02BBat ad-Duwal al-\u02BBArab\u012Byah",
          "League of Arab States"
        ]
      }
    ],
    cioc: "BRN"
  },
  {
    name: "Bangladesh",
    topLevelDomain: [".bd"],
    alpha2Code: "BD",
    alpha3Code: "BGD",
    callingCodes: ["880"],
    capital: "Dhaka",
    altSpellings: [
      "BD",
      "People's Republic of Bangladesh",
      "G\xF4n\xF4pr\xF4jat\xF4ntri Bangladesh"
    ],
    region: "Asia",
    subregion: "Southern Asia",
    population: 161006790,
    latlng: [24, 90],
    demonym: "Bangladeshi",
    area: 147570,
    gini: 32.1,
    timezones: ["UTC+06:00"],
    borders: ["MMR", "IND"],
    nativeName: "Bangladesh",
    numericCode: "050",
    currencies: [
      {
        code: "BDT",
        name: "Bangladeshi taka",
        symbol: "\u09F3"
      }
    ],
    languages: [
      {
        iso639_1: "bn",
        iso639_2: "ben",
        name: "Bengali",
        nativeName: "\u09AC\u09BE\u0982\u09B2\u09BE"
      }
    ],
    translations: {
      de: "Bangladesch",
      es: "Bangladesh",
      fr: "Bangladesh",
      ja: "\u30D0\u30F3\u30B0\u30E9\u30C7\u30B7\u30E5",
      it: "Bangladesh",
      br: "Bangladesh",
      pt: "Bangladeche",
      nl: "Bangladesh",
      hr: "Banglade\u0161",
      fa: "\u0628\u0646\u06AF\u0644\u0627\u062F\u0634"
    },
    flag: "https://restcountries.eu/data/bgd.svg",
    regionalBlocs: [
      {
        acronym: "SAARC",
        name: "South Asian Association for Regional Cooperation",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "BAN"
  },
  {
    name: "Barbados",
    topLevelDomain: [".bb"],
    alpha2Code: "BB",
    alpha3Code: "BRB",
    callingCodes: ["1246"],
    capital: "Bridgetown",
    altSpellings: ["BB"],
    region: "Americas",
    subregion: "Caribbean",
    population: 285e3,
    latlng: [13.16666666, -59.53333333],
    demonym: "Barbadian",
    area: 430,
    gini: null,
    timezones: ["UTC-04:00"],
    borders: [],
    nativeName: "Barbados",
    numericCode: "052",
    currencies: [
      {
        code: "BBD",
        name: "Barbadian dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Barbados",
      es: "Barbados",
      fr: "Barbade",
      ja: "\u30D0\u30EB\u30D0\u30C9\u30B9",
      it: "Barbados",
      br: "Barbados",
      pt: "Barbados",
      nl: "Barbados",
      hr: "Barbados",
      fa: "\u0628\u0627\u0631\u0628\u0627\u062F\u0648\u0633"
    },
    flag: "https://restcountries.eu/data/brb.svg",
    regionalBlocs: [
      {
        acronym: "CARICOM",
        name: "Caribbean Community",
        otherAcronyms: [],
        otherNames: [
          "Comunidad del Caribe",
          "Communaut\xE9 Carib\xE9enne",
          "Caribische Gemeenschap"
        ]
      }
    ],
    cioc: "BAR"
  },
  {
    name: "Belarus",
    topLevelDomain: [".by"],
    alpha2Code: "BY",
    alpha3Code: "BLR",
    callingCodes: ["375"],
    capital: "Minsk",
    altSpellings: [
      "BY",
      "Bielaru\u015B",
      "Republic of Belarus",
      "\u0411\u0435\u043B\u043E\u0440\u0443\u0441\u0441\u0438\u044F",
      "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0411\u0435\u043B\u0430\u0440\u0443\u0441\u044C",
      "Belorussiya",
      "Respublika Belarus\u2019"
    ],
    region: "Europe",
    subregion: "Eastern Europe",
    population: 9498700,
    latlng: [53, 28],
    demonym: "Belarusian",
    area: 207600,
    gini: 26.5,
    timezones: ["UTC+03:00"],
    borders: ["LVA", "LTU", "POL", "RUS", "UKR"],
    nativeName: "\u0411\u0435\u043B\u0430\u0440\u0443\u0301\u0441\u044C",
    numericCode: "112",
    currencies: [
      {
        code: "BYN",
        name: "New Belarusian ruble",
        symbol: "Br"
      },
      {
        code: "BYR",
        name: "Old Belarusian ruble",
        symbol: "Br"
      }
    ],
    languages: [
      {
        iso639_1: "be",
        iso639_2: "bel",
        name: "Belarusian",
        nativeName: "\u0431\u0435\u043B\u0430\u0440\u0443\u0441\u043A\u0430\u044F \u043C\u043E\u0432\u0430"
      },
      {
        iso639_1: "ru",
        iso639_2: "rus",
        name: "Russian",
        nativeName: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439"
      }
    ],
    translations: {
      de: "Wei\xDFrussland",
      es: "Bielorrusia",
      fr: "Bi\xE9lorussie",
      ja: "\u30D9\u30E9\u30EB\u30FC\u30B7",
      it: "Bielorussia",
      br: "Bielorr\xFAssia",
      pt: "Bielorr\xFAssia",
      nl: "Wit-Rusland",
      hr: "Bjelorusija",
      fa: "\u0628\u0644\u0627\u0631\u0648\u0633"
    },
    flag: "https://restcountries.eu/data/blr.svg",
    regionalBlocs: [
      {
        acronym: "EEU",
        name: "Eurasian Economic Union",
        otherAcronyms: ["EAEU"],
        otherNames: []
      }
    ],
    cioc: "BLR"
  },
  {
    name: "Belgium",
    topLevelDomain: [".be"],
    alpha2Code: "BE",
    alpha3Code: "BEL",
    callingCodes: ["32"],
    capital: "Brussels",
    altSpellings: [
      "BE",
      "Belgi\xEB",
      "Belgie",
      "Belgien",
      "Belgique",
      "Kingdom of Belgium",
      "Koninkrijk Belgi\xEB",
      "Royaume de Belgique",
      "K\xF6nigreich Belgien"
    ],
    region: "Europe",
    subregion: "Western Europe",
    population: 11319511,
    latlng: [50.83333333, 4],
    demonym: "Belgian",
    area: 30528,
    gini: 33,
    timezones: ["UTC+01:00"],
    borders: ["FRA", "DEU", "LUX", "NLD"],
    nativeName: "Belgi\xEB",
    numericCode: "056",
    currencies: [
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      }
    ],
    languages: [
      {
        iso639_1: "nl",
        iso639_2: "nld",
        name: "Dutch",
        nativeName: "Nederlands"
      },
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      },
      {
        iso639_1: "de",
        iso639_2: "deu",
        name: "German",
        nativeName: "Deutsch"
      }
    ],
    translations: {
      de: "Belgien",
      es: "B\xE9lgica",
      fr: "Belgique",
      ja: "\u30D9\u30EB\u30AE\u30FC",
      it: "Belgio",
      br: "B\xE9lgica",
      pt: "B\xE9lgica",
      nl: "Belgi\xEB",
      hr: "Belgija",
      fa: "\u0628\u0644\u0698\u06CC\u06A9"
    },
    flag: "https://restcountries.eu/data/bel.svg",
    regionalBlocs: [
      {
        acronym: "EU",
        name: "European Union",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "BEL"
  },
  {
    name: "Belize",
    topLevelDomain: [".bz"],
    alpha2Code: "BZ",
    alpha3Code: "BLZ",
    callingCodes: ["501"],
    capital: "Belmopan",
    altSpellings: ["BZ"],
    region: "Americas",
    subregion: "Central America",
    population: 370300,
    latlng: [17.25, -88.75],
    demonym: "Belizean",
    area: 22966,
    gini: 53.1,
    timezones: ["UTC-06:00"],
    borders: ["GTM", "MEX"],
    nativeName: "Belize",
    numericCode: "084",
    currencies: [
      {
        code: "BZD",
        name: "Belize dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      },
      {
        iso639_1: "es",
        iso639_2: "spa",
        name: "Spanish",
        nativeName: "Espa\xF1ol"
      }
    ],
    translations: {
      de: "Belize",
      es: "Belice",
      fr: "Belize",
      ja: "\u30D9\u30EA\u30FC\u30BA",
      it: "Belize",
      br: "Belize",
      pt: "Belize",
      nl: "Belize",
      hr: "Belize",
      fa: "\u0628\u0644\u06CC\u0632"
    },
    flag: "https://restcountries.eu/data/blz.svg",
    regionalBlocs: [
      {
        acronym: "CARICOM",
        name: "Caribbean Community",
        otherAcronyms: [],
        otherNames: [
          "Comunidad del Caribe",
          "Communaut\xE9 Carib\xE9enne",
          "Caribische Gemeenschap"
        ]
      },
      {
        acronym: "CAIS",
        name: "Central American Integration System",
        otherAcronyms: ["SICA"],
        otherNames: ["Sistema de la Integraci\xF3n Centroamericana,"]
      }
    ],
    cioc: "BIZ"
  },
  {
    name: "Benin",
    topLevelDomain: [".bj"],
    alpha2Code: "BJ",
    alpha3Code: "BEN",
    callingCodes: ["229"],
    capital: "Porto-Novo",
    altSpellings: ["BJ", "Republic of Benin", "R\xE9publique du B\xE9nin"],
    region: "Africa",
    subregion: "Western Africa",
    population: 10653654,
    latlng: [9.5, 2.25],
    demonym: "Beninese",
    area: 112622,
    gini: 38.6,
    timezones: ["UTC+01:00"],
    borders: ["BFA", "NER", "NGA", "TGO"],
    nativeName: "B\xE9nin",
    numericCode: "204",
    currencies: [
      {
        code: "XOF",
        name: "West African CFA franc",
        symbol: "Fr"
      }
    ],
    languages: [
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      }
    ],
    translations: {
      de: "Benin",
      es: "Ben\xEDn",
      fr: "B\xE9nin",
      ja: "\u30D9\u30CA\u30F3",
      it: "Benin",
      br: "Benin",
      pt: "Benim",
      nl: "Benin",
      hr: "Benin",
      fa: "\u0628\u0646\u06CC\u0646"
    },
    flag: "https://restcountries.eu/data/ben.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "BEN"
  },
  {
    name: "Bermuda",
    topLevelDomain: [".bm"],
    alpha2Code: "BM",
    alpha3Code: "BMU",
    callingCodes: ["1441"],
    capital: "Hamilton",
    altSpellings: [
      "BM",
      "The Islands of Bermuda",
      "The Bermudas",
      "Somers Isles"
    ],
    region: "Americas",
    subregion: "Northern America",
    population: 61954,
    latlng: [32.33333333, -64.75],
    demonym: "Bermudian",
    area: 54,
    gini: null,
    timezones: ["UTC-04:00"],
    borders: [],
    nativeName: "Bermuda",
    numericCode: "060",
    currencies: [
      {
        code: "BMD",
        name: "Bermudian dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Bermuda",
      es: "Bermudas",
      fr: "Bermudes",
      ja: "\u30D0\u30DF\u30E5\u30FC\u30C0",
      it: "Bermuda",
      br: "Bermudas",
      pt: "Bermudas",
      nl: "Bermuda",
      hr: "Bermudi",
      fa: "\u0628\u0631\u0645\u0648\u062F\u0627"
    },
    flag: "https://restcountries.eu/data/bmu.svg",
    regionalBlocs: [],
    cioc: "BER"
  },
  {
    name: "Bhutan",
    topLevelDomain: [".bt"],
    alpha2Code: "BT",
    alpha3Code: "BTN",
    callingCodes: ["975"],
    capital: "Thimphu",
    altSpellings: ["BT", "Kingdom of Bhutan"],
    region: "Asia",
    subregion: "Southern Asia",
    population: 775620,
    latlng: [27.5, 90.5],
    demonym: "Bhutanese",
    area: 38394,
    gini: 38.1,
    timezones: ["UTC+06:00"],
    borders: ["CHN", "IND"],
    nativeName: "\u02BCbrug-yul",
    numericCode: "064",
    currencies: [
      {
        code: "BTN",
        name: "Bhutanese ngultrum",
        symbol: "Nu."
      },
      {
        code: "INR",
        name: "Indian rupee",
        symbol: "\u20B9"
      }
    ],
    languages: [
      {
        iso639_1: "dz",
        iso639_2: "dzo",
        name: "Dzongkha",
        nativeName: "\u0F62\u0FAB\u0F7C\u0F44\u0F0B\u0F41"
      }
    ],
    translations: {
      de: "Bhutan",
      es: "But\xE1n",
      fr: "Bhoutan",
      ja: "\u30D6\u30FC\u30BF\u30F3",
      it: "Bhutan",
      br: "But\xE3o",
      pt: "But\xE3o",
      nl: "Bhutan",
      hr: "Butan",
      fa: "\u0628\u0648\u062A\u0627\u0646"
    },
    flag: "https://restcountries.eu/data/btn.svg",
    regionalBlocs: [
      {
        acronym: "SAARC",
        name: "South Asian Association for Regional Cooperation",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "BHU"
  },
  {
    name: "Bolivia (Plurinational State of)",
    topLevelDomain: [".bo"],
    alpha2Code: "BO",
    alpha3Code: "BOL",
    callingCodes: ["591"],
    capital: "Sucre",
    altSpellings: [
      "BO",
      "Buliwya",
      "Wuliwya",
      "Plurinational State of Bolivia",
      "Estado Plurinacional de Bolivia",
      "Buliwya Mamallaqta",
      "Wuliwya Suyu",
      "Tet\xE3 Vol\xEDvia"
    ],
    region: "Americas",
    subregion: "South America",
    population: 10985059,
    latlng: [-17, -65],
    demonym: "Bolivian",
    area: 1098581,
    gini: 56.3,
    timezones: ["UTC-04:00"],
    borders: ["ARG", "BRA", "CHL", "PRY", "PER"],
    nativeName: "Bolivia",
    numericCode: "068",
    currencies: [
      {
        code: "BOB",
        name: "Bolivian boliviano",
        symbol: "Bs."
      }
    ],
    languages: [
      {
        iso639_1: "es",
        iso639_2: "spa",
        name: "Spanish",
        nativeName: "Espa\xF1ol"
      },
      {
        iso639_1: "ay",
        iso639_2: "aym",
        name: "Aymara",
        nativeName: "aymar aru"
      },
      {
        iso639_1: "qu",
        iso639_2: "que",
        name: "Quechua",
        nativeName: "Runa Simi"
      }
    ],
    translations: {
      de: "Bolivien",
      es: "Bolivia",
      fr: "Bolivie",
      ja: "\u30DC\u30EA\u30D3\u30A2\u591A\u6C11\u65CF\u56FD",
      it: "Bolivia",
      br: "Bol\xEDvia",
      pt: "Bol\xEDvia",
      nl: "Bolivia",
      hr: "Bolivija",
      fa: "\u0628\u0648\u0644\u06CC\u0648\u06CC"
    },
    flag: "https://restcountries.eu/data/bol.svg",
    regionalBlocs: [
      {
        acronym: "USAN",
        name: "Union of South American Nations",
        otherAcronyms: ["UNASUR", "UNASUL", "UZAN"],
        otherNames: [
          "Uni\xF3n de Naciones Suramericanas",
          "Uni\xE3o de Na\xE7\xF5es Sul-Americanas",
          "Unie van Zuid-Amerikaanse Naties",
          "South American Union"
        ]
      }
    ],
    cioc: "BOL"
  },
  {
    name: "Bonaire, Sint Eustatius and Saba",
    topLevelDomain: [".an", ".nl"],
    alpha2Code: "BQ",
    alpha3Code: "BES",
    callingCodes: ["5997"],
    capital: "Kralendijk",
    altSpellings: ["BQ", "Boneiru"],
    region: "Americas",
    subregion: "Caribbean",
    population: 17408,
    latlng: [12.15, -68.266667],
    demonym: "Dutch",
    area: 294,
    gini: null,
    timezones: ["UTC-04:00"],
    borders: [],
    nativeName: "Bonaire",
    numericCode: "535",
    currencies: [
      {
        code: "USD",
        name: "United States dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "nl",
        iso639_2: "nld",
        name: "Dutch",
        nativeName: "Nederlands"
      }
    ],
    translations: {
      de: "Bonaire, Sint Eustatius und Saba",
      es: null,
      fr: "Bonaire, Saint-Eustache et Saba",
      ja: null,
      it: "Bonaire, Saint-Eustache e Saba",
      br: "Bonaire",
      pt: "Bonaire",
      nl: null,
      hr: null,
      fa: "\u0628\u0648\u0646\u06CC\u0631"
    },
    flag: "https://restcountries.eu/data/bes.svg",
    regionalBlocs: [],
    cioc: null
  },
  {
    name: "Bosnia and Herzegovina",
    topLevelDomain: [".ba"],
    alpha2Code: "BA",
    alpha3Code: "BIH",
    callingCodes: ["387"],
    capital: "Sarajevo",
    altSpellings: ["BA", "Bosnia-Herzegovina", "\u0411\u043E\u0441\u043D\u0430 \u0438 \u0425\u0435\u0440\u0446\u0435\u0433\u043E\u0432\u0438\u043D\u0430"],
    region: "Europe",
    subregion: "Southern Europe",
    population: 3531159,
    latlng: [44, 18],
    demonym: "Bosnian, Herzegovinian",
    area: 51209,
    gini: 36.2,
    timezones: ["UTC+01:00"],
    borders: ["HRV", "MNE", "SRB"],
    nativeName: "Bosna i Hercegovina",
    numericCode: "070",
    currencies: [
      {
        code: "BAM",
        name: "Bosnia and Herzegovina convertible mark",
        symbol: null
      }
    ],
    languages: [
      {
        iso639_1: "bs",
        iso639_2: "bos",
        name: "Bosnian",
        nativeName: "bosanski jezik"
      },
      {
        iso639_1: "hr",
        iso639_2: "hrv",
        name: "Croatian",
        nativeName: "hrvatski jezik"
      },
      {
        iso639_1: "sr",
        iso639_2: "srp",
        name: "Serbian",
        nativeName: "\u0441\u0440\u043F\u0441\u043A\u0438 \u0458\u0435\u0437\u0438\u043A"
      }
    ],
    translations: {
      de: "Bosnien und Herzegowina",
      es: "Bosnia y Herzegovina",
      fr: "Bosnie-Herz\xE9govine",
      ja: "\u30DC\u30B9\u30CB\u30A2\u30FB\u30D8\u30EB\u30C4\u30A7\u30B4\u30D3\u30CA",
      it: "Bosnia ed Erzegovina",
      br: "B\xF3snia e Herzegovina",
      pt: "B\xF3snia e Herzegovina",
      nl: "Bosni\xEB en Herzegovina",
      hr: "Bosna i Hercegovina",
      fa: "\u0628\u0648\u0633\u0646\u06CC \u0648 \u0647\u0631\u0632\u06AF\u0648\u06CC\u0646"
    },
    flag: "https://restcountries.eu/data/bih.svg",
    regionalBlocs: [
      {
        acronym: "CEFTA",
        name: "Central European Free Trade Agreement",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "BIH"
  },
  {
    name: "Botswana",
    topLevelDomain: [".bw"],
    alpha2Code: "BW",
    alpha3Code: "BWA",
    callingCodes: ["267"],
    capital: "Gaborone",
    altSpellings: ["BW", "Republic of Botswana", "Lefatshe la Botswana"],
    region: "Africa",
    subregion: "Southern Africa",
    population: 2141206,
    latlng: [-22, 24],
    demonym: "Motswana",
    area: 582e3,
    gini: 61,
    timezones: ["UTC+02:00"],
    borders: ["NAM", "ZAF", "ZMB", "ZWE"],
    nativeName: "Botswana",
    numericCode: "072",
    currencies: [
      {
        code: "BWP",
        name: "Botswana pula",
        symbol: "P"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      },
      {
        iso639_1: "tn",
        iso639_2: "tsn",
        name: "Tswana",
        nativeName: "Setswana"
      }
    ],
    translations: {
      de: "Botswana",
      es: "Botswana",
      fr: "Botswana",
      ja: "\u30DC\u30C4\u30EF\u30CA",
      it: "Botswana",
      br: "Botsuana",
      pt: "Botsuana",
      nl: "Botswana",
      hr: "Bocvana",
      fa: "\u0628\u0648\u062A\u0633\u0648\u0627\u0646\u0627"
    },
    flag: "https://restcountries.eu/data/bwa.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "BOT"
  },
  {
    name: "Bouvet Island",
    topLevelDomain: [".bv"],
    alpha2Code: "BV",
    alpha3Code: "BVT",
    callingCodes: [""],
    capital: "",
    altSpellings: ["BV", "Bouvet\xF8ya", "Bouvet-\xF8ya"],
    region: "",
    subregion: "",
    population: 0,
    latlng: [-54.43333333, 3.4],
    demonym: "",
    area: 49,
    gini: null,
    timezones: ["UTC+01:00"],
    borders: [],
    nativeName: "Bouvet\xF8ya",
    numericCode: "074",
    currencies: [
      {
        code: "NOK",
        name: "Norwegian krone",
        symbol: "kr"
      }
    ],
    languages: [
      {
        iso639_1: "no",
        iso639_2: "nor",
        name: "Norwegian",
        nativeName: "Norsk"
      },
      {
        iso639_1: "nb",
        iso639_2: "nob",
        name: "Norwegian Bokm\xE5l",
        nativeName: "Norsk bokm\xE5l"
      },
      {
        iso639_1: "nn",
        iso639_2: "nno",
        name: "Norwegian Nynorsk",
        nativeName: "Norsk nynorsk"
      }
    ],
    translations: {
      de: "Bouvetinsel",
      es: "Isla Bouvet",
      fr: "\xCEle Bouvet",
      ja: "\u30D6\u30FC\u30D9\u5CF6",
      it: "Isola Bouvet",
      br: "Ilha Bouvet",
      pt: "Ilha Bouvet",
      nl: "Bouveteiland",
      hr: "Otok Bouvet",
      fa: "\u062C\u0632\u06CC\u0631\u0647 \u0628\u0648\u0648\u0647"
    },
    flag: "https://restcountries.eu/data/bvt.svg",
    regionalBlocs: [],
    cioc: ""
  },
  {
    name: "Brazil",
    topLevelDomain: [".br"],
    alpha2Code: "BR",
    alpha3Code: "BRA",
    callingCodes: ["55"],
    capital: "Bras\xEDlia",
    altSpellings: [
      "BR",
      "Brasil",
      "Federative Republic of Brazil",
      "Rep\xFAblica Federativa do Brasil"
    ],
    region: "Americas",
    subregion: "South America",
    population: 206135893,
    latlng: [-10, -55],
    demonym: "Brazilian",
    area: 8515767,
    gini: 54.7,
    timezones: ["UTC-05:00", "UTC-04:00", "UTC-03:00", "UTC-02:00"],
    borders: [
      "ARG",
      "BOL",
      "COL",
      "GUF",
      "GUY",
      "PRY",
      "PER",
      "SUR",
      "URY",
      "VEN"
    ],
    nativeName: "Brasil",
    numericCode: "076",
    currencies: [
      {
        code: "BRL",
        name: "Brazilian real",
        symbol: "R$"
      }
    ],
    languages: [
      {
        iso639_1: "pt",
        iso639_2: "por",
        name: "Portuguese",
        nativeName: "Portugu\xEAs"
      }
    ],
    translations: {
      de: "Brasilien",
      es: "Brasil",
      fr: "Br\xE9sil",
      ja: "\u30D6\u30E9\u30B8\u30EB",
      it: "Brasile",
      br: "Brasil",
      pt: "Brasil",
      nl: "Brazili\xEB",
      hr: "Brazil",
      fa: "\u0628\u0631\u0632\u06CC\u0644"
    },
    flag: "https://restcountries.eu/data/bra.svg",
    regionalBlocs: [
      {
        acronym: "USAN",
        name: "Union of South American Nations",
        otherAcronyms: ["UNASUR", "UNASUL", "UZAN"],
        otherNames: [
          "Uni\xF3n de Naciones Suramericanas",
          "Uni\xE3o de Na\xE7\xF5es Sul-Americanas",
          "Unie van Zuid-Amerikaanse Naties",
          "South American Union"
        ]
      }
    ],
    cioc: "BRA"
  },
  {
    name: "British Indian Ocean Territory",
    topLevelDomain: [".io"],
    alpha2Code: "IO",
    alpha3Code: "IOT",
    callingCodes: ["246"],
    capital: "Diego Garcia",
    altSpellings: ["IO"],
    region: "Africa",
    subregion: "Eastern Africa",
    population: 3e3,
    latlng: [-6, 71.5],
    demonym: "Indian",
    area: 60,
    gini: null,
    timezones: ["UTC+06:00"],
    borders: [],
    nativeName: "British Indian Ocean Territory",
    numericCode: "086",
    currencies: [
      {
        code: "USD",
        name: "United States dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Britisches Territorium im Indischen Ozean",
      es: "Territorio Brit\xE1nico del Oc\xE9ano \xCDndico",
      fr: "Territoire britannique de l'oc\xE9an Indien",
      ja: "\u30A4\u30AE\u30EA\u30B9\u9818\u30A4\u30F3\u30C9\u6D0B\u5730\u57DF",
      it: "Territorio britannico dell'oceano indiano",
      br: "Territ\xF3rio Brit\xE2nico do Oceano \xED\xCDdico",
      pt: "Territ\xF3rio Brit\xE2nico do Oceano \xCDndico",
      nl: "Britse Gebieden in de Indische Oceaan",
      hr: "Britanski Indijskooceanski teritorij",
      fa: "\u0642\u0644\u0645\u0631\u0648 \u0628\u0631\u06CC\u062A\u0627\u0646\u06CC\u0627 \u062F\u0631 \u0627\u0642\u06CC\u0627\u0646\u0648\u0633 \u0647\u0646\u062F"
    },
    flag: "https://restcountries.eu/data/iot.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: ""
  },
  {
    name: "United States Minor Outlying Islands",
    topLevelDomain: [".us"],
    alpha2Code: "UM",
    alpha3Code: "UMI",
    callingCodes: [""],
    capital: "",
    altSpellings: ["UM"],
    region: "Americas",
    subregion: "Northern America",
    population: 300,
    latlng: [],
    demonym: "American",
    area: null,
    gini: null,
    timezones: ["UTC-11:00", "UTC-10:00", "UTC+12:00"],
    borders: [],
    nativeName: "United States Minor Outlying Islands",
    numericCode: "581",
    currencies: [
      {
        code: "USD",
        name: "United States Dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Kleinere Inselbesitzungen der Vereinigten Staaten",
      es: "Islas Ultramarinas Menores de Estados Unidos",
      fr: "\xCEles mineures \xE9loign\xE9es des \xC9tats-Unis",
      ja: "\u5408\u8846\u56FD\u9818\u6709\u5C0F\u96E2\u5CF6",
      it: "Isole minori esterne degli Stati Uniti d'America",
      br: "Ilhas Menores Distantes dos Estados Unidos",
      pt: "Ilhas Menores Distantes dos Estados Unidos",
      nl: "Kleine afgelegen eilanden van de Verenigde Staten",
      hr: "Mali udaljeni otoci SAD-a",
      fa: "\u062C\u0632\u0627\u06CC\u0631 \u06A9\u0648\u0686\u06A9 \u062D\u0627\u0634\u06CC\u0647\u200C\u0627\u06CC \u0627\u06CC\u0627\u0644\u0627\u062A \u0645\u062A\u062D\u062F\u0647 \u0622\u0645\u0631\u06CC\u06A9\u0627"
    },
    flag: "https://restcountries.eu/data/umi.svg",
    regionalBlocs: [],
    cioc: ""
  },
  {
    name: "Virgin Islands (British)",
    topLevelDomain: [".vg"],
    alpha2Code: "VG",
    alpha3Code: "VGB",
    callingCodes: ["1284"],
    capital: "Road Town",
    altSpellings: ["VG"],
    region: "Americas",
    subregion: "Caribbean",
    population: 28514,
    latlng: [18.431383, -64.62305],
    demonym: "Virgin Islander",
    area: 151,
    gini: null,
    timezones: ["UTC-04:00"],
    borders: [],
    nativeName: "British Virgin Islands",
    numericCode: "092",
    currencies: [
      {
        code: null,
        name: "[D]",
        symbol: "$"
      },
      {
        code: "USD",
        name: "United States dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Britische Jungferninseln",
      es: "Islas V\xEDrgenes del Reino Unido",
      fr: "\xCEles Vierges britanniques",
      ja: "\u30A4\u30AE\u30EA\u30B9\u9818\u30F4\u30A1\u30FC\u30B8\u30F3\u8AF8\u5CF6",
      it: "Isole Vergini Britanniche",
      br: "Ilhas Virgens Brit\xE2nicas",
      pt: "Ilhas Virgens Brit\xE2nicas",
      nl: "Britse Maagdeneilanden",
      hr: "Britanski Djevi\u010Danski Otoci",
      fa: "\u062C\u0632\u0627\u06CC\u0631 \u0648\u06CC\u0631\u062C\u06CC\u0646 \u0628\u0631\u06CC\u062A\u0627\u0646\u06CC\u0627"
    },
    flag: "https://restcountries.eu/data/vgb.svg",
    regionalBlocs: [],
    cioc: "IVB"
  },
  {
    name: "Virgin Islands (U.S.)",
    topLevelDomain: [".vi"],
    alpha2Code: "VI",
    alpha3Code: "VIR",
    callingCodes: ["1 340"],
    capital: "Charlotte Amalie",
    altSpellings: [
      "VI",
      "USVI",
      "American Virgin Islands",
      "U.S. Virgin Islands"
    ],
    region: "Americas",
    subregion: "Caribbean",
    population: 114743,
    latlng: [18.34, -64.93],
    demonym: "Virgin Islander",
    area: 346.36,
    gini: null,
    timezones: ["UTC-04:00"],
    borders: [],
    nativeName: "Virgin Islands of the United States",
    numericCode: "850",
    currencies: [
      {
        code: "USD",
        name: "United States dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Amerikanische Jungferninseln",
      es: "Islas V\xEDrgenes de los Estados Unidos",
      fr: "\xCEles Vierges des \xC9tats-Unis",
      ja: "\u30A2\u30E1\u30EA\u30AB\u9818\u30F4\u30A1\u30FC\u30B8\u30F3\u8AF8\u5CF6",
      it: "Isole Vergini americane",
      br: "Ilhas Virgens Americanas",
      pt: "Ilhas Virgens Americanas",
      nl: "Verenigde Staten Maagdeneilanden",
      hr: null,
      fa: "\u062C\u0632\u0627\u06CC\u0631 \u0648\u06CC\u0631\u062C\u06CC\u0646 \u0622\u0645\u0631\u06CC\u06A9\u0627"
    },
    flag: "https://restcountries.eu/data/vir.svg",
    regionalBlocs: [],
    cioc: "ISV"
  },
  {
    name: "Brunei Darussalam",
    topLevelDomain: [".bn"],
    alpha2Code: "BN",
    alpha3Code: "BRN",
    callingCodes: ["673"],
    capital: "Bandar Seri Begawan",
    altSpellings: ["BN", "Nation of Brunei", " the Abode of Peace"],
    region: "Asia",
    subregion: "South-Eastern Asia",
    population: 411900,
    latlng: [4.5, 114.66666666],
    demonym: "Bruneian",
    area: 5765,
    gini: null,
    timezones: ["UTC+08:00"],
    borders: ["MYS"],
    nativeName: "Negara Brunei Darussalam",
    numericCode: "096",
    currencies: [
      {
        code: "BND",
        name: "Brunei dollar",
        symbol: "$"
      },
      {
        code: "SGD",
        name: "Singapore dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "ms",
        iso639_2: "msa",
        name: "Malay",
        nativeName: "bahasa Melayu"
      }
    ],
    translations: {
      de: "Brunei",
      es: "Brunei",
      fr: "Brunei",
      ja: "\u30D6\u30EB\u30CD\u30A4\u30FB\u30C0\u30EB\u30B5\u30E9\u30FC\u30E0",
      it: "Brunei",
      br: "Brunei",
      pt: "Brunei",
      nl: "Brunei",
      hr: "Brunej",
      fa: "\u0628\u0631\u0648\u0646\u0626\u06CC"
    },
    flag: "https://restcountries.eu/data/brn.svg",
    regionalBlocs: [
      {
        acronym: "ASEAN",
        name: "Association of Southeast Asian Nations",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "BRU"
  },
  {
    name: "Bulgaria",
    topLevelDomain: [".bg"],
    alpha2Code: "BG",
    alpha3Code: "BGR",
    callingCodes: ["359"],
    capital: "Sofia",
    altSpellings: ["BG", "Republic of Bulgaria", "\u0420\u0435\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0411\u044A\u043B\u0433\u0430\u0440\u0438\u044F"],
    region: "Europe",
    subregion: "Eastern Europe",
    population: 7153784,
    latlng: [43, 25],
    demonym: "Bulgarian",
    area: 110879,
    gini: 28.2,
    timezones: ["UTC+02:00"],
    borders: ["GRC", "MKD", "ROU", "SRB", "TUR"],
    nativeName: "\u0411\u044A\u043B\u0433\u0430\u0440\u0438\u044F",
    numericCode: "100",
    currencies: [
      {
        code: "BGN",
        name: "Bulgarian lev",
        symbol: "\u043B\u0432"
      }
    ],
    languages: [
      {
        iso639_1: "bg",
        iso639_2: "bul",
        name: "Bulgarian",
        nativeName: "\u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438 \u0435\u0437\u0438\u043A"
      }
    ],
    translations: {
      de: "Bulgarien",
      es: "Bulgaria",
      fr: "Bulgarie",
      ja: "\u30D6\u30EB\u30AC\u30EA\u30A2",
      it: "Bulgaria",
      br: "Bulg\xE1ria",
      pt: "Bulg\xE1ria",
      nl: "Bulgarije",
      hr: "Bugarska",
      fa: "\u0628\u0644\u063A\u0627\u0631\u0633\u062A\u0627\u0646"
    },
    flag: "https://restcountries.eu/data/bgr.svg",
    regionalBlocs: [
      {
        acronym: "EU",
        name: "European Union",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "BUL"
  },
  {
    name: "Burkina Faso",
    topLevelDomain: [".bf"],
    alpha2Code: "BF",
    alpha3Code: "BFA",
    callingCodes: ["226"],
    capital: "Ouagadougou",
    altSpellings: ["BF"],
    region: "Africa",
    subregion: "Western Africa",
    population: 19034397,
    latlng: [13, -2],
    demonym: "Burkinabe",
    area: 272967,
    gini: 39.8,
    timezones: ["UTC"],
    borders: ["BEN", "CIV", "GHA", "MLI", "NER", "TGO"],
    nativeName: "Burkina Faso",
    numericCode: "854",
    currencies: [
      {
        code: "XOF",
        name: "West African CFA franc",
        symbol: "Fr"
      }
    ],
    languages: [
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      },
      {
        iso639_1: "ff",
        iso639_2: "ful",
        name: "Fula",
        nativeName: "Fulfulde"
      }
    ],
    translations: {
      de: "Burkina Faso",
      es: "Burkina Faso",
      fr: "Burkina Faso",
      ja: "\u30D6\u30EB\u30AD\u30CA\u30D5\u30A1\u30BD",
      it: "Burkina Faso",
      br: "Burkina Faso",
      pt: "Burquina Faso",
      nl: "Burkina Faso",
      hr: "Burkina Faso",
      fa: "\u0628\u0648\u0631\u06A9\u06CC\u0646\u0627\u0641\u0627\u0633\u0648"
    },
    flag: "https://restcountries.eu/data/bfa.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "BUR"
  },
  {
    name: "Burundi",
    topLevelDomain: [".bi"],
    alpha2Code: "BI",
    alpha3Code: "BDI",
    callingCodes: ["257"],
    capital: "Bujumbura",
    altSpellings: [
      "BI",
      "Republic of Burundi",
      "Republika y'Uburundi",
      "R\xE9publique du Burundi"
    ],
    region: "Africa",
    subregion: "Eastern Africa",
    population: 10114505,
    latlng: [-3.5, 30],
    demonym: "Burundian",
    area: 27834,
    gini: 33.3,
    timezones: ["UTC+02:00"],
    borders: ["COD", "RWA", "TZA"],
    nativeName: "Burundi",
    numericCode: "108",
    currencies: [
      {
        code: "BIF",
        name: "Burundian franc",
        symbol: "Fr"
      }
    ],
    languages: [
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      },
      {
        iso639_1: "rn",
        iso639_2: "run",
        name: "Kirundi",
        nativeName: "Ikirundi"
      }
    ],
    translations: {
      de: "Burundi",
      es: "Burundi",
      fr: "Burundi",
      ja: "\u30D6\u30EB\u30F3\u30B8",
      it: "Burundi",
      br: "Burundi",
      pt: "Bur\xFAndi",
      nl: "Burundi",
      hr: "Burundi",
      fa: "\u0628\u0648\u0631\u0648\u0646\u062F\u06CC"
    },
    flag: "https://restcountries.eu/data/bdi.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "BDI"
  },
  {
    name: "Cambodia",
    topLevelDomain: [".kh"],
    alpha2Code: "KH",
    alpha3Code: "KHM",
    callingCodes: ["855"],
    capital: "Phnom Penh",
    altSpellings: ["KH", "Kingdom of Cambodia"],
    region: "Asia",
    subregion: "South-Eastern Asia",
    population: 15626444,
    latlng: [13, 105],
    demonym: "Cambodian",
    area: 181035,
    gini: 37.9,
    timezones: ["UTC+07:00"],
    borders: ["LAO", "THA", "VNM"],
    nativeName: "K\xE2mp\u016Dch\xE9a",
    numericCode: "116",
    currencies: [
      {
        code: "KHR",
        name: "Cambodian riel",
        symbol: "\u17DB"
      },
      {
        code: "USD",
        name: "United States dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "km",
        iso639_2: "khm",
        name: "Khmer",
        nativeName: "\u1781\u17D2\u1798\u17C2\u179A"
      }
    ],
    translations: {
      de: "Kambodscha",
      es: "Camboya",
      fr: "Cambodge",
      ja: "\u30AB\u30F3\u30DC\u30B8\u30A2",
      it: "Cambogia",
      br: "Camboja",
      pt: "Camboja",
      nl: "Cambodja",
      hr: "Kambod\u017Ea",
      fa: "\u06A9\u0627\u0645\u0628\u0648\u062C"
    },
    flag: "https://restcountries.eu/data/khm.svg",
    regionalBlocs: [
      {
        acronym: "ASEAN",
        name: "Association of Southeast Asian Nations",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "CAM"
  },
  {
    name: "Cameroon",
    topLevelDomain: [".cm"],
    alpha2Code: "CM",
    alpha3Code: "CMR",
    callingCodes: ["237"],
    capital: "Yaound\xE9",
    altSpellings: ["CM", "Republic of Cameroon", "R\xE9publique du Cameroun"],
    region: "Africa",
    subregion: "Middle Africa",
    population: 22709892,
    latlng: [6, 12],
    demonym: "Cameroonian",
    area: 475442,
    gini: 38.9,
    timezones: ["UTC+01:00"],
    borders: ["CAF", "TCD", "COG", "GNQ", "GAB", "NGA"],
    nativeName: "Cameroon",
    numericCode: "120",
    currencies: [
      {
        code: "XAF",
        name: "Central African CFA franc",
        symbol: "Fr"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      },
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      }
    ],
    translations: {
      de: "Kamerun",
      es: "Camer\xFAn",
      fr: "Cameroun",
      ja: "\u30AB\u30E1\u30EB\u30FC\u30F3",
      it: "Camerun",
      br: "Camar\xF5es",
      pt: "Camar\xF5es",
      nl: "Kameroen",
      hr: "Kamerun",
      fa: "\u06A9\u0627\u0645\u0631\u0648\u0646"
    },
    flag: "https://restcountries.eu/data/cmr.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "CMR"
  },
  {
    name: "Canada",
    topLevelDomain: [".ca"],
    alpha2Code: "CA",
    alpha3Code: "CAN",
    callingCodes: ["1"],
    capital: "Ottawa",
    altSpellings: ["CA"],
    region: "Americas",
    subregion: "Northern America",
    population: 36155487,
    latlng: [60, -95],
    demonym: "Canadian",
    area: 9984670,
    gini: 32.6,
    timezones: [
      "UTC-08:00",
      "UTC-07:00",
      "UTC-06:00",
      "UTC-05:00",
      "UTC-04:00",
      "UTC-03:30"
    ],
    borders: ["USA"],
    nativeName: "Canada",
    numericCode: "124",
    currencies: [
      {
        code: "CAD",
        name: "Canadian dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      },
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      }
    ],
    translations: {
      de: "Kanada",
      es: "Canad\xE1",
      fr: "Canada",
      ja: "\u30AB\u30CA\u30C0",
      it: "Canada",
      br: "Canad\xE1",
      pt: "Canad\xE1",
      nl: "Canada",
      hr: "Kanada",
      fa: "\u06A9\u0627\u0646\u0627\u062F\u0627"
    },
    flag: "https://restcountries.eu/data/can.svg",
    regionalBlocs: [
      {
        acronym: "NAFTA",
        name: "North American Free Trade Agreement",
        otherAcronyms: [],
        otherNames: [
          "Tratado de Libre Comercio de Am\xE9rica del Norte",
          "Accord de Libre-\xE9change Nord-Am\xE9ricain"
        ]
      }
    ],
    cioc: "CAN"
  },
  {
    name: "Cabo Verde",
    topLevelDomain: [".cv"],
    alpha2Code: "CV",
    alpha3Code: "CPV",
    callingCodes: ["238"],
    capital: "Praia",
    altSpellings: ["CV", "Republic of Cabo Verde", "Rep\xFAblica de Cabo Verde"],
    region: "Africa",
    subregion: "Western Africa",
    population: 531239,
    latlng: [16, -24],
    demonym: "Cape Verdian",
    area: 4033,
    gini: 50.5,
    timezones: ["UTC-01:00"],
    borders: [],
    nativeName: "Cabo Verde",
    numericCode: "132",
    currencies: [
      {
        code: "CVE",
        name: "Cape Verdean escudo",
        symbol: "Esc"
      }
    ],
    languages: [
      {
        iso639_1: "pt",
        iso639_2: "por",
        name: "Portuguese",
        nativeName: "Portugu\xEAs"
      }
    ],
    translations: {
      de: "Kap Verde",
      es: "Cabo Verde",
      fr: "Cap Vert",
      ja: "\u30AB\u30FC\u30DC\u30D9\u30EB\u30C7",
      it: "Capo Verde",
      br: "Cabo Verde",
      pt: "Cabo Verde",
      nl: "Kaapverdi\xEB",
      hr: "Zelenortska Republika",
      fa: "\u06A9\u06CC\u067E \u0648\u0631\u062F"
    },
    flag: "https://restcountries.eu/data/cpv.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "CPV"
  },
  {
    name: "Cayman Islands",
    topLevelDomain: [".ky"],
    alpha2Code: "KY",
    alpha3Code: "CYM",
    callingCodes: ["1345"],
    capital: "George Town",
    altSpellings: ["KY"],
    region: "Americas",
    subregion: "Caribbean",
    population: 58238,
    latlng: [19.5, -80.5],
    demonym: "Caymanian",
    area: 264,
    gini: null,
    timezones: ["UTC-05:00"],
    borders: [],
    nativeName: "Cayman Islands",
    numericCode: "136",
    currencies: [
      {
        code: "KYD",
        name: "Cayman Islands dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Kaimaninseln",
      es: "Islas Caim\xE1n",
      fr: "\xCEles Ca\xEFmans",
      ja: "\u30B1\u30A4\u30DE\u30F3\u8AF8\u5CF6",
      it: "Isole Cayman",
      br: "Ilhas Cayman",
      pt: "Ilhas Caim\xE3o",
      nl: "Caymaneilanden",
      hr: "Kajmanski otoci",
      fa: "\u062C\u0632\u0627\u06CC\u0631 \u06A9\u06CC\u0645\u0646"
    },
    flag: "https://restcountries.eu/data/cym.svg",
    regionalBlocs: [],
    cioc: "CAY"
  },
  {
    name: "Central African Republic",
    topLevelDomain: [".cf"],
    alpha2Code: "CF",
    alpha3Code: "CAF",
    callingCodes: ["236"],
    capital: "Bangui",
    altSpellings: [
      "CF",
      "Central African Republic",
      "R\xE9publique centrafricaine"
    ],
    region: "Africa",
    subregion: "Middle Africa",
    population: 4998e3,
    latlng: [7, 21],
    demonym: "Central African",
    area: 622984,
    gini: 56.3,
    timezones: ["UTC+01:00"],
    borders: ["CMR", "TCD", "COD", "COG", "SSD", "SDN"],
    nativeName: "K\xF6d\xF6r\xF6s\xEAse t\xEE B\xEAafr\xEEka",
    numericCode: "140",
    currencies: [
      {
        code: "XAF",
        name: "Central African CFA franc",
        symbol: "Fr"
      }
    ],
    languages: [
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      },
      {
        iso639_1: "sg",
        iso639_2: "sag",
        name: "Sango",
        nativeName: "y\xE2ng\xE2 t\xEE s\xE4ng\xF6"
      }
    ],
    translations: {
      de: "Zentralafrikanische Republik",
      es: "Rep\xFAblica Centroafricana",
      fr: "R\xE9publique centrafricaine",
      ja: "\u4E2D\u592E\u30A2\u30D5\u30EA\u30AB\u5171\u548C\u56FD",
      it: "Repubblica Centrafricana",
      br: "Rep\xFAblica Centro-Africana",
      pt: "Rep\xFAblica Centro-Africana",
      nl: "Centraal-Afrikaanse Republiek",
      hr: "Srednjoafri\u010Dka Republika",
      fa: "\u062C\u0645\u0647\u0648\u0631\u06CC \u0622\u0641\u0631\u06CC\u0642\u0627\u06CC \u0645\u0631\u06A9\u0632\u06CC"
    },
    flag: "https://restcountries.eu/data/caf.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "CAF"
  },
  {
    name: "Chad",
    topLevelDomain: [".td"],
    alpha2Code: "TD",
    alpha3Code: "TCD",
    callingCodes: ["235"],
    capital: "N'Djamena",
    altSpellings: ["TD", "Tchad", "Republic of Chad", "R\xE9publique du Tchad"],
    region: "Africa",
    subregion: "Middle Africa",
    population: 14497e3,
    latlng: [15, 19],
    demonym: "Chadian",
    area: 1284e3,
    gini: 39.8,
    timezones: ["UTC+01:00"],
    borders: ["CMR", "CAF", "LBY", "NER", "NGA", "SSD"],
    nativeName: "Tchad",
    numericCode: "148",
    currencies: [
      {
        code: "XAF",
        name: "Central African CFA franc",
        symbol: "Fr"
      }
    ],
    languages: [
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      },
      {
        iso639_1: "ar",
        iso639_2: "ara",
        name: "Arabic",
        nativeName: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"
      }
    ],
    translations: {
      de: "Tschad",
      es: "Chad",
      fr: "Tchad",
      ja: "\u30C1\u30E3\u30C9",
      it: "Ciad",
      br: "Chade",
      pt: "Chade",
      nl: "Tsjaad",
      hr: "\u010Cad",
      fa: "\u0686\u0627\u062F"
    },
    flag: "https://restcountries.eu/data/tcd.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "CHA"
  },
  {
    name: "Chile",
    topLevelDomain: [".cl"],
    alpha2Code: "CL",
    alpha3Code: "CHL",
    callingCodes: ["56"],
    capital: "Santiago",
    altSpellings: ["CL", "Republic of Chile", "Rep\xFAblica de Chile"],
    region: "Americas",
    subregion: "South America",
    population: 18191900,
    latlng: [-30, -71],
    demonym: "Chilean",
    area: 756102,
    gini: 52.1,
    timezones: ["UTC-06:00", "UTC-04:00"],
    borders: ["ARG", "BOL", "PER"],
    nativeName: "Chile",
    numericCode: "152",
    currencies: [
      {
        code: "CLP",
        name: "Chilean peso",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "es",
        iso639_2: "spa",
        name: "Spanish",
        nativeName: "Espa\xF1ol"
      }
    ],
    translations: {
      de: "Chile",
      es: "Chile",
      fr: "Chili",
      ja: "\u30C1\u30EA",
      it: "Cile",
      br: "Chile",
      pt: "Chile",
      nl: "Chili",
      hr: "\u010Cile",
      fa: "\u0634\u06CC\u0644\u06CC"
    },
    flag: "https://restcountries.eu/data/chl.svg",
    regionalBlocs: [
      {
        acronym: "PA",
        name: "Pacific Alliance",
        otherAcronyms: [],
        otherNames: ["Alianza del Pac\xEDfico"]
      },
      {
        acronym: "USAN",
        name: "Union of South American Nations",
        otherAcronyms: ["UNASUR", "UNASUL", "UZAN"],
        otherNames: [
          "Uni\xF3n de Naciones Suramericanas",
          "Uni\xE3o de Na\xE7\xF5es Sul-Americanas",
          "Unie van Zuid-Amerikaanse Naties",
          "South American Union"
        ]
      }
    ],
    cioc: "CHI"
  },
  {
    name: "China",
    topLevelDomain: [".cn"],
    alpha2Code: "CN",
    alpha3Code: "CHN",
    callingCodes: ["86"],
    capital: "Beijing",
    altSpellings: [
      "CN",
      "Zh\u014Dnggu\xF3",
      "Zhongguo",
      "Zhonghua",
      "People's Republic of China",
      "\u4E2D\u534E\u4EBA\u6C11\u5171\u548C\u56FD",
      "Zh\u014Dnghu\xE1 R\xE9nm\xEDn G\xF2ngh\xE9gu\xF3"
    ],
    region: "Asia",
    subregion: "Eastern Asia",
    population: 1377422166,
    latlng: [35, 105],
    demonym: "Chinese",
    area: 9640011,
    gini: 47,
    timezones: ["UTC+08:00"],
    borders: [
      "AFG",
      "BTN",
      "MMR",
      "HKG",
      "IND",
      "KAZ",
      "PRK",
      "KGZ",
      "LAO",
      "MAC",
      "MNG",
      "PAK",
      "RUS",
      "TJK",
      "VNM"
    ],
    nativeName: "\u4E2D\u56FD",
    numericCode: "156",
    currencies: [
      {
        code: "CNY",
        name: "Chinese yuan",
        symbol: "\xA5"
      }
    ],
    languages: [
      {
        iso639_1: "zh",
        iso639_2: "zho",
        name: "Chinese",
        nativeName: "\u4E2D\u6587 (Zh\u014Dngw\xE9n)"
      }
    ],
    translations: {
      de: "China",
      es: "China",
      fr: "Chine",
      ja: "\u4E2D\u56FD",
      it: "Cina",
      br: "China",
      pt: "China",
      nl: "China",
      hr: "Kina",
      fa: "\u0686\u06CC\u0646"
    },
    flag: "https://restcountries.eu/data/chn.svg",
    regionalBlocs: [],
    cioc: "CHN"
  },
  {
    name: "Christmas Island",
    topLevelDomain: [".cx"],
    alpha2Code: "CX",
    alpha3Code: "CXR",
    callingCodes: ["61"],
    capital: "Flying Fish Cove",
    altSpellings: ["CX", "Territory of Christmas Island"],
    region: "Oceania",
    subregion: "Australia and New Zealand",
    population: 2072,
    latlng: [-10.5, 105.66666666],
    demonym: "Christmas Island",
    area: 135,
    gini: null,
    timezones: ["UTC+07:00"],
    borders: [],
    nativeName: "Christmas Island",
    numericCode: "162",
    currencies: [
      {
        code: "AUD",
        name: "Australian dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Weihnachtsinsel",
      es: "Isla de Navidad",
      fr: "\xCEle Christmas",
      ja: "\u30AF\u30EA\u30B9\u30DE\u30B9\u5CF6",
      it: "Isola di Natale",
      br: "Ilha Christmas",
      pt: "Ilha do Natal",
      nl: "Christmaseiland",
      hr: "Bo\u017Ei\u0107ni otok",
      fa: "\u062C\u0632\u06CC\u0631\u0647 \u06A9\u0631\u06CC\u0633\u0645\u0633"
    },
    flag: "https://restcountries.eu/data/cxr.svg",
    regionalBlocs: [],
    cioc: ""
  },
  {
    name: "Cocos (Keeling) Islands",
    topLevelDomain: [".cc"],
    alpha2Code: "CC",
    alpha3Code: "CCK",
    callingCodes: ["61"],
    capital: "West Island",
    altSpellings: [
      "CC",
      "Territory of the Cocos (Keeling) Islands",
      "Keeling Islands"
    ],
    region: "Oceania",
    subregion: "Australia and New Zealand",
    population: 550,
    latlng: [-12.5, 96.83333333],
    demonym: "Cocos Islander",
    area: 14,
    gini: null,
    timezones: ["UTC+06:30"],
    borders: [],
    nativeName: "Cocos (Keeling) Islands",
    numericCode: "166",
    currencies: [
      {
        code: "AUD",
        name: "Australian dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Kokosinseln",
      es: "Islas Cocos o Islas Keeling",
      fr: "\xCEles Cocos",
      ja: "\u30B3\u30B3\u30B9\uFF08\u30AD\u30FC\u30EA\u30F3\u30B0\uFF09\u8AF8\u5CF6",
      it: "Isole Cocos e Keeling",
      br: "Ilhas Cocos",
      pt: "Ilhas dos Cocos",
      nl: "Cocoseilanden",
      hr: "Kokosovi Otoci",
      fa: "\u062C\u0632\u0627\u06CC\u0631 \u06A9\u0648\u06A9\u0648\u0633"
    },
    flag: "https://restcountries.eu/data/cck.svg",
    regionalBlocs: [],
    cioc: ""
  },
  {
    name: "Colombia",
    topLevelDomain: [".co"],
    alpha2Code: "CO",
    alpha3Code: "COL",
    callingCodes: ["57"],
    capital: "Bogot\xE1",
    altSpellings: ["CO", "Republic of Colombia", "Rep\xFAblica de Colombia"],
    region: "Americas",
    subregion: "South America",
    population: 48759958,
    latlng: [4, -72],
    demonym: "Colombian",
    area: 1141748,
    gini: 55.9,
    timezones: ["UTC-05:00"],
    borders: ["BRA", "ECU", "PAN", "PER", "VEN"],
    nativeName: "Colombia",
    numericCode: "170",
    currencies: [
      {
        code: "COP",
        name: "Colombian peso",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "es",
        iso639_2: "spa",
        name: "Spanish",
        nativeName: "Espa\xF1ol"
      }
    ],
    translations: {
      de: "Kolumbien",
      es: "Colombia",
      fr: "Colombie",
      ja: "\u30B3\u30ED\u30F3\u30D3\u30A2",
      it: "Colombia",
      br: "Col\xF4mbia",
      pt: "Col\xF4mbia",
      nl: "Colombia",
      hr: "Kolumbija",
      fa: "\u06A9\u0644\u0645\u0628\u06CC\u0627"
    },
    flag: "https://restcountries.eu/data/col.svg",
    regionalBlocs: [
      {
        acronym: "PA",
        name: "Pacific Alliance",
        otherAcronyms: [],
        otherNames: ["Alianza del Pac\xEDfico"]
      },
      {
        acronym: "USAN",
        name: "Union of South American Nations",
        otherAcronyms: ["UNASUR", "UNASUL", "UZAN"],
        otherNames: [
          "Uni\xF3n de Naciones Suramericanas",
          "Uni\xE3o de Na\xE7\xF5es Sul-Americanas",
          "Unie van Zuid-Amerikaanse Naties",
          "South American Union"
        ]
      }
    ],
    cioc: "COL"
  },
  {
    name: "Comoros",
    topLevelDomain: [".km"],
    alpha2Code: "KM",
    alpha3Code: "COM",
    callingCodes: ["269"],
    capital: "Moroni",
    altSpellings: [
      "KM",
      "Union of the Comoros",
      "Union des Comores",
      "Udzima wa Komori",
      "al-Itti\u1E25\u0101d al-Qumur\u012B"
    ],
    region: "Africa",
    subregion: "Eastern Africa",
    population: 806153,
    latlng: [-12.16666666, 44.25],
    demonym: "Comoran",
    area: 1862,
    gini: 64.3,
    timezones: ["UTC+03:00"],
    borders: [],
    nativeName: "Komori",
    numericCode: "174",
    currencies: [
      {
        code: "KMF",
        name: "Comorian franc",
        symbol: "Fr"
      }
    ],
    languages: [
      {
        iso639_1: "ar",
        iso639_2: "ara",
        name: "Arabic",
        nativeName: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"
      },
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      }
    ],
    translations: {
      de: "Union der Komoren",
      es: "Comoras",
      fr: "Comores",
      ja: "\u30B3\u30E2\u30ED",
      it: "Comore",
      br: "Comores",
      pt: "Comores",
      nl: "Comoren",
      hr: "Komori",
      fa: "\u06A9\u0648\u0645\u0648\u0631"
    },
    flag: "https://restcountries.eu/data/com.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      },
      {
        acronym: "AL",
        name: "Arab League",
        otherAcronyms: [],
        otherNames: [
          "\u062C\u0627\u0645\u0639\u0629 \u0627\u0644\u062F\u0648\u0644 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
          "J\u0101mi\u02BBat ad-Duwal al-\u02BBArab\u012Byah",
          "League of Arab States"
        ]
      }
    ],
    cioc: "COM"
  },
  {
    name: "Congo",
    topLevelDomain: [".cg"],
    alpha2Code: "CG",
    alpha3Code: "COG",
    callingCodes: ["242"],
    capital: "Brazzaville",
    altSpellings: ["CG", "Congo-Brazzaville"],
    region: "Africa",
    subregion: "Middle Africa",
    population: 4741e3,
    latlng: [-1, 15],
    demonym: "Congolese",
    area: 342e3,
    gini: 47.3,
    timezones: ["UTC+01:00"],
    borders: ["AGO", "CMR", "CAF", "COD", "GAB"],
    nativeName: "R\xE9publique du Congo",
    numericCode: "178",
    currencies: [
      {
        code: "XAF",
        name: "Central African CFA franc",
        symbol: "Fr"
      }
    ],
    languages: [
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      },
      {
        iso639_1: "ln",
        iso639_2: "lin",
        name: "Lingala",
        nativeName: "Ling\xE1la"
      }
    ],
    translations: {
      de: "Kongo",
      es: "Congo",
      fr: "Congo",
      ja: "\u30B3\u30F3\u30B4\u5171\u548C\u56FD",
      it: "Congo",
      br: "Congo",
      pt: "Congo",
      nl: "Congo [Republiek]",
      hr: "Kongo",
      fa: "\u06A9\u0646\u06AF\u0648"
    },
    flag: "https://restcountries.eu/data/cog.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "CGO"
  },
  {
    name: "Congo (Democratic Republic of the)",
    topLevelDomain: [".cd"],
    alpha2Code: "CD",
    alpha3Code: "COD",
    callingCodes: ["243"],
    capital: "Kinshasa",
    altSpellings: ["CD", "DR Congo", "Congo-Kinshasa", "DRC"],
    region: "Africa",
    subregion: "Middle Africa",
    population: 85026e3,
    latlng: [0, 25],
    demonym: "Congolese",
    area: 2344858,
    gini: null,
    timezones: ["UTC+01:00", "UTC+02:00"],
    borders: ["AGO", "BDI", "CAF", "COG", "RWA", "SSD", "TZA", "UGA", "ZMB"],
    nativeName: "R\xE9publique d\xE9mocratique du Congo",
    numericCode: "180",
    currencies: [
      {
        code: "CDF",
        name: "Congolese franc",
        symbol: "Fr"
      }
    ],
    languages: [
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      },
      {
        iso639_1: "ln",
        iso639_2: "lin",
        name: "Lingala",
        nativeName: "Ling\xE1la"
      },
      {
        iso639_1: "kg",
        iso639_2: "kon",
        name: "Kongo",
        nativeName: "Kikongo"
      },
      {
        iso639_1: "sw",
        iso639_2: "swa",
        name: "Swahili",
        nativeName: "Kiswahili"
      },
      {
        iso639_1: "lu",
        iso639_2: "lub",
        name: "Luba-Katanga",
        nativeName: "Tshiluba"
      }
    ],
    translations: {
      de: "Kongo (Dem. Rep.)",
      es: "Congo (Rep. Dem.)",
      fr: "Congo (R\xE9p. d\xE9m.)",
      ja: "\u30B3\u30F3\u30B4\u6C11\u4E3B\u5171\u548C\u56FD",
      it: "Congo (Rep. Dem.)",
      br: "RD Congo",
      pt: "RD Congo",
      nl: "Congo [DRC]",
      hr: "Kongo, Demokratska Republika",
      fa: "\u062C\u0645\u0647\u0648\u0631\u06CC \u06A9\u0646\u06AF\u0648"
    },
    flag: "https://restcountries.eu/data/cod.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "COD"
  },
  {
    name: "Cook Islands",
    topLevelDomain: [".ck"],
    alpha2Code: "CK",
    alpha3Code: "COK",
    callingCodes: ["682"],
    capital: "Avarua",
    altSpellings: ["CK", "K\u016Bki '\u0100irani"],
    region: "Oceania",
    subregion: "Polynesia",
    population: 18100,
    latlng: [-21.23333333, -159.76666666],
    demonym: "Cook Islander",
    area: 236,
    gini: null,
    timezones: ["UTC-10:00"],
    borders: [],
    nativeName: "Cook Islands",
    numericCode: "184",
    currencies: [
      {
        code: "NZD",
        name: "New Zealand dollar",
        symbol: "$"
      },
      {
        code: "CKD",
        name: "Cook Islands dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Cookinseln",
      es: "Islas Cook",
      fr: "\xCEles Cook",
      ja: "\u30AF\u30C3\u30AF\u8AF8\u5CF6",
      it: "Isole Cook",
      br: "Ilhas Cook",
      pt: "Ilhas Cook",
      nl: "Cookeilanden",
      hr: "Cookovo Oto\u010Dje",
      fa: "\u062C\u0632\u0627\u06CC\u0631 \u06A9\u0648\u06A9"
    },
    flag: "https://restcountries.eu/data/cok.svg",
    regionalBlocs: [],
    cioc: "COK"
  },
  {
    name: "Costa Rica",
    topLevelDomain: [".cr"],
    alpha2Code: "CR",
    alpha3Code: "CRI",
    callingCodes: ["506"],
    capital: "San Jos\xE9",
    altSpellings: ["CR", "Republic of Costa Rica", "Rep\xFAblica de Costa Rica"],
    region: "Americas",
    subregion: "Central America",
    population: 4890379,
    latlng: [10, -84],
    demonym: "Costa Rican",
    area: 51100,
    gini: 50.7,
    timezones: ["UTC-06:00"],
    borders: ["NIC", "PAN"],
    nativeName: "Costa Rica",
    numericCode: "188",
    currencies: [
      {
        code: "CRC",
        name: "Costa Rican col\xF3n",
        symbol: "\u20A1"
      }
    ],
    languages: [
      {
        iso639_1: "es",
        iso639_2: "spa",
        name: "Spanish",
        nativeName: "Espa\xF1ol"
      }
    ],
    translations: {
      de: "Costa Rica",
      es: "Costa Rica",
      fr: "Costa Rica",
      ja: "\u30B3\u30B9\u30BF\u30EA\u30AB",
      it: "Costa Rica",
      br: "Costa Rica",
      pt: "Costa Rica",
      nl: "Costa Rica",
      hr: "Kostarika",
      fa: "\u06A9\u0627\u0633\u062A\u0627\u0631\u06CC\u06A9\u0627"
    },
    flag: "https://restcountries.eu/data/cri.svg",
    regionalBlocs: [
      {
        acronym: "CAIS",
        name: "Central American Integration System",
        otherAcronyms: ["SICA"],
        otherNames: ["Sistema de la Integraci\xF3n Centroamericana,"]
      }
    ],
    cioc: "CRC"
  },
  {
    name: "Croatia",
    topLevelDomain: [".hr"],
    alpha2Code: "HR",
    alpha3Code: "HRV",
    callingCodes: ["385"],
    capital: "Zagreb",
    altSpellings: [
      "HR",
      "Hrvatska",
      "Republic of Croatia",
      "Republika Hrvatska"
    ],
    region: "Europe",
    subregion: "Southern Europe",
    population: 4190669,
    latlng: [45.16666666, 15.5],
    demonym: "Croatian",
    area: 56594,
    gini: 33.7,
    timezones: ["UTC+01:00"],
    borders: ["BIH", "HUN", "MNE", "SRB", "SVN"],
    nativeName: "Hrvatska",
    numericCode: "191",
    currencies: [
      {
        code: "HRK",
        name: "Croatian kuna",
        symbol: "kn"
      }
    ],
    languages: [
      {
        iso639_1: "hr",
        iso639_2: "hrv",
        name: "Croatian",
        nativeName: "hrvatski jezik"
      }
    ],
    translations: {
      de: "Kroatien",
      es: "Croacia",
      fr: "Croatie",
      ja: "\u30AF\u30ED\u30A2\u30C1\u30A2",
      it: "Croazia",
      br: "Cro\xE1cia",
      pt: "Cro\xE1cia",
      nl: "Kroati\xEB",
      hr: "Hrvatska",
      fa: "\u06A9\u0631\u0648\u0627\u0633\u06CC"
    },
    flag: "https://restcountries.eu/data/hrv.svg",
    regionalBlocs: [
      {
        acronym: "EU",
        name: "European Union",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "CRO"
  },
  {
    name: "Cuba",
    topLevelDomain: [".cu"],
    alpha2Code: "CU",
    alpha3Code: "CUB",
    callingCodes: ["53"],
    capital: "Havana",
    altSpellings: ["CU", "Republic of Cuba", "Rep\xFAblica de Cuba"],
    region: "Americas",
    subregion: "Caribbean",
    population: 11239004,
    latlng: [21.5, -80],
    demonym: "Cuban",
    area: 109884,
    gini: null,
    timezones: ["UTC-05:00"],
    borders: [],
    nativeName: "Cuba",
    numericCode: "192",
    currencies: [
      {
        code: "CUC",
        name: "Cuban convertible peso",
        symbol: "$"
      },
      {
        code: "CUP",
        name: "Cuban peso",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "es",
        iso639_2: "spa",
        name: "Spanish",
        nativeName: "Espa\xF1ol"
      }
    ],
    translations: {
      de: "Kuba",
      es: "Cuba",
      fr: "Cuba",
      ja: "\u30AD\u30E5\u30FC\u30D0",
      it: "Cuba",
      br: "Cuba",
      pt: "Cuba",
      nl: "Cuba",
      hr: "Kuba",
      fa: "\u06A9\u0648\u0628\u0627"
    },
    flag: "https://restcountries.eu/data/cub.svg",
    regionalBlocs: [],
    cioc: "CUB"
  },
  {
    name: "Cura\xE7ao",
    topLevelDomain: [".cw"],
    alpha2Code: "CW",
    alpha3Code: "CUW",
    callingCodes: ["599"],
    capital: "Willemstad",
    altSpellings: [
      "CW",
      "Curacao",
      "K\xF2rsou",
      "Country of Cura\xE7ao",
      "Land Cura\xE7ao",
      "Pais K\xF2rsou"
    ],
    region: "Americas",
    subregion: "Caribbean",
    population: 154843,
    latlng: [12.116667, -68.933333],
    demonym: "Dutch",
    area: 444,
    gini: null,
    timezones: ["UTC-04:00"],
    borders: [],
    nativeName: "Cura\xE7ao",
    numericCode: "531",
    currencies: [
      {
        code: "ANG",
        name: "Netherlands Antillean guilder",
        symbol: "\u0192"
      }
    ],
    languages: [
      {
        iso639_1: "nl",
        iso639_2: "nld",
        name: "Dutch",
        nativeName: "Nederlands"
      },
      {
        iso639_1: "pa",
        iso639_2: "pan",
        name: "(Eastern) Punjabi",
        nativeName: "\u0A2A\u0A70\u0A1C\u0A3E\u0A2C\u0A40"
      },
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Cura\xE7ao",
      es: null,
      fr: "Cura\xE7ao",
      ja: null,
      it: "Cura\xE7ao",
      br: "Cura\xE7ao",
      pt: "Cura\xE7ao",
      nl: "Cura\xE7ao",
      hr: null,
      fa: "\u06A9\u0648\u0631\u0627\u0633\u0627\u0626\u0648"
    },
    flag: "https://restcountries.eu/data/cuw.svg",
    regionalBlocs: [],
    cioc: ""
  },
  {
    name: "Cyprus",
    topLevelDomain: [".cy"],
    alpha2Code: "CY",
    alpha3Code: "CYP",
    callingCodes: ["357"],
    capital: "Nicosia",
    altSpellings: [
      "CY",
      "K\xFDpros",
      "K\u0131br\u0131s",
      "Republic of Cyprus",
      "\u039A\u03C5\u03C0\u03C1\u03B9\u03B1\u03BA\u03AE \u0394\u03B7\u03BC\u03BF\u03BA\u03C1\u03B1\u03C4\u03AF\u03B1",
      "K\u0131br\u0131s Cumhuriyeti"
    ],
    region: "Europe",
    subregion: "Southern Europe",
    population: 847e3,
    latlng: [35, 33],
    demonym: "Cypriot",
    area: 9251,
    gini: null,
    timezones: ["UTC+02:00"],
    borders: ["GBR"],
    nativeName: "\u039A\u03CD\u03C0\u03C1\u03BF\u03C2",
    numericCode: "196",
    currencies: [
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      }
    ],
    languages: [
      {
        iso639_1: "el",
        iso639_2: "ell",
        name: "Greek (modern)",
        nativeName: "\u03B5\u03BB\u03BB\u03B7\u03BD\u03B9\u03BA\u03AC"
      },
      {
        iso639_1: "tr",
        iso639_2: "tur",
        name: "Turkish",
        nativeName: "T\xFCrk\xE7e"
      },
      {
        iso639_1: "hy",
        iso639_2: "hye",
        name: "Armenian",
        nativeName: "\u0540\u0561\u0575\u0565\u0580\u0565\u0576"
      }
    ],
    translations: {
      de: "Zypern",
      es: "Chipre",
      fr: "Chypre",
      ja: "\u30AD\u30D7\u30ED\u30B9",
      it: "Cipro",
      br: "Chipre",
      pt: "Chipre",
      nl: "Cyprus",
      hr: "Cipar",
      fa: "\u0642\u0628\u0631\u0633"
    },
    flag: "https://restcountries.eu/data/cyp.svg",
    regionalBlocs: [
      {
        acronym: "EU",
        name: "European Union",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "CYP"
  },
  {
    name: "Czech Republic",
    topLevelDomain: [".cz"],
    alpha2Code: "CZ",
    alpha3Code: "CZE",
    callingCodes: ["420"],
    capital: "Prague",
    altSpellings: ["CZ", "\u010Cesk\xE1 republika", "\u010Cesko"],
    region: "Europe",
    subregion: "Eastern Europe",
    population: 10558524,
    latlng: [49.75, 15.5],
    demonym: "Czech",
    area: 78865,
    gini: 26,
    timezones: ["UTC+01:00"],
    borders: ["AUT", "DEU", "POL", "SVK"],
    nativeName: "\u010Cesk\xE1 republika",
    numericCode: "203",
    currencies: [
      {
        code: "CZK",
        name: "Czech koruna",
        symbol: "K\u010D"
      }
    ],
    languages: [
      {
        iso639_1: "cs",
        iso639_2: "ces",
        name: "Czech",
        nativeName: "\u010De\u0161tina"
      },
      {
        iso639_1: "sk",
        iso639_2: "slk",
        name: "Slovak",
        nativeName: "sloven\u010Dina"
      }
    ],
    translations: {
      de: "Tschechische Republik",
      es: "Rep\xFAblica Checa",
      fr: "R\xE9publique tch\xE8que",
      ja: "\u30C1\u30A7\u30B3",
      it: "Repubblica Ceca",
      br: "Rep\xFAblica Tcheca",
      pt: "Rep\xFAblica Checa",
      nl: "Tsjechi\xEB",
      hr: "\u010Ce\u0161ka",
      fa: "\u062C\u0645\u0647\u0648\u0631\u06CC \u0686\u06A9"
    },
    flag: "https://restcountries.eu/data/cze.svg",
    regionalBlocs: [
      {
        acronym: "EU",
        name: "European Union",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "CZE"
  },
  {
    name: "Denmark",
    topLevelDomain: [".dk"],
    alpha2Code: "DK",
    alpha3Code: "DNK",
    callingCodes: ["45"],
    capital: "Copenhagen",
    altSpellings: ["DK", "Danmark", "Kingdom of Denmark", "Kongeriget Danmark"],
    region: "Europe",
    subregion: "Northern Europe",
    population: 5717014,
    latlng: [56, 10],
    demonym: "Danish",
    area: 43094,
    gini: 24,
    timezones: ["UTC-04:00", "UTC-03:00", "UTC-01:00", "UTC", "UTC+01:00"],
    borders: ["DEU"],
    nativeName: "Danmark",
    numericCode: "208",
    currencies: [
      {
        code: "DKK",
        name: "Danish krone",
        symbol: "kr"
      }
    ],
    languages: [
      {
        iso639_1: "da",
        iso639_2: "dan",
        name: "Danish",
        nativeName: "dansk"
      }
    ],
    translations: {
      de: "D\xE4nemark",
      es: "Dinamarca",
      fr: "Danemark",
      ja: "\u30C7\u30F3\u30DE\u30FC\u30AF",
      it: "Danimarca",
      br: "Dinamarca",
      pt: "Dinamarca",
      nl: "Denemarken",
      hr: "Danska",
      fa: "\u062F\u0627\u0646\u0645\u0627\u0631\u06A9"
    },
    flag: "https://restcountries.eu/data/dnk.svg",
    regionalBlocs: [
      {
        acronym: "EU",
        name: "European Union",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "DEN"
  },
  {
    name: "Djibouti",
    topLevelDomain: [".dj"],
    alpha2Code: "DJ",
    alpha3Code: "DJI",
    callingCodes: ["253"],
    capital: "Djibouti",
    altSpellings: [
      "DJ",
      "Jabuuti",
      "Gabuuti",
      "Republic of Djibouti",
      "R\xE9publique de Djibouti",
      "Gabuutih Ummuuno",
      "Jamhuuriyadda Jabuuti"
    ],
    region: "Africa",
    subregion: "Eastern Africa",
    population: 9e5,
    latlng: [11.5, 43],
    demonym: "Djibouti",
    area: 23200,
    gini: 40,
    timezones: ["UTC+03:00"],
    borders: ["ERI", "ETH", "SOM"],
    nativeName: "Djibouti",
    numericCode: "262",
    currencies: [
      {
        code: "DJF",
        name: "Djiboutian franc",
        symbol: "Fr"
      }
    ],
    languages: [
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      },
      {
        iso639_1: "ar",
        iso639_2: "ara",
        name: "Arabic",
        nativeName: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"
      }
    ],
    translations: {
      de: "Dschibuti",
      es: "Yibuti",
      fr: "Djibouti",
      ja: "\u30B8\u30D6\u30C1",
      it: "Gibuti",
      br: "Djibuti",
      pt: "Djibuti",
      nl: "Djibouti",
      hr: "D\u017Eibuti",
      fa: "\u062C\u06CC\u0628\u0648\u062A\u06CC"
    },
    flag: "https://restcountries.eu/data/dji.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      },
      {
        acronym: "AL",
        name: "Arab League",
        otherAcronyms: [],
        otherNames: [
          "\u062C\u0627\u0645\u0639\u0629 \u0627\u0644\u062F\u0648\u0644 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
          "J\u0101mi\u02BBat ad-Duwal al-\u02BBArab\u012Byah",
          "League of Arab States"
        ]
      }
    ],
    cioc: "DJI"
  },
  {
    name: "Dominica",
    topLevelDomain: [".dm"],
    alpha2Code: "DM",
    alpha3Code: "DMA",
    callingCodes: ["1767"],
    capital: "Roseau",
    altSpellings: [
      "DM",
      "Dominique",
      "Wai\u2018tu kubuli",
      "Commonwealth of Dominica"
    ],
    region: "Americas",
    subregion: "Caribbean",
    population: 71293,
    latlng: [15.41666666, -61.33333333],
    demonym: "Dominican",
    area: 751,
    gini: null,
    timezones: ["UTC-04:00"],
    borders: [],
    nativeName: "Dominica",
    numericCode: "212",
    currencies: [
      {
        code: "XCD",
        name: "East Caribbean dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Dominica",
      es: "Dominica",
      fr: "Dominique",
      ja: "\u30C9\u30DF\u30CB\u30AB\u56FD",
      it: "Dominica",
      br: "Dominica",
      pt: "Dominica",
      nl: "Dominica",
      hr: "Dominika",
      fa: "\u062F\u0648\u0645\u06CC\u0646\u06CC\u06A9\u0627"
    },
    flag: "https://restcountries.eu/data/dma.svg",
    regionalBlocs: [],
    cioc: "DMA"
  },
  {
    name: "Dominican Republic",
    topLevelDomain: [".do"],
    alpha2Code: "DO",
    alpha3Code: "DOM",
    callingCodes: ["1809", "1829", "1849"],
    capital: "Santo Domingo",
    altSpellings: ["DO"],
    region: "Americas",
    subregion: "Caribbean",
    population: 10075045,
    latlng: [19, -70.66666666],
    demonym: "Dominican",
    area: 48671,
    gini: 47.2,
    timezones: ["UTC-04:00"],
    borders: ["HTI"],
    nativeName: "Rep\xFAblica Dominicana",
    numericCode: "214",
    currencies: [
      {
        code: "DOP",
        name: "Dominican peso",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "es",
        iso639_2: "spa",
        name: "Spanish",
        nativeName: "Espa\xF1ol"
      }
    ],
    translations: {
      de: "Dominikanische Republik",
      es: "Rep\xFAblica Dominicana",
      fr: "R\xE9publique dominicaine",
      ja: "\u30C9\u30DF\u30CB\u30AB\u5171\u548C\u56FD",
      it: "Repubblica Dominicana",
      br: "Rep\xFAblica Dominicana",
      pt: "Rep\xFAblica Dominicana",
      nl: "Dominicaanse Republiek",
      hr: "Dominikanska Republika",
      fa: "\u062C\u0645\u0647\u0648\u0631\u06CC \u062F\u0648\u0645\u06CC\u0646\u06CC\u06A9\u0646"
    },
    flag: "https://restcountries.eu/data/dom.svg",
    regionalBlocs: [
      {
        acronym: "CARICOM",
        name: "Caribbean Community",
        otherAcronyms: [],
        otherNames: [
          "Comunidad del Caribe",
          "Communaut\xE9 Carib\xE9enne",
          "Caribische Gemeenschap"
        ]
      },
      {
        acronym: "CAIS",
        name: "Central American Integration System",
        otherAcronyms: ["SICA"],
        otherNames: ["Sistema de la Integraci\xF3n Centroamericana,"]
      }
    ],
    cioc: "DOM"
  },
  {
    name: "Ecuador",
    topLevelDomain: [".ec"],
    alpha2Code: "EC",
    alpha3Code: "ECU",
    callingCodes: ["593"],
    capital: "Quito",
    altSpellings: ["EC", "Republic of Ecuador", "Rep\xFAblica del Ecuador"],
    region: "Americas",
    subregion: "South America",
    population: 16545799,
    latlng: [-2, -77.5],
    demonym: "Ecuadorean",
    area: 276841,
    gini: 49.3,
    timezones: ["UTC-06:00", "UTC-05:00"],
    borders: ["COL", "PER"],
    nativeName: "Ecuador",
    numericCode: "218",
    currencies: [
      {
        code: "USD",
        name: "United States dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "es",
        iso639_2: "spa",
        name: "Spanish",
        nativeName: "Espa\xF1ol"
      }
    ],
    translations: {
      de: "Ecuador",
      es: "Ecuador",
      fr: "\xC9quateur",
      ja: "\u30A8\u30AF\u30A2\u30C9\u30EB",
      it: "Ecuador",
      br: "Equador",
      pt: "Equador",
      nl: "Ecuador",
      hr: "Ekvador",
      fa: "\u0627\u06A9\u0648\u0627\u062F\u0648\u0631"
    },
    flag: "https://restcountries.eu/data/ecu.svg",
    regionalBlocs: [
      {
        acronym: "USAN",
        name: "Union of South American Nations",
        otherAcronyms: ["UNASUR", "UNASUL", "UZAN"],
        otherNames: [
          "Uni\xF3n de Naciones Suramericanas",
          "Uni\xE3o de Na\xE7\xF5es Sul-Americanas",
          "Unie van Zuid-Amerikaanse Naties",
          "South American Union"
        ]
      }
    ],
    cioc: "ECU"
  },
  {
    name: "Egypt",
    topLevelDomain: [".eg"],
    alpha2Code: "EG",
    alpha3Code: "EGY",
    callingCodes: ["20"],
    capital: "Cairo",
    altSpellings: ["EG", "Arab Republic of Egypt"],
    region: "Africa",
    subregion: "Northern Africa",
    population: 9129e4,
    latlng: [27, 30],
    demonym: "Egyptian",
    area: 1002450,
    gini: 30.8,
    timezones: ["UTC+02:00"],
    borders: ["ISR", "LBY", "SDN"],
    nativeName: "\u0645\u0635\u0631\u200E",
    numericCode: "818",
    currencies: [
      {
        code: "EGP",
        name: "Egyptian pound",
        symbol: "\xA3"
      }
    ],
    languages: [
      {
        iso639_1: "ar",
        iso639_2: "ara",
        name: "Arabic",
        nativeName: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"
      }
    ],
    translations: {
      de: "\xC4gypten",
      es: "Egipto",
      fr: "\xC9gypte",
      ja: "\u30A8\u30B8\u30D7\u30C8",
      it: "Egitto",
      br: "Egito",
      pt: "Egipto",
      nl: "Egypte",
      hr: "Egipat",
      fa: "\u0645\u0635\u0631"
    },
    flag: "https://restcountries.eu/data/egy.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      },
      {
        acronym: "AL",
        name: "Arab League",
        otherAcronyms: [],
        otherNames: [
          "\u062C\u0627\u0645\u0639\u0629 \u0627\u0644\u062F\u0648\u0644 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
          "J\u0101mi\u02BBat ad-Duwal al-\u02BBArab\u012Byah",
          "League of Arab States"
        ]
      }
    ],
    cioc: "EGY"
  },
  {
    name: "El Salvador",
    topLevelDomain: [".sv"],
    alpha2Code: "SV",
    alpha3Code: "SLV",
    callingCodes: ["503"],
    capital: "San Salvador",
    altSpellings: ["SV", "Republic of El Salvador", "Rep\xFAblica de El Salvador"],
    region: "Americas",
    subregion: "Central America",
    population: 6520675,
    latlng: [13.83333333, -88.91666666],
    demonym: "Salvadoran",
    area: 21041,
    gini: 48.3,
    timezones: ["UTC-06:00"],
    borders: ["GTM", "HND"],
    nativeName: "El Salvador",
    numericCode: "222",
    currencies: [
      {
        code: "USD",
        name: "United States dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "es",
        iso639_2: "spa",
        name: "Spanish",
        nativeName: "Espa\xF1ol"
      }
    ],
    translations: {
      de: "El Salvador",
      es: "El Salvador",
      fr: "Salvador",
      ja: "\u30A8\u30EB\u30B5\u30EB\u30D0\u30C9\u30EB",
      it: "El Salvador",
      br: "El Salvador",
      pt: "El Salvador",
      nl: "El Salvador",
      hr: "Salvador",
      fa: "\u0627\u0644\u0633\u0627\u0644\u0648\u0627\u062F\u0648\u0631"
    },
    flag: "https://restcountries.eu/data/slv.svg",
    regionalBlocs: [
      {
        acronym: "CAIS",
        name: "Central American Integration System",
        otherAcronyms: ["SICA"],
        otherNames: ["Sistema de la Integraci\xF3n Centroamericana,"]
      }
    ],
    cioc: "ESA"
  },
  {
    name: "Equatorial Guinea",
    topLevelDomain: [".gq"],
    alpha2Code: "GQ",
    alpha3Code: "GNQ",
    callingCodes: ["240"],
    capital: "Malabo",
    altSpellings: [
      "GQ",
      "Republic of Equatorial Guinea",
      "Rep\xFAblica de Guinea Ecuatorial",
      "R\xE9publique de Guin\xE9e \xE9quatoriale",
      "Rep\xFAblica da Guin\xE9 Equatorial"
    ],
    region: "Africa",
    subregion: "Middle Africa",
    population: 1222442,
    latlng: [2, 10],
    demonym: "Equatorial Guinean",
    area: 28051,
    gini: null,
    timezones: ["UTC+01:00"],
    borders: ["CMR", "GAB"],
    nativeName: "Guinea Ecuatorial",
    numericCode: "226",
    currencies: [
      {
        code: "XAF",
        name: "Central African CFA franc",
        symbol: "Fr"
      }
    ],
    languages: [
      {
        iso639_1: "es",
        iso639_2: "spa",
        name: "Spanish",
        nativeName: "Espa\xF1ol"
      },
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      }
    ],
    translations: {
      de: "\xC4quatorial-Guinea",
      es: "Guinea Ecuatorial",
      fr: "Guin\xE9e-\xC9quatoriale",
      ja: "\u8D64\u9053\u30AE\u30CB\u30A2",
      it: "Guinea Equatoriale",
      br: "Guin\xE9 Equatorial",
      pt: "Guin\xE9 Equatorial",
      nl: "Equatoriaal-Guinea",
      hr: "Ekvatorijalna Gvineja",
      fa: "\u06AF\u06CC\u0646\u0647 \u0627\u0633\u062A\u0648\u0627\u06CC\u06CC"
    },
    flag: "https://restcountries.eu/data/gnq.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "GEQ"
  },
  {
    name: "Eritrea",
    topLevelDomain: [".er"],
    alpha2Code: "ER",
    alpha3Code: "ERI",
    callingCodes: ["291"],
    capital: "Asmara",
    altSpellings: [
      "ER",
      "State of Eritrea",
      "\u1203\u1308\u1228 \u12A4\u122D\u1275\u122B",
      "Dawlat Iritriy\xE1",
      "\u02BEErtr\u0101",
      "Iritriy\u0101",
      ""
    ],
    region: "Africa",
    subregion: "Eastern Africa",
    population: 5352e3,
    latlng: [15, 39],
    demonym: "Eritrean",
    area: 117600,
    gini: null,
    timezones: ["UTC+03:00"],
    borders: ["DJI", "ETH", "SDN"],
    nativeName: "\u12A4\u122D\u1275\u122B",
    numericCode: "232",
    currencies: [
      {
        code: "ERN",
        name: "Eritrean nakfa",
        symbol: "Nfk"
      }
    ],
    languages: [
      {
        iso639_1: "ti",
        iso639_2: "tir",
        name: "Tigrinya",
        nativeName: "\u1275\u130D\u122D\u129B"
      },
      {
        iso639_1: "ar",
        iso639_2: "ara",
        name: "Arabic",
        nativeName: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"
      },
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Eritrea",
      es: "Eritrea",
      fr: "\xC9rythr\xE9e",
      ja: "\u30A8\u30EA\u30C8\u30EA\u30A2",
      it: "Eritrea",
      br: "Eritreia",
      pt: "Eritreia",
      nl: "Eritrea",
      hr: "Eritreja",
      fa: "\u0627\u0631\u06CC\u062A\u0631\u0647"
    },
    flag: "https://restcountries.eu/data/eri.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "ERI"
  },
  {
    name: "Estonia",
    topLevelDomain: [".ee"],
    alpha2Code: "EE",
    alpha3Code: "EST",
    callingCodes: ["372"],
    capital: "Tallinn",
    altSpellings: ["EE", "Eesti", "Republic of Estonia", "Eesti Vabariik"],
    region: "Europe",
    subregion: "Northern Europe",
    population: 1315944,
    latlng: [59, 26],
    demonym: "Estonian",
    area: 45227,
    gini: 36,
    timezones: ["UTC+02:00"],
    borders: ["LVA", "RUS"],
    nativeName: "Eesti",
    numericCode: "233",
    currencies: [
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      }
    ],
    languages: [
      {
        iso639_1: "et",
        iso639_2: "est",
        name: "Estonian",
        nativeName: "eesti"
      }
    ],
    translations: {
      de: "Estland",
      es: "Estonia",
      fr: "Estonie",
      ja: "\u30A8\u30B9\u30C8\u30CB\u30A2",
      it: "Estonia",
      br: "Est\xF4nia",
      pt: "Est\xF3nia",
      nl: "Estland",
      hr: "Estonija",
      fa: "\u0627\u0633\u062A\u0648\u0646\u06CC"
    },
    flag: "https://restcountries.eu/data/est.svg",
    regionalBlocs: [
      {
        acronym: "EU",
        name: "European Union",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "EST"
  },
  {
    name: "Ethiopia",
    topLevelDomain: [".et"],
    alpha2Code: "ET",
    alpha3Code: "ETH",
    callingCodes: ["251"],
    capital: "Addis Ababa",
    altSpellings: [
      "ET",
      "\u02BE\u012Aty\u014D\u1E57\u1E57y\u0101",
      "Federal Democratic Republic of Ethiopia",
      "\u12E8\u12A2\u1275\u12EE\u1335\u12EB \u134C\u12F4\u122B\u120B\u12CA \u12F2\u121E\u12AD\u122B\u1232\u12EB\u12CA \u122A\u1350\u1265\u120A\u12AD"
    ],
    region: "Africa",
    subregion: "Eastern Africa",
    population: 92206005,
    latlng: [8, 38],
    demonym: "Ethiopian",
    area: 1104300,
    gini: 29.8,
    timezones: ["UTC+03:00"],
    borders: ["DJI", "ERI", "KEN", "SOM", "SSD", "SDN"],
    nativeName: "\u12A2\u1275\u12EE\u1335\u12EB",
    numericCode: "231",
    currencies: [
      {
        code: "ETB",
        name: "Ethiopian birr",
        symbol: "Br"
      }
    ],
    languages: [
      {
        iso639_1: "am",
        iso639_2: "amh",
        name: "Amharic",
        nativeName: "\u12A0\u121B\u122D\u129B"
      }
    ],
    translations: {
      de: "\xC4thiopien",
      es: "Etiop\xEDa",
      fr: "\xC9thiopie",
      ja: "\u30A8\u30C1\u30AA\u30D4\u30A2",
      it: "Etiopia",
      br: "Eti\xF3pia",
      pt: "Eti\xF3pia",
      nl: "Ethiopi\xEB",
      hr: "Etiopija",
      fa: "\u0627\u062A\u06CC\u0648\u067E\u06CC"
    },
    flag: "https://restcountries.eu/data/eth.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "ETH"
  },
  {
    name: "Falkland Islands (Malvinas)",
    topLevelDomain: [".fk"],
    alpha2Code: "FK",
    alpha3Code: "FLK",
    callingCodes: ["500"],
    capital: "Stanley",
    altSpellings: ["FK", "Islas Malvinas"],
    region: "Americas",
    subregion: "South America",
    population: 2563,
    latlng: [-51.75, -59],
    demonym: "Falkland Islander",
    area: 12173,
    gini: null,
    timezones: ["UTC-04:00"],
    borders: [],
    nativeName: "Falkland Islands",
    numericCode: "238",
    currencies: [
      {
        code: "FKP",
        name: "Falkland Islands pound",
        symbol: "\xA3"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Falklandinseln",
      es: "Islas Malvinas",
      fr: "\xCEles Malouines",
      ja: "\u30D5\u30A9\u30FC\u30AF\u30E9\u30F3\u30C9\uFF08\u30DE\u30EB\u30D3\u30CA\u30B9\uFF09\u8AF8\u5CF6",
      it: "Isole Falkland o Isole Malvine",
      br: "Ilhas Malvinas",
      pt: "Ilhas Falkland",
      nl: "Falklandeilanden [Islas Malvinas]",
      hr: "Falklandski Otoci",
      fa: "\u062C\u0632\u0627\u06CC\u0631 \u0641\u0627\u0644\u06A9\u0644\u0646\u062F"
    },
    flag: "https://restcountries.eu/data/flk.svg",
    regionalBlocs: [
      {
        acronym: "USAN",
        name: "Union of South American Nations",
        otherAcronyms: ["UNASUR", "UNASUL", "UZAN"],
        otherNames: [
          "Uni\xF3n de Naciones Suramericanas",
          "Uni\xE3o de Na\xE7\xF5es Sul-Americanas",
          "Unie van Zuid-Amerikaanse Naties",
          "South American Union"
        ]
      }
    ],
    cioc: ""
  },
  {
    name: "Faroe Islands",
    topLevelDomain: [".fo"],
    alpha2Code: "FO",
    alpha3Code: "FRO",
    callingCodes: ["298"],
    capital: "T\xF3rshavn",
    altSpellings: ["FO", "F\xF8royar", "F\xE6r\xF8erne"],
    region: "Europe",
    subregion: "Northern Europe",
    population: 49376,
    latlng: [62, -7],
    demonym: "Faroese",
    area: 1393,
    gini: null,
    timezones: ["UTC+00:00"],
    borders: [],
    nativeName: "F\xF8royar",
    numericCode: "234",
    currencies: [
      {
        code: "DKK",
        name: "Danish krone",
        symbol: "kr"
      },
      {
        code: "(none)",
        name: "Faroese kr\xF3na",
        symbol: "kr"
      }
    ],
    languages: [
      {
        iso639_1: "fo",
        iso639_2: "fao",
        name: "Faroese",
        nativeName: "f\xF8royskt"
      }
    ],
    translations: {
      de: "F\xE4r\xF6er-Inseln",
      es: "Islas Faroe",
      fr: "\xCEles F\xE9ro\xE9",
      ja: "\u30D5\u30A7\u30ED\u30FC\u8AF8\u5CF6",
      it: "Isole Far Oer",
      br: "Ilhas Faro\xE9",
      pt: "Ilhas Faro\xE9",
      nl: "Faer\xF6er",
      hr: "Farski Otoci",
      fa: "\u062C\u0632\u0627\u06CC\u0631 \u0641\u0627\u0631\u0648"
    },
    flag: "https://restcountries.eu/data/fro.svg",
    regionalBlocs: [
      {
        acronym: "EU",
        name: "European Union",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: ""
  },
  {
    name: "Fiji",
    topLevelDomain: [".fj"],
    alpha2Code: "FJ",
    alpha3Code: "FJI",
    callingCodes: ["679"],
    capital: "Suva",
    altSpellings: [
      "FJ",
      "Viti",
      "Republic of Fiji",
      "Matanitu ko Viti",
      "Fij\u012B Ga\u1E47ar\u0101jya"
    ],
    region: "Oceania",
    subregion: "Melanesia",
    population: 867e3,
    latlng: [-18, 175],
    demonym: "Fijian",
    area: 18272,
    gini: 42.8,
    timezones: ["UTC+12:00"],
    borders: [],
    nativeName: "Fiji",
    numericCode: "242",
    currencies: [
      {
        code: "FJD",
        name: "Fijian dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      },
      {
        iso639_1: "fj",
        iso639_2: "fij",
        name: "Fijian",
        nativeName: "vosa Vakaviti"
      },
      {
        iso639_1: "hi",
        iso639_2: "hin",
        name: "Hindi",
        nativeName: "\u0939\u093F\u0928\u094D\u0926\u0940"
      },
      {
        iso639_1: "ur",
        iso639_2: "urd",
        name: "Urdu",
        nativeName: "\u0627\u0631\u062F\u0648"
      }
    ],
    translations: {
      de: "Fidschi",
      es: "Fiyi",
      fr: "Fidji",
      ja: "\u30D5\u30A3\u30B8\u30FC",
      it: "Figi",
      br: "Fiji",
      pt: "Fiji",
      nl: "Fiji",
      hr: "Fi\u0111i",
      fa: "\u0641\u06CC\u062C\u06CC"
    },
    flag: "https://restcountries.eu/data/fji.svg",
    regionalBlocs: [],
    cioc: "FIJ"
  },
  {
    name: "Finland",
    topLevelDomain: [".fi"],
    alpha2Code: "FI",
    alpha3Code: "FIN",
    callingCodes: ["358"],
    capital: "Helsinki",
    altSpellings: [
      "FI",
      "Suomi",
      "Republic of Finland",
      "Suomen tasavalta",
      "Republiken Finland"
    ],
    region: "Europe",
    subregion: "Northern Europe",
    population: 5491817,
    latlng: [64, 26],
    demonym: "Finnish",
    area: 338424,
    gini: 26.9,
    timezones: ["UTC+02:00"],
    borders: ["NOR", "SWE", "RUS"],
    nativeName: "Suomi",
    numericCode: "246",
    currencies: [
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      }
    ],
    languages: [
      {
        iso639_1: "fi",
        iso639_2: "fin",
        name: "Finnish",
        nativeName: "suomi"
      },
      {
        iso639_1: "sv",
        iso639_2: "swe",
        name: "Swedish",
        nativeName: "svenska"
      }
    ],
    translations: {
      de: "Finnland",
      es: "Finlandia",
      fr: "Finlande",
      ja: "\u30D5\u30A3\u30F3\u30E9\u30F3\u30C9",
      it: "Finlandia",
      br: "Finl\xE2ndia",
      pt: "Finl\xE2ndia",
      nl: "Finland",
      hr: "Finska",
      fa: "\u0641\u0646\u0644\u0627\u0646\u062F"
    },
    flag: "https://restcountries.eu/data/fin.svg",
    regionalBlocs: [
      {
        acronym: "EU",
        name: "European Union",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "FIN"
  },
  {
    name: "France",
    topLevelDomain: [".fr"],
    alpha2Code: "FR",
    alpha3Code: "FRA",
    callingCodes: ["33"],
    capital: "Paris",
    altSpellings: ["FR", "French Republic", "R\xE9publique fran\xE7aise"],
    region: "Europe",
    subregion: "Western Europe",
    population: 6671e4,
    latlng: [46, 2],
    demonym: "French",
    area: 640679,
    gini: 32.7,
    timezones: [
      "UTC-10:00",
      "UTC-09:30",
      "UTC-09:00",
      "UTC-08:00",
      "UTC-04:00",
      "UTC-03:00",
      "UTC+01:00",
      "UTC+03:00",
      "UTC+04:00",
      "UTC+05:00",
      "UTC+11:00",
      "UTC+12:00"
    ],
    borders: ["AND", "BEL", "DEU", "ITA", "LUX", "MCO", "ESP", "CHE"],
    nativeName: "France",
    numericCode: "250",
    currencies: [
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      }
    ],
    languages: [
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      }
    ],
    translations: {
      de: "Frankreich",
      es: "Francia",
      fr: "France",
      ja: "\u30D5\u30E9\u30F3\u30B9",
      it: "Francia",
      br: "Fran\xE7a",
      pt: "Fran\xE7a",
      nl: "Frankrijk",
      hr: "Francuska",
      fa: "\u0641\u0631\u0627\u0646\u0633\u0647"
    },
    flag: "https://restcountries.eu/data/fra.svg",
    regionalBlocs: [
      {
        acronym: "EU",
        name: "European Union",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "FRA"
  },
  {
    name: "French Guiana",
    topLevelDomain: [".gf"],
    alpha2Code: "GF",
    alpha3Code: "GUF",
    callingCodes: ["594"],
    capital: "Cayenne",
    altSpellings: ["GF", "Guiana", "Guyane"],
    region: "Americas",
    subregion: "South America",
    population: 254541,
    latlng: [4, -53],
    demonym: "",
    area: null,
    gini: null,
    timezones: ["UTC-03:00"],
    borders: ["BRA", "SUR"],
    nativeName: "Guyane fran\xE7aise",
    numericCode: "254",
    currencies: [
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      }
    ],
    languages: [
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      }
    ],
    translations: {
      de: "Franz\xF6sisch Guyana",
      es: "Guayana Francesa",
      fr: "Guayane",
      ja: "\u30D5\u30E9\u30F3\u30B9\u9818\u30AE\u30A2\u30CA",
      it: "Guyana francese",
      br: "Guiana Francesa",
      pt: "Guiana Francesa",
      nl: "Frans-Guyana",
      hr: "Francuska Gvajana",
      fa: "\u06AF\u0648\u06CC\u0627\u0646 \u0641\u0631\u0627\u0646\u0633\u0647"
    },
    flag: "https://restcountries.eu/data/guf.svg",
    regionalBlocs: [
      {
        acronym: "USAN",
        name: "Union of South American Nations",
        otherAcronyms: ["UNASUR", "UNASUL", "UZAN"],
        otherNames: [
          "Uni\xF3n de Naciones Suramericanas",
          "Uni\xE3o de Na\xE7\xF5es Sul-Americanas",
          "Unie van Zuid-Amerikaanse Naties",
          "South American Union"
        ]
      },
      {
        acronym: "EU",
        name: "European Union",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: ""
  },
  {
    name: "French Polynesia",
    topLevelDomain: [".pf"],
    alpha2Code: "PF",
    alpha3Code: "PYF",
    callingCodes: ["689"],
    capital: "Papeet\u0113",
    altSpellings: [
      "PF",
      "Polyn\xE9sie fran\xE7aise",
      "French Polynesia",
      "P\u014Dr\u012Bnetia Far\u0101ni"
    ],
    region: "Oceania",
    subregion: "Polynesia",
    population: 271800,
    latlng: [-15, -140],
    demonym: "French Polynesian",
    area: 4167,
    gini: null,
    timezones: ["UTC-10:00", "UTC-09:30", "UTC-09:00"],
    borders: [],
    nativeName: "Polyn\xE9sie fran\xE7aise",
    numericCode: "258",
    currencies: [
      {
        code: "XPF",
        name: "CFP franc",
        symbol: "Fr"
      }
    ],
    languages: [
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      }
    ],
    translations: {
      de: "Franz\xF6sisch-Polynesien",
      es: "Polinesia Francesa",
      fr: "Polyn\xE9sie fran\xE7aise",
      ja: "\u30D5\u30E9\u30F3\u30B9\u9818\u30DD\u30EA\u30CD\u30B7\u30A2",
      it: "Polinesia Francese",
      br: "Polin\xE9sia Francesa",
      pt: "Polin\xE9sia Francesa",
      nl: "Frans-Polynesi\xEB",
      hr: "Francuska Polinezija",
      fa: "\u067E\u0644\u06CC\u200C\u0646\u0632\u06CC \u0641\u0631\u0627\u0646\u0633\u0647"
    },
    flag: "https://restcountries.eu/data/pyf.svg",
    regionalBlocs: [],
    cioc: ""
  },
  {
    name: "French Southern Territories",
    topLevelDomain: [".tf"],
    alpha2Code: "TF",
    alpha3Code: "ATF",
    callingCodes: [""],
    capital: "Port-aux-Fran\xE7ais",
    altSpellings: ["TF"],
    region: "Africa",
    subregion: "Southern Africa",
    population: 140,
    latlng: [-49.25, 69.167],
    demonym: "French",
    area: 7747,
    gini: null,
    timezones: ["UTC+05:00"],
    borders: [],
    nativeName: "Territoire des Terres australes et antarctiques fran\xE7aises",
    numericCode: "260",
    currencies: [
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      }
    ],
    languages: [
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      }
    ],
    translations: {
      de: "Franz\xF6sische S\xFCd- und Antarktisgebiete",
      es: "Tierras Australes y Ant\xE1rticas Francesas",
      fr: "Terres australes et antarctiques fran\xE7aises",
      ja: "\u30D5\u30E9\u30F3\u30B9\u9818\u5357\u65B9\u30FB\u5357\u6975\u5730\u57DF",
      it: "Territori Francesi del Sud",
      br: "Terras Austrais e Ant\xE1rticas Francesas",
      pt: "Terras Austrais e Ant\xE1rticas Francesas",
      nl: "Franse Gebieden in de zuidelijke Indische Oceaan",
      hr: "Francuski ju\u017Eni i antarkti\u010Dki teritoriji",
      fa: "\u0633\u0631\u0632\u0645\u06CC\u0646\u200C\u0647\u0627\u06CC \u062C\u0646\u0648\u0628\u06CC \u0648 \u062C\u0646\u0648\u0628\u06AF\u0627\u0646\u06CC \u0641\u0631\u0627\u0646\u0633\u0647"
    },
    flag: "https://restcountries.eu/data/atf.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: ""
  },
  {
    name: "Gabon",
    topLevelDomain: [".ga"],
    alpha2Code: "GA",
    alpha3Code: "GAB",
    callingCodes: ["241"],
    capital: "Libreville",
    altSpellings: ["GA", "Gabonese Republic", "R\xE9publique Gabonaise"],
    region: "Africa",
    subregion: "Middle Africa",
    population: 1802278,
    latlng: [-1, 11.75],
    demonym: "Gabonese",
    area: 267668,
    gini: 41.5,
    timezones: ["UTC+01:00"],
    borders: ["CMR", "COG", "GNQ"],
    nativeName: "Gabon",
    numericCode: "266",
    currencies: [
      {
        code: "XAF",
        name: "Central African CFA franc",
        symbol: "Fr"
      }
    ],
    languages: [
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      }
    ],
    translations: {
      de: "Gabun",
      es: "Gab\xF3n",
      fr: "Gabon",
      ja: "\u30AC\u30DC\u30F3",
      it: "Gabon",
      br: "Gab\xE3o",
      pt: "Gab\xE3o",
      nl: "Gabon",
      hr: "Gabon",
      fa: "\u06AF\u0627\u0628\u0646"
    },
    flag: "https://restcountries.eu/data/gab.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "GAB"
  },
  {
    name: "Gambia",
    topLevelDomain: [".gm"],
    alpha2Code: "GM",
    alpha3Code: "GMB",
    callingCodes: ["220"],
    capital: "Banjul",
    altSpellings: ["GM", "Republic of the Gambia"],
    region: "Africa",
    subregion: "Western Africa",
    population: 1882450,
    latlng: [13.46666666, -16.56666666],
    demonym: "Gambian",
    area: 11295,
    gini: null,
    timezones: ["UTC+00:00"],
    borders: ["SEN"],
    nativeName: "Gambia",
    numericCode: "270",
    currencies: [
      {
        code: "GMD",
        name: "Gambian dalasi",
        symbol: "D"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Gambia",
      es: "Gambia",
      fr: "Gambie",
      ja: "\u30AC\u30F3\u30D3\u30A2",
      it: "Gambia",
      br: "G\xE2mbia",
      pt: "G\xE2mbia",
      nl: "Gambia",
      hr: "Gambija",
      fa: "\u06AF\u0627\u0645\u0628\u06CC\u0627"
    },
    flag: "https://restcountries.eu/data/gmb.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "GAM"
  },
  {
    name: "Georgia",
    topLevelDomain: [".ge"],
    alpha2Code: "GE",
    alpha3Code: "GEO",
    callingCodes: ["995"],
    capital: "Tbilisi",
    altSpellings: ["GE", "Sakartvelo"],
    region: "Asia",
    subregion: "Western Asia",
    population: 3720400,
    latlng: [42, 43.5],
    demonym: "Georgian",
    area: 69700,
    gini: 41.3,
    timezones: ["UTC-05:00"],
    borders: ["ARM", "AZE", "RUS", "TUR"],
    nativeName: "\u10E1\u10D0\u10E5\u10D0\u10E0\u10D7\u10D5\u10D4\u10DA\u10DD",
    numericCode: "268",
    currencies: [
      {
        code: "GEL",
        name: "Georgian Lari",
        symbol: "\u10DA"
      }
    ],
    languages: [
      {
        iso639_1: "ka",
        iso639_2: "kat",
        name: "Georgian",
        nativeName: "\u10E5\u10D0\u10E0\u10D7\u10E3\u10DA\u10D8"
      }
    ],
    translations: {
      de: "Georgien",
      es: "Georgia",
      fr: "G\xE9orgie",
      ja: "\u30B0\u30EB\u30B8\u30A2",
      it: "Georgia",
      br: "Ge\xF3rgia",
      pt: "Ge\xF3rgia",
      nl: "Georgi\xEB",
      hr: "Gruzija",
      fa: "\u06AF\u0631\u062C\u0633\u062A\u0627\u0646"
    },
    flag: "https://restcountries.eu/data/geo.svg",
    regionalBlocs: [],
    cioc: "GEO"
  },
  {
    name: "Germany",
    topLevelDomain: [".de"],
    alpha2Code: "DE",
    alpha3Code: "DEU",
    callingCodes: ["49"],
    capital: "Berlin",
    altSpellings: [
      "DE",
      "Federal Republic of Germany",
      "Bundesrepublik Deutschland"
    ],
    region: "Europe",
    subregion: "Western Europe",
    population: 81770900,
    latlng: [51, 9],
    demonym: "German",
    area: 357114,
    gini: 28.3,
    timezones: ["UTC+01:00"],
    borders: ["AUT", "BEL", "CZE", "DNK", "FRA", "LUX", "NLD", "POL", "CHE"],
    nativeName: "Deutschland",
    numericCode: "276",
    currencies: [
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      }
    ],
    languages: [
      {
        iso639_1: "de",
        iso639_2: "deu",
        name: "German",
        nativeName: "Deutsch"
      }
    ],
    translations: {
      de: "Deutschland",
      es: "Alemania",
      fr: "Allemagne",
      ja: "\u30C9\u30A4\u30C4",
      it: "Germania",
      br: "Alemanha",
      pt: "Alemanha",
      nl: "Duitsland",
      hr: "Njema\u010Dka",
      fa: "\u0622\u0644\u0645\u0627\u0646"
    },
    flag: "https://restcountries.eu/data/deu.svg",
    regionalBlocs: [
      {
        acronym: "EU",
        name: "European Union",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "GER"
  },
  {
    name: "Ghana",
    topLevelDomain: [".gh"],
    alpha2Code: "GH",
    alpha3Code: "GHA",
    callingCodes: ["233"],
    capital: "Accra",
    altSpellings: ["GH"],
    region: "Africa",
    subregion: "Western Africa",
    population: 27670174,
    latlng: [8, -2],
    demonym: "Ghanaian",
    area: 238533,
    gini: 42.8,
    timezones: ["UTC"],
    borders: ["BFA", "CIV", "TGO"],
    nativeName: "Ghana",
    numericCode: "288",
    currencies: [
      {
        code: "GHS",
        name: "Ghanaian cedi",
        symbol: "\u20B5"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Ghana",
      es: "Ghana",
      fr: "Ghana",
      ja: "\u30AC\u30FC\u30CA",
      it: "Ghana",
      br: "Gana",
      pt: "Gana",
      nl: "Ghana",
      hr: "Gana",
      fa: "\u063A\u0646\u0627"
    },
    flag: "https://restcountries.eu/data/gha.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "GHA"
  },
  {
    name: "Gibraltar",
    topLevelDomain: [".gi"],
    alpha2Code: "GI",
    alpha3Code: "GIB",
    callingCodes: ["350"],
    capital: "Gibraltar",
    altSpellings: ["GI"],
    region: "Europe",
    subregion: "Southern Europe",
    population: 33140,
    latlng: [36.13333333, -5.35],
    demonym: "Gibraltar",
    area: 6,
    gini: null,
    timezones: ["UTC+01:00"],
    borders: ["ESP"],
    nativeName: "Gibraltar",
    numericCode: "292",
    currencies: [
      {
        code: "GIP",
        name: "Gibraltar pound",
        symbol: "\xA3"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Gibraltar",
      es: "Gibraltar",
      fr: "Gibraltar",
      ja: "\u30B8\u30D6\u30E9\u30EB\u30BF\u30EB",
      it: "Gibilterra",
      br: "Gibraltar",
      pt: "Gibraltar",
      nl: "Gibraltar",
      hr: "Gibraltar",
      fa: "\u062C\u0628\u0644\u200C\u0637\u0627\u0631\u0642"
    },
    flag: "https://restcountries.eu/data/gib.svg",
    regionalBlocs: [
      {
        acronym: "EU",
        name: "European Union",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: ""
  },
  {
    name: "Greece",
    topLevelDomain: [".gr"],
    alpha2Code: "GR",
    alpha3Code: "GRC",
    callingCodes: ["30"],
    capital: "Athens",
    altSpellings: ["GR", "Ell\xE1da", "Hellenic Republic", "\u0395\u03BB\u03BB\u03B7\u03BD\u03B9\u03BA\u03AE \u0394\u03B7\u03BC\u03BF\u03BA\u03C1\u03B1\u03C4\u03AF\u03B1"],
    region: "Europe",
    subregion: "Southern Europe",
    population: 10858018,
    latlng: [39, 22],
    demonym: "Greek",
    area: 131990,
    gini: 34.3,
    timezones: ["UTC+02:00"],
    borders: ["ALB", "BGR", "TUR", "MKD"],
    nativeName: "\u0395\u03BB\u03BB\u03AC\u03B4\u03B1",
    numericCode: "300",
    currencies: [
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      }
    ],
    languages: [
      {
        iso639_1: "el",
        iso639_2: "ell",
        name: "Greek (modern)",
        nativeName: "\u03B5\u03BB\u03BB\u03B7\u03BD\u03B9\u03BA\u03AC"
      }
    ],
    translations: {
      de: "Griechenland",
      es: "Grecia",
      fr: "Gr\xE8ce",
      ja: "\u30AE\u30EA\u30B7\u30E3",
      it: "Grecia",
      br: "Gr\xE9cia",
      pt: "Gr\xE9cia",
      nl: "Griekenland",
      hr: "Gr\u010Dka",
      fa: "\u06CC\u0648\u0646\u0627\u0646"
    },
    flag: "https://restcountries.eu/data/grc.svg",
    regionalBlocs: [
      {
        acronym: "EU",
        name: "European Union",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "GRE"
  },
  {
    name: "Greenland",
    topLevelDomain: [".gl"],
    alpha2Code: "GL",
    alpha3Code: "GRL",
    callingCodes: ["299"],
    capital: "Nuuk",
    altSpellings: ["GL", "Gr\xF8nland"],
    region: "Americas",
    subregion: "Northern America",
    population: 55847,
    latlng: [72, -40],
    demonym: "Greenlandic",
    area: 2166086,
    gini: null,
    timezones: ["UTC-04:00", "UTC-03:00", "UTC-01:00", "UTC+00:00"],
    borders: [],
    nativeName: "Kalaallit Nunaat",
    numericCode: "304",
    currencies: [
      {
        code: "DKK",
        name: "Danish krone",
        symbol: "kr"
      }
    ],
    languages: [
      {
        iso639_1: "kl",
        iso639_2: "kal",
        name: "Kalaallisut",
        nativeName: "kalaallisut"
      }
    ],
    translations: {
      de: "Gr\xF6nland",
      es: "Groenlandia",
      fr: "Groenland",
      ja: "\u30B0\u30EA\u30FC\u30F3\u30E9\u30F3\u30C9",
      it: "Groenlandia",
      br: "Groel\xE2ndia",
      pt: "Gronel\xE2ndia",
      nl: "Groenland",
      hr: "Grenland",
      fa: "\u06AF\u0631\u06CC\u0646\u0644\u0646\u062F"
    },
    flag: "https://restcountries.eu/data/grl.svg",
    regionalBlocs: [],
    cioc: ""
  },
  {
    name: "Grenada",
    topLevelDomain: [".gd"],
    alpha2Code: "GD",
    alpha3Code: "GRD",
    callingCodes: ["1473"],
    capital: "St. George's",
    altSpellings: ["GD"],
    region: "Americas",
    subregion: "Caribbean",
    population: 103328,
    latlng: [12.11666666, -61.66666666],
    demonym: "Grenadian",
    area: 344,
    gini: null,
    timezones: ["UTC-04:00"],
    borders: [],
    nativeName: "Grenada",
    numericCode: "308",
    currencies: [
      {
        code: "XCD",
        name: "East Caribbean dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Grenada",
      es: "Grenada",
      fr: "Grenade",
      ja: "\u30B0\u30EC\u30CA\u30C0",
      it: "Grenada",
      br: "Granada",
      pt: "Granada",
      nl: "Grenada",
      hr: "Grenada",
      fa: "\u06AF\u0631\u0646\u0627\u062F\u0627"
    },
    flag: "https://restcountries.eu/data/grd.svg",
    regionalBlocs: [
      {
        acronym: "CARICOM",
        name: "Caribbean Community",
        otherAcronyms: [],
        otherNames: [
          "Comunidad del Caribe",
          "Communaut\xE9 Carib\xE9enne",
          "Caribische Gemeenschap"
        ]
      }
    ],
    cioc: "GRN"
  },
  {
    name: "Guadeloupe",
    topLevelDomain: [".gp"],
    alpha2Code: "GP",
    alpha3Code: "GLP",
    callingCodes: ["590"],
    capital: "Basse-Terre",
    altSpellings: ["GP", "Gwadloup"],
    region: "Americas",
    subregion: "Caribbean",
    population: 400132,
    latlng: [16.25, -61.583333],
    demonym: "Guadeloupian",
    area: null,
    gini: null,
    timezones: ["UTC-04:00"],
    borders: [],
    nativeName: "Guadeloupe",
    numericCode: "312",
    currencies: [
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      }
    ],
    languages: [
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      }
    ],
    translations: {
      de: "Guadeloupe",
      es: "Guadalupe",
      fr: "Guadeloupe",
      ja: "\u30B0\u30A2\u30C9\u30EB\u30FC\u30D7",
      it: "Guadeloupa",
      br: "Guadalupe",
      pt: "Guadalupe",
      nl: "Guadeloupe",
      hr: "Gvadalupa",
      fa: "\u062C\u0632\u06CC\u0631\u0647 \u06AF\u0648\u0627\u062F\u0644\u0648\u067E"
    },
    flag: "https://restcountries.eu/data/glp.svg",
    regionalBlocs: [],
    cioc: ""
  },
  {
    name: "Guam",
    topLevelDomain: [".gu"],
    alpha2Code: "GU",
    alpha3Code: "GUM",
    callingCodes: ["1671"],
    capital: "Hag\xE5t\xF1a",
    altSpellings: ["GU", "Gu\xE5h\xE5n"],
    region: "Oceania",
    subregion: "Micronesia",
    population: 184200,
    latlng: [13.46666666, 144.78333333],
    demonym: "Guamanian",
    area: 549,
    gini: null,
    timezones: ["UTC+10:00"],
    borders: [],
    nativeName: "Guam",
    numericCode: "316",
    currencies: [
      {
        code: "USD",
        name: "United States dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      },
      {
        iso639_1: "ch",
        iso639_2: "cha",
        name: "Chamorro",
        nativeName: "Chamoru"
      },
      {
        iso639_1: "es",
        iso639_2: "spa",
        name: "Spanish",
        nativeName: "Espa\xF1ol"
      }
    ],
    translations: {
      de: "Guam",
      es: "Guam",
      fr: "Guam",
      ja: "\u30B0\u30A2\u30E0",
      it: "Guam",
      br: "Guam",
      pt: "Guame",
      nl: "Guam",
      hr: "Guam",
      fa: "\u06AF\u0648\u0627\u0645"
    },
    flag: "https://restcountries.eu/data/gum.svg",
    regionalBlocs: [],
    cioc: "GUM"
  },
  {
    name: "Guatemala",
    topLevelDomain: [".gt"],
    alpha2Code: "GT",
    alpha3Code: "GTM",
    callingCodes: ["502"],
    capital: "Guatemala City",
    altSpellings: ["GT"],
    region: "Americas",
    subregion: "Central America",
    population: 16176133,
    latlng: [15.5, -90.25],
    demonym: "Guatemalan",
    area: 108889,
    gini: 55.9,
    timezones: ["UTC-06:00"],
    borders: ["BLZ", "SLV", "HND", "MEX"],
    nativeName: "Guatemala",
    numericCode: "320",
    currencies: [
      {
        code: "GTQ",
        name: "Guatemalan quetzal",
        symbol: "Q"
      }
    ],
    languages: [
      {
        iso639_1: "es",
        iso639_2: "spa",
        name: "Spanish",
        nativeName: "Espa\xF1ol"
      }
    ],
    translations: {
      de: "Guatemala",
      es: "Guatemala",
      fr: "Guatemala",
      ja: "\u30B0\u30A2\u30C6\u30DE\u30E9",
      it: "Guatemala",
      br: "Guatemala",
      pt: "Guatemala",
      nl: "Guatemala",
      hr: "Gvatemala",
      fa: "\u06AF\u0648\u0627\u062A\u0645\u0627\u0644\u0627"
    },
    flag: "https://restcountries.eu/data/gtm.svg",
    regionalBlocs: [
      {
        acronym: "CAIS",
        name: "Central American Integration System",
        otherAcronyms: ["SICA"],
        otherNames: ["Sistema de la Integraci\xF3n Centroamericana,"]
      }
    ],
    cioc: "GUA"
  },
  {
    name: "Guernsey",
    topLevelDomain: [".gg"],
    alpha2Code: "GG",
    alpha3Code: "GGY",
    callingCodes: ["44"],
    capital: "St. Peter Port",
    altSpellings: ["GG", "Bailiwick of Guernsey", "Bailliage de Guernesey"],
    region: "Europe",
    subregion: "Northern Europe",
    population: 62999,
    latlng: [49.46666666, -2.58333333],
    demonym: "Channel Islander",
    area: 78,
    gini: null,
    timezones: ["UTC+00:00"],
    borders: [],
    nativeName: "Guernsey",
    numericCode: "831",
    currencies: [
      {
        code: "GBP",
        name: "British pound",
        symbol: "\xA3"
      },
      {
        code: "(none)",
        name: "Guernsey pound",
        symbol: "\xA3"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      },
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      }
    ],
    translations: {
      de: "Guernsey",
      es: "Guernsey",
      fr: "Guernesey",
      ja: "\u30AC\u30FC\u30F3\u30B8\u30FC",
      it: "Guernsey",
      br: "Guernsey",
      pt: "Guernsey",
      nl: "Guernsey",
      hr: "Guernsey",
      fa: "\u06AF\u0631\u0646\u0632\u06CC"
    },
    flag: "https://restcountries.eu/data/ggy.svg",
    regionalBlocs: [],
    cioc: ""
  },
  {
    name: "Guinea",
    topLevelDomain: [".gn"],
    alpha2Code: "GN",
    alpha3Code: "GIN",
    callingCodes: ["224"],
    capital: "Conakry",
    altSpellings: ["GN", "Republic of Guinea", "R\xE9publique de Guin\xE9e"],
    region: "Africa",
    subregion: "Western Africa",
    population: 12947e3,
    latlng: [11, -10],
    demonym: "Guinean",
    area: 245857,
    gini: 39.4,
    timezones: ["UTC"],
    borders: ["CIV", "GNB", "LBR", "MLI", "SEN", "SLE"],
    nativeName: "Guin\xE9e",
    numericCode: "324",
    currencies: [
      {
        code: "GNF",
        name: "Guinean franc",
        symbol: "Fr"
      }
    ],
    languages: [
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      },
      {
        iso639_1: "ff",
        iso639_2: "ful",
        name: "Fula",
        nativeName: "Fulfulde"
      }
    ],
    translations: {
      de: "Guinea",
      es: "Guinea",
      fr: "Guin\xE9e",
      ja: "\u30AE\u30CB\u30A2",
      it: "Guinea",
      br: "Guin\xE9",
      pt: "Guin\xE9",
      nl: "Guinee",
      hr: "Gvineja",
      fa: "\u06AF\u06CC\u0646\u0647"
    },
    flag: "https://restcountries.eu/data/gin.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "GUI"
  },
  {
    name: "Guinea-Bissau",
    topLevelDomain: [".gw"],
    alpha2Code: "GW",
    alpha3Code: "GNB",
    callingCodes: ["245"],
    capital: "Bissau",
    altSpellings: [
      "GW",
      "Republic of Guinea-Bissau",
      "Rep\xFAblica da Guin\xE9-Bissau"
    ],
    region: "Africa",
    subregion: "Western Africa",
    population: 1547777,
    latlng: [12, -15],
    demonym: "Guinea-Bissauan",
    area: 36125,
    gini: 35.5,
    timezones: ["UTC"],
    borders: ["GIN", "SEN"],
    nativeName: "Guin\xE9-Bissau",
    numericCode: "624",
    currencies: [
      {
        code: "XOF",
        name: "West African CFA franc",
        symbol: "Fr"
      }
    ],
    languages: [
      {
        iso639_1: "pt",
        iso639_2: "por",
        name: "Portuguese",
        nativeName: "Portugu\xEAs"
      }
    ],
    translations: {
      de: "Guinea-Bissau",
      es: "Guinea-Bis\xE1u",
      fr: "Guin\xE9e-Bissau",
      ja: "\u30AE\u30CB\u30A2\u30D3\u30B5\u30A6",
      it: "Guinea-Bissau",
      br: "Guin\xE9-Bissau",
      pt: "Guin\xE9-Bissau",
      nl: "Guinee-Bissau",
      hr: "Gvineja Bisau",
      fa: "\u06AF\u06CC\u0646\u0647 \u0628\u06CC\u0633\u0627\u0626\u0648"
    },
    flag: "https://restcountries.eu/data/gnb.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "GBS"
  },
  {
    name: "Guyana",
    topLevelDomain: [".gy"],
    alpha2Code: "GY",
    alpha3Code: "GUY",
    callingCodes: ["592"],
    capital: "Georgetown",
    altSpellings: ["GY", "Co-operative Republic of Guyana"],
    region: "Americas",
    subregion: "South America",
    population: 746900,
    latlng: [5, -59],
    demonym: "Guyanese",
    area: 214969,
    gini: 44.5,
    timezones: ["UTC-04:00"],
    borders: ["BRA", "SUR", "VEN"],
    nativeName: "Guyana",
    numericCode: "328",
    currencies: [
      {
        code: "GYD",
        name: "Guyanese dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Guyana",
      es: "Guyana",
      fr: "Guyane",
      ja: "\u30AC\u30A4\u30A2\u30CA",
      it: "Guyana",
      br: "Guiana",
      pt: "Guiana",
      nl: "Guyana",
      hr: "Gvajana",
      fa: "\u06AF\u0648\u06CC\u0627\u0646"
    },
    flag: "https://restcountries.eu/data/guy.svg",
    regionalBlocs: [
      {
        acronym: "CARICOM",
        name: "Caribbean Community",
        otherAcronyms: [],
        otherNames: [
          "Comunidad del Caribe",
          "Communaut\xE9 Carib\xE9enne",
          "Caribische Gemeenschap"
        ]
      },
      {
        acronym: "USAN",
        name: "Union of South American Nations",
        otherAcronyms: ["UNASUR", "UNASUL", "UZAN"],
        otherNames: [
          "Uni\xF3n de Naciones Suramericanas",
          "Uni\xE3o de Na\xE7\xF5es Sul-Americanas",
          "Unie van Zuid-Amerikaanse Naties",
          "South American Union"
        ]
      }
    ],
    cioc: "GUY"
  },
  {
    name: "Haiti",
    topLevelDomain: [".ht"],
    alpha2Code: "HT",
    alpha3Code: "HTI",
    callingCodes: ["509"],
    capital: "Port-au-Prince",
    altSpellings: [
      "HT",
      "Republic of Haiti",
      "R\xE9publique d'Ha\xEFti",
      "Repiblik Ayiti"
    ],
    region: "Americas",
    subregion: "Caribbean",
    population: 11078033,
    latlng: [19, -72.41666666],
    demonym: "Haitian",
    area: 27750,
    gini: 59.2,
    timezones: ["UTC-05:00"],
    borders: ["DOM"],
    nativeName: "Ha\xEFti",
    numericCode: "332",
    currencies: [
      {
        code: "HTG",
        name: "Haitian gourde",
        symbol: "G"
      }
    ],
    languages: [
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      },
      {
        iso639_1: "ht",
        iso639_2: "hat",
        name: "Haitian",
        nativeName: "Krey\xF2l ayisyen"
      }
    ],
    translations: {
      de: "Haiti",
      es: "Haiti",
      fr: "Ha\xEFti",
      ja: "\u30CF\u30A4\u30C1",
      it: "Haiti",
      br: "Haiti",
      pt: "Haiti",
      nl: "Ha\xEFti",
      hr: "Haiti",
      fa: "\u0647\u0627\u0626\u06CC\u062A\u06CC"
    },
    flag: "https://restcountries.eu/data/hti.svg",
    regionalBlocs: [
      {
        acronym: "CARICOM",
        name: "Caribbean Community",
        otherAcronyms: [],
        otherNames: [
          "Comunidad del Caribe",
          "Communaut\xE9 Carib\xE9enne",
          "Caribische Gemeenschap"
        ]
      }
    ],
    cioc: "HAI"
  },
  {
    name: "Heard Island and McDonald Islands",
    topLevelDomain: [".hm", ".aq"],
    alpha2Code: "HM",
    alpha3Code: "HMD",
    callingCodes: [""],
    capital: "",
    altSpellings: ["HM"],
    region: "",
    subregion: "",
    population: 0,
    latlng: [-53.1, 72.51666666],
    demonym: "Heard and McDonald Islander",
    area: 412,
    gini: null,
    timezones: ["UTC+05:00"],
    borders: [],
    nativeName: "Heard Island and McDonald Islands",
    numericCode: "334",
    currencies: [
      {
        code: "AUD",
        name: "Australian dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Heard und die McDonaldinseln",
      es: "Islas Heard y McDonald",
      fr: "\xCEles Heard-et-MacDonald",
      ja: "\u30CF\u30FC\u30C9\u5CF6\u3068\u30DE\u30AF\u30C9\u30CA\u30EB\u30C9\u8AF8\u5CF6",
      it: "Isole Heard e McDonald",
      br: "Ilha Heard e Ilhas McDonald",
      pt: "Ilha Heard e Ilhas McDonald",
      nl: "Heard- en McDonaldeilanden",
      hr: "Otok Heard i oto\u010Dje McDonald",
      fa: "\u062C\u0632\u06CC\u0631\u0647 \u0647\u0631\u062F \u0648 \u062C\u0632\u0627\u06CC\u0631 \u0645\u06A9\u200C\u062F\u0648\u0646\u0627\u0644\u062F"
    },
    flag: "https://restcountries.eu/data/hmd.svg",
    regionalBlocs: [],
    cioc: ""
  },
  {
    name: "Holy See",
    topLevelDomain: [".va"],
    alpha2Code: "VA",
    alpha3Code: "VAT",
    callingCodes: ["379"],
    capital: "Rome",
    altSpellings: ["Sancta Sedes", "Vatican", "The Vatican"],
    region: "Europe",
    subregion: "Southern Europe",
    population: 451,
    latlng: [41.9, 12.45],
    demonym: "",
    area: 0.44,
    gini: null,
    timezones: ["UTC+01:00"],
    borders: ["ITA"],
    nativeName: "Sancta Sedes",
    numericCode: "336",
    currencies: [
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      }
    ],
    languages: [
      {
        iso639_1: "la",
        iso639_2: "lat",
        name: "Latin",
        nativeName: "latine"
      },
      {
        iso639_1: "it",
        iso639_2: "ita",
        name: "Italian",
        nativeName: "Italiano"
      },
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      },
      {
        iso639_1: "de",
        iso639_2: "deu",
        name: "German",
        nativeName: "Deutsch"
      }
    ],
    translations: {
      de: "Heiliger Stuhl",
      es: "Santa Sede",
      fr: "voir Saint",
      ja: "\u8056\u5EA7",
      it: "Santa Sede",
      br: "Vaticano",
      pt: "Vaticano",
      nl: "Heilige Stoel",
      hr: "Sveta Stolica",
      fa: "\u0633\u0631\u06CC\u0631 \u0645\u0642\u062F\u0633"
    },
    flag: "https://restcountries.eu/data/vat.svg",
    regionalBlocs: [],
    cioc: ""
  },
  {
    name: "Honduras",
    topLevelDomain: [".hn"],
    alpha2Code: "HN",
    alpha3Code: "HND",
    callingCodes: ["504"],
    capital: "Tegucigalpa",
    altSpellings: ["HN", "Republic of Honduras", "Rep\xFAblica de Honduras"],
    region: "Americas",
    subregion: "Central America",
    population: 8576532,
    latlng: [15, -86.5],
    demonym: "Honduran",
    area: 112492,
    gini: 57,
    timezones: ["UTC-06:00"],
    borders: ["GTM", "SLV", "NIC"],
    nativeName: "Honduras",
    numericCode: "340",
    currencies: [
      {
        code: "HNL",
        name: "Honduran lempira",
        symbol: "L"
      }
    ],
    languages: [
      {
        iso639_1: "es",
        iso639_2: "spa",
        name: "Spanish",
        nativeName: "Espa\xF1ol"
      }
    ],
    translations: {
      de: "Honduras",
      es: "Honduras",
      fr: "Honduras",
      ja: "\u30DB\u30F3\u30B8\u30E5\u30E9\u30B9",
      it: "Honduras",
      br: "Honduras",
      pt: "Honduras",
      nl: "Honduras",
      hr: "Honduras",
      fa: "\u0647\u0646\u062F\u0648\u0631\u0627\u0633"
    },
    flag: "https://restcountries.eu/data/hnd.svg",
    regionalBlocs: [
      {
        acronym: "CAIS",
        name: "Central American Integration System",
        otherAcronyms: ["SICA"],
        otherNames: ["Sistema de la Integraci\xF3n Centroamericana,"]
      }
    ],
    cioc: "HON"
  },
  {
    name: "Hong Kong",
    topLevelDomain: [".hk"],
    alpha2Code: "HK",
    alpha3Code: "HKG",
    callingCodes: ["852"],
    capital: "City of Victoria",
    altSpellings: ["HK", "\u9999\u6E2F"],
    region: "Asia",
    subregion: "Eastern Asia",
    population: 7324300,
    latlng: [22.25, 114.16666666],
    demonym: "Chinese",
    area: 1104,
    gini: 53.3,
    timezones: ["UTC+08:00"],
    borders: ["CHN"],
    nativeName: "\u9999\u6E2F",
    numericCode: "344",
    currencies: [
      {
        code: "HKD",
        name: "Hong Kong dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      },
      {
        iso639_1: "zh",
        iso639_2: "zho",
        name: "Chinese",
        nativeName: "\u4E2D\u6587 (Zh\u014Dngw\xE9n)"
      }
    ],
    translations: {
      de: "Hong Kong",
      es: "Hong Kong",
      fr: "Hong Kong",
      ja: "\u9999\u6E2F",
      it: "Hong Kong",
      br: "Hong Kong",
      pt: "Hong Kong",
      nl: "Hongkong",
      hr: "Hong Kong",
      fa: "\u0647\u0646\u06AF\u200C\u06A9\u0646\u06AF"
    },
    flag: "https://restcountries.eu/data/hkg.svg",
    regionalBlocs: [],
    cioc: "HKG"
  },
  {
    name: "Hungary",
    topLevelDomain: [".hu"],
    alpha2Code: "HU",
    alpha3Code: "HUN",
    callingCodes: ["36"],
    capital: "Budapest",
    altSpellings: ["HU"],
    region: "Europe",
    subregion: "Eastern Europe",
    population: 9823e3,
    latlng: [47, 20],
    demonym: "Hungarian",
    area: 93028,
    gini: 31.2,
    timezones: ["UTC+01:00"],
    borders: ["AUT", "HRV", "ROU", "SRB", "SVK", "SVN", "UKR"],
    nativeName: "Magyarorsz\xE1g",
    numericCode: "348",
    currencies: [
      {
        code: "HUF",
        name: "Hungarian forint",
        symbol: "Ft"
      }
    ],
    languages: [
      {
        iso639_1: "hu",
        iso639_2: "hun",
        name: "Hungarian",
        nativeName: "magyar"
      }
    ],
    translations: {
      de: "Ungarn",
      es: "Hungr\xEDa",
      fr: "Hongrie",
      ja: "\u30CF\u30F3\u30AC\u30EA\u30FC",
      it: "Ungheria",
      br: "Hungria",
      pt: "Hungria",
      nl: "Hongarije",
      hr: "Ma\u0111arska",
      fa: "\u0645\u062C\u0627\u0631\u0633\u062A\u0627\u0646"
    },
    flag: "https://restcountries.eu/data/hun.svg",
    regionalBlocs: [
      {
        acronym: "EU",
        name: "European Union",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "HUN"
  },
  {
    name: "Iceland",
    topLevelDomain: [".is"],
    alpha2Code: "IS",
    alpha3Code: "ISL",
    callingCodes: ["354"],
    capital: "Reykjav\xEDk",
    altSpellings: ["IS", "Island", "Republic of Iceland", "L\xFD\xF0veldi\xF0 \xCDsland"],
    region: "Europe",
    subregion: "Northern Europe",
    population: 334300,
    latlng: [65, -18],
    demonym: "Icelander",
    area: 103e3,
    gini: null,
    timezones: ["UTC"],
    borders: [],
    nativeName: "\xCDsland",
    numericCode: "352",
    currencies: [
      {
        code: "ISK",
        name: "Icelandic kr\xF3na",
        symbol: "kr"
      }
    ],
    languages: [
      {
        iso639_1: "is",
        iso639_2: "isl",
        name: "Icelandic",
        nativeName: "\xCDslenska"
      }
    ],
    translations: {
      de: "Island",
      es: "Islandia",
      fr: "Islande",
      ja: "\u30A2\u30A4\u30B9\u30E9\u30F3\u30C9",
      it: "Islanda",
      br: "Isl\xE2ndia",
      pt: "Isl\xE2ndia",
      nl: "IJsland",
      hr: "Island",
      fa: "\u0627\u06CC\u0633\u0644\u0646\u062F"
    },
    flag: "https://restcountries.eu/data/isl.svg",
    regionalBlocs: [
      {
        acronym: "EFTA",
        name: "European Free Trade Association",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "ISL"
  },
  {
    name: "India",
    topLevelDomain: [".in"],
    alpha2Code: "IN",
    alpha3Code: "IND",
    callingCodes: ["91"],
    capital: "New Delhi",
    altSpellings: ["IN", "Bh\u0101rat", "Republic of India", "Bharat Ganrajya"],
    region: "Asia",
    subregion: "Southern Asia",
    population: 129521e4,
    latlng: [20, 77],
    demonym: "Indian",
    area: 3287590,
    gini: 33.4,
    timezones: ["UTC+05:30"],
    borders: ["AFG", "BGD", "BTN", "MMR", "CHN", "NPL", "PAK", "LKA"],
    nativeName: "\u092D\u093E\u0930\u0924",
    numericCode: "356",
    currencies: [
      {
        code: "INR",
        name: "Indian rupee",
        symbol: "\u20B9"
      }
    ],
    languages: [
      {
        iso639_1: "hi",
        iso639_2: "hin",
        name: "Hindi",
        nativeName: "\u0939\u093F\u0928\u094D\u0926\u0940"
      },
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Indien",
      es: "India",
      fr: "Inde",
      ja: "\u30A4\u30F3\u30C9",
      it: "India",
      br: "\xCDndia",
      pt: "\xCDndia",
      nl: "India",
      hr: "Indija",
      fa: "\u0647\u0646\u062F"
    },
    flag: "https://restcountries.eu/data/ind.svg",
    regionalBlocs: [
      {
        acronym: "SAARC",
        name: "South Asian Association for Regional Cooperation",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "IND"
  },
  {
    name: "Indonesia",
    topLevelDomain: [".id"],
    alpha2Code: "ID",
    alpha3Code: "IDN",
    callingCodes: ["62"],
    capital: "Jakarta",
    altSpellings: ["ID", "Republic of Indonesia", "Republik Indonesia"],
    region: "Asia",
    subregion: "South-Eastern Asia",
    population: 258705e3,
    latlng: [-5, 120],
    demonym: "Indonesian",
    area: 1904569,
    gini: 34,
    timezones: ["UTC+07:00", "UTC+08:00", "UTC+09:00"],
    borders: ["TLS", "MYS", "PNG"],
    nativeName: "Indonesia",
    numericCode: "360",
    currencies: [
      {
        code: "IDR",
        name: "Indonesian rupiah",
        symbol: "Rp"
      }
    ],
    languages: [
      {
        iso639_1: "id",
        iso639_2: "ind",
        name: "Indonesian",
        nativeName: "Bahasa Indonesia"
      }
    ],
    translations: {
      de: "Indonesien",
      es: "Indonesia",
      fr: "Indon\xE9sie",
      ja: "\u30A4\u30F3\u30C9\u30CD\u30B7\u30A2",
      it: "Indonesia",
      br: "Indon\xE9sia",
      pt: "Indon\xE9sia",
      nl: "Indonesi\xEB",
      hr: "Indonezija",
      fa: "\u0627\u0646\u062F\u0648\u0646\u0632\u06CC"
    },
    flag: "https://restcountries.eu/data/idn.svg",
    regionalBlocs: [
      {
        acronym: "ASEAN",
        name: "Association of Southeast Asian Nations",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "INA"
  },
  {
    name: "C\xF4te d'Ivoire",
    topLevelDomain: [".ci"],
    alpha2Code: "CI",
    alpha3Code: "CIV",
    callingCodes: ["225"],
    capital: "Yamoussoukro",
    altSpellings: [
      "CI",
      "Ivory Coast",
      "Republic of C\xF4te d'Ivoire",
      "R\xE9publique de C\xF4te d'Ivoire"
    ],
    region: "Africa",
    subregion: "Western Africa",
    population: 22671331,
    latlng: [8, -5],
    demonym: "Ivorian",
    area: 322463,
    gini: 41.5,
    timezones: ["UTC"],
    borders: ["BFA", "GHA", "GIN", "LBR", "MLI"],
    nativeName: "C\xF4te d'Ivoire",
    numericCode: "384",
    currencies: [
      {
        code: "XOF",
        name: "West African CFA franc",
        symbol: "Fr"
      }
    ],
    languages: [
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      }
    ],
    translations: {
      de: "Elfenbeink\xFCste",
      es: "Costa de Marfil",
      fr: "C\xF4te d'Ivoire",
      ja: "\u30B3\u30FC\u30C8\u30B8\u30DC\u30EF\u30FC\u30EB",
      it: "Costa D'Avorio",
      br: "Costa do Marfim",
      pt: "Costa do Marfim",
      nl: "Ivoorkust",
      hr: "Obala Bjelokosti",
      fa: "\u0633\u0627\u062D\u0644 \u0639\u0627\u062C"
    },
    flag: "https://restcountries.eu/data/civ.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "CIV"
  },
  {
    name: "Iran (Islamic Republic of)",
    topLevelDomain: [".ir"],
    alpha2Code: "IR",
    alpha3Code: "IRN",
    callingCodes: ["98"],
    capital: "Tehran",
    altSpellings: [
      "IR",
      "Islamic Republic of Iran",
      "Jomhuri-ye Esl\u0101mi-ye Ir\u0101n"
    ],
    region: "Asia",
    subregion: "Southern Asia",
    population: 79369900,
    latlng: [32, 53],
    demonym: "Iranian",
    area: 1648195,
    gini: 38.3,
    timezones: ["UTC+03:30"],
    borders: ["AFG", "ARM", "AZE", "IRQ", "PAK", "TUR", "TKM"],
    nativeName: "\u0627\u06CC\u0631\u0627\u0646",
    numericCode: "364",
    currencies: [
      {
        code: "IRR",
        name: "Iranian rial",
        symbol: "\uFDFC"
      }
    ],
    languages: [
      {
        iso639_1: "fa",
        iso639_2: "fas",
        name: "Persian (Farsi)",
        nativeName: "\u0641\u0627\u0631\u0633\u06CC"
      }
    ],
    translations: {
      de: "Iran",
      es: "Iran",
      fr: "Iran",
      ja: "\u30A4\u30E9\u30F3\u30FB\u30A4\u30B9\u30E9\u30E0\u5171\u548C\u56FD",
      it: null,
      br: "Ir\xE3",
      pt: "Ir\xE3o",
      nl: "Iran",
      hr: "Iran",
      fa: "\u0627\u06CC\u0631\u0627\u0646"
    },
    flag: "https://restcountries.eu/data/irn.svg",
    regionalBlocs: [],
    cioc: "IRI"
  },
  {
    name: "Iraq",
    topLevelDomain: [".iq"],
    alpha2Code: "IQ",
    alpha3Code: "IRQ",
    callingCodes: ["964"],
    capital: "Baghdad",
    altSpellings: ["IQ", "Republic of Iraq", "Jumh\u016Briyyat al-\u2018Ir\u0101q"],
    region: "Asia",
    subregion: "Western Asia",
    population: 37883543,
    latlng: [33, 44],
    demonym: "Iraqi",
    area: 438317,
    gini: 30.9,
    timezones: ["UTC+03:00"],
    borders: ["IRN", "JOR", "KWT", "SAU", "SYR", "TUR"],
    nativeName: "\u0627\u0644\u0639\u0631\u0627\u0642",
    numericCode: "368",
    currencies: [
      {
        code: "IQD",
        name: "Iraqi dinar",
        symbol: "\u0639.\u062F"
      }
    ],
    languages: [
      {
        iso639_1: "ar",
        iso639_2: "ara",
        name: "Arabic",
        nativeName: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"
      },
      {
        iso639_1: "ku",
        iso639_2: "kur",
        name: "Kurdish",
        nativeName: "Kurd\xEE"
      }
    ],
    translations: {
      de: "Irak",
      es: "Irak",
      fr: "Irak",
      ja: "\u30A4\u30E9\u30AF",
      it: "Iraq",
      br: "Iraque",
      pt: "Iraque",
      nl: "Irak",
      hr: "Irak",
      fa: "\u0639\u0631\u0627\u0642"
    },
    flag: "https://restcountries.eu/data/irq.svg",
    regionalBlocs: [
      {
        acronym: "AL",
        name: "Arab League",
        otherAcronyms: [],
        otherNames: [
          "\u062C\u0627\u0645\u0639\u0629 \u0627\u0644\u062F\u0648\u0644 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
          "J\u0101mi\u02BBat ad-Duwal al-\u02BBArab\u012Byah",
          "League of Arab States"
        ]
      }
    ],
    cioc: "IRQ"
  },
  {
    name: "Ireland",
    topLevelDomain: [".ie"],
    alpha2Code: "IE",
    alpha3Code: "IRL",
    callingCodes: ["353"],
    capital: "Dublin",
    altSpellings: ["IE", "\xC9ire", "Republic of Ireland", "Poblacht na h\xC9ireann"],
    region: "Europe",
    subregion: "Northern Europe",
    population: 6378e3,
    latlng: [53, -8],
    demonym: "Irish",
    area: 70273,
    gini: 34.3,
    timezones: ["UTC"],
    borders: ["GBR"],
    nativeName: "\xC9ire",
    numericCode: "372",
    currencies: [
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      }
    ],
    languages: [
      {
        iso639_1: "ga",
        iso639_2: "gle",
        name: "Irish",
        nativeName: "Gaeilge"
      },
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Irland",
      es: "Irlanda",
      fr: "Irlande",
      ja: "\u30A2\u30A4\u30EB\u30E9\u30F3\u30C9",
      it: "Irlanda",
      br: "Irlanda",
      pt: "Irlanda",
      nl: "Ierland",
      hr: "Irska",
      fa: "\u0627\u06CC\u0631\u0644\u0646\u062F"
    },
    flag: "https://restcountries.eu/data/irl.svg",
    regionalBlocs: [
      {
        acronym: "EU",
        name: "European Union",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "IRL"
  },
  {
    name: "Isle of Man",
    topLevelDomain: [".im"],
    alpha2Code: "IM",
    alpha3Code: "IMN",
    callingCodes: ["44"],
    capital: "Douglas",
    altSpellings: ["IM", "Ellan Vannin", "Mann", "Mannin"],
    region: "Europe",
    subregion: "Northern Europe",
    population: 84497,
    latlng: [54.25, -4.5],
    demonym: "Manx",
    area: 572,
    gini: null,
    timezones: ["UTC+00:00"],
    borders: [],
    nativeName: "Isle of Man",
    numericCode: "833",
    currencies: [
      {
        code: "GBP",
        name: "British pound",
        symbol: "\xA3"
      },
      {
        code: "IMP[G]",
        name: "Manx pound",
        symbol: "\xA3"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      },
      {
        iso639_1: "gv",
        iso639_2: "glv",
        name: "Manx",
        nativeName: "Gaelg"
      }
    ],
    translations: {
      de: "Insel Man",
      es: "Isla de Man",
      fr: "\xCEle de Man",
      ja: "\u30DE\u30F3\u5CF6",
      it: "Isola di Man",
      br: "Ilha de Man",
      pt: "Ilha de Man",
      nl: "Isle of Man",
      hr: "Otok Man",
      fa: "\u062C\u0632\u06CC\u0631\u0647 \u0645\u0646"
    },
    flag: "https://restcountries.eu/data/imn.svg",
    regionalBlocs: [
      {
        acronym: "EU",
        name: "European Union",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: ""
  },
  {
    name: "Israel",
    topLevelDomain: [".il"],
    alpha2Code: "IL",
    alpha3Code: "ISR",
    callingCodes: ["972"],
    capital: "Jerusalem",
    altSpellings: ["IL", "State of Israel", "Med\u012Bnat Yisr\u0101'el"],
    region: "Asia",
    subregion: "Western Asia",
    population: 8527400,
    latlng: [31.5, 34.75],
    demonym: "Israeli",
    area: 20770,
    gini: 39.2,
    timezones: ["UTC+02:00"],
    borders: ["EGY", "JOR", "LBN", "SYR"],
    nativeName: "\u05D9\u05B4\u05E9\u05B0\u05C2\u05E8\u05B8\u05D0\u05B5\u05DC",
    numericCode: "376",
    currencies: [
      {
        code: "ILS",
        name: "Israeli new shekel",
        symbol: "\u20AA"
      }
    ],
    languages: [
      {
        iso639_1: "he",
        iso639_2: "heb",
        name: "Hebrew (modern)",
        nativeName: "\u05E2\u05D1\u05E8\u05D9\u05EA"
      },
      {
        iso639_1: "ar",
        iso639_2: "ara",
        name: "Arabic",
        nativeName: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"
      }
    ],
    translations: {
      de: "Israel",
      es: "Israel",
      fr: "Isra\xEBl",
      ja: "\u30A4\u30B9\u30E9\u30A8\u30EB",
      it: "Israele",
      br: "Israel",
      pt: "Israel",
      nl: "Isra\xEBl",
      hr: "Izrael",
      fa: "\u0627\u0633\u0631\u0627\u0626\u06CC\u0644"
    },
    flag: "https://restcountries.eu/data/isr.svg",
    regionalBlocs: [],
    cioc: "ISR"
  },
  {
    name: "Italy",
    topLevelDomain: [".it"],
    alpha2Code: "IT",
    alpha3Code: "ITA",
    callingCodes: ["39"],
    capital: "Rome",
    altSpellings: ["IT", "Italian Republic", "Repubblica italiana"],
    region: "Europe",
    subregion: "Southern Europe",
    population: 60665551,
    latlng: [42.83333333, 12.83333333],
    demonym: "Italian",
    area: 301336,
    gini: 36,
    timezones: ["UTC+01:00"],
    borders: ["AUT", "FRA", "SMR", "SVN", "CHE", "VAT"],
    nativeName: "Italia",
    numericCode: "380",
    currencies: [
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      }
    ],
    languages: [
      {
        iso639_1: "it",
        iso639_2: "ita",
        name: "Italian",
        nativeName: "Italiano"
      }
    ],
    translations: {
      de: "Italien",
      es: "Italia",
      fr: "Italie",
      ja: "\u30A4\u30BF\u30EA\u30A2",
      it: "Italia",
      br: "It\xE1lia",
      pt: "It\xE1lia",
      nl: "Itali\xEB",
      hr: "Italija",
      fa: "\u0627\u06CC\u062A\u0627\u0644\u06CC\u0627"
    },
    flag: "https://restcountries.eu/data/ita.svg",
    regionalBlocs: [
      {
        acronym: "EU",
        name: "European Union",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "ITA"
  },
  {
    name: "Jamaica",
    topLevelDomain: [".jm"],
    alpha2Code: "JM",
    alpha3Code: "JAM",
    callingCodes: ["1876"],
    capital: "Kingston",
    altSpellings: ["JM"],
    region: "Americas",
    subregion: "Caribbean",
    population: 2723246,
    latlng: [18.25, -77.5],
    demonym: "Jamaican",
    area: 10991,
    gini: 45.5,
    timezones: ["UTC-05:00"],
    borders: [],
    nativeName: "Jamaica",
    numericCode: "388",
    currencies: [
      {
        code: "JMD",
        name: "Jamaican dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Jamaika",
      es: "Jamaica",
      fr: "Jama\xEFque",
      ja: "\u30B8\u30E3\u30DE\u30A4\u30AB",
      it: "Giamaica",
      br: "Jamaica",
      pt: "Jamaica",
      nl: "Jamaica",
      hr: "Jamajka",
      fa: "\u062C\u0627\u0645\u0627\u0626\u06CC\u06A9\u0627"
    },
    flag: "https://restcountries.eu/data/jam.svg",
    regionalBlocs: [
      {
        acronym: "CARICOM",
        name: "Caribbean Community",
        otherAcronyms: [],
        otherNames: [
          "Comunidad del Caribe",
          "Communaut\xE9 Carib\xE9enne",
          "Caribische Gemeenschap"
        ]
      }
    ],
    cioc: "JAM"
  },
  {
    name: "Japan",
    topLevelDomain: [".jp"],
    alpha2Code: "JP",
    alpha3Code: "JPN",
    callingCodes: ["81"],
    capital: "Tokyo",
    altSpellings: ["JP", "Nippon", "Nihon"],
    region: "Asia",
    subregion: "Eastern Asia",
    population: 12696e4,
    latlng: [36, 138],
    demonym: "Japanese",
    area: 377930,
    gini: 38.1,
    timezones: ["UTC+09:00"],
    borders: [],
    nativeName: "\u65E5\u672C",
    numericCode: "392",
    currencies: [
      {
        code: "JPY",
        name: "Japanese yen",
        symbol: "\xA5"
      }
    ],
    languages: [
      {
        iso639_1: "ja",
        iso639_2: "jpn",
        name: "Japanese",
        nativeName: "\u65E5\u672C\u8A9E (\u306B\u307B\u3093\u3054)"
      }
    ],
    translations: {
      de: "Japan",
      es: "Jap\xF3n",
      fr: "Japon",
      ja: "\u65E5\u672C",
      it: "Giappone",
      br: "Jap\xE3o",
      pt: "Jap\xE3o",
      nl: "Japan",
      hr: "Japan",
      fa: "\u0698\u0627\u067E\u0646"
    },
    flag: "https://restcountries.eu/data/jpn.svg",
    regionalBlocs: [],
    cioc: "JPN"
  },
  {
    name: "Jersey",
    topLevelDomain: [".je"],
    alpha2Code: "JE",
    alpha3Code: "JEY",
    callingCodes: ["44"],
    capital: "Saint Helier",
    altSpellings: [
      "JE",
      "Bailiwick of Jersey",
      "Bailliage de Jersey",
      "Bailliage d\xE9 J\xE8rri"
    ],
    region: "Europe",
    subregion: "Northern Europe",
    population: 100800,
    latlng: [49.25, -2.16666666],
    demonym: "Channel Islander",
    area: 116,
    gini: null,
    timezones: ["UTC+01:00"],
    borders: [],
    nativeName: "Jersey",
    numericCode: "832",
    currencies: [
      {
        code: "GBP",
        name: "British pound",
        symbol: "\xA3"
      },
      {
        code: "JEP[G]",
        name: "Jersey pound",
        symbol: "\xA3"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      },
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      }
    ],
    translations: {
      de: "Jersey",
      es: "Jersey",
      fr: "Jersey",
      ja: "\u30B8\u30E3\u30FC\u30B8\u30FC",
      it: "Isola di Jersey",
      br: "Jersey",
      pt: "Jersey",
      nl: "Jersey",
      hr: "Jersey",
      fa: "\u062C\u0631\u0632\u06CC"
    },
    flag: "https://restcountries.eu/data/jey.svg",
    regionalBlocs: [],
    cioc: ""
  },
  {
    name: "Jordan",
    topLevelDomain: [".jo"],
    alpha2Code: "JO",
    alpha3Code: "JOR",
    callingCodes: ["962"],
    capital: "Amman",
    altSpellings: [
      "JO",
      "Hashemite Kingdom of Jordan",
      "al-Mamlakah al-Urdun\u012Byah al-H\u0101shim\u012Byah"
    ],
    region: "Asia",
    subregion: "Western Asia",
    population: 9531712,
    latlng: [31, 36],
    demonym: "Jordanian",
    area: 89342,
    gini: 35.4,
    timezones: ["UTC+03:00"],
    borders: ["IRQ", "ISR", "SAU", "SYR"],
    nativeName: "\u0627\u0644\u0623\u0631\u062F\u0646",
    numericCode: "400",
    currencies: [
      {
        code: "JOD",
        name: "Jordanian dinar",
        symbol: "\u062F.\u0627"
      }
    ],
    languages: [
      {
        iso639_1: "ar",
        iso639_2: "ara",
        name: "Arabic",
        nativeName: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"
      }
    ],
    translations: {
      de: "Jordanien",
      es: "Jordania",
      fr: "Jordanie",
      ja: "\u30E8\u30EB\u30C0\u30F3",
      it: "Giordania",
      br: "Jord\xE2nia",
      pt: "Jord\xE2nia",
      nl: "Jordani\xEB",
      hr: "Jordan",
      fa: "\u0627\u0631\u062F\u0646"
    },
    flag: "https://restcountries.eu/data/jor.svg",
    regionalBlocs: [
      {
        acronym: "AL",
        name: "Arab League",
        otherAcronyms: [],
        otherNames: [
          "\u062C\u0627\u0645\u0639\u0629 \u0627\u0644\u062F\u0648\u0644 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
          "J\u0101mi\u02BBat ad-Duwal al-\u02BBArab\u012Byah",
          "League of Arab States"
        ]
      }
    ],
    cioc: "JOR"
  },
  {
    name: "Kazakhstan",
    topLevelDomain: [".kz", ".\u049B\u0430\u0437"],
    alpha2Code: "KZ",
    alpha3Code: "KAZ",
    callingCodes: ["76", "77"],
    capital: "Astana",
    altSpellings: [
      "KZ",
      "Qazaqstan",
      "\u041A\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043D",
      "Republic of Kazakhstan",
      "\u049A\u0430\u0437\u0430\u049B\u0441\u0442\u0430\u043D \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0441\u044B",
      "Qazaqstan Respubl\xEFkas\u0131",
      "\u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041A\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043D",
      "Respublika Kazakhstan"
    ],
    region: "Asia",
    subregion: "Central Asia",
    population: 17753200,
    latlng: [48, 68],
    demonym: "Kazakhstani",
    area: 2724900,
    gini: 29,
    timezones: ["UTC+05:00", "UTC+06:00"],
    borders: ["CHN", "KGZ", "RUS", "TKM", "UZB"],
    nativeName: "\u049A\u0430\u0437\u0430\u049B\u0441\u0442\u0430\u043D",
    numericCode: "398",
    currencies: [
      {
        code: "KZT",
        name: "Kazakhstani tenge",
        symbol: null
      }
    ],
    languages: [
      {
        iso639_1: "kk",
        iso639_2: "kaz",
        name: "Kazakh",
        nativeName: "\u049B\u0430\u0437\u0430\u049B \u0442\u0456\u043B\u0456"
      },
      {
        iso639_1: "ru",
        iso639_2: "rus",
        name: "Russian",
        nativeName: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439"
      }
    ],
    translations: {
      de: "Kasachstan",
      es: "Kazajist\xE1n",
      fr: "Kazakhstan",
      ja: "\u30AB\u30B6\u30D5\u30B9\u30BF\u30F3",
      it: "Kazakistan",
      br: "Cazaquist\xE3o",
      pt: "Cazaquist\xE3o",
      nl: "Kazachstan",
      hr: "Kazahstan",
      fa: "\u0642\u0632\u0627\u0642\u0633\u062A\u0627\u0646"
    },
    flag: "https://restcountries.eu/data/kaz.svg",
    regionalBlocs: [
      {
        acronym: "EEU",
        name: "Eurasian Economic Union",
        otherAcronyms: ["EAEU"],
        otherNames: []
      }
    ],
    cioc: "KAZ"
  },
  {
    name: "Kenya",
    topLevelDomain: [".ke"],
    alpha2Code: "KE",
    alpha3Code: "KEN",
    callingCodes: ["254"],
    capital: "Nairobi",
    altSpellings: ["KE", "Republic of Kenya", "Jamhuri ya Kenya"],
    region: "Africa",
    subregion: "Eastern Africa",
    population: 47251e3,
    latlng: [1, 38],
    demonym: "Kenyan",
    area: 580367,
    gini: 47.7,
    timezones: ["UTC+03:00"],
    borders: ["ETH", "SOM", "SSD", "TZA", "UGA"],
    nativeName: "Kenya",
    numericCode: "404",
    currencies: [
      {
        code: "KES",
        name: "Kenyan shilling",
        symbol: "Sh"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      },
      {
        iso639_1: "sw",
        iso639_2: "swa",
        name: "Swahili",
        nativeName: "Kiswahili"
      }
    ],
    translations: {
      de: "Kenia",
      es: "Kenia",
      fr: "Kenya",
      ja: "\u30B1\u30CB\u30A2",
      it: "Kenya",
      br: "Qu\xEAnia",
      pt: "Qu\xE9nia",
      nl: "Kenia",
      hr: "Kenija",
      fa: "\u06A9\u0646\u06CC\u0627"
    },
    flag: "https://restcountries.eu/data/ken.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "KEN"
  },
  {
    name: "Kiribati",
    topLevelDomain: [".ki"],
    alpha2Code: "KI",
    alpha3Code: "KIR",
    callingCodes: ["686"],
    capital: "South Tarawa",
    altSpellings: ["KI", "Republic of Kiribati", "Ribaberiki Kiribati"],
    region: "Oceania",
    subregion: "Micronesia",
    population: 113400,
    latlng: [1.41666666, 173],
    demonym: "I-Kiribati",
    area: 811,
    gini: null,
    timezones: ["UTC+12:00", "UTC+13:00", "UTC+14:00"],
    borders: [],
    nativeName: "Kiribati",
    numericCode: "296",
    currencies: [
      {
        code: "AUD",
        name: "Australian dollar",
        symbol: "$"
      },
      {
        code: "(none)",
        name: "Kiribati dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Kiribati",
      es: "Kiribati",
      fr: "Kiribati",
      ja: "\u30AD\u30EA\u30D0\u30B9",
      it: "Kiribati",
      br: "Kiribati",
      pt: "Quirib\xE1ti",
      nl: "Kiribati",
      hr: "Kiribati",
      fa: "\u06A9\u06CC\u0631\u06CC\u0628\u0627\u062A\u06CC"
    },
    flag: "https://restcountries.eu/data/kir.svg",
    regionalBlocs: [],
    cioc: "KIR"
  },
  {
    name: "Kuwait",
    topLevelDomain: [".kw"],
    alpha2Code: "KW",
    alpha3Code: "KWT",
    callingCodes: ["965"],
    capital: "Kuwait City",
    altSpellings: ["KW", "State of Kuwait", "Dawlat al-Kuwait"],
    region: "Asia",
    subregion: "Western Asia",
    population: 4183658,
    latlng: [29.5, 45.75],
    demonym: "Kuwaiti",
    area: 17818,
    gini: null,
    timezones: ["UTC+03:00"],
    borders: ["IRN", "SAU"],
    nativeName: "\u0627\u0644\u0643\u0648\u064A\u062A",
    numericCode: "414",
    currencies: [
      {
        code: "KWD",
        name: "Kuwaiti dinar",
        symbol: "\u062F.\u0643"
      }
    ],
    languages: [
      {
        iso639_1: "ar",
        iso639_2: "ara",
        name: "Arabic",
        nativeName: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"
      }
    ],
    translations: {
      de: "Kuwait",
      es: "Kuwait",
      fr: "Kowe\xEFt",
      ja: "\u30AF\u30A6\u30A7\u30FC\u30C8",
      it: "Kuwait",
      br: "Kuwait",
      pt: "Kuwait",
      nl: "Koeweit",
      hr: "Kuvajt",
      fa: "\u06A9\u0648\u06CC\u062A"
    },
    flag: "https://restcountries.eu/data/kwt.svg",
    regionalBlocs: [
      {
        acronym: "AL",
        name: "Arab League",
        otherAcronyms: [],
        otherNames: [
          "\u062C\u0627\u0645\u0639\u0629 \u0627\u0644\u062F\u0648\u0644 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
          "J\u0101mi\u02BBat ad-Duwal al-\u02BBArab\u012Byah",
          "League of Arab States"
        ]
      }
    ],
    cioc: "KUW"
  },
  {
    name: "Kyrgyzstan",
    topLevelDomain: [".kg"],
    alpha2Code: "KG",
    alpha3Code: "KGZ",
    callingCodes: ["996"],
    capital: "Bishkek",
    altSpellings: [
      "KG",
      "\u041A\u0438\u0440\u0433\u0438\u0437\u0438\u044F",
      "Kyrgyz Republic",
      "\u041A\u044B\u0440\u0433\u044B\u0437 \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0441\u044B",
      "Kyrgyz Respublikasy"
    ],
    region: "Asia",
    subregion: "Central Asia",
    population: 6047800,
    latlng: [41, 75],
    demonym: "Kirghiz",
    area: 199951,
    gini: 36.2,
    timezones: ["UTC+06:00"],
    borders: ["CHN", "KAZ", "TJK", "UZB"],
    nativeName: "\u041A\u044B\u0440\u0433\u044B\u0437\u0441\u0442\u0430\u043D",
    numericCode: "417",
    currencies: [
      {
        code: "KGS",
        name: "Kyrgyzstani som",
        symbol: "\u0441"
      }
    ],
    languages: [
      {
        iso639_1: "ky",
        iso639_2: "kir",
        name: "Kyrgyz",
        nativeName: "\u041A\u044B\u0440\u0433\u044B\u0437\u0447\u0430"
      },
      {
        iso639_1: "ru",
        iso639_2: "rus",
        name: "Russian",
        nativeName: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439"
      }
    ],
    translations: {
      de: "Kirgisistan",
      es: "Kirguizist\xE1n",
      fr: "Kirghizistan",
      ja: "\u30AD\u30EB\u30AE\u30B9",
      it: "Kirghizistan",
      br: "Quirguist\xE3o",
      pt: "Quirguizist\xE3o",
      nl: "Kirgizi\xEB",
      hr: "Kirgistan",
      fa: "\u0642\u0631\u0642\u06CC\u0632\u0633\u062A\u0627\u0646"
    },
    flag: "https://restcountries.eu/data/kgz.svg",
    regionalBlocs: [
      {
        acronym: "EEU",
        name: "Eurasian Economic Union",
        otherAcronyms: ["EAEU"],
        otherNames: []
      }
    ],
    cioc: "KGZ"
  },
  {
    name: "Lao People's Democratic Republic",
    topLevelDomain: [".la"],
    alpha2Code: "LA",
    alpha3Code: "LAO",
    callingCodes: ["856"],
    capital: "Vientiane",
    altSpellings: [
      "LA",
      "Lao",
      "Laos",
      "Lao People's Democratic Republic",
      "Sathalanalat Paxathipatai Paxaxon Lao"
    ],
    region: "Asia",
    subregion: "South-Eastern Asia",
    population: 6492400,
    latlng: [18, 105],
    demonym: "Laotian",
    area: 236800,
    gini: 36.7,
    timezones: ["UTC+07:00"],
    borders: ["MMR", "KHM", "CHN", "THA", "VNM"],
    nativeName: "\u0EAA\u0E9B\u0E9B\u0EA5\u0EB2\u0EA7",
    numericCode: "418",
    currencies: [
      {
        code: "LAK",
        name: "Lao kip",
        symbol: "\u20AD"
      }
    ],
    languages: [
      {
        iso639_1: "lo",
        iso639_2: "lao",
        name: "Lao",
        nativeName: "\u0E9E\u0EB2\u0EAA\u0EB2\u0EA5\u0EB2\u0EA7"
      }
    ],
    translations: {
      de: "Laos",
      es: "Laos",
      fr: "Laos",
      ja: "\u30E9\u30AA\u30B9\u4EBA\u6C11\u6C11\u4E3B\u5171\u548C\u56FD",
      it: "Laos",
      br: "Laos",
      pt: "Laos",
      nl: "Laos",
      hr: "Laos",
      fa: "\u0644\u0627\u0626\u0648\u0633"
    },
    flag: "https://restcountries.eu/data/lao.svg",
    regionalBlocs: [
      {
        acronym: "ASEAN",
        name: "Association of Southeast Asian Nations",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "LAO"
  },
  {
    name: "Latvia",
    topLevelDomain: [".lv"],
    alpha2Code: "LV",
    alpha3Code: "LVA",
    callingCodes: ["371"],
    capital: "Riga",
    altSpellings: ["LV", "Republic of Latvia", "Latvijas Republika"],
    region: "Europe",
    subregion: "Northern Europe",
    population: 1961600,
    latlng: [57, 25],
    demonym: "Latvian",
    area: 64559,
    gini: 36.6,
    timezones: ["UTC+02:00"],
    borders: ["BLR", "EST", "LTU", "RUS"],
    nativeName: "Latvija",
    numericCode: "428",
    currencies: [
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      }
    ],
    languages: [
      {
        iso639_1: "lv",
        iso639_2: "lav",
        name: "Latvian",
        nativeName: "latvie\u0161u valoda"
      }
    ],
    translations: {
      de: "Lettland",
      es: "Letonia",
      fr: "Lettonie",
      ja: "\u30E9\u30C8\u30D3\u30A2",
      it: "Lettonia",
      br: "Let\xF4nia",
      pt: "Let\xF3nia",
      nl: "Letland",
      hr: "Latvija",
      fa: "\u0644\u062A\u0648\u0646\u06CC"
    },
    flag: "https://restcountries.eu/data/lva.svg",
    regionalBlocs: [
      {
        acronym: "EU",
        name: "European Union",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "LAT"
  },
  {
    name: "Lebanon",
    topLevelDomain: [".lb"],
    alpha2Code: "LB",
    alpha3Code: "LBN",
    callingCodes: ["961"],
    capital: "Beirut",
    altSpellings: ["LB", "Lebanese Republic", "Al-Jumh\u016Br\u012Byah Al-Libn\u0101n\u012Byah"],
    region: "Asia",
    subregion: "Western Asia",
    population: 5988e3,
    latlng: [33.83333333, 35.83333333],
    demonym: "Lebanese",
    area: 10452,
    gini: null,
    timezones: ["UTC+02:00"],
    borders: ["ISR", "SYR"],
    nativeName: "\u0644\u0628\u0646\u0627\u0646",
    numericCode: "422",
    currencies: [
      {
        code: "LBP",
        name: "Lebanese pound",
        symbol: "\u0644.\u0644"
      }
    ],
    languages: [
      {
        iso639_1: "ar",
        iso639_2: "ara",
        name: "Arabic",
        nativeName: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"
      },
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      }
    ],
    translations: {
      de: "Libanon",
      es: "L\xEDbano",
      fr: "Liban",
      ja: "\u30EC\u30D0\u30CE\u30F3",
      it: "Libano",
      br: "L\xEDbano",
      pt: "L\xEDbano",
      nl: "Libanon",
      hr: "Libanon",
      fa: "\u0644\u0628\u0646\u0627\u0646"
    },
    flag: "https://restcountries.eu/data/lbn.svg",
    regionalBlocs: [
      {
        acronym: "AL",
        name: "Arab League",
        otherAcronyms: [],
        otherNames: [
          "\u062C\u0627\u0645\u0639\u0629 \u0627\u0644\u062F\u0648\u0644 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
          "J\u0101mi\u02BBat ad-Duwal al-\u02BBArab\u012Byah",
          "League of Arab States"
        ]
      }
    ],
    cioc: "LIB"
  },
  {
    name: "Lesotho",
    topLevelDomain: [".ls"],
    alpha2Code: "LS",
    alpha3Code: "LSO",
    callingCodes: ["266"],
    capital: "Maseru",
    altSpellings: ["LS", "Kingdom of Lesotho", "Muso oa Lesotho"],
    region: "Africa",
    subregion: "Southern Africa",
    population: 1894194,
    latlng: [-29.5, 28.5],
    demonym: "Mosotho",
    area: 30355,
    gini: 52.5,
    timezones: ["UTC+02:00"],
    borders: ["ZAF"],
    nativeName: "Lesotho",
    numericCode: "426",
    currencies: [
      {
        code: "LSL",
        name: "Lesotho loti",
        symbol: "L"
      },
      {
        code: "ZAR",
        name: "South African rand",
        symbol: "R"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      },
      {
        iso639_1: "st",
        iso639_2: "sot",
        name: "Southern Sotho",
        nativeName: "Sesotho"
      }
    ],
    translations: {
      de: "Lesotho",
      es: "Lesotho",
      fr: "Lesotho",
      ja: "\u30EC\u30BD\u30C8",
      it: "Lesotho",
      br: "Lesoto",
      pt: "Lesoto",
      nl: "Lesotho",
      hr: "Lesoto",
      fa: "\u0644\u0633\u0648\u062A\u0648"
    },
    flag: "https://restcountries.eu/data/lso.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "LES"
  },
  {
    name: "Liberia",
    topLevelDomain: [".lr"],
    alpha2Code: "LR",
    alpha3Code: "LBR",
    callingCodes: ["231"],
    capital: "Monrovia",
    altSpellings: ["LR", "Republic of Liberia"],
    region: "Africa",
    subregion: "Western Africa",
    population: 4615e3,
    latlng: [6.5, -9.5],
    demonym: "Liberian",
    area: 111369,
    gini: 38.2,
    timezones: ["UTC"],
    borders: ["GIN", "CIV", "SLE"],
    nativeName: "Liberia",
    numericCode: "430",
    currencies: [
      {
        code: "LRD",
        name: "Liberian dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Liberia",
      es: "Liberia",
      fr: "Liberia",
      ja: "\u30EA\u30D9\u30EA\u30A2",
      it: "Liberia",
      br: "Lib\xE9ria",
      pt: "Lib\xE9ria",
      nl: "Liberia",
      hr: "Liberija",
      fa: "\u0644\u06CC\u0628\u0631\u06CC\u0627"
    },
    flag: "https://restcountries.eu/data/lbr.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "LBR"
  },
  {
    name: "Libya",
    topLevelDomain: [".ly"],
    alpha2Code: "LY",
    alpha3Code: "LBY",
    callingCodes: ["218"],
    capital: "Tripoli",
    altSpellings: ["LY", "State of Libya", "Dawlat Libya"],
    region: "Africa",
    subregion: "Northern Africa",
    population: 6385e3,
    latlng: [25, 17],
    demonym: "Libyan",
    area: 1759540,
    gini: null,
    timezones: ["UTC+01:00"],
    borders: ["DZA", "TCD", "EGY", "NER", "SDN", "TUN"],
    nativeName: "\u200F\u0644\u064A\u0628\u064A\u0627",
    numericCode: "434",
    currencies: [
      {
        code: "LYD",
        name: "Libyan dinar",
        symbol: "\u0644.\u062F"
      }
    ],
    languages: [
      {
        iso639_1: "ar",
        iso639_2: "ara",
        name: "Arabic",
        nativeName: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"
      }
    ],
    translations: {
      de: "Libyen",
      es: "Libia",
      fr: "Libye",
      ja: "\u30EA\u30D3\u30A2",
      it: "Libia",
      br: "L\xEDbia",
      pt: "L\xEDbia",
      nl: "Libi\xEB",
      hr: "Libija",
      fa: "\u0644\u06CC\u0628\u06CC"
    },
    flag: "https://restcountries.eu/data/lby.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      },
      {
        acronym: "AL",
        name: "Arab League",
        otherAcronyms: [],
        otherNames: [
          "\u062C\u0627\u0645\u0639\u0629 \u0627\u0644\u062F\u0648\u0644 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
          "J\u0101mi\u02BBat ad-Duwal al-\u02BBArab\u012Byah",
          "League of Arab States"
        ]
      }
    ],
    cioc: "LBA"
  },
  {
    name: "Liechtenstein",
    topLevelDomain: [".li"],
    alpha2Code: "LI",
    alpha3Code: "LIE",
    callingCodes: ["423"],
    capital: "Vaduz",
    altSpellings: [
      "LI",
      "Principality of Liechtenstein",
      "F\xFCrstentum Liechtenstein"
    ],
    region: "Europe",
    subregion: "Western Europe",
    population: 37623,
    latlng: [47.26666666, 9.53333333],
    demonym: "Liechtensteiner",
    area: 160,
    gini: null,
    timezones: ["UTC+01:00"],
    borders: ["AUT", "CHE"],
    nativeName: "Liechtenstein",
    numericCode: "438",
    currencies: [
      {
        code: "CHF",
        name: "Swiss franc",
        symbol: "Fr"
      }
    ],
    languages: [
      {
        iso639_1: "de",
        iso639_2: "deu",
        name: "German",
        nativeName: "Deutsch"
      }
    ],
    translations: {
      de: "Liechtenstein",
      es: "Liechtenstein",
      fr: "Liechtenstein",
      ja: "\u30EA\u30D2\u30C6\u30F3\u30B7\u30E5\u30BF\u30A4\u30F3",
      it: "Liechtenstein",
      br: "Liechtenstein",
      pt: "Listenstaine",
      nl: "Liechtenstein",
      hr: "Lihten\u0161tajn",
      fa: "\u0644\u06CC\u062E\u062A\u0646\u200C\u0627\u0634\u062A\u0627\u06CC\u0646"
    },
    flag: "https://restcountries.eu/data/lie.svg",
    regionalBlocs: [
      {
        acronym: "EFTA",
        name: "European Free Trade Association",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "LIE"
  },
  {
    name: "Lithuania",
    topLevelDomain: [".lt"],
    alpha2Code: "LT",
    alpha3Code: "LTU",
    callingCodes: ["370"],
    capital: "Vilnius",
    altSpellings: ["LT", "Republic of Lithuania", "Lietuvos Respublika"],
    region: "Europe",
    subregion: "Northern Europe",
    population: 2872294,
    latlng: [56, 24],
    demonym: "Lithuanian",
    area: 65300,
    gini: 37.6,
    timezones: ["UTC+02:00"],
    borders: ["BLR", "LVA", "POL", "RUS"],
    nativeName: "Lietuva",
    numericCode: "440",
    currencies: [
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      }
    ],
    languages: [
      {
        iso639_1: "lt",
        iso639_2: "lit",
        name: "Lithuanian",
        nativeName: "lietuvi\u0173 kalba"
      }
    ],
    translations: {
      de: "Litauen",
      es: "Lituania",
      fr: "Lituanie",
      ja: "\u30EA\u30C8\u30A2\u30CB\u30A2",
      it: "Lituania",
      br: "Litu\xE2nia",
      pt: "Litu\xE2nia",
      nl: "Litouwen",
      hr: "Litva",
      fa: "\u0644\u06CC\u062A\u0648\u0627\u0646\u06CC"
    },
    flag: "https://restcountries.eu/data/ltu.svg",
    regionalBlocs: [
      {
        acronym: "EU",
        name: "European Union",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "LTU"
  },
  {
    name: "Luxembourg",
    topLevelDomain: [".lu"],
    alpha2Code: "LU",
    alpha3Code: "LUX",
    callingCodes: ["352"],
    capital: "Luxembourg",
    altSpellings: [
      "LU",
      "Grand Duchy of Luxembourg",
      "Grand-Duch\xE9 de Luxembourg",
      "Gro\xDFherzogtum Luxemburg",
      "Groussherzogtum L\xEBtzebuerg"
    ],
    region: "Europe",
    subregion: "Western Europe",
    population: 576200,
    latlng: [49.75, 6.16666666],
    demonym: "Luxembourger",
    area: 2586,
    gini: 30.8,
    timezones: ["UTC+01:00"],
    borders: ["BEL", "FRA", "DEU"],
    nativeName: "Luxembourg",
    numericCode: "442",
    currencies: [
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      }
    ],
    languages: [
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      },
      {
        iso639_1: "de",
        iso639_2: "deu",
        name: "German",
        nativeName: "Deutsch"
      },
      {
        iso639_1: "lb",
        iso639_2: "ltz",
        name: "Luxembourgish",
        nativeName: "L\xEBtzebuergesch"
      }
    ],
    translations: {
      de: "Luxemburg",
      es: "Luxemburgo",
      fr: "Luxembourg",
      ja: "\u30EB\u30AF\u30BB\u30F3\u30D6\u30EB\u30AF",
      it: "Lussemburgo",
      br: "Luxemburgo",
      pt: "Luxemburgo",
      nl: "Luxemburg",
      hr: "Luksemburg",
      fa: "\u0644\u0648\u06A9\u0632\u0627\u0645\u0628\u0648\u0631\u06AF"
    },
    flag: "https://restcountries.eu/data/lux.svg",
    regionalBlocs: [
      {
        acronym: "EU",
        name: "European Union",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "LUX"
  },
  {
    name: "Macao",
    topLevelDomain: [".mo"],
    alpha2Code: "MO",
    alpha3Code: "MAC",
    callingCodes: ["853"],
    capital: "",
    altSpellings: [
      "MO",
      "\u6FB3\u95E8",
      "Macao Special Administrative Region of the People's Republic of China",
      "\u4E2D\u83EF\u4EBA\u6C11\u5171\u548C\u570B\u6FB3\u9580\u7279\u5225\u884C\u653F\u5340",
      "Regi\xE3o Administrativa Especial de Macau da Rep\xFAblica Popular da China"
    ],
    region: "Asia",
    subregion: "Eastern Asia",
    population: 649100,
    latlng: [22.16666666, 113.55],
    demonym: "Chinese",
    area: 30,
    gini: null,
    timezones: ["UTC+08:00"],
    borders: ["CHN"],
    nativeName: "\u6FB3\u9580",
    numericCode: "446",
    currencies: [
      {
        code: "MOP",
        name: "Macanese pataca",
        symbol: "P"
      }
    ],
    languages: [
      {
        iso639_1: "zh",
        iso639_2: "zho",
        name: "Chinese",
        nativeName: "\u4E2D\u6587 (Zh\u014Dngw\xE9n)"
      },
      {
        iso639_1: "pt",
        iso639_2: "por",
        name: "Portuguese",
        nativeName: "Portugu\xEAs"
      }
    ],
    translations: {
      de: "Macao",
      es: "Macao",
      fr: "Macao",
      ja: "\u30DE\u30AB\u30AA",
      it: "Macao",
      br: "Macau",
      pt: "Macau",
      nl: "Macao",
      hr: "Makao",
      fa: "\u0645\u06A9\u0627\u0626\u0648"
    },
    flag: "https://restcountries.eu/data/mac.svg",
    regionalBlocs: [],
    cioc: ""
  },
  {
    name: "Macedonia (the former Yugoslav Republic of)",
    topLevelDomain: [".mk"],
    alpha2Code: "MK",
    alpha3Code: "MKD",
    callingCodes: ["389"],
    capital: "Skopje",
    altSpellings: ["MK", "Republic of Macedonia", "\u0420\u0435\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041C\u0430\u043A\u0435\u0434\u043E\u043D\u0438\u0458\u0430"],
    region: "Europe",
    subregion: "Southern Europe",
    population: 2058539,
    latlng: [41.83333333, 22],
    demonym: "Macedonian",
    area: 25713,
    gini: 43.2,
    timezones: ["UTC+01:00"],
    borders: ["ALB", "BGR", "GRC", "KOS", "SRB"],
    nativeName: "\u041C\u0430\u043A\u0435\u0434\u043E\u043D\u0438\u0458\u0430",
    numericCode: "807",
    currencies: [
      {
        code: "MKD",
        name: "Macedonian denar",
        symbol: "\u0434\u0435\u043D"
      }
    ],
    languages: [
      {
        iso639_1: "mk",
        iso639_2: "mkd",
        name: "Macedonian",
        nativeName: "\u043C\u0430\u043A\u0435\u0434\u043E\u043D\u0441\u043A\u0438 \u0458\u0430\u0437\u0438\u043A"
      }
    ],
    translations: {
      de: "Mazedonien",
      es: "Macedonia",
      fr: "Mac\xE9doine",
      ja: "\u30DE\u30B1\u30C9\u30CB\u30A2\u65E7\u30E6\u30FC\u30B4\u30B9\u30E9\u30D3\u30A2\u5171\u548C\u56FD",
      it: "Macedonia",
      br: "Maced\xF4nia",
      pt: "Maced\xF3nia",
      nl: "Macedoni\xEB",
      hr: "Makedonija",
      fa: ""
    },
    flag: "https://restcountries.eu/data/mkd.svg",
    regionalBlocs: [
      {
        acronym: "CEFTA",
        name: "Central European Free Trade Agreement",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "MKD"
  },
  {
    name: "Madagascar",
    topLevelDomain: [".mg"],
    alpha2Code: "MG",
    alpha3Code: "MDG",
    callingCodes: ["261"],
    capital: "Antananarivo",
    altSpellings: [
      "MG",
      "Republic of Madagascar",
      "Repoblikan'i Madagasikara",
      "R\xE9publique de Madagascar"
    ],
    region: "Africa",
    subregion: "Eastern Africa",
    population: 22434363,
    latlng: [-20, 47],
    demonym: "Malagasy",
    area: 587041,
    gini: 44.1,
    timezones: ["UTC+03:00"],
    borders: [],
    nativeName: "Madagasikara",
    numericCode: "450",
    currencies: [
      {
        code: "MGA",
        name: "Malagasy ariary",
        symbol: "Ar"
      }
    ],
    languages: [
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      },
      {
        iso639_1: "mg",
        iso639_2: "mlg",
        name: "Malagasy",
        nativeName: "fiteny malagasy"
      }
    ],
    translations: {
      de: "Madagaskar",
      es: "Madagascar",
      fr: "Madagascar",
      ja: "\u30DE\u30C0\u30AC\u30B9\u30AB\u30EB",
      it: "Madagascar",
      br: "Madagascar",
      pt: "Madag\xE1scar",
      nl: "Madagaskar",
      hr: "Madagaskar",
      fa: "\u0645\u0627\u062F\u0627\u06AF\u0627\u0633\u06A9\u0627\u0631"
    },
    flag: "https://restcountries.eu/data/mdg.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "MAD"
  },
  {
    name: "Malawi",
    topLevelDomain: [".mw"],
    alpha2Code: "MW",
    alpha3Code: "MWI",
    callingCodes: ["265"],
    capital: "Lilongwe",
    altSpellings: ["MW", "Republic of Malawi"],
    region: "Africa",
    subregion: "Eastern Africa",
    population: 16832910,
    latlng: [-13.5, 34],
    demonym: "Malawian",
    area: 118484,
    gini: 39,
    timezones: ["UTC+02:00"],
    borders: ["MOZ", "TZA", "ZMB"],
    nativeName: "Malawi",
    numericCode: "454",
    currencies: [
      {
        code: "MWK",
        name: "Malawian kwacha",
        symbol: "MK"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      },
      {
        iso639_1: "ny",
        iso639_2: "nya",
        name: "Chichewa",
        nativeName: "chiChe\u0175a"
      }
    ],
    translations: {
      de: "Malawi",
      es: "Malawi",
      fr: "Malawi",
      ja: "\u30DE\u30E9\u30A6\u30A4",
      it: "Malawi",
      br: "Malawi",
      pt: "Mal\xE1vi",
      nl: "Malawi",
      hr: "Malavi",
      fa: "\u0645\u0627\u0644\u0627\u0648\u06CC"
    },
    flag: "https://restcountries.eu/data/mwi.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "MAW"
  },
  {
    name: "Malaysia",
    topLevelDomain: [".my"],
    alpha2Code: "MY",
    alpha3Code: "MYS",
    callingCodes: ["60"],
    capital: "Kuala Lumpur",
    altSpellings: ["MY"],
    region: "Asia",
    subregion: "South-Eastern Asia",
    population: 31405416,
    latlng: [2.5, 112.5],
    demonym: "Malaysian",
    area: 330803,
    gini: 46.2,
    timezones: ["UTC+08:00"],
    borders: ["BRN", "IDN", "THA"],
    nativeName: "Malaysia",
    numericCode: "458",
    currencies: [
      {
        code: "MYR",
        name: "Malaysian ringgit",
        symbol: "RM"
      }
    ],
    languages: [
      {
        iso639_1: null,
        iso639_2: "zsm",
        name: "Malaysian",
        nativeName: "\u0628\u0647\u0627\u0633 \u0645\u0644\u064A\u0633\u064A\u0627"
      }
    ],
    translations: {
      de: "Malaysia",
      es: "Malasia",
      fr: "Malaisie",
      ja: "\u30DE\u30EC\u30FC\u30B7\u30A2",
      it: "Malesia",
      br: "Mal\xE1sia",
      pt: "Mal\xE1sia",
      nl: "Maleisi\xEB",
      hr: "Malezija",
      fa: "\u0645\u0627\u0644\u0632\u06CC"
    },
    flag: "https://restcountries.eu/data/mys.svg",
    regionalBlocs: [
      {
        acronym: "ASEAN",
        name: "Association of Southeast Asian Nations",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "MAS"
  },
  {
    name: "Maldives",
    topLevelDomain: [".mv"],
    alpha2Code: "MV",
    alpha3Code: "MDV",
    callingCodes: ["960"],
    capital: "Mal\xE9",
    altSpellings: [
      "MV",
      "Maldive Islands",
      "Republic of the Maldives",
      "Dhivehi Raajjeyge Jumhooriyya"
    ],
    region: "Asia",
    subregion: "Southern Asia",
    population: 344023,
    latlng: [3.25, 73],
    demonym: "Maldivan",
    area: 300,
    gini: 37.4,
    timezones: ["UTC+05:00"],
    borders: [],
    nativeName: "Maldives",
    numericCode: "462",
    currencies: [
      {
        code: "MVR",
        name: "Maldivian rufiyaa",
        symbol: ".\u0783"
      }
    ],
    languages: [
      {
        iso639_1: "dv",
        iso639_2: "div",
        name: "Divehi",
        nativeName: "\u078B\u07A8\u0788\u07AC\u0780\u07A8"
      }
    ],
    translations: {
      de: "Malediven",
      es: "Maldivas",
      fr: "Maldives",
      ja: "\u30E2\u30EB\u30C7\u30A3\u30D6",
      it: "Maldive",
      br: "Maldivas",
      pt: "Maldivas",
      nl: "Maldiven",
      hr: "Maldivi",
      fa: "\u0645\u0627\u0644\u062F\u06CC\u0648"
    },
    flag: "https://restcountries.eu/data/mdv.svg",
    regionalBlocs: [
      {
        acronym: "SAARC",
        name: "South Asian Association for Regional Cooperation",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "MDV"
  },
  {
    name: "Mali",
    topLevelDomain: [".ml"],
    alpha2Code: "ML",
    alpha3Code: "MLI",
    callingCodes: ["223"],
    capital: "Bamako",
    altSpellings: ["ML", "Republic of Mali", "R\xE9publique du Mali"],
    region: "Africa",
    subregion: "Western Africa",
    population: 18135e3,
    latlng: [17, -4],
    demonym: "Malian",
    area: 1240192,
    gini: 33,
    timezones: ["UTC"],
    borders: ["DZA", "BFA", "GIN", "CIV", "MRT", "NER", "SEN"],
    nativeName: "Mali",
    numericCode: "466",
    currencies: [
      {
        code: "XOF",
        name: "West African CFA franc",
        symbol: "Fr"
      }
    ],
    languages: [
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      }
    ],
    translations: {
      de: "Mali",
      es: "Mali",
      fr: "Mali",
      ja: "\u30DE\u30EA",
      it: "Mali",
      br: "Mali",
      pt: "Mali",
      nl: "Mali",
      hr: "Mali",
      fa: "\u0645\u0627\u0644\u06CC"
    },
    flag: "https://restcountries.eu/data/mli.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "MLI"
  },
  {
    name: "Malta",
    topLevelDomain: [".mt"],
    alpha2Code: "MT",
    alpha3Code: "MLT",
    callingCodes: ["356"],
    capital: "Valletta",
    altSpellings: ["MT", "Republic of Malta", "Repubblika ta' Malta"],
    region: "Europe",
    subregion: "Southern Europe",
    population: 425384,
    latlng: [35.83333333, 14.58333333],
    demonym: "Maltese",
    area: 316,
    gini: null,
    timezones: ["UTC+01:00"],
    borders: [],
    nativeName: "Malta",
    numericCode: "470",
    currencies: [
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      }
    ],
    languages: [
      {
        iso639_1: "mt",
        iso639_2: "mlt",
        name: "Maltese",
        nativeName: "Malti"
      },
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Malta",
      es: "Malta",
      fr: "Malte",
      ja: "\u30DE\u30EB\u30BF",
      it: "Malta",
      br: "Malta",
      pt: "Malta",
      nl: "Malta",
      hr: "Malta",
      fa: "\u0645\u0627\u0644\u062A"
    },
    flag: "https://restcountries.eu/data/mlt.svg",
    regionalBlocs: [
      {
        acronym: "EU",
        name: "European Union",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "MLT"
  },
  {
    name: "Marshall Islands",
    topLevelDomain: [".mh"],
    alpha2Code: "MH",
    alpha3Code: "MHL",
    callingCodes: ["692"],
    capital: "Majuro",
    altSpellings: [
      "MH",
      "Republic of the Marshall Islands",
      "Aolep\u0101n Aor\u014Dkin M\u0327aje\u013C"
    ],
    region: "Oceania",
    subregion: "Micronesia",
    population: 54880,
    latlng: [9, 168],
    demonym: "Marshallese",
    area: 181,
    gini: null,
    timezones: ["UTC+12:00"],
    borders: [],
    nativeName: "M\u0327aje\u013C",
    numericCode: "584",
    currencies: [
      {
        code: "USD",
        name: "United States dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      },
      {
        iso639_1: "mh",
        iso639_2: "mah",
        name: "Marshallese",
        nativeName: "Kajin M\u0327aje\u013C"
      }
    ],
    translations: {
      de: "Marshallinseln",
      es: "Islas Marshall",
      fr: "\xCEles Marshall",
      ja: "\u30DE\u30FC\u30B7\u30E3\u30EB\u8AF8\u5CF6",
      it: "Isole Marshall",
      br: "Ilhas Marshall",
      pt: "Ilhas Marshall",
      nl: "Marshalleilanden",
      hr: "Mar\u0161alovi Otoci",
      fa: "\u062C\u0632\u0627\u06CC\u0631 \u0645\u0627\u0631\u0634\u0627\u0644"
    },
    flag: "https://restcountries.eu/data/mhl.svg",
    regionalBlocs: [],
    cioc: "MHL"
  },
  {
    name: "Martinique",
    topLevelDomain: [".mq"],
    alpha2Code: "MQ",
    alpha3Code: "MTQ",
    callingCodes: ["596"],
    capital: "Fort-de-France",
    altSpellings: ["MQ"],
    region: "Americas",
    subregion: "Caribbean",
    population: 378243,
    latlng: [14.666667, -61],
    demonym: "French",
    area: null,
    gini: null,
    timezones: ["UTC-04:00"],
    borders: [],
    nativeName: "Martinique",
    numericCode: "474",
    currencies: [
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      }
    ],
    languages: [
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      }
    ],
    translations: {
      de: "Martinique",
      es: "Martinica",
      fr: "Martinique",
      ja: "\u30DE\u30EB\u30C6\u30A3\u30CB\u30FC\u30AF",
      it: "Martinica",
      br: "Martinica",
      pt: "Martinica",
      nl: "Martinique",
      hr: "Martinique",
      fa: "\u0645\u0648\u0646\u062A\u0633\u0631\u0627\u062A"
    },
    flag: "https://restcountries.eu/data/mtq.svg",
    regionalBlocs: [],
    cioc: ""
  },
  {
    name: "Mauritania",
    topLevelDomain: [".mr"],
    alpha2Code: "MR",
    alpha3Code: "MRT",
    callingCodes: ["222"],
    capital: "Nouakchott",
    altSpellings: [
      "MR",
      "Islamic Republic of Mauritania",
      "al-Jumh\u016Briyyah al-\u02BEIsl\u0101miyyah al-M\u016Br\u012Bt\u0101niyyah"
    ],
    region: "Africa",
    subregion: "Western Africa",
    population: 3718678,
    latlng: [20, -12],
    demonym: "Mauritanian",
    area: 1030700,
    gini: 40.5,
    timezones: ["UTC"],
    borders: ["DZA", "MLI", "SEN", "ESH"],
    nativeName: "\u0645\u0648\u0631\u064A\u062A\u0627\u0646\u064A\u0627",
    numericCode: "478",
    currencies: [
      {
        code: "MRO",
        name: "Mauritanian ouguiya",
        symbol: "UM"
      }
    ],
    languages: [
      {
        iso639_1: "ar",
        iso639_2: "ara",
        name: "Arabic",
        nativeName: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"
      }
    ],
    translations: {
      de: "Mauretanien",
      es: "Mauritania",
      fr: "Mauritanie",
      ja: "\u30E2\u30FC\u30EA\u30BF\u30CB\u30A2",
      it: "Mauritania",
      br: "Maurit\xE2nia",
      pt: "Maurit\xE2nia",
      nl: "Mauritani\xEB",
      hr: "Mauritanija",
      fa: "\u0645\u0648\u0631\u06CC\u062A\u0627\u0646\u06CC"
    },
    flag: "https://restcountries.eu/data/mrt.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      },
      {
        acronym: "AL",
        name: "Arab League",
        otherAcronyms: [],
        otherNames: [
          "\u062C\u0627\u0645\u0639\u0629 \u0627\u0644\u062F\u0648\u0644 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
          "J\u0101mi\u02BBat ad-Duwal al-\u02BBArab\u012Byah",
          "League of Arab States"
        ]
      }
    ],
    cioc: "MTN"
  },
  {
    name: "Mauritius",
    topLevelDomain: [".mu"],
    alpha2Code: "MU",
    alpha3Code: "MUS",
    callingCodes: ["230"],
    capital: "Port Louis",
    altSpellings: ["MU", "Republic of Mauritius", "R\xE9publique de Maurice"],
    region: "Africa",
    subregion: "Eastern Africa",
    population: 1262879,
    latlng: [-20.28333333, 57.55],
    demonym: "Mauritian",
    area: 2040,
    gini: null,
    timezones: ["UTC+04:00"],
    borders: [],
    nativeName: "Maurice",
    numericCode: "480",
    currencies: [
      {
        code: "MUR",
        name: "Mauritian rupee",
        symbol: "\u20A8"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Mauritius",
      es: "Mauricio",
      fr: "\xCEle Maurice",
      ja: "\u30E2\u30FC\u30EA\u30B7\u30E3\u30B9",
      it: "Mauritius",
      br: "Maur\xEDcio",
      pt: "Maur\xEDcia",
      nl: "Mauritius",
      hr: "Mauricijus",
      fa: "\u0645\u0648\u0631\u06CC\u0633"
    },
    flag: "https://restcountries.eu/data/mus.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "MRI"
  },
  {
    name: "Mayotte",
    topLevelDomain: [".yt"],
    alpha2Code: "YT",
    alpha3Code: "MYT",
    callingCodes: ["262"],
    capital: "Mamoudzou",
    altSpellings: ["YT", "Department of Mayotte", "D\xE9partement de Mayotte"],
    region: "Africa",
    subregion: "Eastern Africa",
    population: 226915,
    latlng: [-12.83333333, 45.16666666],
    demonym: "French",
    area: null,
    gini: null,
    timezones: ["UTC+03:00"],
    borders: [],
    nativeName: "Mayotte",
    numericCode: "175",
    currencies: [
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      }
    ],
    languages: [
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      }
    ],
    translations: {
      de: "Mayotte",
      es: "Mayotte",
      fr: "Mayotte",
      ja: "\u30DE\u30E8\u30C3\u30C8",
      it: "Mayotte",
      br: "Mayotte",
      pt: "Mayotte",
      nl: "Mayotte",
      hr: "Mayotte",
      fa: "\u0645\u0627\u06CC\u0648\u062A"
    },
    flag: "https://restcountries.eu/data/myt.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: ""
  },
  {
    name: "Mexico",
    topLevelDomain: [".mx"],
    alpha2Code: "MX",
    alpha3Code: "MEX",
    callingCodes: ["52"],
    capital: "Mexico City",
    altSpellings: [
      "MX",
      "Mexicanos",
      "United Mexican States",
      "Estados Unidos Mexicanos"
    ],
    region: "Americas",
    subregion: "Central America",
    population: 122273473,
    latlng: [23, -102],
    demonym: "Mexican",
    area: 1964375,
    gini: 47,
    timezones: ["UTC-08:00", "UTC-07:00", "UTC-06:00"],
    borders: ["BLZ", "GTM", "USA"],
    nativeName: "M\xE9xico",
    numericCode: "484",
    currencies: [
      {
        code: "MXN",
        name: "Mexican peso",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "es",
        iso639_2: "spa",
        name: "Spanish",
        nativeName: "Espa\xF1ol"
      }
    ],
    translations: {
      de: "Mexiko",
      es: "M\xE9xico",
      fr: "Mexique",
      ja: "\u30E1\u30AD\u30B7\u30B3",
      it: "Messico",
      br: "M\xE9xico",
      pt: "M\xE9xico",
      nl: "Mexico",
      hr: "Meksiko",
      fa: "\u0645\u06A9\u0632\u06CC\u06A9"
    },
    flag: "https://restcountries.eu/data/mex.svg",
    regionalBlocs: [
      {
        acronym: "PA",
        name: "Pacific Alliance",
        otherAcronyms: [],
        otherNames: ["Alianza del Pac\xEDfico"]
      },
      {
        acronym: "NAFTA",
        name: "North American Free Trade Agreement",
        otherAcronyms: [],
        otherNames: [
          "Tratado de Libre Comercio de Am\xE9rica del Norte",
          "Accord de Libre-\xE9change Nord-Am\xE9ricain"
        ]
      }
    ],
    cioc: "MEX"
  },
  {
    name: "Micronesia (Federated States of)",
    topLevelDomain: [".fm"],
    alpha2Code: "FM",
    alpha3Code: "FSM",
    callingCodes: ["691"],
    capital: "Palikir",
    altSpellings: ["FM", "Federated States of Micronesia"],
    region: "Oceania",
    subregion: "Micronesia",
    population: 102800,
    latlng: [6.91666666, 158.25],
    demonym: "Micronesian",
    area: 702,
    gini: null,
    timezones: ["UTC+10:00", "UTC+11"],
    borders: [],
    nativeName: "Micronesia",
    numericCode: "583",
    currencies: [
      {
        code: null,
        name: "[D]",
        symbol: "$"
      },
      {
        code: "USD",
        name: "United States dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Mikronesien",
      es: "Micronesia",
      fr: "Micron\xE9sie",
      ja: "\u30DF\u30AF\u30ED\u30CD\u30B7\u30A2\u9023\u90A6",
      it: "Micronesia",
      br: "Micron\xE9sia",
      pt: "Micron\xE9sia",
      nl: "Micronesi\xEB",
      hr: "Mikronezija",
      fa: "\u0627\u06CC\u0627\u0644\u0627\u062A \u0641\u062F\u0631\u0627\u0644 \u0645\u06CC\u06A9\u0631\u0648\u0646\u0632\u06CC"
    },
    flag: "https://restcountries.eu/data/fsm.svg",
    regionalBlocs: [],
    cioc: "FSM"
  },
  {
    name: "Moldova (Republic of)",
    topLevelDomain: [".md"],
    alpha2Code: "MD",
    alpha3Code: "MDA",
    callingCodes: ["373"],
    capital: "Chi\u0219in\u0103u",
    altSpellings: ["MD", "Republic of Moldova", "Republica Moldova"],
    region: "Europe",
    subregion: "Eastern Europe",
    population: 3553100,
    latlng: [47, 29],
    demonym: "Moldovan",
    area: 33846,
    gini: 33,
    timezones: ["UTC+02:00"],
    borders: ["ROU", "UKR"],
    nativeName: "Moldova",
    numericCode: "498",
    currencies: [
      {
        code: "MDL",
        name: "Moldovan leu",
        symbol: "L"
      }
    ],
    languages: [
      {
        iso639_1: "ro",
        iso639_2: "ron",
        name: "Romanian",
        nativeName: "Rom\xE2n\u0103"
      }
    ],
    translations: {
      de: "Moldawie",
      es: "Moldavia",
      fr: "Moldavie",
      ja: "\u30E2\u30EB\u30C9\u30D0\u5171\u548C\u56FD",
      it: "Moldavia",
      br: "Mold\xE1via",
      pt: "Mold\xE1via",
      nl: "Moldavi\xEB",
      hr: "Moldova",
      fa: "\u0645\u0648\u0644\u062F\u0627\u0648\u06CC"
    },
    flag: "https://restcountries.eu/data/mda.svg",
    regionalBlocs: [
      {
        acronym: "CEFTA",
        name: "Central European Free Trade Agreement",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "MDA"
  },
  {
    name: "Monaco",
    topLevelDomain: [".mc"],
    alpha2Code: "MC",
    alpha3Code: "MCO",
    callingCodes: ["377"],
    capital: "Monaco",
    altSpellings: ["MC", "Principality of Monaco", "Principaut\xE9 de Monaco"],
    region: "Europe",
    subregion: "Western Europe",
    population: 38400,
    latlng: [43.73333333, 7.4],
    demonym: "Monegasque",
    area: 2.02,
    gini: null,
    timezones: ["UTC+01:00"],
    borders: ["FRA"],
    nativeName: "Monaco",
    numericCode: "492",
    currencies: [
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      }
    ],
    languages: [
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      }
    ],
    translations: {
      de: "Monaco",
      es: "M\xF3naco",
      fr: "Monaco",
      ja: "\u30E2\u30CA\u30B3",
      it: "Principato di Monaco",
      br: "M\xF4naco",
      pt: "M\xF3naco",
      nl: "Monaco",
      hr: "Monako",
      fa: "\u0645\u0648\u0646\u0627\u06A9\u0648"
    },
    flag: "https://restcountries.eu/data/mco.svg",
    regionalBlocs: [],
    cioc: "MON"
  },
  {
    name: "Mongolia",
    topLevelDomain: [".mn"],
    alpha2Code: "MN",
    alpha3Code: "MNG",
    callingCodes: ["976"],
    capital: "Ulan Bator",
    altSpellings: ["MN"],
    region: "Asia",
    subregion: "Eastern Asia",
    population: 3093100,
    latlng: [46, 105],
    demonym: "Mongolian",
    area: 1564110,
    gini: 36.5,
    timezones: ["UTC+07:00", "UTC+08:00"],
    borders: ["CHN", "RUS"],
    nativeName: "\u041C\u043E\u043D\u0433\u043E\u043B \u0443\u043B\u0441",
    numericCode: "496",
    currencies: [
      {
        code: "MNT",
        name: "Mongolian t\xF6gr\xF6g",
        symbol: "\u20AE"
      }
    ],
    languages: [
      {
        iso639_1: "mn",
        iso639_2: "mon",
        name: "Mongolian",
        nativeName: "\u041C\u043E\u043D\u0433\u043E\u043B \u0445\u044D\u043B"
      }
    ],
    translations: {
      de: "Mongolei",
      es: "Mongolia",
      fr: "Mongolie",
      ja: "\u30E2\u30F3\u30B4\u30EB",
      it: "Mongolia",
      br: "Mong\xF3lia",
      pt: "Mong\xF3lia",
      nl: "Mongoli\xEB",
      hr: "Mongolija",
      fa: "\u0645\u063A\u0648\u0644\u0633\u062A\u0627\u0646"
    },
    flag: "https://restcountries.eu/data/mng.svg",
    regionalBlocs: [],
    cioc: "MGL"
  },
  {
    name: "Montenegro",
    topLevelDomain: [".me"],
    alpha2Code: "ME",
    alpha3Code: "MNE",
    callingCodes: ["382"],
    capital: "Podgorica",
    altSpellings: ["ME", "Crna Gora"],
    region: "Europe",
    subregion: "Southern Europe",
    population: 621810,
    latlng: [42.5, 19.3],
    demonym: "Montenegrin",
    area: 13812,
    gini: 30,
    timezones: ["UTC+01:00"],
    borders: ["ALB", "BIH", "HRV", "KOS", "SRB"],
    nativeName: "\u0426\u0440\u043D\u0430 \u0413\u043E\u0440\u0430",
    numericCode: "499",
    currencies: [
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      }
    ],
    languages: [
      {
        iso639_1: "sr",
        iso639_2: "srp",
        name: "Serbian",
        nativeName: "\u0441\u0440\u043F\u0441\u043A\u0438 \u0458\u0435\u0437\u0438\u043A"
      },
      {
        iso639_1: "bs",
        iso639_2: "bos",
        name: "Bosnian",
        nativeName: "bosanski jezik"
      },
      {
        iso639_1: "sq",
        iso639_2: "sqi",
        name: "Albanian",
        nativeName: "Shqip"
      },
      {
        iso639_1: "hr",
        iso639_2: "hrv",
        name: "Croatian",
        nativeName: "hrvatski jezik"
      }
    ],
    translations: {
      de: "Montenegro",
      es: "Montenegro",
      fr: "Mont\xE9n\xE9gro",
      ja: "\u30E2\u30F3\u30C6\u30CD\u30B0\u30ED",
      it: "Montenegro",
      br: "Montenegro",
      pt: "Montenegro",
      nl: "Montenegro",
      hr: "Crna Gora",
      fa: "\u0645\u0648\u0646\u062A\u0647\u200C\u0646\u06AF\u0631\u0648"
    },
    flag: "https://restcountries.eu/data/mne.svg",
    regionalBlocs: [
      {
        acronym: "CEFTA",
        name: "Central European Free Trade Agreement",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "MNE"
  },
  {
    name: "Montserrat",
    topLevelDomain: [".ms"],
    alpha2Code: "MS",
    alpha3Code: "MSR",
    callingCodes: ["1664"],
    capital: "Plymouth",
    altSpellings: ["MS"],
    region: "Americas",
    subregion: "Caribbean",
    population: 4922,
    latlng: [16.75, -62.2],
    demonym: "Montserratian",
    area: 102,
    gini: null,
    timezones: ["UTC-04:00"],
    borders: [],
    nativeName: "Montserrat",
    numericCode: "500",
    currencies: [
      {
        code: "XCD",
        name: "East Caribbean dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Montserrat",
      es: "Montserrat",
      fr: "Montserrat",
      ja: "\u30E2\u30F3\u30C8\u30BB\u30E9\u30C8",
      it: "Montserrat",
      br: "Montserrat",
      pt: "Monserrate",
      nl: "Montserrat",
      hr: "Montserrat",
      fa: "\u0645\u0627\u06CC\u0648\u062A"
    },
    flag: "https://restcountries.eu/data/msr.svg",
    regionalBlocs: [
      {
        acronym: "CARICOM",
        name: "Caribbean Community",
        otherAcronyms: [],
        otherNames: [
          "Comunidad del Caribe",
          "Communaut\xE9 Carib\xE9enne",
          "Caribische Gemeenschap"
        ]
      }
    ],
    cioc: ""
  },
  {
    name: "Morocco",
    topLevelDomain: [".ma"],
    alpha2Code: "MA",
    alpha3Code: "MAR",
    callingCodes: ["212"],
    capital: "Rabat",
    altSpellings: ["MA", "Kingdom of Morocco", "Al-Mamlakah al-Ma\u0121ribiyah"],
    region: "Africa",
    subregion: "Northern Africa",
    population: 33337529,
    latlng: [32, -5],
    demonym: "Moroccan",
    area: 446550,
    gini: 40.9,
    timezones: ["UTC"],
    borders: ["DZA", "ESH", "ESP"],
    nativeName: "\u0627\u0644\u0645\u063A\u0631\u0628",
    numericCode: "504",
    currencies: [
      {
        code: "MAD",
        name: "Moroccan dirham",
        symbol: "\u062F.\u0645."
      }
    ],
    languages: [
      {
        iso639_1: "ar",
        iso639_2: "ara",
        name: "Arabic",
        nativeName: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"
      }
    ],
    translations: {
      de: "Marokko",
      es: "Marruecos",
      fr: "Maroc",
      ja: "\u30E2\u30ED\u30C3\u30B3",
      it: "Marocco",
      br: "Marrocos",
      pt: "Marrocos",
      nl: "Marokko",
      hr: "Maroko",
      fa: "\u0645\u0631\u0627\u06A9\u0634"
    },
    flag: "https://restcountries.eu/data/mar.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      },
      {
        acronym: "AL",
        name: "Arab League",
        otherAcronyms: [],
        otherNames: [
          "\u062C\u0627\u0645\u0639\u0629 \u0627\u0644\u062F\u0648\u0644 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
          "J\u0101mi\u02BBat ad-Duwal al-\u02BBArab\u012Byah",
          "League of Arab States"
        ]
      }
    ],
    cioc: "MAR"
  },
  {
    name: "Mozambique",
    topLevelDomain: [".mz"],
    alpha2Code: "MZ",
    alpha3Code: "MOZ",
    callingCodes: ["258"],
    capital: "Maputo",
    altSpellings: ["MZ", "Republic of Mozambique", "Rep\xFAblica de Mo\xE7ambique"],
    region: "Africa",
    subregion: "Eastern Africa",
    population: 26423700,
    latlng: [-18.25, 35],
    demonym: "Mozambican",
    area: 801590,
    gini: 45.7,
    timezones: ["UTC+02:00"],
    borders: ["MWI", "ZAF", "SWZ", "TZA", "ZMB", "ZWE"],
    nativeName: "Mo\xE7ambique",
    numericCode: "508",
    currencies: [
      {
        code: "MZN",
        name: "Mozambican metical",
        symbol: "MT"
      }
    ],
    languages: [
      {
        iso639_1: "pt",
        iso639_2: "por",
        name: "Portuguese",
        nativeName: "Portugu\xEAs"
      }
    ],
    translations: {
      de: "Mosambik",
      es: "Mozambique",
      fr: "Mozambique",
      ja: "\u30E2\u30B6\u30F3\u30D3\u30FC\u30AF",
      it: "Mozambico",
      br: "Mo\xE7ambique",
      pt: "Mo\xE7ambique",
      nl: "Mozambique",
      hr: "Mozambik",
      fa: "\u0645\u0648\u0632\u0627\u0645\u0628\u06CC\u06A9"
    },
    flag: "https://restcountries.eu/data/moz.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "MOZ"
  },
  {
    name: "Myanmar",
    topLevelDomain: [".mm"],
    alpha2Code: "MM",
    alpha3Code: "MMR",
    callingCodes: ["95"],
    capital: "Naypyidaw",
    altSpellings: [
      "MM",
      "Burma",
      "Republic of the Union of Myanmar",
      "Pyidaunzu Thanm\u0103da My\u0103ma Nainngandaw"
    ],
    region: "Asia",
    subregion: "South-Eastern Asia",
    population: 51419420,
    latlng: [22, 98],
    demonym: "Burmese",
    area: 676578,
    gini: null,
    timezones: ["UTC+06:30"],
    borders: ["BGD", "CHN", "IND", "LAO", "THA"],
    nativeName: "Myanma",
    numericCode: "104",
    currencies: [
      {
        code: "MMK",
        name: "Burmese kyat",
        symbol: "Ks"
      }
    ],
    languages: [
      {
        iso639_1: "my",
        iso639_2: "mya",
        name: "Burmese",
        nativeName: "\u1017\u1019\u102C\u1005\u102C"
      }
    ],
    translations: {
      de: "Myanmar",
      es: "Myanmar",
      fr: "Myanmar",
      ja: "\u30DF\u30E3\u30F3\u30DE\u30FC",
      it: "Birmania",
      br: "Myanmar",
      pt: "Myanmar",
      nl: "Myanmar",
      hr: "Mijanmar",
      fa: "\u0645\u06CC\u0627\u0646\u0645\u0627\u0631"
    },
    flag: "https://restcountries.eu/data/mmr.svg",
    regionalBlocs: [
      {
        acronym: "ASEAN",
        name: "Association of Southeast Asian Nations",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "MYA"
  },
  {
    name: "Namibia",
    topLevelDomain: [".na"],
    alpha2Code: "NA",
    alpha3Code: "NAM",
    callingCodes: ["264"],
    capital: "Windhoek",
    altSpellings: ["NA", "Namibi\xEB", "Republic of Namibia"],
    region: "Africa",
    subregion: "Southern Africa",
    population: 2324388,
    latlng: [-22, 17],
    demonym: "Namibian",
    area: 825615,
    gini: 63.9,
    timezones: ["UTC+01:00"],
    borders: ["AGO", "BWA", "ZAF", "ZMB"],
    nativeName: "Namibia",
    numericCode: "516",
    currencies: [
      {
        code: "NAD",
        name: "Namibian dollar",
        symbol: "$"
      },
      {
        code: "ZAR",
        name: "South African rand",
        symbol: "R"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      },
      {
        iso639_1: "af",
        iso639_2: "afr",
        name: "Afrikaans",
        nativeName: "Afrikaans"
      }
    ],
    translations: {
      de: "Namibia",
      es: "Namibia",
      fr: "Namibie",
      ja: "\u30CA\u30DF\u30D3\u30A2",
      it: "Namibia",
      br: "Nam\xEDbia",
      pt: "Nam\xEDbia",
      nl: "Namibi\xEB",
      hr: "Namibija",
      fa: "\u0646\u0627\u0645\u06CC\u0628\u06CC\u0627"
    },
    flag: "https://restcountries.eu/data/nam.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "NAM"
  },
  {
    name: "Nauru",
    topLevelDomain: [".nr"],
    alpha2Code: "NR",
    alpha3Code: "NRU",
    callingCodes: ["674"],
    capital: "Yaren",
    altSpellings: [
      "NR",
      "Naoero",
      "Pleasant Island",
      "Republic of Nauru",
      "Ripublik Naoero"
    ],
    region: "Oceania",
    subregion: "Micronesia",
    population: 10084,
    latlng: [-0.53333333, 166.91666666],
    demonym: "Nauruan",
    area: 21,
    gini: null,
    timezones: ["UTC+12:00"],
    borders: [],
    nativeName: "Nauru",
    numericCode: "520",
    currencies: [
      {
        code: "AUD",
        name: "Australian dollar",
        symbol: "$"
      },
      {
        code: "(none)",
        name: null,
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      },
      {
        iso639_1: "na",
        iso639_2: "nau",
        name: "Nauruan",
        nativeName: "Dorerin Naoero"
      }
    ],
    translations: {
      de: "Nauru",
      es: "Nauru",
      fr: "Nauru",
      ja: "\u30CA\u30A6\u30EB",
      it: "Nauru",
      br: "Nauru",
      pt: "Nauru",
      nl: "Nauru",
      hr: "Nauru",
      fa: "\u0646\u0627\u0626\u0648\u0631\u0648"
    },
    flag: "https://restcountries.eu/data/nru.svg",
    regionalBlocs: [],
    cioc: "NRU"
  },
  {
    name: "Nepal",
    topLevelDomain: [".np"],
    alpha2Code: "NP",
    alpha3Code: "NPL",
    callingCodes: ["977"],
    capital: "Kathmandu",
    altSpellings: [
      "NP",
      "Federal Democratic Republic of Nepal",
      "Lokt\u0101ntrik Ganatantra Nep\u0101l"
    ],
    region: "Asia",
    subregion: "Southern Asia",
    population: 28431500,
    latlng: [28, 84],
    demonym: "Nepalese",
    area: 147181,
    gini: 32.8,
    timezones: ["UTC+05:45"],
    borders: ["CHN", "IND"],
    nativeName: "\u0928\u0947\u092A\u093E\u0932",
    numericCode: "524",
    currencies: [
      {
        code: "NPR",
        name: "Nepalese rupee",
        symbol: "\u20A8"
      }
    ],
    languages: [
      {
        iso639_1: "ne",
        iso639_2: "nep",
        name: "Nepali",
        nativeName: "\u0928\u0947\u092A\u093E\u0932\u0940"
      }
    ],
    translations: {
      de: "N\xE9pal",
      es: "Nepal",
      fr: "N\xE9pal",
      ja: "\u30CD\u30D1\u30FC\u30EB",
      it: "Nepal",
      br: "Nepal",
      pt: "Nepal",
      nl: "Nepal",
      hr: "Nepal",
      fa: "\u0646\u067E\u0627\u0644"
    },
    flag: "https://restcountries.eu/data/npl.svg",
    regionalBlocs: [
      {
        acronym: "SAARC",
        name: "South Asian Association for Regional Cooperation",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "NEP"
  },
  {
    name: "Netherlands",
    topLevelDomain: [".nl"],
    alpha2Code: "NL",
    alpha3Code: "NLD",
    callingCodes: ["31"],
    capital: "Amsterdam",
    altSpellings: ["NL", "Holland", "Nederland"],
    region: "Europe",
    subregion: "Western Europe",
    population: 17019800,
    latlng: [52.5, 5.75],
    demonym: "Dutch",
    area: 41850,
    gini: 30.9,
    timezones: ["UTC-04:00", "UTC+01:00"],
    borders: ["BEL", "DEU"],
    nativeName: "Nederland",
    numericCode: "528",
    currencies: [
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      }
    ],
    languages: [
      {
        iso639_1: "nl",
        iso639_2: "nld",
        name: "Dutch",
        nativeName: "Nederlands"
      }
    ],
    translations: {
      de: "Niederlande",
      es: "Pa\xEDses Bajos",
      fr: "Pays-Bas",
      ja: "\u30AA\u30E9\u30F3\u30C0",
      it: "Paesi Bassi",
      br: "Holanda",
      pt: "Pa\xEDses Baixos",
      nl: "Nederland",
      hr: "Nizozemska",
      fa: "\u067E\u0627\u062F\u0634\u0627\u0647\u06CC \u0647\u0644\u0646\u062F"
    },
    flag: "https://restcountries.eu/data/nld.svg",
    regionalBlocs: [
      {
        acronym: "EU",
        name: "European Union",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "NED"
  },
  {
    name: "New Caledonia",
    topLevelDomain: [".nc"],
    alpha2Code: "NC",
    alpha3Code: "NCL",
    callingCodes: ["687"],
    capital: "Noum\xE9a",
    altSpellings: ["NC"],
    region: "Oceania",
    subregion: "Melanesia",
    population: 268767,
    latlng: [-21.5, 165.5],
    demonym: "New Caledonian",
    area: 18575,
    gini: null,
    timezones: ["UTC+11:00"],
    borders: [],
    nativeName: "Nouvelle-Cal\xE9donie",
    numericCode: "540",
    currencies: [
      {
        code: "XPF",
        name: "CFP franc",
        symbol: "Fr"
      }
    ],
    languages: [
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      }
    ],
    translations: {
      de: "Neukaledonien",
      es: "Nueva Caledonia",
      fr: "Nouvelle-Cal\xE9donie",
      ja: "\u30CB\u30E5\u30FC\u30AB\u30EC\u30C9\u30CB\u30A2",
      it: "Nuova Caledonia",
      br: "Nova Caled\xF4nia",
      pt: "Nova Caled\xF3nia",
      nl: "Nieuw-Caledoni\xEB",
      hr: "Nova Kaledonija",
      fa: "\u06A9\u0627\u0644\u062F\u0648\u0646\u06CC\u0627\u06CC \u062C\u062F\u06CC\u062F"
    },
    flag: "https://restcountries.eu/data/ncl.svg",
    regionalBlocs: [],
    cioc: ""
  },
  {
    name: "New Zealand",
    topLevelDomain: [".nz"],
    alpha2Code: "NZ",
    alpha3Code: "NZL",
    callingCodes: ["64"],
    capital: "Wellington",
    altSpellings: ["NZ", "Aotearoa"],
    region: "Oceania",
    subregion: "Australia and New Zealand",
    population: 4697854,
    latlng: [-41, 174],
    demonym: "New Zealander",
    area: 270467,
    gini: 36.2,
    timezones: [
      "UTC-11:00",
      "UTC-10:00",
      "UTC+12:00",
      "UTC+12:45",
      "UTC+13:00"
    ],
    borders: [],
    nativeName: "New Zealand",
    numericCode: "554",
    currencies: [
      {
        code: "NZD",
        name: "New Zealand dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      },
      {
        iso639_1: "mi",
        iso639_2: "mri",
        name: "M\u0101ori",
        nativeName: "te reo M\u0101ori"
      }
    ],
    translations: {
      de: "Neuseeland",
      es: "Nueva Zelanda",
      fr: "Nouvelle-Z\xE9lande",
      ja: "\u30CB\u30E5\u30FC\u30B8\u30FC\u30E9\u30F3\u30C9",
      it: "Nuova Zelanda",
      br: "Nova Zel\xE2ndia",
      pt: "Nova Zel\xE2ndia",
      nl: "Nieuw-Zeeland",
      hr: "Novi Zeland",
      fa: "\u0646\u06CC\u0648\u0632\u06CC\u0644\u0646\u062F"
    },
    flag: "https://restcountries.eu/data/nzl.svg",
    regionalBlocs: [],
    cioc: "NZL"
  },
  {
    name: "Nicaragua",
    topLevelDomain: [".ni"],
    alpha2Code: "NI",
    alpha3Code: "NIC",
    callingCodes: ["505"],
    capital: "Managua",
    altSpellings: ["NI", "Republic of Nicaragua", "Rep\xFAblica de Nicaragua"],
    region: "Americas",
    subregion: "Central America",
    population: 6262703,
    latlng: [13, -85],
    demonym: "Nicaraguan",
    area: 130373,
    gini: 40.5,
    timezones: ["UTC-06:00"],
    borders: ["CRI", "HND"],
    nativeName: "Nicaragua",
    numericCode: "558",
    currencies: [
      {
        code: "NIO",
        name: "Nicaraguan c\xF3rdoba",
        symbol: "C$"
      }
    ],
    languages: [
      {
        iso639_1: "es",
        iso639_2: "spa",
        name: "Spanish",
        nativeName: "Espa\xF1ol"
      }
    ],
    translations: {
      de: "Nicaragua",
      es: "Nicaragua",
      fr: "Nicaragua",
      ja: "\u30CB\u30AB\u30E9\u30B0\u30A2",
      it: "Nicaragua",
      br: "Nicar\xE1gua",
      pt: "Nicar\xE1gua",
      nl: "Nicaragua",
      hr: "Nikaragva",
      fa: "\u0646\u06CC\u06A9\u0627\u0631\u0627\u06AF\u0648\u0626\u0647"
    },
    flag: "https://restcountries.eu/data/nic.svg",
    regionalBlocs: [
      {
        acronym: "CAIS",
        name: "Central American Integration System",
        otherAcronyms: ["SICA"],
        otherNames: ["Sistema de la Integraci\xF3n Centroamericana,"]
      }
    ],
    cioc: "NCA"
  },
  {
    name: "Niger",
    topLevelDomain: [".ne"],
    alpha2Code: "NE",
    alpha3Code: "NER",
    callingCodes: ["227"],
    capital: "Niamey",
    altSpellings: ["NE", "Nijar", "Republic of Niger", "R\xE9publique du Niger"],
    region: "Africa",
    subregion: "Western Africa",
    population: 20715e3,
    latlng: [16, 8],
    demonym: "Nigerien",
    area: 1267e3,
    gini: 34.6,
    timezones: ["UTC+01:00"],
    borders: ["DZA", "BEN", "BFA", "TCD", "LBY", "MLI", "NGA"],
    nativeName: "Niger",
    numericCode: "562",
    currencies: [
      {
        code: "XOF",
        name: "West African CFA franc",
        symbol: "Fr"
      }
    ],
    languages: [
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      }
    ],
    translations: {
      de: "Niger",
      es: "N\xEDger",
      fr: "Niger",
      ja: "\u30CB\u30B8\u30A7\u30FC\u30EB",
      it: "Niger",
      br: "N\xEDger",
      pt: "N\xEDger",
      nl: "Niger",
      hr: "Niger",
      fa: "\u0646\u06CC\u062C\u0631"
    },
    flag: "https://restcountries.eu/data/ner.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "NIG"
  },
  {
    name: "Nigeria",
    topLevelDomain: [".ng"],
    alpha2Code: "NG",
    alpha3Code: "NGA",
    callingCodes: ["234"],
    capital: "Abuja",
    altSpellings: ["NG", "Nijeriya", "Na\xEDj\xEDr\xED\xE0", "Federal Republic of Nigeria"],
    region: "Africa",
    subregion: "Western Africa",
    population: 186988e3,
    latlng: [10, 8],
    demonym: "Nigerian",
    area: 923768,
    gini: 48.8,
    timezones: ["UTC+01:00"],
    borders: ["BEN", "CMR", "TCD", "NER"],
    nativeName: "Nigeria",
    numericCode: "566",
    currencies: [
      {
        code: "NGN",
        name: "Nigerian naira",
        symbol: "\u20A6"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Nigeria",
      es: "Nigeria",
      fr: "Nig\xE9ria",
      ja: "\u30CA\u30A4\u30B8\u30A7\u30EA\u30A2",
      it: "Nigeria",
      br: "Nig\xE9ria",
      pt: "Nig\xE9ria",
      nl: "Nigeria",
      hr: "Nigerija",
      fa: "\u0646\u06CC\u062C\u0631\u06CC\u0647"
    },
    flag: "https://restcountries.eu/data/nga.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "NGR"
  },
  {
    name: "Niue",
    topLevelDomain: [".nu"],
    alpha2Code: "NU",
    alpha3Code: "NIU",
    callingCodes: ["683"],
    capital: "Alofi",
    altSpellings: ["NU"],
    region: "Oceania",
    subregion: "Polynesia",
    population: 1470,
    latlng: [-19.03333333, -169.86666666],
    demonym: "Niuean",
    area: 260,
    gini: null,
    timezones: ["UTC-11:00"],
    borders: [],
    nativeName: "Niu\u0113",
    numericCode: "570",
    currencies: [
      {
        code: "NZD",
        name: "New Zealand dollar",
        symbol: "$"
      },
      {
        code: "(none)",
        name: "Niue dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Niue",
      es: "Niue",
      fr: "Niue",
      ja: "\u30CB\u30A6\u30A8",
      it: "Niue",
      br: "Niue",
      pt: "Niue",
      nl: "Niue",
      hr: "Niue",
      fa: "\u0646\u06CC\u0648\u0648\u06CC"
    },
    flag: "https://restcountries.eu/data/niu.svg",
    regionalBlocs: [],
    cioc: ""
  },
  {
    name: "Norfolk Island",
    topLevelDomain: [".nf"],
    alpha2Code: "NF",
    alpha3Code: "NFK",
    callingCodes: ["672"],
    capital: "Kingston",
    altSpellings: [
      "NF",
      "Territory of Norfolk Island",
      "Teratri of Norf'k Ailen"
    ],
    region: "Oceania",
    subregion: "Australia and New Zealand",
    population: 2302,
    latlng: [-29.03333333, 167.95],
    demonym: "Norfolk Islander",
    area: 36,
    gini: null,
    timezones: ["UTC+11:30"],
    borders: [],
    nativeName: "Norfolk Island",
    numericCode: "574",
    currencies: [
      {
        code: "AUD",
        name: "Australian dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Norfolkinsel",
      es: "Isla de Norfolk",
      fr: "\xCEle de Norfolk",
      ja: "\u30CE\u30FC\u30D5\u30A9\u30FC\u30AF\u5CF6",
      it: "Isola Norfolk",
      br: "Ilha Norfolk",
      pt: "Ilha Norfolk",
      nl: "Norfolkeiland",
      hr: "Otok Norfolk",
      fa: "\u062C\u0632\u06CC\u0631\u0647 \u0646\u0648\u0631\u0641\u06A9"
    },
    flag: "https://restcountries.eu/data/nfk.svg",
    regionalBlocs: [],
    cioc: ""
  },
  {
    name: "Korea (Democratic People's Republic of)",
    topLevelDomain: [".kp"],
    alpha2Code: "KP",
    alpha3Code: "PRK",
    callingCodes: ["850"],
    capital: "Pyongyang",
    altSpellings: [
      "KP",
      "Democratic People's Republic of Korea",
      "\uC870\uC120\uBBFC\uC8FC\uC8FC\uC758\uC778\uBBFC\uACF5\uD654\uAD6D",
      "Chos\u014Fn Minjuju\u016Di Inmin Konghwaguk"
    ],
    region: "Asia",
    subregion: "Eastern Asia",
    population: 25281e3,
    latlng: [40, 127],
    demonym: "North Korean",
    area: 120538,
    gini: null,
    timezones: ["UTC+09:00"],
    borders: ["CHN", "KOR", "RUS"],
    nativeName: "\uBD81\uD55C",
    numericCode: "408",
    currencies: [
      {
        code: "KPW",
        name: "North Korean won",
        symbol: "\u20A9"
      }
    ],
    languages: [
      {
        iso639_1: "ko",
        iso639_2: "kor",
        name: "Korean",
        nativeName: "\uD55C\uAD6D\uC5B4"
      }
    ],
    translations: {
      de: "Nordkorea",
      es: "Corea del Norte",
      fr: "Cor\xE9e du Nord",
      ja: "\u671D\u9BAE\u6C11\u4E3B\u4E3B\u7FA9\u4EBA\u6C11\u5171\u548C\u56FD",
      it: "Corea del Nord",
      br: "Coreia do Norte",
      pt: "Coreia do Norte",
      nl: "Noord-Korea",
      hr: "Sjeverna Koreja",
      fa: "\u06A9\u0631\u0647 \u062C\u0646\u0648\u0628\u06CC"
    },
    flag: "https://restcountries.eu/data/prk.svg",
    regionalBlocs: [],
    cioc: "PRK"
  },
  {
    name: "Northern Mariana Islands",
    topLevelDomain: [".mp"],
    alpha2Code: "MP",
    alpha3Code: "MNP",
    callingCodes: ["1670"],
    capital: "Saipan",
    altSpellings: [
      "MP",
      "Commonwealth of the Northern Mariana Islands",
      "Sankattan Siha Na Islas Mari\xE5nas"
    ],
    region: "Oceania",
    subregion: "Micronesia",
    population: 56940,
    latlng: [15.2, 145.75],
    demonym: "American",
    area: 464,
    gini: null,
    timezones: ["UTC+10:00"],
    borders: [],
    nativeName: "Northern Mariana Islands",
    numericCode: "580",
    currencies: [
      {
        code: "USD",
        name: "United States dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      },
      {
        iso639_1: "ch",
        iso639_2: "cha",
        name: "Chamorro",
        nativeName: "Chamoru"
      }
    ],
    translations: {
      de: "N\xF6rdliche Marianen",
      es: "Islas Marianas del Norte",
      fr: "\xCEles Mariannes du Nord",
      ja: "\u5317\u30DE\u30EA\u30A2\u30CA\u8AF8\u5CF6",
      it: "Isole Marianne Settentrionali",
      br: "Ilhas Marianas",
      pt: "Ilhas Marianas",
      nl: "Noordelijke Marianeneilanden",
      hr: "Sjevernomarijanski otoci",
      fa: "\u062C\u0632\u0627\u06CC\u0631 \u0645\u0627\u0631\u06CC\u0627\u0646\u0627\u06CC \u0634\u0645\u0627\u0644\u06CC"
    },
    flag: "https://restcountries.eu/data/mnp.svg",
    regionalBlocs: [],
    cioc: ""
  },
  {
    name: "Norway",
    topLevelDomain: [".no"],
    alpha2Code: "NO",
    alpha3Code: "NOR",
    callingCodes: ["47"],
    capital: "Oslo",
    altSpellings: [
      "NO",
      "Norge",
      "Noreg",
      "Kingdom of Norway",
      "Kongeriket Norge",
      "Kongeriket Noreg"
    ],
    region: "Europe",
    subregion: "Northern Europe",
    population: 5223256,
    latlng: [62, 10],
    demonym: "Norwegian",
    area: 323802,
    gini: 25.8,
    timezones: ["UTC+01:00"],
    borders: ["FIN", "SWE", "RUS"],
    nativeName: "Norge",
    numericCode: "578",
    currencies: [
      {
        code: "NOK",
        name: "Norwegian krone",
        symbol: "kr"
      }
    ],
    languages: [
      {
        iso639_1: "no",
        iso639_2: "nor",
        name: "Norwegian",
        nativeName: "Norsk"
      },
      {
        iso639_1: "nb",
        iso639_2: "nob",
        name: "Norwegian Bokm\xE5l",
        nativeName: "Norsk bokm\xE5l"
      },
      {
        iso639_1: "nn",
        iso639_2: "nno",
        name: "Norwegian Nynorsk",
        nativeName: "Norsk nynorsk"
      }
    ],
    translations: {
      de: "Norwegen",
      es: "Noruega",
      fr: "Norv\xE8ge",
      ja: "\u30CE\u30EB\u30A6\u30A7\u30FC",
      it: "Norvegia",
      br: "Noruega",
      pt: "Noruega",
      nl: "Noorwegen",
      hr: "Norve\u0161ka",
      fa: "\u0646\u0631\u0648\u0698"
    },
    flag: "https://restcountries.eu/data/nor.svg",
    regionalBlocs: [
      {
        acronym: "EFTA",
        name: "European Free Trade Association",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "NOR"
  },
  {
    name: "Oman",
    topLevelDomain: [".om"],
    alpha2Code: "OM",
    alpha3Code: "OMN",
    callingCodes: ["968"],
    capital: "Muscat",
    altSpellings: ["OM", "Sultanate of Oman", "Sal\u1E6Danat \u02BBUm\u0101n"],
    region: "Asia",
    subregion: "Western Asia",
    population: 4420133,
    latlng: [21, 57],
    demonym: "Omani",
    area: 309500,
    gini: null,
    timezones: ["UTC+04:00"],
    borders: ["SAU", "ARE", "YEM"],
    nativeName: "\u0639\u0645\u0627\u0646",
    numericCode: "512",
    currencies: [
      {
        code: "OMR",
        name: "Omani rial",
        symbol: "\u0631.\u0639."
      }
    ],
    languages: [
      {
        iso639_1: "ar",
        iso639_2: "ara",
        name: "Arabic",
        nativeName: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"
      }
    ],
    translations: {
      de: "Oman",
      es: "Om\xE1n",
      fr: "Oman",
      ja: "\u30AA\u30DE\u30FC\u30F3",
      it: "oman",
      br: "Om\xE3",
      pt: "Om\xE3",
      nl: "Oman",
      hr: "Oman",
      fa: "\u0639\u0645\u0627\u0646"
    },
    flag: "https://restcountries.eu/data/omn.svg",
    regionalBlocs: [
      {
        acronym: "AL",
        name: "Arab League",
        otherAcronyms: [],
        otherNames: [
          "\u062C\u0627\u0645\u0639\u0629 \u0627\u0644\u062F\u0648\u0644 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
          "J\u0101mi\u02BBat ad-Duwal al-\u02BBArab\u012Byah",
          "League of Arab States"
        ]
      }
    ],
    cioc: "OMA"
  },
  {
    name: "Pakistan",
    topLevelDomain: [".pk"],
    alpha2Code: "PK",
    alpha3Code: "PAK",
    callingCodes: ["92"],
    capital: "Islamabad",
    altSpellings: [
      "PK",
      "P\u0101kist\u0101n",
      "Islamic Republic of Pakistan",
      "Isl\u0101m\u012B Jumh\u016Briya'eh P\u0101kist\u0101n"
    ],
    region: "Asia",
    subregion: "Southern Asia",
    population: 194125062,
    latlng: [30, 70],
    demonym: "Pakistani",
    area: 881912,
    gini: 30,
    timezones: ["UTC+05:00"],
    borders: ["AFG", "CHN", "IND", "IRN"],
    nativeName: "Pakistan",
    numericCode: "586",
    currencies: [
      {
        code: "PKR",
        name: "Pakistani rupee",
        symbol: "\u20A8"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      },
      {
        iso639_1: "ur",
        iso639_2: "urd",
        name: "Urdu",
        nativeName: "\u0627\u0631\u062F\u0648"
      }
    ],
    translations: {
      de: "Pakistan",
      es: "Pakist\xE1n",
      fr: "Pakistan",
      ja: "\u30D1\u30AD\u30B9\u30BF\u30F3",
      it: "Pakistan",
      br: "Paquist\xE3o",
      pt: "Paquist\xE3o",
      nl: "Pakistan",
      hr: "Pakistan",
      fa: "\u067E\u0627\u06A9\u0633\u062A\u0627\u0646"
    },
    flag: "https://restcountries.eu/data/pak.svg",
    regionalBlocs: [
      {
        acronym: "SAARC",
        name: "South Asian Association for Regional Cooperation",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "PAK"
  },
  {
    name: "Palau",
    topLevelDomain: [".pw"],
    alpha2Code: "PW",
    alpha3Code: "PLW",
    callingCodes: ["680"],
    capital: "Ngerulmud",
    altSpellings: ["PW", "Republic of Palau", "Beluu er a Belau"],
    region: "Oceania",
    subregion: "Micronesia",
    population: 17950,
    latlng: [7.5, 134.5],
    demonym: "Palauan",
    area: 459,
    gini: null,
    timezones: ["UTC+09:00"],
    borders: [],
    nativeName: "Palau",
    numericCode: "585",
    currencies: [
      {
        code: "(none)",
        name: "[E]",
        symbol: "$"
      },
      {
        code: "USD",
        name: "United States dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Palau",
      es: "Palau",
      fr: "Palaos",
      ja: "\u30D1\u30E9\u30AA",
      it: "Palau",
      br: "Palau",
      pt: "Palau",
      nl: "Palau",
      hr: "Palau",
      fa: "\u067E\u0627\u0644\u0627\u0626\u0648"
    },
    flag: "https://restcountries.eu/data/plw.svg",
    regionalBlocs: [],
    cioc: "PLW"
  },
  {
    name: "Palestine, State of",
    topLevelDomain: [".ps"],
    alpha2Code: "PS",
    alpha3Code: "PSE",
    callingCodes: ["970"],
    capital: "Ramallah",
    altSpellings: ["PS", "State of Palestine", "Dawlat Filas\u1E6Din"],
    region: "Asia",
    subregion: "Western Asia",
    population: 4682467,
    latlng: [31.9, 35.2],
    demonym: "Palestinian",
    area: null,
    gini: 35.5,
    timezones: ["UTC+02:00"],
    borders: ["ISR", "EGY", "JOR"],
    nativeName: "\u0641\u0644\u0633\u0637\u064A\u0646",
    numericCode: "275",
    currencies: [
      {
        code: "ILS",
        name: "Israeli new sheqel",
        symbol: "\u20AA"
      }
    ],
    languages: [
      {
        iso639_1: "ar",
        iso639_2: "ara",
        name: "Arabic",
        nativeName: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"
      }
    ],
    translations: {
      de: "Pal\xE4stina",
      es: "Palestina",
      fr: "Palestine",
      ja: "\u30D1\u30EC\u30B9\u30C1\u30CA",
      it: "Palestina",
      br: "Palestina",
      pt: "Palestina",
      nl: "Palestijnse gebieden",
      hr: "Palestina",
      fa: "\u0641\u0644\u0633\u0637\u06CC\u0646"
    },
    flag: "https://restcountries.eu/data/pse.svg",
    regionalBlocs: [
      {
        acronym: "AL",
        name: "Arab League",
        otherAcronyms: [],
        otherNames: [
          "\u062C\u0627\u0645\u0639\u0629 \u0627\u0644\u062F\u0648\u0644 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
          "J\u0101mi\u02BBat ad-Duwal al-\u02BBArab\u012Byah",
          "League of Arab States"
        ]
      }
    ],
    cioc: "PLE"
  },
  {
    name: "Panama",
    topLevelDomain: [".pa"],
    alpha2Code: "PA",
    alpha3Code: "PAN",
    callingCodes: ["507"],
    capital: "Panama City",
    altSpellings: ["PA", "Republic of Panama", "Rep\xFAblica de Panam\xE1"],
    region: "Americas",
    subregion: "Central America",
    population: 3814672,
    latlng: [9, -80],
    demonym: "Panamanian",
    area: 75417,
    gini: 51.9,
    timezones: ["UTC-05:00"],
    borders: ["COL", "CRI"],
    nativeName: "Panam\xE1",
    numericCode: "591",
    currencies: [
      {
        code: "PAB",
        name: "Panamanian balboa",
        symbol: "B/."
      },
      {
        code: "USD",
        name: "United States dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "es",
        iso639_2: "spa",
        name: "Spanish",
        nativeName: "Espa\xF1ol"
      }
    ],
    translations: {
      de: "Panama",
      es: "Panam\xE1",
      fr: "Panama",
      ja: "\u30D1\u30CA\u30DE",
      it: "Panama",
      br: "Panam\xE1",
      pt: "Panam\xE1",
      nl: "Panama",
      hr: "Panama",
      fa: "\u067E\u0627\u0646\u0627\u0645\u0627"
    },
    flag: "https://restcountries.eu/data/pan.svg",
    regionalBlocs: [
      {
        acronym: "CAIS",
        name: "Central American Integration System",
        otherAcronyms: ["SICA"],
        otherNames: ["Sistema de la Integraci\xF3n Centroamericana,"]
      }
    ],
    cioc: "PAN"
  },
  {
    name: "Papua New Guinea",
    topLevelDomain: [".pg"],
    alpha2Code: "PG",
    alpha3Code: "PNG",
    callingCodes: ["675"],
    capital: "Port Moresby",
    altSpellings: [
      "PG",
      "Independent State of Papua New Guinea",
      "Independen Stet bilong Papua Niugini"
    ],
    region: "Oceania",
    subregion: "Melanesia",
    population: 8083700,
    latlng: [-6, 147],
    demonym: "Papua New Guinean",
    area: 462840,
    gini: 50.9,
    timezones: ["UTC+10:00"],
    borders: ["IDN"],
    nativeName: "Papua Niugini",
    numericCode: "598",
    currencies: [
      {
        code: "PGK",
        name: "Papua New Guinean kina",
        symbol: "K"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Papua-Neuguinea",
      es: "Pap\xFAa Nueva Guinea",
      fr: "Papouasie-Nouvelle-Guin\xE9e",
      ja: "\u30D1\u30D7\u30A2\u30CB\u30E5\u30FC\u30AE\u30CB\u30A2",
      it: "Papua Nuova Guinea",
      br: "Papua Nova Guin\xE9",
      pt: "Papua Nova Guin\xE9",
      nl: "Papoea-Nieuw-Guinea",
      hr: "Papua Nova Gvineja",
      fa: "\u067E\u0627\u067E\u0648\u0622 \u06AF\u06CC\u0646\u0647 \u0646\u0648"
    },
    flag: "https://restcountries.eu/data/png.svg",
    regionalBlocs: [],
    cioc: "PNG"
  },
  {
    name: "Paraguay",
    topLevelDomain: [".py"],
    alpha2Code: "PY",
    alpha3Code: "PRY",
    callingCodes: ["595"],
    capital: "Asunci\xF3n",
    altSpellings: [
      "PY",
      "Republic of Paraguay",
      "Rep\xFAblica del Paraguay",
      "Tet\xE3 Paragu\xE1i"
    ],
    region: "Americas",
    subregion: "South America",
    population: 6854536,
    latlng: [-23, -58],
    demonym: "Paraguayan",
    area: 406752,
    gini: 52.4,
    timezones: ["UTC-04:00"],
    borders: ["ARG", "BOL", "BRA"],
    nativeName: "Paraguay",
    numericCode: "600",
    currencies: [
      {
        code: "PYG",
        name: "Paraguayan guaran\xED",
        symbol: "\u20B2"
      }
    ],
    languages: [
      {
        iso639_1: "es",
        iso639_2: "spa",
        name: "Spanish",
        nativeName: "Espa\xF1ol"
      },
      {
        iso639_1: "gn",
        iso639_2: "grn",
        name: "Guaran\xED",
        nativeName: "Ava\xF1e'\u1EBD"
      }
    ],
    translations: {
      de: "Paraguay",
      es: "Paraguay",
      fr: "Paraguay",
      ja: "\u30D1\u30E9\u30B0\u30A2\u30A4",
      it: "Paraguay",
      br: "Paraguai",
      pt: "Paraguai",
      nl: "Paraguay",
      hr: "Paragvaj",
      fa: "\u067E\u0627\u0631\u0627\u06AF\u0648\u0626\u0647"
    },
    flag: "https://restcountries.eu/data/pry.svg",
    regionalBlocs: [
      {
        acronym: "USAN",
        name: "Union of South American Nations",
        otherAcronyms: ["UNASUR", "UNASUL", "UZAN"],
        otherNames: [
          "Uni\xF3n de Naciones Suramericanas",
          "Uni\xE3o de Na\xE7\xF5es Sul-Americanas",
          "Unie van Zuid-Amerikaanse Naties",
          "South American Union"
        ]
      }
    ],
    cioc: "PAR"
  },
  {
    name: "Peru",
    topLevelDomain: [".pe"],
    alpha2Code: "PE",
    alpha3Code: "PER",
    callingCodes: ["51"],
    capital: "Lima",
    altSpellings: ["PE", "Republic of Peru", " Rep\xFAblica del Per\xFA"],
    region: "Americas",
    subregion: "South America",
    population: 31488700,
    latlng: [-10, -76],
    demonym: "Peruvian",
    area: 1285216,
    gini: 48.1,
    timezones: ["UTC-05:00"],
    borders: ["BOL", "BRA", "CHL", "COL", "ECU"],
    nativeName: "Per\xFA",
    numericCode: "604",
    currencies: [
      {
        code: "PEN",
        name: "Peruvian sol",
        symbol: "S/."
      }
    ],
    languages: [
      {
        iso639_1: "es",
        iso639_2: "spa",
        name: "Spanish",
        nativeName: "Espa\xF1ol"
      }
    ],
    translations: {
      de: "Peru",
      es: "Per\xFA",
      fr: "P\xE9rou",
      ja: "\u30DA\u30EB\u30FC",
      it: "Per\xF9",
      br: "Peru",
      pt: "Peru",
      nl: "Peru",
      hr: "Peru",
      fa: "\u067E\u0631\u0648"
    },
    flag: "https://restcountries.eu/data/per.svg",
    regionalBlocs: [
      {
        acronym: "PA",
        name: "Pacific Alliance",
        otherAcronyms: [],
        otherNames: ["Alianza del Pac\xEDfico"]
      },
      {
        acronym: "USAN",
        name: "Union of South American Nations",
        otherAcronyms: ["UNASUR", "UNASUL", "UZAN"],
        otherNames: [
          "Uni\xF3n de Naciones Suramericanas",
          "Uni\xE3o de Na\xE7\xF5es Sul-Americanas",
          "Unie van Zuid-Amerikaanse Naties",
          "South American Union"
        ]
      }
    ],
    cioc: "PER"
  },
  {
    name: "Philippines",
    topLevelDomain: [".ph"],
    alpha2Code: "PH",
    alpha3Code: "PHL",
    callingCodes: ["63"],
    capital: "Manila",
    altSpellings: [
      "PH",
      "Republic of the Philippines",
      "Rep\xFAblika ng Pilipinas"
    ],
    region: "Asia",
    subregion: "South-Eastern Asia",
    population: 103279800,
    latlng: [13, 122],
    demonym: "Filipino",
    area: 342353,
    gini: 43,
    timezones: ["UTC+08:00"],
    borders: [],
    nativeName: "Pilipinas",
    numericCode: "608",
    currencies: [
      {
        code: "PHP",
        name: "Philippine peso",
        symbol: "\u20B1"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Philippinen",
      es: "Filipinas",
      fr: "Philippines",
      ja: "\u30D5\u30A3\u30EA\u30D4\u30F3",
      it: "Filippine",
      br: "Filipinas",
      pt: "Filipinas",
      nl: "Filipijnen",
      hr: "Filipini",
      fa: "\u062C\u0632\u0627\u06CC\u0631 \u0627\u0644\u0646\u062F\u0641\u06CC\u0644\u06CC\u067E\u06CC\u0646"
    },
    flag: "https://restcountries.eu/data/phl.svg",
    regionalBlocs: [
      {
        acronym: "ASEAN",
        name: "Association of Southeast Asian Nations",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "PHI"
  },
  {
    name: "Pitcairn",
    topLevelDomain: [".pn"],
    alpha2Code: "PN",
    alpha3Code: "PCN",
    callingCodes: ["64"],
    capital: "Adamstown",
    altSpellings: ["PN", "Pitcairn Henderson Ducie and Oeno Islands"],
    region: "Oceania",
    subregion: "Polynesia",
    population: 56,
    latlng: [-25.06666666, -130.1],
    demonym: "Pitcairn Islander",
    area: 47,
    gini: null,
    timezones: ["UTC-08:00"],
    borders: [],
    nativeName: "Pitcairn Islands",
    numericCode: "612",
    currencies: [
      {
        code: "NZD",
        name: "New Zealand dollar",
        symbol: "$"
      },
      {
        code: null,
        name: "Pitcairn Islands dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Pitcairn",
      es: "Islas Pitcairn",
      fr: "\xCEles Pitcairn",
      ja: "\u30D4\u30C8\u30B1\u30A2\u30F3",
      it: "Isole Pitcairn",
      br: "Ilhas Pitcairn",
      pt: "Ilhas Pic\xE1rnia",
      nl: "Pitcairneilanden",
      hr: "Pitcairnovo oto\u010Dje",
      fa: "\u067E\u06CC\u062A\u06A9\u0631\u0646"
    },
    flag: "https://restcountries.eu/data/pcn.svg",
    regionalBlocs: [],
    cioc: ""
  },
  {
    name: "Poland",
    topLevelDomain: [".pl"],
    alpha2Code: "PL",
    alpha3Code: "POL",
    callingCodes: ["48"],
    capital: "Warsaw",
    altSpellings: ["PL", "Republic of Poland", "Rzeczpospolita Polska"],
    region: "Europe",
    subregion: "Eastern Europe",
    population: 38437239,
    latlng: [52, 20],
    demonym: "Polish",
    area: 312679,
    gini: 34.1,
    timezones: ["UTC+01:00"],
    borders: ["BLR", "CZE", "DEU", "LTU", "RUS", "SVK", "UKR"],
    nativeName: "Polska",
    numericCode: "616",
    currencies: [
      {
        code: "PLN",
        name: "Polish z\u0142oty",
        symbol: "z\u0142"
      }
    ],
    languages: [
      {
        iso639_1: "pl",
        iso639_2: "pol",
        name: "Polish",
        nativeName: "j\u0119zyk polski"
      }
    ],
    translations: {
      de: "Polen",
      es: "Polonia",
      fr: "Pologne",
      ja: "\u30DD\u30FC\u30E9\u30F3\u30C9",
      it: "Polonia",
      br: "Pol\xF4nia",
      pt: "Pol\xF3nia",
      nl: "Polen",
      hr: "Poljska",
      fa: "\u0644\u0647\u0633\u062A\u0627\u0646"
    },
    flag: "https://restcountries.eu/data/pol.svg",
    regionalBlocs: [
      {
        acronym: "EU",
        name: "European Union",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "POL"
  },
  {
    name: "Portugal",
    topLevelDomain: [".pt"],
    alpha2Code: "PT",
    alpha3Code: "PRT",
    callingCodes: ["351"],
    capital: "Lisbon",
    altSpellings: [
      "PT",
      "Portuguesa",
      "Portuguese Republic",
      "Rep\xFAblica Portuguesa"
    ],
    region: "Europe",
    subregion: "Southern Europe",
    population: 10374822,
    latlng: [39.5, -8],
    demonym: "Portuguese",
    area: 92090,
    gini: 38.5,
    timezones: ["UTC-01:00", "UTC"],
    borders: ["ESP"],
    nativeName: "Portugal",
    numericCode: "620",
    currencies: [
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      }
    ],
    languages: [
      {
        iso639_1: "pt",
        iso639_2: "por",
        name: "Portuguese",
        nativeName: "Portugu\xEAs"
      }
    ],
    translations: {
      de: "Portugal",
      es: "Portugal",
      fr: "Portugal",
      ja: "\u30DD\u30EB\u30C8\u30AC\u30EB",
      it: "Portogallo",
      br: "Portugal",
      pt: "Portugal",
      nl: "Portugal",
      hr: "Portugal",
      fa: "\u067E\u0631\u062A\u063A\u0627\u0644"
    },
    flag: "https://restcountries.eu/data/prt.svg",
    regionalBlocs: [
      {
        acronym: "EU",
        name: "European Union",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "POR"
  },
  {
    name: "Puerto Rico",
    topLevelDomain: [".pr"],
    alpha2Code: "PR",
    alpha3Code: "PRI",
    callingCodes: ["1787", "1939"],
    capital: "San Juan",
    altSpellings: [
      "PR",
      "Commonwealth of Puerto Rico",
      "Estado Libre Asociado de Puerto Rico"
    ],
    region: "Americas",
    subregion: "Caribbean",
    population: 3474182,
    latlng: [18.25, -66.5],
    demonym: "Puerto Rican",
    area: 8870,
    gini: null,
    timezones: ["UTC-04:00"],
    borders: [],
    nativeName: "Puerto Rico",
    numericCode: "630",
    currencies: [
      {
        code: "USD",
        name: "United States dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "es",
        iso639_2: "spa",
        name: "Spanish",
        nativeName: "Espa\xF1ol"
      },
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Puerto Rico",
      es: "Puerto Rico",
      fr: "Porto Rico",
      ja: "\u30D7\u30A8\u30EB\u30C8\u30EA\u30B3",
      it: "Porto Rico",
      br: "Porto Rico",
      pt: "Porto Rico",
      nl: "Puerto Rico",
      hr: "Portoriko",
      fa: "\u067E\u0648\u0631\u062A\u0648 \u0631\u06CC\u06A9\u0648"
    },
    flag: "https://restcountries.eu/data/pri.svg",
    regionalBlocs: [],
    cioc: "PUR"
  },
  {
    name: "Qatar",
    topLevelDomain: [".qa"],
    alpha2Code: "QA",
    alpha3Code: "QAT",
    callingCodes: ["974"],
    capital: "Doha",
    altSpellings: ["QA", "State of Qatar", "Dawlat Qa\u1E6Dar"],
    region: "Asia",
    subregion: "Western Asia",
    population: 2587564,
    latlng: [25.5, 51.25],
    demonym: "Qatari",
    area: 11586,
    gini: 41.1,
    timezones: ["UTC+03:00"],
    borders: ["SAU"],
    nativeName: "\u0642\u0637\u0631",
    numericCode: "634",
    currencies: [
      {
        code: "QAR",
        name: "Qatari riyal",
        symbol: "\u0631.\u0642"
      }
    ],
    languages: [
      {
        iso639_1: "ar",
        iso639_2: "ara",
        name: "Arabic",
        nativeName: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"
      }
    ],
    translations: {
      de: "Katar",
      es: "Catar",
      fr: "Qatar",
      ja: "\u30AB\u30BF\u30FC\u30EB",
      it: "Qatar",
      br: "Catar",
      pt: "Catar",
      nl: "Qatar",
      hr: "Katar",
      fa: "\u0642\u0637\u0631"
    },
    flag: "https://restcountries.eu/data/qat.svg",
    regionalBlocs: [
      {
        acronym: "AL",
        name: "Arab League",
        otherAcronyms: [],
        otherNames: [
          "\u062C\u0627\u0645\u0639\u0629 \u0627\u0644\u062F\u0648\u0644 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
          "J\u0101mi\u02BBat ad-Duwal al-\u02BBArab\u012Byah",
          "League of Arab States"
        ]
      }
    ],
    cioc: "QAT"
  },
  {
    name: "Republic of Kosovo",
    topLevelDomain: [""],
    alpha2Code: "XK",
    alpha3Code: "KOS",
    callingCodes: ["383"],
    capital: "Pristina",
    altSpellings: ["XK", "\u0420\u0435\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u041A\u043E\u0441\u043E\u0432\u043E"],
    region: "Europe",
    subregion: "Eastern Europe",
    population: 1733842,
    latlng: [42.666667, 21.166667],
    demonym: "Kosovar",
    area: 10908,
    gini: null,
    timezones: ["UTC+01:00"],
    borders: ["ALB", "MKD", "MNE", "SRB"],
    nativeName: "Republika e Kosov\xEBs",
    numericCode: null,
    currencies: [
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      }
    ],
    languages: [
      {
        iso639_1: "sq",
        iso639_2: "sqi",
        name: "Albanian",
        nativeName: "Shqip"
      },
      {
        iso639_1: "sr",
        iso639_2: "srp",
        name: "Serbian",
        nativeName: "\u0441\u0440\u043F\u0441\u043A\u0438 \u0458\u0435\u0437\u0438\u043A"
      }
    ],
    translations: {
      de: null,
      es: "Kosovo",
      fr: null,
      ja: null,
      it: null,
      br: "Kosovo",
      pt: "Kosovo",
      nl: null,
      hr: "Kosovo",
      fa: "\u06A9\u0648\u0632\u0648\u0648"
    },
    flag: "https://restcountries.eu/data/kos.svg",
    regionalBlocs: [
      {
        acronym: "CEFTA",
        name: "Central European Free Trade Agreement",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: null
  },
  {
    name: "R\xE9union",
    topLevelDomain: [".re"],
    alpha2Code: "RE",
    alpha3Code: "REU",
    callingCodes: ["262"],
    capital: "Saint-Denis",
    altSpellings: ["RE", "Reunion"],
    region: "Africa",
    subregion: "Eastern Africa",
    population: 840974,
    latlng: [-21.15, 55.5],
    demonym: "French",
    area: null,
    gini: null,
    timezones: ["UTC+04:00"],
    borders: [],
    nativeName: "La R\xE9union",
    numericCode: "638",
    currencies: [
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      }
    ],
    languages: [
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      }
    ],
    translations: {
      de: "R\xE9union",
      es: "Reuni\xF3n",
      fr: "R\xE9union",
      ja: "\u30EC\u30E6\u30CB\u30AA\u30F3",
      it: "Riunione",
      br: "Reuni\xE3o",
      pt: "Reuni\xE3o",
      nl: "R\xE9union",
      hr: "R\xE9union",
      fa: "\u0631\u0626\u0648\u0646\u06CC\u0648\u0646"
    },
    flag: "https://restcountries.eu/data/reu.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: ""
  },
  {
    name: "Romania",
    topLevelDomain: [".ro"],
    alpha2Code: "RO",
    alpha3Code: "ROU",
    callingCodes: ["40"],
    capital: "Bucharest",
    altSpellings: ["RO", "Rumania", "Roumania", "Rom\xE2nia"],
    region: "Europe",
    subregion: "Eastern Europe",
    population: 19861408,
    latlng: [46, 25],
    demonym: "Romanian",
    area: 238391,
    gini: 30,
    timezones: ["UTC+02:00"],
    borders: ["BGR", "HUN", "MDA", "SRB", "UKR"],
    nativeName: "Rom\xE2nia",
    numericCode: "642",
    currencies: [
      {
        code: "RON",
        name: "Romanian leu",
        symbol: "lei"
      }
    ],
    languages: [
      {
        iso639_1: "ro",
        iso639_2: "ron",
        name: "Romanian",
        nativeName: "Rom\xE2n\u0103"
      }
    ],
    translations: {
      de: "Rum\xE4nien",
      es: "Rumania",
      fr: "Roumanie",
      ja: "\u30EB\u30FC\u30DE\u30CB\u30A2",
      it: "Romania",
      br: "Rom\xEAnia",
      pt: "Rom\xE9nia",
      nl: "Roemeni\xEB",
      hr: "Rumunjska",
      fa: "\u0631\u0648\u0645\u0627\u0646\u06CC"
    },
    flag: "https://restcountries.eu/data/rou.svg",
    regionalBlocs: [
      {
        acronym: "EU",
        name: "European Union",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "ROU"
  },
  {
    name: "Russian Federation",
    topLevelDomain: [".ru"],
    alpha2Code: "RU",
    alpha3Code: "RUS",
    callingCodes: ["7"],
    capital: "Moscow",
    altSpellings: [
      "RU",
      "Rossiya",
      "Russian Federation",
      "\u0420\u043E\u0441\u0441\u0438\u0439\u0441\u043A\u0430\u044F \u0424\u0435\u0434\u0435\u0440\u0430\u0446\u0438\u044F",
      "Rossiyskaya Federatsiya"
    ],
    region: "Europe",
    subregion: "Eastern Europe",
    population: 146599183,
    latlng: [60, 100],
    demonym: "Russian",
    area: 17124442,
    gini: 40.1,
    timezones: [
      "UTC+03:00",
      "UTC+04:00",
      "UTC+06:00",
      "UTC+07:00",
      "UTC+08:00",
      "UTC+09:00",
      "UTC+10:00",
      "UTC+11:00",
      "UTC+12:00"
    ],
    borders: [
      "AZE",
      "BLR",
      "CHN",
      "EST",
      "FIN",
      "GEO",
      "KAZ",
      "PRK",
      "LVA",
      "LTU",
      "MNG",
      "NOR",
      "POL",
      "UKR"
    ],
    nativeName: "\u0420\u043E\u0441\u0441\u0438\u044F",
    numericCode: "643",
    currencies: [
      {
        code: "RUB",
        name: "Russian ruble",
        symbol: "\u20BD"
      }
    ],
    languages: [
      {
        iso639_1: "ru",
        iso639_2: "rus",
        name: "Russian",
        nativeName: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439"
      }
    ],
    translations: {
      de: "Russland",
      es: "Rusia",
      fr: "Russie",
      ja: "\u30ED\u30B7\u30A2\u9023\u90A6",
      it: "Russia",
      br: "R\xFAssia",
      pt: "R\xFAssia",
      nl: "Rusland",
      hr: "Rusija",
      fa: "\u0631\u0648\u0633\u06CC\u0647"
    },
    flag: "https://restcountries.eu/data/rus.svg",
    regionalBlocs: [
      {
        acronym: "EEU",
        name: "Eurasian Economic Union",
        otherAcronyms: ["EAEU"],
        otherNames: []
      }
    ],
    cioc: "RUS"
  },
  {
    name: "Rwanda",
    topLevelDomain: [".rw"],
    alpha2Code: "RW",
    alpha3Code: "RWA",
    callingCodes: ["250"],
    capital: "Kigali",
    altSpellings: [
      "RW",
      "Republic of Rwanda",
      "Repubulika y'u Rwanda",
      "R\xE9publique du Rwanda"
    ],
    region: "Africa",
    subregion: "Eastern Africa",
    population: 11553188,
    latlng: [-2, 30],
    demonym: "Rwandan",
    area: 26338,
    gini: 50.8,
    timezones: ["UTC+02:00"],
    borders: ["BDI", "COD", "TZA", "UGA"],
    nativeName: "Rwanda",
    numericCode: "646",
    currencies: [
      {
        code: "RWF",
        name: "Rwandan franc",
        symbol: "Fr"
      }
    ],
    languages: [
      {
        iso639_1: "rw",
        iso639_2: "kin",
        name: "Kinyarwanda",
        nativeName: "Ikinyarwanda"
      },
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      },
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      }
    ],
    translations: {
      de: "Ruanda",
      es: "Ruanda",
      fr: "Rwanda",
      ja: "\u30EB\u30EF\u30F3\u30C0",
      it: "Ruanda",
      br: "Ruanda",
      pt: "Ruanda",
      nl: "Rwanda",
      hr: "Ruanda",
      fa: "\u0631\u0648\u0627\u0646\u062F\u0627"
    },
    flag: "https://restcountries.eu/data/rwa.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "RWA"
  },
  {
    name: "Saint Barth\xE9lemy",
    topLevelDomain: [".bl"],
    alpha2Code: "BL",
    alpha3Code: "BLM",
    callingCodes: ["590"],
    capital: "Gustavia",
    altSpellings: [
      "BL",
      "St. Barthelemy",
      "Collectivity of Saint Barth\xE9lemy",
      "Collectivit\xE9 de Saint-Barth\xE9lemy"
    ],
    region: "Americas",
    subregion: "Caribbean",
    population: 9417,
    latlng: [18.5, -63.41666666],
    demonym: "Saint Barth\xE9lemy Islander",
    area: 21,
    gini: null,
    timezones: ["UTC-04:00"],
    borders: [],
    nativeName: "Saint-Barth\xE9lemy",
    numericCode: "652",
    currencies: [
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      }
    ],
    languages: [
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      }
    ],
    translations: {
      de: "Saint-Barth\xE9lemy",
      es: "San Bartolom\xE9",
      fr: "Saint-Barth\xE9lemy",
      ja: "\u30B5\u30F3\u30FB\u30D0\u30EB\u30C6\u30EB\u30DF\u30FC",
      it: "Antille Francesi",
      br: "S\xE3o Bartolomeu",
      pt: "S\xE3o Bartolomeu",
      nl: "Saint Barth\xE9lemy",
      hr: "Saint Barth\xE9lemy",
      fa: "\u0633\u0646-\u0628\u0627\u0631\u062A\u0644\u0645\u06CC"
    },
    flag: "https://restcountries.eu/data/blm.svg",
    regionalBlocs: [],
    cioc: ""
  },
  {
    name: "Saint Helena, Ascension and Tristan da Cunha",
    topLevelDomain: [".sh"],
    alpha2Code: "SH",
    alpha3Code: "SHN",
    callingCodes: ["290"],
    capital: "Jamestown",
    altSpellings: ["SH"],
    region: "Africa",
    subregion: "Western Africa",
    population: 4255,
    latlng: [-15.95, -5.7],
    demonym: "Saint Helenian",
    area: null,
    gini: null,
    timezones: ["UTC+00:00"],
    borders: [],
    nativeName: "Saint Helena",
    numericCode: "654",
    currencies: [
      {
        code: "SHP",
        name: "Saint Helena pound",
        symbol: "\xA3"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Sankt Helena",
      es: "Santa Helena",
      fr: "Sainte-H\xE9l\xE8ne",
      ja: "\u30BB\u30F3\u30C8\u30D8\u30EC\u30CA\u30FB\u30A2\u30BB\u30F3\u30B7\u30E7\u30F3\u304A\u3088\u3073\u30C8\u30EA\u30B9\u30BF\u30F3\u30C0\u30AF\u30FC\u30CB\u30E3",
      it: "Sant'Elena",
      br: "Santa Helena",
      pt: "Santa Helena",
      nl: "Sint-Helena",
      hr: "Sveta Helena",
      fa: "\u0633\u0646\u062A \u0647\u0644\u0646\u0627\u060C \u0627\u0633\u0646\u0634\u0646 \u0648 \u062A\u0631\u06CC\u0633\u062A\u0627\u0646 \u062F\u0627 \u06A9\u0648\u0646\u0627"
    },
    flag: "https://restcountries.eu/data/shn.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: null
  },
  {
    name: "Saint Kitts and Nevis",
    topLevelDomain: [".kn"],
    alpha2Code: "KN",
    alpha3Code: "KNA",
    callingCodes: ["1869"],
    capital: "Basseterre",
    altSpellings: ["KN", "Federation of Saint Christopher and Nevis"],
    region: "Americas",
    subregion: "Caribbean",
    population: 46204,
    latlng: [17.33333333, -62.75],
    demonym: "Kittian and Nevisian",
    area: 261,
    gini: null,
    timezones: ["UTC-04:00"],
    borders: [],
    nativeName: "Saint Kitts and Nevis",
    numericCode: "659",
    currencies: [
      {
        code: "XCD",
        name: "East Caribbean dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "St. Kitts und Nevis",
      es: "San Crist\xF3bal y Nieves",
      fr: "Saint-Christophe-et-Ni\xE9v\xE8s",
      ja: "\u30BB\u30F3\u30C8\u30AF\u30EA\u30B9\u30C8\u30D5\u30A1\u30FC\u30FB\u30CD\u30A4\u30D3\u30B9",
      it: "Saint Kitts e Nevis",
      br: "S\xE3o Crist\xF3v\xE3o e Neves",
      pt: "S\xE3o Crist\xF3v\xE3o e Neves",
      nl: "Saint Kitts en Nevis",
      hr: "Sveti Kristof i Nevis",
      fa: "\u0633\u0646\u062A \u06A9\u06CC\u062A\u0633 \u0648 \u0646\u0648\u06CC\u0633"
    },
    flag: "https://restcountries.eu/data/kna.svg",
    regionalBlocs: [
      {
        acronym: "CARICOM",
        name: "Caribbean Community",
        otherAcronyms: [],
        otherNames: [
          "Comunidad del Caribe",
          "Communaut\xE9 Carib\xE9enne",
          "Caribische Gemeenschap"
        ]
      }
    ],
    cioc: "SKN"
  },
  {
    name: "Saint Lucia",
    topLevelDomain: [".lc"],
    alpha2Code: "LC",
    alpha3Code: "LCA",
    callingCodes: ["1758"],
    capital: "Castries",
    altSpellings: ["LC"],
    region: "Americas",
    subregion: "Caribbean",
    population: 186e3,
    latlng: [13.88333333, -60.96666666],
    demonym: "Saint Lucian",
    area: 616,
    gini: 42.6,
    timezones: ["UTC-04:00"],
    borders: [],
    nativeName: "Saint Lucia",
    numericCode: "662",
    currencies: [
      {
        code: "XCD",
        name: "East Caribbean dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Saint Lucia",
      es: "Santa Luc\xEDa",
      fr: "Saint-Lucie",
      ja: "\u30BB\u30F3\u30C8\u30EB\u30B7\u30A2",
      it: "Santa Lucia",
      br: "Santa L\xFAcia",
      pt: "Santa L\xFAcia",
      nl: "Saint Lucia",
      hr: "Sveta Lucija",
      fa: "\u0633\u0646\u062A \u0644\u0648\u0633\u06CC\u0627"
    },
    flag: "https://restcountries.eu/data/lca.svg",
    regionalBlocs: [
      {
        acronym: "CARICOM",
        name: "Caribbean Community",
        otherAcronyms: [],
        otherNames: [
          "Comunidad del Caribe",
          "Communaut\xE9 Carib\xE9enne",
          "Caribische Gemeenschap"
        ]
      }
    ],
    cioc: "LCA"
  },
  {
    name: "Saint Martin (French part)",
    topLevelDomain: [".mf", ".fr", ".gp"],
    alpha2Code: "MF",
    alpha3Code: "MAF",
    callingCodes: ["590"],
    capital: "Marigot",
    altSpellings: [
      "MF",
      "Collectivity of Saint Martin",
      "Collectivit\xE9 de Saint-Martin"
    ],
    region: "Americas",
    subregion: "Caribbean",
    population: 36979,
    latlng: [18.08333333, -63.95],
    demonym: "Saint Martin Islander",
    area: 53,
    gini: null,
    timezones: ["UTC-04:00"],
    borders: ["SXM", "NLD"],
    nativeName: "Saint-Martin",
    numericCode: "663",
    currencies: [
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      },
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      },
      {
        iso639_1: "nl",
        iso639_2: "nld",
        name: "Dutch",
        nativeName: "Nederlands"
      }
    ],
    translations: {
      de: "Saint Martin",
      es: "Saint Martin",
      fr: "Saint-Martin",
      ja: "\u30B5\u30F3\u30FB\u30DE\u30EB\u30BF\u30F3\uFF08\u30D5\u30E9\u30F3\u30B9\u9818\uFF09",
      it: "Saint Martin",
      br: "Saint Martin",
      pt: "Ilha S\xE3o Martinho",
      nl: "Saint-Martin",
      hr: "Sveti Martin",
      fa: "\u0633\u06CC\u0646\u062A \u0645\u0627\u0631\u062A\u0646"
    },
    flag: "https://restcountries.eu/data/maf.svg",
    regionalBlocs: [],
    cioc: ""
  },
  {
    name: "Saint Pierre and Miquelon",
    topLevelDomain: [".pm"],
    alpha2Code: "PM",
    alpha3Code: "SPM",
    callingCodes: ["508"],
    capital: "Saint-Pierre",
    altSpellings: [
      "PM",
      "Collectivit\xE9 territoriale de Saint-Pierre-et-Miquelon"
    ],
    region: "Americas",
    subregion: "Northern America",
    population: 6069,
    latlng: [46.83333333, -56.33333333],
    demonym: "French",
    area: 242,
    gini: null,
    timezones: ["UTC-03:00"],
    borders: [],
    nativeName: "Saint-Pierre-et-Miquelon",
    numericCode: "666",
    currencies: [
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      }
    ],
    languages: [
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      }
    ],
    translations: {
      de: "Saint-Pierre und Miquelon",
      es: "San Pedro y Miquel\xF3n",
      fr: "Saint-Pierre-et-Miquelon",
      ja: "\u30B5\u30F3\u30D4\u30A8\u30FC\u30EB\u5CF6\u30FB\u30DF\u30AF\u30ED\u30F3\u5CF6",
      it: "Saint-Pierre e Miquelon",
      br: "Saint-Pierre e Miquelon",
      pt: "S\xE3o Pedro e Miquelon",
      nl: "Saint Pierre en Miquelon",
      hr: "Sveti Petar i Mikelon",
      fa: "\u0633\u0646 \u067E\u06CC\u0631 \u0648 \u0645\u06CC\u06A9\u0644\u0646"
    },
    flag: "https://restcountries.eu/data/spm.svg",
    regionalBlocs: [],
    cioc: ""
  },
  {
    name: "Saint Vincent and the Grenadines",
    topLevelDomain: [".vc"],
    alpha2Code: "VC",
    alpha3Code: "VCT",
    callingCodes: ["1784"],
    capital: "Kingstown",
    altSpellings: ["VC"],
    region: "Americas",
    subregion: "Caribbean",
    population: 109991,
    latlng: [13.25, -61.2],
    demonym: "Saint Vincentian",
    area: 389,
    gini: null,
    timezones: ["UTC-04:00"],
    borders: [],
    nativeName: "Saint Vincent and the Grenadines",
    numericCode: "670",
    currencies: [
      {
        code: "XCD",
        name: "East Caribbean dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Saint Vincent und die Grenadinen",
      es: "San Vicente y Granadinas",
      fr: "Saint-Vincent-et-les-Grenadines",
      ja: "\u30BB\u30F3\u30C8\u30D3\u30F3\u30BB\u30F3\u30C8\u304A\u3088\u3073\u30B0\u30EC\u30CA\u30C7\u30A3\u30FC\u30F3\u8AF8\u5CF6",
      it: "Saint Vincent e Grenadine",
      br: "S\xE3o Vicente e Granadinas",
      pt: "S\xE3o Vicente e Granadinas",
      nl: "Saint Vincent en de Grenadines",
      hr: "Sveti Vincent i Grenadini",
      fa: "\u0633\u0646\u062A \u0648\u06CC\u0646\u0633\u0646\u062A \u0648 \u06AF\u0631\u0646\u0627\u062F\u06CC\u0646\u200C\u0647\u0627"
    },
    flag: "https://restcountries.eu/data/vct.svg",
    regionalBlocs: [
      {
        acronym: "CARICOM",
        name: "Caribbean Community",
        otherAcronyms: [],
        otherNames: [
          "Comunidad del Caribe",
          "Communaut\xE9 Carib\xE9enne",
          "Caribische Gemeenschap"
        ]
      }
    ],
    cioc: "VIN"
  },
  {
    name: "Samoa",
    topLevelDomain: [".ws"],
    alpha2Code: "WS",
    alpha3Code: "WSM",
    callingCodes: ["685"],
    capital: "Apia",
    altSpellings: [
      "WS",
      "Independent State of Samoa",
      "Malo Sa\u02BBoloto Tuto\u02BBatasi o S\u0101moa"
    ],
    region: "Oceania",
    subregion: "Polynesia",
    population: 194899,
    latlng: [-13.58333333, -172.33333333],
    demonym: "Samoan",
    area: 2842,
    gini: null,
    timezones: ["UTC+13:00"],
    borders: [],
    nativeName: "Samoa",
    numericCode: "882",
    currencies: [
      {
        code: "WST",
        name: "Samoan t\u0101l\u0101",
        symbol: "T"
      }
    ],
    languages: [
      {
        iso639_1: "sm",
        iso639_2: "smo",
        name: "Samoan",
        nativeName: "gagana fa'a Samoa"
      },
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Samoa",
      es: "Samoa",
      fr: "Samoa",
      ja: "\u30B5\u30E2\u30A2",
      it: "Samoa",
      br: "Samoa",
      pt: "Samoa",
      nl: "Samoa",
      hr: "Samoa",
      fa: "\u0633\u0627\u0645\u0648\u0622"
    },
    flag: "https://restcountries.eu/data/wsm.svg",
    regionalBlocs: [],
    cioc: "SAM"
  },
  {
    name: "San Marino",
    topLevelDomain: [".sm"],
    alpha2Code: "SM",
    alpha3Code: "SMR",
    callingCodes: ["378"],
    capital: "City of San Marino",
    altSpellings: ["SM", "Republic of San Marino", "Repubblica di San Marino"],
    region: "Europe",
    subregion: "Southern Europe",
    population: 33005,
    latlng: [43.76666666, 12.41666666],
    demonym: "Sammarinese",
    area: 61,
    gini: null,
    timezones: ["UTC+01:00"],
    borders: ["ITA"],
    nativeName: "San Marino",
    numericCode: "674",
    currencies: [
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      }
    ],
    languages: [
      {
        iso639_1: "it",
        iso639_2: "ita",
        name: "Italian",
        nativeName: "Italiano"
      }
    ],
    translations: {
      de: "San Marino",
      es: "San Marino",
      fr: "Saint-Marin",
      ja: "\u30B5\u30F3\u30DE\u30EA\u30CE",
      it: "San Marino",
      br: "San Marino",
      pt: "S\xE3o Marinho",
      nl: "San Marino",
      hr: "San Marino",
      fa: "\u0633\u0627\u0646 \u0645\u0627\u0631\u06CC\u0646\u0648"
    },
    flag: "https://restcountries.eu/data/smr.svg",
    regionalBlocs: [],
    cioc: "SMR"
  },
  {
    name: "Sao Tome and Principe",
    topLevelDomain: [".st"],
    alpha2Code: "ST",
    alpha3Code: "STP",
    callingCodes: ["239"],
    capital: "S\xE3o Tom\xE9",
    altSpellings: [
      "ST",
      "Democratic Republic of S\xE3o Tom\xE9 and Pr\xEDncipe",
      "Rep\xFAblica Democr\xE1tica de S\xE3o Tom\xE9 e Pr\xEDncipe"
    ],
    region: "Africa",
    subregion: "Middle Africa",
    population: 187356,
    latlng: [1, 7],
    demonym: "Sao Tomean",
    area: 964,
    gini: 50.8,
    timezones: ["UTC"],
    borders: [],
    nativeName: "S\xE3o Tom\xE9 e Pr\xEDncipe",
    numericCode: "678",
    currencies: [
      {
        code: "STD",
        name: "S\xE3o Tom\xE9 and Pr\xEDncipe dobra",
        symbol: "Db"
      }
    ],
    languages: [
      {
        iso639_1: "pt",
        iso639_2: "por",
        name: "Portuguese",
        nativeName: "Portugu\xEAs"
      }
    ],
    translations: {
      de: "S\xE3o Tom\xE9 und Pr\xEDncipe",
      es: "Santo Tom\xE9 y Pr\xEDncipe",
      fr: "Sao Tom\xE9-et-Principe",
      ja: "\u30B5\u30F3\u30C8\u30E1\u30FB\u30D7\u30EA\u30F3\u30B7\u30DA",
      it: "S\xE3o Tom\xE9 e Pr\xEDncipe",
      br: "S\xE3o Tom\xE9 e Pr\xEDncipe",
      pt: "S\xE3o Tom\xE9 e Pr\xEDncipe",
      nl: "Sao Tom\xE9 en Principe",
      hr: "Sveti Toma i Princip",
      fa: "\u06A9\u0648\u0627\u062A\u0631\u0648 \u062F\u0648 \u0641\u0631\u0648\u06CC\u0631\u0648"
    },
    flag: "https://restcountries.eu/data/stp.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "STP"
  },
  {
    name: "Saudi Arabia",
    topLevelDomain: [".sa"],
    alpha2Code: "SA",
    alpha3Code: "SAU",
    callingCodes: ["966"],
    capital: "Riyadh",
    altSpellings: [
      "SA",
      "Kingdom of Saudi Arabia",
      "Al-Mamlakah al-\u2018Arabiyyah as-Su\u2018\u016Bdiyyah"
    ],
    region: "Asia",
    subregion: "Western Asia",
    population: 32248200,
    latlng: [25, 45],
    demonym: "Saudi Arabian",
    area: 2149690,
    gini: null,
    timezones: ["UTC+03:00"],
    borders: ["IRQ", "JOR", "KWT", "OMN", "QAT", "ARE", "YEM"],
    nativeName: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629",
    numericCode: "682",
    currencies: [
      {
        code: "SAR",
        name: "Saudi riyal",
        symbol: "\u0631.\u0633"
      }
    ],
    languages: [
      {
        iso639_1: "ar",
        iso639_2: "ara",
        name: "Arabic",
        nativeName: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"
      }
    ],
    translations: {
      de: "Saudi-Arabien",
      es: "Arabia Saud\xED",
      fr: "Arabie Saoudite",
      ja: "\u30B5\u30A6\u30B8\u30A2\u30E9\u30D3\u30A2",
      it: "Arabia Saudita",
      br: "Ar\xE1bia Saudita",
      pt: "Ar\xE1bia Saudita",
      nl: "Saoedi-Arabi\xEB",
      hr: "Saudijska Arabija",
      fa: "\u0639\u0631\u0628\u0633\u062A\u0627\u0646 \u0633\u0639\u0648\u062F\u06CC"
    },
    flag: "https://restcountries.eu/data/sau.svg",
    regionalBlocs: [
      {
        acronym: "AL",
        name: "Arab League",
        otherAcronyms: [],
        otherNames: [
          "\u062C\u0627\u0645\u0639\u0629 \u0627\u0644\u062F\u0648\u0644 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
          "J\u0101mi\u02BBat ad-Duwal al-\u02BBArab\u012Byah",
          "League of Arab States"
        ]
      }
    ],
    cioc: "KSA"
  },
  {
    name: "Senegal",
    topLevelDomain: [".sn"],
    alpha2Code: "SN",
    alpha3Code: "SEN",
    callingCodes: ["221"],
    capital: "Dakar",
    altSpellings: ["SN", "Republic of Senegal", "R\xE9publique du S\xE9n\xE9gal"],
    region: "Africa",
    subregion: "Western Africa",
    population: 14799859,
    latlng: [14, -14],
    demonym: "Senegalese",
    area: 196722,
    gini: 39.2,
    timezones: ["UTC"],
    borders: ["GMB", "GIN", "GNB", "MLI", "MRT"],
    nativeName: "S\xE9n\xE9gal",
    numericCode: "686",
    currencies: [
      {
        code: "XOF",
        name: "West African CFA franc",
        symbol: "Fr"
      }
    ],
    languages: [
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      }
    ],
    translations: {
      de: "Senegal",
      es: "Senegal",
      fr: "S\xE9n\xE9gal",
      ja: "\u30BB\u30CD\u30AC\u30EB",
      it: "Senegal",
      br: "Senegal",
      pt: "Senegal",
      nl: "Senegal",
      hr: "Senegal",
      fa: "\u0633\u0646\u06AF\u0627\u0644"
    },
    flag: "https://restcountries.eu/data/sen.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "SEN"
  },
  {
    name: "Serbia",
    topLevelDomain: [".rs"],
    alpha2Code: "RS",
    alpha3Code: "SRB",
    callingCodes: ["381"],
    capital: "Belgrade",
    altSpellings: [
      "RS",
      "Srbija",
      "Republic of Serbia",
      "\u0420\u0435\u043F\u0443\u0431\u043B\u0438\u043A\u0430 \u0421\u0440\u0431\u0438\u0458\u0430",
      "Republika Srbija"
    ],
    region: "Europe",
    subregion: "Southern Europe",
    population: 7076372,
    latlng: [44, 21],
    demonym: "Serbian",
    area: 88361,
    gini: 27.8,
    timezones: ["UTC+01:00"],
    borders: ["BIH", "BGR", "HRV", "HUN", "KOS", "MKD", "MNE", "ROU"],
    nativeName: "\u0421\u0440\u0431\u0438\u0458\u0430",
    numericCode: "688",
    currencies: [
      {
        code: "RSD",
        name: "Serbian dinar",
        symbol: "\u0434\u0438\u043D."
      }
    ],
    languages: [
      {
        iso639_1: "sr",
        iso639_2: "srp",
        name: "Serbian",
        nativeName: "\u0441\u0440\u043F\u0441\u043A\u0438 \u0458\u0435\u0437\u0438\u043A"
      }
    ],
    translations: {
      de: "Serbien",
      es: "Serbia",
      fr: "Serbie",
      ja: "\u30BB\u30EB\u30D3\u30A2",
      it: "Serbia",
      br: "S\xE9rvia",
      pt: "S\xE9rvia",
      nl: "Servi\xEB",
      hr: "Srbija",
      fa: "\u0635\u0631\u0628\u0633\u062A\u0627\u0646"
    },
    flag: "https://restcountries.eu/data/srb.svg",
    regionalBlocs: [
      {
        acronym: "CEFTA",
        name: "Central European Free Trade Agreement",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "SRB"
  },
  {
    name: "Seychelles",
    topLevelDomain: [".sc"],
    alpha2Code: "SC",
    alpha3Code: "SYC",
    callingCodes: ["248"],
    capital: "Victoria",
    altSpellings: [
      "SC",
      "Republic of Seychelles",
      "Repiblik Sesel",
      "R\xE9publique des Seychelles"
    ],
    region: "Africa",
    subregion: "Eastern Africa",
    population: 91400,
    latlng: [-4.58333333, 55.66666666],
    demonym: "Seychellois",
    area: 452,
    gini: 65.8,
    timezones: ["UTC+04:00"],
    borders: [],
    nativeName: "Seychelles",
    numericCode: "690",
    currencies: [
      {
        code: "SCR",
        name: "Seychellois rupee",
        symbol: "\u20A8"
      }
    ],
    languages: [
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      },
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Seychellen",
      es: "Seychelles",
      fr: "Seychelles",
      ja: "\u30BB\u30FC\u30B7\u30A7\u30EB",
      it: "Seychelles",
      br: "Seicheles",
      pt: "Seicheles",
      nl: "Seychellen",
      hr: "Sej\u0161eli",
      fa: "\u0633\u06CC\u0634\u0644"
    },
    flag: "https://restcountries.eu/data/syc.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "SEY"
  },
  {
    name: "Sierra Leone",
    topLevelDomain: [".sl"],
    alpha2Code: "SL",
    alpha3Code: "SLE",
    callingCodes: ["232"],
    capital: "Freetown",
    altSpellings: ["SL", "Republic of Sierra Leone"],
    region: "Africa",
    subregion: "Western Africa",
    population: 7075641,
    latlng: [8.5, -11.5],
    demonym: "Sierra Leonean",
    area: 71740,
    gini: 42.5,
    timezones: ["UTC"],
    borders: ["GIN", "LBR"],
    nativeName: "Sierra Leone",
    numericCode: "694",
    currencies: [
      {
        code: "SLL",
        name: "Sierra Leonean leone",
        symbol: "Le"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Sierra Leone",
      es: "Sierra Leone",
      fr: "Sierra Leone",
      ja: "\u30B7\u30A8\u30E9\u30EC\u30AA\u30CD",
      it: "Sierra Leone",
      br: "Serra Leoa",
      pt: "Serra Leoa",
      nl: "Sierra Leone",
      hr: "Sijera Leone",
      fa: "\u0633\u06CC\u0631\u0627\u0644\u0626\u0648\u0646"
    },
    flag: "https://restcountries.eu/data/sle.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "SLE"
  },
  {
    name: "Singapore",
    topLevelDomain: [".sg"],
    alpha2Code: "SG",
    alpha3Code: "SGP",
    callingCodes: ["65"],
    capital: "Singapore",
    altSpellings: ["SG", "Singapura", "Republik Singapura", "\u65B0\u52A0\u5761\u5171\u548C\u56FD"],
    region: "Asia",
    subregion: "South-Eastern Asia",
    population: 5535e3,
    latlng: [1.36666666, 103.8],
    demonym: "Singaporean",
    area: 710,
    gini: 48.1,
    timezones: ["UTC+08:00"],
    borders: [],
    nativeName: "Singapore",
    numericCode: "702",
    currencies: [
      {
        code: "BND",
        name: "Brunei dollar",
        symbol: "$"
      },
      {
        code: "SGD",
        name: "Singapore dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      },
      {
        iso639_1: "ms",
        iso639_2: "msa",
        name: "Malay",
        nativeName: "bahasa Melayu"
      },
      {
        iso639_1: "ta",
        iso639_2: "tam",
        name: "Tamil",
        nativeName: "\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD"
      },
      {
        iso639_1: "zh",
        iso639_2: "zho",
        name: "Chinese",
        nativeName: "\u4E2D\u6587 (Zh\u014Dngw\xE9n)"
      }
    ],
    translations: {
      de: "Singapur",
      es: "Singapur",
      fr: "Singapour",
      ja: "\u30B7\u30F3\u30AC\u30DD\u30FC\u30EB",
      it: "Singapore",
      br: "Singapura",
      pt: "Singapura",
      nl: "Singapore",
      hr: "Singapur",
      fa: "\u0633\u0646\u06AF\u0627\u067E\u0648\u0631"
    },
    flag: "https://restcountries.eu/data/sgp.svg",
    regionalBlocs: [
      {
        acronym: "ASEAN",
        name: "Association of Southeast Asian Nations",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "SIN"
  },
  {
    name: "Sint Maarten (Dutch part)",
    topLevelDomain: [".sx"],
    alpha2Code: "SX",
    alpha3Code: "SXM",
    callingCodes: ["1721"],
    capital: "Philipsburg",
    altSpellings: ["SX"],
    region: "Americas",
    subregion: "Caribbean",
    population: 38247,
    latlng: [18.033333, -63.05],
    demonym: "Dutch",
    area: 34,
    gini: null,
    timezones: ["UTC-04:00"],
    borders: ["MAF"],
    nativeName: "Sint Maarten",
    numericCode: "534",
    currencies: [
      {
        code: "ANG",
        name: "Netherlands Antillean guilder",
        symbol: "\u0192"
      }
    ],
    languages: [
      {
        iso639_1: "nl",
        iso639_2: "nld",
        name: "Dutch",
        nativeName: "Nederlands"
      },
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Sint Maarten (niederl. Teil)",
      es: null,
      fr: "Saint Martin (partie n\xE9erlandaise)",
      ja: null,
      it: "Saint Martin (parte olandese)",
      br: "Sint Maarten",
      pt: "S\xE3o Martinho",
      nl: "Sint Maarten",
      hr: null,
      fa: "\u0633\u06CC\u0646\u062A \u0645\u0627\u0631\u062A\u0646"
    },
    flag: "https://restcountries.eu/data/sxm.svg",
    regionalBlocs: [],
    cioc: ""
  },
  {
    name: "Slovakia",
    topLevelDomain: [".sk"],
    alpha2Code: "SK",
    alpha3Code: "SVK",
    callingCodes: ["421"],
    capital: "Bratislava",
    altSpellings: ["SK", "Slovak Republic", "Slovensk\xE1 republika"],
    region: "Europe",
    subregion: "Eastern Europe",
    population: 5426252,
    latlng: [48.66666666, 19.5],
    demonym: "Slovak",
    area: 49037,
    gini: 26,
    timezones: ["UTC+01:00"],
    borders: ["AUT", "CZE", "HUN", "POL", "UKR"],
    nativeName: "Slovensko",
    numericCode: "703",
    currencies: [
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      }
    ],
    languages: [
      {
        iso639_1: "sk",
        iso639_2: "slk",
        name: "Slovak",
        nativeName: "sloven\u010Dina"
      }
    ],
    translations: {
      de: "Slowakei",
      es: "Rep\xFAblica Eslovaca",
      fr: "Slovaquie",
      ja: "\u30B9\u30ED\u30D0\u30AD\u30A2",
      it: "Slovacchia",
      br: "Eslov\xE1quia",
      pt: "Eslov\xE1quia",
      nl: "Slowakije",
      hr: "Slova\u010Dka",
      fa: "\u0627\u0633\u0644\u0648\u0627\u06A9\u06CC"
    },
    flag: "https://restcountries.eu/data/svk.svg",
    regionalBlocs: [
      {
        acronym: "EU",
        name: "European Union",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "SVK"
  },
  {
    name: "Slovenia",
    topLevelDomain: [".si"],
    alpha2Code: "SI",
    alpha3Code: "SVN",
    callingCodes: ["386"],
    capital: "Ljubljana",
    altSpellings: ["SI", "Republic of Slovenia", "Republika Slovenija"],
    region: "Europe",
    subregion: "Southern Europe",
    population: 2064188,
    latlng: [46.11666666, 14.81666666],
    demonym: "Slovene",
    area: 20273,
    gini: 31.2,
    timezones: ["UTC+01:00"],
    borders: ["AUT", "HRV", "ITA", "HUN"],
    nativeName: "Slovenija",
    numericCode: "705",
    currencies: [
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      }
    ],
    languages: [
      {
        iso639_1: "sl",
        iso639_2: "slv",
        name: "Slovene",
        nativeName: "slovenski jezik"
      }
    ],
    translations: {
      de: "Slowenien",
      es: "Eslovenia",
      fr: "Slov\xE9nie",
      ja: "\u30B9\u30ED\u30D9\u30CB\u30A2",
      it: "Slovenia",
      br: "Eslov\xEAnia",
      pt: "Eslov\xE9nia",
      nl: "Sloveni\xEB",
      hr: "Slovenija",
      fa: "\u0627\u0633\u0644\u0648\u0648\u0646\u06CC"
    },
    flag: "https://restcountries.eu/data/svn.svg",
    regionalBlocs: [
      {
        acronym: "EU",
        name: "European Union",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "SLO"
  },
  {
    name: "Solomon Islands",
    topLevelDomain: [".sb"],
    alpha2Code: "SB",
    alpha3Code: "SLB",
    callingCodes: ["677"],
    capital: "Honiara",
    altSpellings: ["SB"],
    region: "Oceania",
    subregion: "Melanesia",
    population: 642e3,
    latlng: [-8, 159],
    demonym: "Solomon Islander",
    area: 28896,
    gini: null,
    timezones: ["UTC+11:00"],
    borders: [],
    nativeName: "Solomon Islands",
    numericCode: "090",
    currencies: [
      {
        code: "SBD",
        name: "Solomon Islands dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Salomonen",
      es: "Islas Salom\xF3n",
      fr: "\xCEles Salomon",
      ja: "\u30BD\u30ED\u30E2\u30F3\u8AF8\u5CF6",
      it: "Isole Salomone",
      br: "Ilhas Salom\xE3o",
      pt: "Ilhas Salom\xE3o",
      nl: "Salomonseilanden",
      hr: "Solomonski Otoci",
      fa: "\u062C\u0632\u0627\u06CC\u0631 \u0633\u0644\u06CC\u0645\u0627\u0646"
    },
    flag: "https://restcountries.eu/data/slb.svg",
    regionalBlocs: [],
    cioc: "SOL"
  },
  {
    name: "Somalia",
    topLevelDomain: [".so"],
    alpha2Code: "SO",
    alpha3Code: "SOM",
    callingCodes: ["252"],
    capital: "Mogadishu",
    altSpellings: [
      "SO",
      "a\u1E63-\u1E62\u016Bm\u0101l",
      "Federal Republic of Somalia",
      "Jamhuuriyadda Federaalka Soomaaliya",
      "Jumh\u016Briyyat a\u1E63-\u1E62\u016Bm\u0101l al-Fider\u0101liyya"
    ],
    region: "Africa",
    subregion: "Eastern Africa",
    population: 11079e3,
    latlng: [10, 49],
    demonym: "Somali",
    area: 637657,
    gini: null,
    timezones: ["UTC+03:00"],
    borders: ["DJI", "ETH", "KEN"],
    nativeName: "Soomaaliya",
    numericCode: "706",
    currencies: [
      {
        code: "SOS",
        name: "Somali shilling",
        symbol: "Sh"
      }
    ],
    languages: [
      {
        iso639_1: "so",
        iso639_2: "som",
        name: "Somali",
        nativeName: "Soomaaliga"
      },
      {
        iso639_1: "ar",
        iso639_2: "ara",
        name: "Arabic",
        nativeName: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"
      }
    ],
    translations: {
      de: "Somalia",
      es: "Somalia",
      fr: "Somalie",
      ja: "\u30BD\u30DE\u30EA\u30A2",
      it: "Somalia",
      br: "Som\xE1lia",
      pt: "Som\xE1lia",
      nl: "Somali\xEB",
      hr: "Somalija",
      fa: "\u0633\u0648\u0645\u0627\u0644\u06CC"
    },
    flag: "https://restcountries.eu/data/som.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      },
      {
        acronym: "AL",
        name: "Arab League",
        otherAcronyms: [],
        otherNames: [
          "\u062C\u0627\u0645\u0639\u0629 \u0627\u0644\u062F\u0648\u0644 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
          "J\u0101mi\u02BBat ad-Duwal al-\u02BBArab\u012Byah",
          "League of Arab States"
        ]
      }
    ],
    cioc: "SOM"
  },
  {
    name: "South Africa",
    topLevelDomain: [".za"],
    alpha2Code: "ZA",
    alpha3Code: "ZAF",
    callingCodes: ["27"],
    capital: "Pretoria",
    altSpellings: ["ZA", "RSA", "Suid-Afrika", "Republic of South Africa"],
    region: "Africa",
    subregion: "Southern Africa",
    population: 55653654,
    latlng: [-29, 24],
    demonym: "South African",
    area: 1221037,
    gini: 63.1,
    timezones: ["UTC+02:00"],
    borders: ["BWA", "LSO", "MOZ", "NAM", "SWZ", "ZWE"],
    nativeName: "South Africa",
    numericCode: "710",
    currencies: [
      {
        code: "ZAR",
        name: "South African rand",
        symbol: "R"
      }
    ],
    languages: [
      {
        iso639_1: "af",
        iso639_2: "afr",
        name: "Afrikaans",
        nativeName: "Afrikaans"
      },
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      },
      {
        iso639_1: "nr",
        iso639_2: "nbl",
        name: "Southern Ndebele",
        nativeName: "isiNdebele"
      },
      {
        iso639_1: "st",
        iso639_2: "sot",
        name: "Southern Sotho",
        nativeName: "Sesotho"
      },
      {
        iso639_1: "ss",
        iso639_2: "ssw",
        name: "Swati",
        nativeName: "SiSwati"
      },
      {
        iso639_1: "tn",
        iso639_2: "tsn",
        name: "Tswana",
        nativeName: "Setswana"
      },
      {
        iso639_1: "ts",
        iso639_2: "tso",
        name: "Tsonga",
        nativeName: "Xitsonga"
      },
      {
        iso639_1: "ve",
        iso639_2: "ven",
        name: "Venda",
        nativeName: "Tshiven\u1E13a"
      },
      {
        iso639_1: "xh",
        iso639_2: "xho",
        name: "Xhosa",
        nativeName: "isiXhosa"
      },
      {
        iso639_1: "zu",
        iso639_2: "zul",
        name: "Zulu",
        nativeName: "isiZulu"
      }
    ],
    translations: {
      de: "Republik S\xFCdafrika",
      es: "Rep\xFAblica de Sud\xE1frica",
      fr: "Afrique du Sud",
      ja: "\u5357\u30A2\u30D5\u30EA\u30AB",
      it: "Sud Africa",
      br: "Rep\xFAblica Sul-Africana",
      pt: "Rep\xFAblica Sul-Africana",
      nl: "Zuid-Afrika",
      hr: "Ju\u017Enoafri\u010Dka Republika",
      fa: "\u0622\u0641\u0631\u06CC\u0642\u0627\u06CC \u062C\u0646\u0648\u0628\u06CC"
    },
    flag: "https://restcountries.eu/data/zaf.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "RSA"
  },
  {
    name: "South Georgia and the South Sandwich Islands",
    topLevelDomain: [".gs"],
    alpha2Code: "GS",
    alpha3Code: "SGS",
    callingCodes: ["500"],
    capital: "King Edward Point",
    altSpellings: ["GS", "South Georgia and the South Sandwich Islands"],
    region: "Americas",
    subregion: "South America",
    population: 30,
    latlng: [-54.5, -37],
    demonym: "South Georgia and the South Sandwich Islander",
    area: null,
    gini: null,
    timezones: ["UTC-02:00"],
    borders: [],
    nativeName: "South Georgia",
    numericCode: "239",
    currencies: [
      {
        code: "GBP",
        name: "British pound",
        symbol: "\xA3"
      },
      {
        code: "(none)",
        name: null,
        symbol: "\xA3"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "S\xFCdgeorgien und die S\xFCdlichen Sandwichinseln",
      es: "Islas Georgias del Sur y Sandwich del Sur",
      fr: "G\xE9orgie du Sud-et-les \xCEles Sandwich du Sud",
      ja: "\u30B5\u30A6\u30B9\u30B8\u30E7\u30FC\u30B8\u30A2\u30FB\u30B5\u30A6\u30B9\u30B5\u30F3\u30C9\u30A6\u30A3\u30C3\u30C1\u8AF8\u5CF6",
      it: "Georgia del Sud e Isole Sandwich Meridionali",
      br: "Ilhas Ge\xF3rgias do Sul e Sandwich do Sul",
      pt: "Ilhas Ge\xF3rgia do Sul e Sandu\xEDche do Sul",
      nl: "Zuid-Georgia en Zuidelijke Sandwicheilanden",
      hr: "Ju\u017Ena Georgija i oto\u010Dje Ju\u017Eni Sandwich",
      fa: "\u062C\u0632\u0627\u06CC\u0631 \u062C\u0648\u0631\u062C\u06CC\u0627\u06CC \u062C\u0646\u0648\u0628\u06CC \u0648 \u0633\u0627\u0646\u062F\u0648\u06CC\u0686 \u062C\u0646\u0648\u0628\u06CC"
    },
    flag: "https://restcountries.eu/data/sgs.svg",
    regionalBlocs: [
      {
        acronym: "USAN",
        name: "Union of South American Nations",
        otherAcronyms: ["UNASUR", "UNASUL", "UZAN"],
        otherNames: [
          "Uni\xF3n de Naciones Suramericanas",
          "Uni\xE3o de Na\xE7\xF5es Sul-Americanas",
          "Unie van Zuid-Amerikaanse Naties",
          "South American Union"
        ]
      }
    ],
    cioc: ""
  },
  {
    name: "Korea (Republic of)",
    topLevelDomain: [".kr"],
    alpha2Code: "KR",
    alpha3Code: "KOR",
    callingCodes: ["82"],
    capital: "Seoul",
    altSpellings: ["KR", "Republic of Korea"],
    region: "Asia",
    subregion: "Eastern Asia",
    population: 50801405,
    latlng: [37, 127.5],
    demonym: "South Korean",
    area: 100210,
    gini: 31.3,
    timezones: ["UTC+09:00"],
    borders: ["PRK"],
    nativeName: "\uB300\uD55C\uBBFC\uAD6D",
    numericCode: "410",
    currencies: [
      {
        code: "KRW",
        name: "South Korean won",
        symbol: "\u20A9"
      }
    ],
    languages: [
      {
        iso639_1: "ko",
        iso639_2: "kor",
        name: "Korean",
        nativeName: "\uD55C\uAD6D\uC5B4"
      }
    ],
    translations: {
      de: "S\xFCdkorea",
      es: "Corea del Sur",
      fr: "Cor\xE9e du Sud",
      ja: "\u5927\u97D3\u6C11\u56FD",
      it: "Corea del Sud",
      br: "Coreia do Sul",
      pt: "Coreia do Sul",
      nl: "Zuid-Korea",
      hr: "Ju\u017Ena Koreja",
      fa: "\u06A9\u0631\u0647 \u0634\u0645\u0627\u0644\u06CC"
    },
    flag: "https://restcountries.eu/data/kor.svg",
    regionalBlocs: [],
    cioc: "KOR"
  },
  {
    name: "South Sudan",
    topLevelDomain: [".ss"],
    alpha2Code: "SS",
    alpha3Code: "SSD",
    callingCodes: ["211"],
    capital: "Juba",
    altSpellings: ["SS"],
    region: "Africa",
    subregion: "Middle Africa",
    population: 12131e3,
    latlng: [7, 30],
    demonym: "South Sudanese",
    area: 619745,
    gini: 45.5,
    timezones: ["UTC+03:00"],
    borders: ["CAF", "COD", "ETH", "KEN", "SDN", "UGA"],
    nativeName: "South Sudan",
    numericCode: "728",
    currencies: [
      {
        code: "SSP",
        name: "South Sudanese pound",
        symbol: "\xA3"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "S\xFCdsudan",
      es: "Sud\xE1n del Sur",
      fr: "Soudan du Sud",
      ja: "\u5357\u30B9\u30FC\u30C0\u30F3",
      it: "Sudan del sud",
      br: "Sud\xE3o do Sul",
      pt: "Sud\xE3o do Sul",
      nl: "Zuid-Soedan",
      hr: "Ju\u017Eni Sudan",
      fa: "\u0633\u0648\u062F\u0627\u0646 \u062C\u0646\u0648\u0628\u06CC"
    },
    flag: "https://restcountries.eu/data/ssd.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: ""
  },
  {
    name: "Spain",
    topLevelDomain: [".es"],
    alpha2Code: "ES",
    alpha3Code: "ESP",
    callingCodes: ["34"],
    capital: "Madrid",
    altSpellings: ["ES", "Kingdom of Spain", "Reino de Espa\xF1a"],
    region: "Europe",
    subregion: "Southern Europe",
    population: 46438422,
    latlng: [40, -4],
    demonym: "Spanish",
    area: 505992,
    gini: 34.7,
    timezones: ["UTC", "UTC+01:00"],
    borders: ["AND", "FRA", "GIB", "PRT", "MAR"],
    nativeName: "Espa\xF1a",
    numericCode: "724",
    currencies: [
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      }
    ],
    languages: [
      {
        iso639_1: "es",
        iso639_2: "spa",
        name: "Spanish",
        nativeName: "Espa\xF1ol"
      }
    ],
    translations: {
      de: "Spanien",
      es: "Espa\xF1a",
      fr: "Espagne",
      ja: "\u30B9\u30DA\u30A4\u30F3",
      it: "Spagna",
      br: "Espanha",
      pt: "Espanha",
      nl: "Spanje",
      hr: "\u0160panjolska",
      fa: "\u0627\u0633\u067E\u0627\u0646\u06CC\u0627"
    },
    flag: "https://restcountries.eu/data/esp.svg",
    regionalBlocs: [
      {
        acronym: "EU",
        name: "European Union",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "ESP"
  },
  {
    name: "Sri Lanka",
    topLevelDomain: [".lk"],
    alpha2Code: "LK",
    alpha3Code: "LKA",
    callingCodes: ["94"],
    capital: "Colombo",
    altSpellings: [
      "LK",
      "ila\u1E45kai",
      "Democratic Socialist Republic of Sri Lanka"
    ],
    region: "Asia",
    subregion: "Southern Asia",
    population: 20966e3,
    latlng: [7, 81],
    demonym: "Sri Lankan",
    area: 65610,
    gini: 40.3,
    timezones: ["UTC+05:30"],
    borders: ["IND"],
    nativeName: "\u015Br\u012B la\u1E43k\u0101va",
    numericCode: "144",
    currencies: [
      {
        code: "LKR",
        name: "Sri Lankan rupee",
        symbol: "Rs"
      }
    ],
    languages: [
      {
        iso639_1: "si",
        iso639_2: "sin",
        name: "Sinhalese",
        nativeName: "\u0DC3\u0DD2\u0D82\u0DC4\u0DBD"
      },
      {
        iso639_1: "ta",
        iso639_2: "tam",
        name: "Tamil",
        nativeName: "\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD"
      }
    ],
    translations: {
      de: "Sri Lanka",
      es: "Sri Lanka",
      fr: "Sri Lanka",
      ja: "\u30B9\u30EA\u30E9\u30F3\u30AB",
      it: "Sri Lanka",
      br: "Sri Lanka",
      pt: "Sri Lanka",
      nl: "Sri Lanka",
      hr: "\u0160ri Lanka",
      fa: "\u0633\u0631\u06CC\u200C\u0644\u0627\u0646\u06A9\u0627"
    },
    flag: "https://restcountries.eu/data/lka.svg",
    regionalBlocs: [
      {
        acronym: "SAARC",
        name: "South Asian Association for Regional Cooperation",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "SRI"
  },
  {
    name: "Sudan",
    topLevelDomain: [".sd"],
    alpha2Code: "SD",
    alpha3Code: "SDN",
    callingCodes: ["249"],
    capital: "Khartoum",
    altSpellings: ["SD", "Republic of the Sudan", "Jumh\u016Br\u012Byat as-S\u016Bd\u0101n"],
    region: "Africa",
    subregion: "Northern Africa",
    population: 39598700,
    latlng: [15, 30],
    demonym: "Sudanese",
    area: 1886068,
    gini: 35.3,
    timezones: ["UTC+03:00"],
    borders: ["CAF", "TCD", "EGY", "ERI", "ETH", "LBY", "SSD"],
    nativeName: "\u0627\u0644\u0633\u0648\u062F\u0627\u0646",
    numericCode: "729",
    currencies: [
      {
        code: "SDG",
        name: "Sudanese pound",
        symbol: "\u062C.\u0633."
      }
    ],
    languages: [
      {
        iso639_1: "ar",
        iso639_2: "ara",
        name: "Arabic",
        nativeName: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"
      },
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Sudan",
      es: "Sud\xE1n",
      fr: "Soudan",
      ja: "\u30B9\u30FC\u30C0\u30F3",
      it: "Sudan",
      br: "Sud\xE3o",
      pt: "Sud\xE3o",
      nl: "Soedan",
      hr: "Sudan",
      fa: "\u0633\u0648\u062F\u0627\u0646"
    },
    flag: "https://restcountries.eu/data/sdn.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      },
      {
        acronym: "AL",
        name: "Arab League",
        otherAcronyms: [],
        otherNames: [
          "\u062C\u0627\u0645\u0639\u0629 \u0627\u0644\u062F\u0648\u0644 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
          "J\u0101mi\u02BBat ad-Duwal al-\u02BBArab\u012Byah",
          "League of Arab States"
        ]
      }
    ],
    cioc: "SUD"
  },
  {
    name: "Suriname",
    topLevelDomain: [".sr"],
    alpha2Code: "SR",
    alpha3Code: "SUR",
    callingCodes: ["597"],
    capital: "Paramaribo",
    altSpellings: [
      "SR",
      "Sarnam",
      "Sranangron",
      "Republic of Suriname",
      "Republiek Suriname"
    ],
    region: "Americas",
    subregion: "South America",
    population: 541638,
    latlng: [4, -56],
    demonym: "Surinamer",
    area: 163820,
    gini: 52.9,
    timezones: ["UTC-03:00"],
    borders: ["BRA", "GUF", "FRA", "GUY"],
    nativeName: "Suriname",
    numericCode: "740",
    currencies: [
      {
        code: "SRD",
        name: "Surinamese dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "nl",
        iso639_2: "nld",
        name: "Dutch",
        nativeName: "Nederlands"
      }
    ],
    translations: {
      de: "Suriname",
      es: "Surinam",
      fr: "Surinam",
      ja: "\u30B9\u30EA\u30CA\u30E0",
      it: "Suriname",
      br: "Suriname",
      pt: "Suriname",
      nl: "Suriname",
      hr: "Surinam",
      fa: "\u0633\u0648\u0631\u06CC\u0646\u0627\u0645"
    },
    flag: "https://restcountries.eu/data/sur.svg",
    regionalBlocs: [
      {
        acronym: "CARICOM",
        name: "Caribbean Community",
        otherAcronyms: [],
        otherNames: [
          "Comunidad del Caribe",
          "Communaut\xE9 Carib\xE9enne",
          "Caribische Gemeenschap"
        ]
      },
      {
        acronym: "USAN",
        name: "Union of South American Nations",
        otherAcronyms: ["UNASUR", "UNASUL", "UZAN"],
        otherNames: [
          "Uni\xF3n de Naciones Suramericanas",
          "Uni\xE3o de Na\xE7\xF5es Sul-Americanas",
          "Unie van Zuid-Amerikaanse Naties",
          "South American Union"
        ]
      }
    ],
    cioc: "SUR"
  },
  {
    name: "Svalbard and Jan Mayen",
    topLevelDomain: [".sj"],
    alpha2Code: "SJ",
    alpha3Code: "SJM",
    callingCodes: ["4779"],
    capital: "Longyearbyen",
    altSpellings: ["SJ", "Svalbard and Jan Mayen Islands"],
    region: "Europe",
    subregion: "Northern Europe",
    population: 2562,
    latlng: [78, 20],
    demonym: "Norwegian",
    area: null,
    gini: null,
    timezones: ["UTC+01:00"],
    borders: [],
    nativeName: "Svalbard og Jan Mayen",
    numericCode: "744",
    currencies: [
      {
        code: "NOK",
        name: "Norwegian krone",
        symbol: "kr"
      }
    ],
    languages: [
      {
        iso639_1: "no",
        iso639_2: "nor",
        name: "Norwegian",
        nativeName: "Norsk"
      }
    ],
    translations: {
      de: "Svalbard und Jan Mayen",
      es: "Islas Svalbard y Jan Mayen",
      fr: "Svalbard et Jan Mayen",
      ja: "\u30B9\u30F4\u30A1\u30FC\u30EB\u30D0\u30EB\u8AF8\u5CF6\u304A\u3088\u3073\u30E4\u30F3\u30DE\u30A4\u30A8\u30F3\u5CF6",
      it: "Svalbard e Jan Mayen",
      br: "Svalbard",
      pt: "Svalbard",
      nl: "Svalbard en Jan Mayen",
      hr: "Svalbard i Jan Mayen",
      fa: "\u0633\u0648\u0627\u0644\u0628\u0627\u0631\u062F \u0648 \u06CC\u0627\u0646 \u0645\u0627\u06CC\u0646"
    },
    flag: "https://restcountries.eu/data/sjm.svg",
    regionalBlocs: [],
    cioc: ""
  },
  {
    name: "Swaziland",
    topLevelDomain: [".sz"],
    alpha2Code: "SZ",
    alpha3Code: "SWZ",
    callingCodes: ["268"],
    capital: "Lobamba",
    altSpellings: [
      "SZ",
      "weSwatini",
      "Swatini",
      "Ngwane",
      "Kingdom of Swaziland",
      "Umbuso waseSwatini"
    ],
    region: "Africa",
    subregion: "Southern Africa",
    population: 1132657,
    latlng: [-26.5, 31.5],
    demonym: "Swazi",
    area: 17364,
    gini: 51.5,
    timezones: ["UTC+02:00"],
    borders: ["MOZ", "ZAF"],
    nativeName: "Swaziland",
    numericCode: "748",
    currencies: [
      {
        code: "SZL",
        name: "Swazi lilangeni",
        symbol: "L"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      },
      {
        iso639_1: "ss",
        iso639_2: "ssw",
        name: "Swati",
        nativeName: "SiSwati"
      }
    ],
    translations: {
      de: "Swasiland",
      es: "Suazilandia",
      fr: "Swaziland",
      ja: "\u30B9\u30EF\u30B8\u30E9\u30F3\u30C9",
      it: "Swaziland",
      br: "Suazil\xE2ndia",
      pt: "Suazil\xE2ndia",
      nl: "Swaziland",
      hr: "Svazi",
      fa: "\u0633\u0648\u0627\u0632\u06CC\u0644\u0646\u062F"
    },
    flag: "https://restcountries.eu/data/swz.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "SWZ"
  },
  {
    name: "Sweden",
    topLevelDomain: [".se"],
    alpha2Code: "SE",
    alpha3Code: "SWE",
    callingCodes: ["46"],
    capital: "Stockholm",
    altSpellings: ["SE", "Kingdom of Sweden", "Konungariket Sverige"],
    region: "Europe",
    subregion: "Northern Europe",
    population: 9894888,
    latlng: [62, 15],
    demonym: "Swedish",
    area: 450295,
    gini: 25,
    timezones: ["UTC+01:00"],
    borders: ["FIN", "NOR"],
    nativeName: "Sverige",
    numericCode: "752",
    currencies: [
      {
        code: "SEK",
        name: "Swedish krona",
        symbol: "kr"
      }
    ],
    languages: [
      {
        iso639_1: "sv",
        iso639_2: "swe",
        name: "Swedish",
        nativeName: "svenska"
      }
    ],
    translations: {
      de: "Schweden",
      es: "Suecia",
      fr: "Su\xE8de",
      ja: "\u30B9\u30A6\u30A7\u30FC\u30C7\u30F3",
      it: "Svezia",
      br: "Su\xE9cia",
      pt: "Su\xE9cia",
      nl: "Zweden",
      hr: "\u0160vedska",
      fa: "\u0633\u0648\u0626\u062F"
    },
    flag: "https://restcountries.eu/data/swe.svg",
    regionalBlocs: [
      {
        acronym: "EU",
        name: "European Union",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "SWE"
  },
  {
    name: "Switzerland",
    topLevelDomain: [".ch"],
    alpha2Code: "CH",
    alpha3Code: "CHE",
    callingCodes: ["41"],
    capital: "Bern",
    altSpellings: [
      "CH",
      "Swiss Confederation",
      "Schweiz",
      "Suisse",
      "Svizzera",
      "Svizra"
    ],
    region: "Europe",
    subregion: "Western Europe",
    population: 8341600,
    latlng: [47, 8],
    demonym: "Swiss",
    area: 41284,
    gini: 33.7,
    timezones: ["UTC+01:00"],
    borders: ["AUT", "FRA", "ITA", "LIE", "DEU"],
    nativeName: "Schweiz",
    numericCode: "756",
    currencies: [
      {
        code: "CHF",
        name: "Swiss franc",
        symbol: "Fr"
      }
    ],
    languages: [
      {
        iso639_1: "de",
        iso639_2: "deu",
        name: "German",
        nativeName: "Deutsch"
      },
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      },
      {
        iso639_1: "it",
        iso639_2: "ita",
        name: "Italian",
        nativeName: "Italiano"
      }
    ],
    translations: {
      de: "Schweiz",
      es: "Suiza",
      fr: "Suisse",
      ja: "\u30B9\u30A4\u30B9",
      it: "Svizzera",
      br: "Su\xED\xE7a",
      pt: "Su\xED\xE7a",
      nl: "Zwitserland",
      hr: "\u0160vicarska",
      fa: "\u0633\u0648\u0626\u06CC\u0633"
    },
    flag: "https://restcountries.eu/data/che.svg",
    regionalBlocs: [
      {
        acronym: "EFTA",
        name: "European Free Trade Association",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "SUI"
  },
  {
    name: "Syrian Arab Republic",
    topLevelDomain: [".sy"],
    alpha2Code: "SY",
    alpha3Code: "SYR",
    callingCodes: ["963"],
    capital: "Damascus",
    altSpellings: [
      "SY",
      "Syrian Arab Republic",
      "Al-Jumh\u016Br\u012Byah Al-\u02BBArab\u012Byah As-S\u016Br\u012Byah"
    ],
    region: "Asia",
    subregion: "Western Asia",
    population: 18564e3,
    latlng: [35, 38],
    demonym: "Syrian",
    area: 185180,
    gini: 35.8,
    timezones: ["UTC+02:00"],
    borders: ["IRQ", "ISR", "JOR", "LBN", "TUR"],
    nativeName: "\u0633\u0648\u0631\u064A\u0627",
    numericCode: "760",
    currencies: [
      {
        code: "SYP",
        name: "Syrian pound",
        symbol: "\xA3"
      }
    ],
    languages: [
      {
        iso639_1: "ar",
        iso639_2: "ara",
        name: "Arabic",
        nativeName: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"
      }
    ],
    translations: {
      de: "Syrien",
      es: "Siria",
      fr: "Syrie",
      ja: "\u30B7\u30EA\u30A2\u30FB\u30A2\u30E9\u30D6\u5171\u548C\u56FD",
      it: "Siria",
      br: "S\xEDria",
      pt: "S\xEDria",
      nl: "Syri\xEB",
      hr: "Sirija",
      fa: "\u0633\u0648\u0631\u06CC\u0647"
    },
    flag: "https://restcountries.eu/data/syr.svg",
    regionalBlocs: [
      {
        acronym: "AL",
        name: "Arab League",
        otherAcronyms: [],
        otherNames: [
          "\u062C\u0627\u0645\u0639\u0629 \u0627\u0644\u062F\u0648\u0644 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
          "J\u0101mi\u02BBat ad-Duwal al-\u02BBArab\u012Byah",
          "League of Arab States"
        ]
      }
    ],
    cioc: "SYR"
  },
  {
    name: "Taiwan",
    topLevelDomain: [".tw"],
    alpha2Code: "TW",
    alpha3Code: "TWN",
    callingCodes: ["886"],
    capital: "Taipei",
    altSpellings: [
      "TW",
      "T\xE1iw\u0101n",
      "Republic of China",
      "\u4E2D\u83EF\u6C11\u570B",
      "Zh\u014Dnghu\xE1 M\xEDngu\xF3"
    ],
    region: "Asia",
    subregion: "Eastern Asia",
    population: 23503349,
    latlng: [23.5, 121],
    demonym: "Taiwanese",
    area: 36193,
    gini: null,
    timezones: ["UTC+08:00"],
    borders: [],
    nativeName: "\u81FA\u7063",
    numericCode: "158",
    currencies: [
      {
        code: "TWD",
        name: "New Taiwan dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "zh",
        iso639_2: "zho",
        name: "Chinese",
        nativeName: "\u4E2D\u6587 (Zh\u014Dngw\xE9n)"
      }
    ],
    translations: {
      de: "Taiwan",
      es: "Taiw\xE1n",
      fr: "Ta\xEFwan",
      ja: "\u53F0\u6E7E\uFF08\u4E2D\u83EF\u6C11\u56FD\uFF09",
      it: "Taiwan",
      br: "Taiwan",
      pt: "Taiwan",
      nl: "Taiwan",
      hr: "Tajvan",
      fa: "\u062A\u0627\u06CC\u0648\u0627\u0646"
    },
    flag: "https://restcountries.eu/data/twn.svg",
    regionalBlocs: [],
    cioc: "TPE"
  },
  {
    name: "Tajikistan",
    topLevelDomain: [".tj"],
    alpha2Code: "TJ",
    alpha3Code: "TJK",
    callingCodes: ["992"],
    capital: "Dushanbe",
    altSpellings: [
      "TJ",
      "To\xE7ikiston",
      "Republic of Tajikistan",
      "\u04B6\u0443\u043C\u04B3\u0443\u0440\u0438\u0438 \u0422\u043E\u04B7\u0438\u043A\u0438\u0441\u0442\u043E\u043D",
      "\xC7umhuriyi To\xE7ikiston"
    ],
    region: "Asia",
    subregion: "Central Asia",
    population: 8593600,
    latlng: [39, 71],
    demonym: "Tadzhik",
    area: 143100,
    gini: 30.8,
    timezones: ["UTC+05:00"],
    borders: ["AFG", "CHN", "KGZ", "UZB"],
    nativeName: "\u0422\u043E\u04B7\u0438\u043A\u0438\u0441\u0442\u043E\u043D",
    numericCode: "762",
    currencies: [
      {
        code: "TJS",
        name: "Tajikistani somoni",
        symbol: "\u0405\u041C"
      }
    ],
    languages: [
      {
        iso639_1: "tg",
        iso639_2: "tgk",
        name: "Tajik",
        nativeName: "\u0442\u043E\u04B7\u0438\u043A\u04E3"
      },
      {
        iso639_1: "ru",
        iso639_2: "rus",
        name: "Russian",
        nativeName: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439"
      }
    ],
    translations: {
      de: "Tadschikistan",
      es: "Tayikist\xE1n",
      fr: "Tadjikistan",
      ja: "\u30BF\u30B8\u30AD\u30B9\u30BF\u30F3",
      it: "Tagikistan",
      br: "Tajiquist\xE3o",
      pt: "Tajiquist\xE3o",
      nl: "Tadzjikistan",
      hr: "Ta\u0111ikistan",
      fa: "\u062A\u0627\u062C\u06CC\u06A9\u0633\u062A\u0627\u0646"
    },
    flag: "https://restcountries.eu/data/tjk.svg",
    regionalBlocs: [],
    cioc: "TJK"
  },
  {
    name: "Tanzania, United Republic of",
    topLevelDomain: [".tz"],
    alpha2Code: "TZ",
    alpha3Code: "TZA",
    callingCodes: ["255"],
    capital: "Dodoma",
    altSpellings: [
      "TZ",
      "United Republic of Tanzania",
      "Jamhuri ya Muungano wa Tanzania"
    ],
    region: "Africa",
    subregion: "Eastern Africa",
    population: 55155e3,
    latlng: [-6, 35],
    demonym: "Tanzanian",
    area: 945087,
    gini: 37.6,
    timezones: ["UTC+03:00"],
    borders: ["BDI", "COD", "KEN", "MWI", "MOZ", "RWA", "UGA", "ZMB"],
    nativeName: "Tanzania",
    numericCode: "834",
    currencies: [
      {
        code: "TZS",
        name: "Tanzanian shilling",
        symbol: "Sh"
      }
    ],
    languages: [
      {
        iso639_1: "sw",
        iso639_2: "swa",
        name: "Swahili",
        nativeName: "Kiswahili"
      },
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Tansania",
      es: "Tanzania",
      fr: "Tanzanie",
      ja: "\u30BF\u30F3\u30B6\u30CB\u30A2",
      it: "Tanzania",
      br: "Tanz\xE2nia",
      pt: "Tanz\xE2nia",
      nl: "Tanzania",
      hr: "Tanzanija",
      fa: "\u062A\u0627\u0646\u0632\u0627\u0646\u06CC\u0627"
    },
    flag: "https://restcountries.eu/data/tza.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "TAN"
  },
  {
    name: "Thailand",
    topLevelDomain: [".th"],
    alpha2Code: "TH",
    alpha3Code: "THA",
    callingCodes: ["66"],
    capital: "Bangkok",
    altSpellings: [
      "TH",
      "Prathet",
      "Thai",
      "Kingdom of Thailand",
      "\u0E23\u0E32\u0E0A\u0E2D\u0E32\u0E13\u0E32\u0E08\u0E31\u0E01\u0E23\u0E44\u0E17\u0E22",
      "Ratcha Anachak Thai"
    ],
    region: "Asia",
    subregion: "South-Eastern Asia",
    population: 65327652,
    latlng: [15, 100],
    demonym: "Thai",
    area: 513120,
    gini: 40,
    timezones: ["UTC+07:00"],
    borders: ["MMR", "KHM", "LAO", "MYS"],
    nativeName: "\u0E1B\u0E23\u0E30\u0E40\u0E17\u0E28\u0E44\u0E17\u0E22",
    numericCode: "764",
    currencies: [
      {
        code: "THB",
        name: "Thai baht",
        symbol: "\u0E3F"
      }
    ],
    languages: [
      {
        iso639_1: "th",
        iso639_2: "tha",
        name: "Thai",
        nativeName: "\u0E44\u0E17\u0E22"
      }
    ],
    translations: {
      de: "Thailand",
      es: "Tailandia",
      fr: "Tha\xEFlande",
      ja: "\u30BF\u30A4",
      it: "Tailandia",
      br: "Tail\xE2ndia",
      pt: "Tail\xE2ndia",
      nl: "Thailand",
      hr: "Tajland",
      fa: "\u062A\u0627\u06CC\u0644\u0646\u062F"
    },
    flag: "https://restcountries.eu/data/tha.svg",
    regionalBlocs: [
      {
        acronym: "ASEAN",
        name: "Association of Southeast Asian Nations",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "THA"
  },
  {
    name: "Timor-Leste",
    topLevelDomain: [".tl"],
    alpha2Code: "TL",
    alpha3Code: "TLS",
    callingCodes: ["670"],
    capital: "Dili",
    altSpellings: [
      "TL",
      "East Timor",
      "Democratic Republic of Timor-Leste",
      "Rep\xFAblica Democr\xE1tica de Timor-Leste",
      "Rep\xFAblika Demokr\xE1tika Tim\xF3r-Leste"
    ],
    region: "Asia",
    subregion: "South-Eastern Asia",
    population: 1167242,
    latlng: [-8.83333333, 125.91666666],
    demonym: "East Timorese",
    area: 14874,
    gini: 31.9,
    timezones: ["UTC+09:00"],
    borders: ["IDN"],
    nativeName: "Timor-Leste",
    numericCode: "626",
    currencies: [
      {
        code: "USD",
        name: "United States dollar",
        symbol: "$"
      },
      {
        code: null,
        name: null,
        symbol: null
      }
    ],
    languages: [
      {
        iso639_1: "pt",
        iso639_2: "por",
        name: "Portuguese",
        nativeName: "Portugu\xEAs"
      }
    ],
    translations: {
      de: "Timor-Leste",
      es: "Timor Oriental",
      fr: "Timor oriental",
      ja: "\u6771\u30C6\u30A3\u30E2\u30FC\u30EB",
      it: "Timor Est",
      br: "Timor Leste",
      pt: "Timor Leste",
      nl: "Oost-Timor",
      hr: "Isto\u010Dni Timor",
      fa: "\u062A\u06CC\u0645\u0648\u0631 \u0634\u0631\u0642\u06CC"
    },
    flag: "https://restcountries.eu/data/tls.svg",
    regionalBlocs: [],
    cioc: "TLS"
  },
  {
    name: "Togo",
    topLevelDomain: [".tg"],
    alpha2Code: "TG",
    alpha3Code: "TGO",
    callingCodes: ["228"],
    capital: "Lom\xE9",
    altSpellings: [
      "TG",
      "Togolese",
      "Togolese Republic",
      "R\xE9publique Togolaise"
    ],
    region: "Africa",
    subregion: "Western Africa",
    population: 7143e3,
    latlng: [8, 1.16666666],
    demonym: "Togolese",
    area: 56785,
    gini: 34.4,
    timezones: ["UTC"],
    borders: ["BEN", "BFA", "GHA"],
    nativeName: "Togo",
    numericCode: "768",
    currencies: [
      {
        code: "XOF",
        name: "West African CFA franc",
        symbol: "Fr"
      }
    ],
    languages: [
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      }
    ],
    translations: {
      de: "Togo",
      es: "Togo",
      fr: "Togo",
      ja: "\u30C8\u30FC\u30B4",
      it: "Togo",
      br: "Togo",
      pt: "Togo",
      nl: "Togo",
      hr: "Togo",
      fa: "\u062A\u0648\u06AF\u0648"
    },
    flag: "https://restcountries.eu/data/tgo.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "TOG"
  },
  {
    name: "Tokelau",
    topLevelDomain: [".tk"],
    alpha2Code: "TK",
    alpha3Code: "TKL",
    callingCodes: ["690"],
    capital: "Fakaofo",
    altSpellings: ["TK"],
    region: "Oceania",
    subregion: "Polynesia",
    population: 1411,
    latlng: [-9, -172],
    demonym: "Tokelauan",
    area: 12,
    gini: null,
    timezones: ["UTC+13:00"],
    borders: [],
    nativeName: "Tokelau",
    numericCode: "772",
    currencies: [
      {
        code: "NZD",
        name: "New Zealand dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Tokelau",
      es: "Islas Tokelau",
      fr: "Tokelau",
      ja: "\u30C8\u30B1\u30E9\u30A6",
      it: "Isole Tokelau",
      br: "Tokelau",
      pt: "Toquelau",
      nl: "Tokelau",
      hr: "Tokelau",
      fa: "\u062A\u0648\u06A9\u0644\u0627\u0626\u0648"
    },
    flag: "https://restcountries.eu/data/tkl.svg",
    regionalBlocs: [],
    cioc: ""
  },
  {
    name: "Tonga",
    topLevelDomain: [".to"],
    alpha2Code: "TO",
    alpha3Code: "TON",
    callingCodes: ["676"],
    capital: "Nuku'alofa",
    altSpellings: ["TO"],
    region: "Oceania",
    subregion: "Polynesia",
    population: 103252,
    latlng: [-20, -175],
    demonym: "Tongan",
    area: 747,
    gini: null,
    timezones: ["UTC+13:00"],
    borders: [],
    nativeName: "Tonga",
    numericCode: "776",
    currencies: [
      {
        code: "TOP",
        name: "Tongan pa\u02BBanga",
        symbol: "T$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      },
      {
        iso639_1: "to",
        iso639_2: "ton",
        name: "Tonga (Tonga Islands)",
        nativeName: "faka Tonga"
      }
    ],
    translations: {
      de: "Tonga",
      es: "Tonga",
      fr: "Tonga",
      ja: "\u30C8\u30F3\u30AC",
      it: "Tonga",
      br: "Tonga",
      pt: "Tonga",
      nl: "Tonga",
      hr: "Tonga",
      fa: "\u062A\u0648\u0646\u06AF\u0627"
    },
    flag: "https://restcountries.eu/data/ton.svg",
    regionalBlocs: [],
    cioc: "TGA"
  },
  {
    name: "Trinidad and Tobago",
    topLevelDomain: [".tt"],
    alpha2Code: "TT",
    alpha3Code: "TTO",
    callingCodes: ["1868"],
    capital: "Port of Spain",
    altSpellings: ["TT", "Republic of Trinidad and Tobago"],
    region: "Americas",
    subregion: "Caribbean",
    population: 1349667,
    latlng: [11, -61],
    demonym: "Trinidadian",
    area: 5130,
    gini: 40.3,
    timezones: ["UTC-04:00"],
    borders: [],
    nativeName: "Trinidad and Tobago",
    numericCode: "780",
    currencies: [
      {
        code: "TTD",
        name: "Trinidad and Tobago dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Trinidad und Tobago",
      es: "Trinidad y Tobago",
      fr: "Trinit\xE9 et Tobago",
      ja: "\u30C8\u30EA\u30CB\u30C0\u30FC\u30C9\u30FB\u30C8\u30D0\u30B4",
      it: "Trinidad e Tobago",
      br: "Trinidad e Tobago",
      pt: "Trindade e Tobago",
      nl: "Trinidad en Tobago",
      hr: "Trinidad i Tobago",
      fa: "\u062A\u0631\u06CC\u0646\u06CC\u062F\u0627\u062F \u0648 \u062A\u0648\u0628\u0627\u06AF\u0648"
    },
    flag: "https://restcountries.eu/data/tto.svg",
    regionalBlocs: [
      {
        acronym: "CARICOM",
        name: "Caribbean Community",
        otherAcronyms: [],
        otherNames: [
          "Comunidad del Caribe",
          "Communaut\xE9 Carib\xE9enne",
          "Caribische Gemeenschap"
        ]
      }
    ],
    cioc: "TTO"
  },
  {
    name: "Tunisia",
    topLevelDomain: [".tn"],
    alpha2Code: "TN",
    alpha3Code: "TUN",
    callingCodes: ["216"],
    capital: "Tunis",
    altSpellings: ["TN", "Republic of Tunisia", "al-Jumh\u016Briyyah at-T\u016Bnisiyyah"],
    region: "Africa",
    subregion: "Northern Africa",
    population: 11154400,
    latlng: [34, 9],
    demonym: "Tunisian",
    area: 163610,
    gini: 41.4,
    timezones: ["UTC+01:00"],
    borders: ["DZA", "LBY"],
    nativeName: "\u062A\u0648\u0646\u0633",
    numericCode: "788",
    currencies: [
      {
        code: "TND",
        name: "Tunisian dinar",
        symbol: "\u062F.\u062A"
      }
    ],
    languages: [
      {
        iso639_1: "ar",
        iso639_2: "ara",
        name: "Arabic",
        nativeName: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"
      }
    ],
    translations: {
      de: "Tunesien",
      es: "T\xFAnez",
      fr: "Tunisie",
      ja: "\u30C1\u30E5\u30CB\u30B8\u30A2",
      it: "Tunisia",
      br: "Tun\xEDsia",
      pt: "Tun\xEDsia",
      nl: "Tunesi\xEB",
      hr: "Tunis",
      fa: "\u062A\u0648\u0646\u0633"
    },
    flag: "https://restcountries.eu/data/tun.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      },
      {
        acronym: "AL",
        name: "Arab League",
        otherAcronyms: [],
        otherNames: [
          "\u062C\u0627\u0645\u0639\u0629 \u0627\u0644\u062F\u0648\u0644 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
          "J\u0101mi\u02BBat ad-Duwal al-\u02BBArab\u012Byah",
          "League of Arab States"
        ]
      }
    ],
    cioc: "TUN"
  },
  {
    name: "Turkey",
    topLevelDomain: [".tr"],
    alpha2Code: "TR",
    alpha3Code: "TUR",
    callingCodes: ["90"],
    capital: "Ankara",
    altSpellings: [
      "TR",
      "Turkiye",
      "Republic of Turkey",
      "T\xFCrkiye Cumhuriyeti"
    ],
    region: "Asia",
    subregion: "Western Asia",
    population: 78741053,
    latlng: [39, 35],
    demonym: "Turkish",
    area: 783562,
    gini: 39,
    timezones: ["UTC+03:00"],
    borders: ["ARM", "AZE", "BGR", "GEO", "GRC", "IRN", "IRQ", "SYR"],
    nativeName: "T\xFCrkiye",
    numericCode: "792",
    currencies: [
      {
        code: "TRY",
        name: "Turkish lira",
        symbol: null
      }
    ],
    languages: [
      {
        iso639_1: "tr",
        iso639_2: "tur",
        name: "Turkish",
        nativeName: "T\xFCrk\xE7e"
      }
    ],
    translations: {
      de: "T\xFCrkei",
      es: "Turqu\xEDa",
      fr: "Turquie",
      ja: "\u30C8\u30EB\u30B3",
      it: "Turchia",
      br: "Turquia",
      pt: "Turquia",
      nl: "Turkije",
      hr: "Turska",
      fa: "\u062A\u0631\u06A9\u06CC\u0647"
    },
    flag: "https://restcountries.eu/data/tur.svg",
    regionalBlocs: [],
    cioc: "TUR"
  },
  {
    name: "Turkmenistan",
    topLevelDomain: [".tm"],
    alpha2Code: "TM",
    alpha3Code: "TKM",
    callingCodes: ["993"],
    capital: "Ashgabat",
    altSpellings: ["TM"],
    region: "Asia",
    subregion: "Central Asia",
    population: 4751120,
    latlng: [40, 60],
    demonym: "Turkmen",
    area: 488100,
    gini: 40.8,
    timezones: ["UTC+05:00"],
    borders: ["AFG", "IRN", "KAZ", "UZB"],
    nativeName: "T\xFCrkmenistan",
    numericCode: "795",
    currencies: [
      {
        code: "TMT",
        name: "Turkmenistan manat",
        symbol: "m"
      }
    ],
    languages: [
      {
        iso639_1: "tk",
        iso639_2: "tuk",
        name: "Turkmen",
        nativeName: "T\xFCrkmen"
      },
      {
        iso639_1: "ru",
        iso639_2: "rus",
        name: "Russian",
        nativeName: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439"
      }
    ],
    translations: {
      de: "Turkmenistan",
      es: "Turkmenist\xE1n",
      fr: "Turkm\xE9nistan",
      ja: "\u30C8\u30EB\u30AF\u30E1\u30CB\u30B9\u30BF\u30F3",
      it: "Turkmenistan",
      br: "Turcomenist\xE3o",
      pt: "Turquemenist\xE3o",
      nl: "Turkmenistan",
      hr: "Turkmenistan",
      fa: "\u062A\u0631\u06A9\u0645\u0646\u0633\u062A\u0627\u0646"
    },
    flag: "https://restcountries.eu/data/tkm.svg",
    regionalBlocs: [],
    cioc: "TKM"
  },
  {
    name: "Turks and Caicos Islands",
    topLevelDomain: [".tc"],
    alpha2Code: "TC",
    alpha3Code: "TCA",
    callingCodes: ["1649"],
    capital: "Cockburn Town",
    altSpellings: ["TC"],
    region: "Americas",
    subregion: "Caribbean",
    population: 31458,
    latlng: [21.75, -71.58333333],
    demonym: "Turks and Caicos Islander",
    area: 948,
    gini: null,
    timezones: ["UTC-04:00"],
    borders: [],
    nativeName: "Turks and Caicos Islands",
    numericCode: "796",
    currencies: [
      {
        code: "USD",
        name: "United States dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Turks- und Caicosinseln",
      es: "Islas Turks y Caicos",
      fr: "\xCEles Turques-et-Ca\xEFques",
      ja: "\u30BF\u30FC\u30AF\u30B9\u30FB\u30AB\u30A4\u30B3\u30B9\u8AF8\u5CF6",
      it: "Isole Turks e Caicos",
      br: "Ilhas Turcas e Caicos",
      pt: "Ilhas Turcas e Caicos",
      nl: "Turks- en Caicoseilanden",
      hr: "Otoci Turks i Caicos",
      fa: "\u062C\u0632\u0627\u06CC\u0631 \u062A\u0648\u0631\u06A9\u0633 \u0648 \u06A9\u0627\u06CC\u06A9\u0648\u0633"
    },
    flag: "https://restcountries.eu/data/tca.svg",
    regionalBlocs: [],
    cioc: ""
  },
  {
    name: "Tuvalu",
    topLevelDomain: [".tv"],
    alpha2Code: "TV",
    alpha3Code: "TUV",
    callingCodes: ["688"],
    capital: "Funafuti",
    altSpellings: ["TV"],
    region: "Oceania",
    subregion: "Polynesia",
    population: 10640,
    latlng: [-8, 178],
    demonym: "Tuvaluan",
    area: 26,
    gini: null,
    timezones: ["UTC+12:00"],
    borders: [],
    nativeName: "Tuvalu",
    numericCode: "798",
    currencies: [
      {
        code: "AUD",
        name: "Australian dollar",
        symbol: "$"
      },
      {
        code: "TVD[G]",
        name: "Tuvaluan dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Tuvalu",
      es: "Tuvalu",
      fr: "Tuvalu",
      ja: "\u30C4\u30D0\u30EB",
      it: "Tuvalu",
      br: "Tuvalu",
      pt: "Tuvalu",
      nl: "Tuvalu",
      hr: "Tuvalu",
      fa: "\u062A\u0648\u0648\u0627\u0644\u0648"
    },
    flag: "https://restcountries.eu/data/tuv.svg",
    regionalBlocs: [],
    cioc: "TUV"
  },
  {
    name: "Uganda",
    topLevelDomain: [".ug"],
    alpha2Code: "UG",
    alpha3Code: "UGA",
    callingCodes: ["256"],
    capital: "Kampala",
    altSpellings: ["UG", "Republic of Uganda", "Jamhuri ya Uganda"],
    region: "Africa",
    subregion: "Eastern Africa",
    population: 33860700,
    latlng: [1, 32],
    demonym: "Ugandan",
    area: 241550,
    gini: 44.3,
    timezones: ["UTC+03:00"],
    borders: ["COD", "KEN", "RWA", "SSD", "TZA"],
    nativeName: "Uganda",
    numericCode: "800",
    currencies: [
      {
        code: "UGX",
        name: "Ugandan shilling",
        symbol: "Sh"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      },
      {
        iso639_1: "sw",
        iso639_2: "swa",
        name: "Swahili",
        nativeName: "Kiswahili"
      }
    ],
    translations: {
      de: "Uganda",
      es: "Uganda",
      fr: "Uganda",
      ja: "\u30A6\u30AC\u30F3\u30C0",
      it: "Uganda",
      br: "Uganda",
      pt: "Uganda",
      nl: "Oeganda",
      hr: "Uganda",
      fa: "\u0627\u0648\u06AF\u0627\u0646\u062F\u0627"
    },
    flag: "https://restcountries.eu/data/uga.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "UGA"
  },
  {
    name: "Ukraine",
    topLevelDomain: [".ua"],
    alpha2Code: "UA",
    alpha3Code: "UKR",
    callingCodes: ["380"],
    capital: "Kiev",
    altSpellings: ["UA", "Ukrayina"],
    region: "Europe",
    subregion: "Eastern Europe",
    population: 42692393,
    latlng: [49, 32],
    demonym: "Ukrainian",
    area: 603700,
    gini: 26.4,
    timezones: ["UTC+02:00"],
    borders: ["BLR", "HUN", "MDA", "POL", "ROU", "RUS", "SVK"],
    nativeName: "\u0423\u043A\u0440\u0430\u0457\u043D\u0430",
    numericCode: "804",
    currencies: [
      {
        code: "UAH",
        name: "Ukrainian hryvnia",
        symbol: "\u20B4"
      }
    ],
    languages: [
      {
        iso639_1: "uk",
        iso639_2: "ukr",
        name: "Ukrainian",
        nativeName: "\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430"
      }
    ],
    translations: {
      de: "Ukraine",
      es: "Ucrania",
      fr: "Ukraine",
      ja: "\u30A6\u30AF\u30E9\u30A4\u30CA",
      it: "Ucraina",
      br: "Ucr\xE2nia",
      pt: "Ucr\xE2nia",
      nl: "Oekra\xEFne",
      hr: "Ukrajina",
      fa: "\u0648\u06A9\u0631\u0627\u06CC\u0646"
    },
    flag: "https://restcountries.eu/data/ukr.svg",
    regionalBlocs: [],
    cioc: "UKR"
  },
  {
    name: "United Arab Emirates",
    topLevelDomain: [".ae"],
    alpha2Code: "AE",
    alpha3Code: "ARE",
    callingCodes: ["971"],
    capital: "Abu Dhabi",
    altSpellings: ["AE", "UAE"],
    region: "Asia",
    subregion: "Western Asia",
    population: 9856e3,
    latlng: [24, 54],
    demonym: "Emirati",
    area: 83600,
    gini: null,
    timezones: ["UTC+04"],
    borders: ["OMN", "SAU"],
    nativeName: "\u062F\u0648\u0644\u0629 \u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062A \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u0645\u062A\u062D\u062F\u0629",
    numericCode: "784",
    currencies: [
      {
        code: "AED",
        name: "United Arab Emirates dirham",
        symbol: "\u062F.\u0625"
      }
    ],
    languages: [
      {
        iso639_1: "ar",
        iso639_2: "ara",
        name: "Arabic",
        nativeName: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"
      }
    ],
    translations: {
      de: "Vereinigte Arabische Emirate",
      es: "Emiratos \xC1rabes Unidos",
      fr: "\xC9mirats arabes unis",
      ja: "\u30A2\u30E9\u30D6\u9996\u9577\u56FD\u9023\u90A6",
      it: "Emirati Arabi Uniti",
      br: "Emirados \xE1rabes Unidos",
      pt: "Emirados \xE1rabes Unidos",
      nl: "Verenigde Arabische Emiraten",
      hr: "Ujedinjeni Arapski Emirati",
      fa: "\u0627\u0645\u0627\u0631\u0627\u062A \u0645\u062A\u062D\u062F\u0647 \u0639\u0631\u0628\u06CC"
    },
    flag: "https://restcountries.eu/data/are.svg",
    regionalBlocs: [
      {
        acronym: "AL",
        name: "Arab League",
        otherAcronyms: [],
        otherNames: [
          "\u062C\u0627\u0645\u0639\u0629 \u0627\u0644\u062F\u0648\u0644 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
          "J\u0101mi\u02BBat ad-Duwal al-\u02BBArab\u012Byah",
          "League of Arab States"
        ]
      }
    ],
    cioc: "UAE"
  },
  {
    name: "United Kingdom of Great Britain and Northern Ireland",
    topLevelDomain: [".uk"],
    alpha2Code: "GB",
    alpha3Code: "GBR",
    callingCodes: ["44"],
    capital: "London",
    altSpellings: ["GB", "UK", "Great Britain"],
    region: "Europe",
    subregion: "Northern Europe",
    population: 6511e4,
    latlng: [54, -2],
    demonym: "British",
    area: 242900,
    gini: 34,
    timezones: [
      "UTC-08:00",
      "UTC-05:00",
      "UTC-04:00",
      "UTC-03:00",
      "UTC-02:00",
      "UTC",
      "UTC+01:00",
      "UTC+02:00",
      "UTC+06:00"
    ],
    borders: ["IRL"],
    nativeName: "United Kingdom",
    numericCode: "826",
    currencies: [
      {
        code: "GBP",
        name: "British pound",
        symbol: "\xA3"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Vereinigtes K\xF6nigreich",
      es: "Reino Unido",
      fr: "Royaume-Uni",
      ja: "\u30A4\u30AE\u30EA\u30B9",
      it: "Regno Unito",
      br: "Reino Unido",
      pt: "Reino Unido",
      nl: "Verenigd Koninkrijk",
      hr: "Ujedinjeno Kraljevstvo",
      fa: "\u0628\u0631\u06CC\u062A\u0627\u0646\u06CC\u0627\u06CC \u06A9\u0628\u06CC\u0631 \u0648 \u0627\u06CC\u0631\u0644\u0646\u062F \u0634\u0645\u0627\u0644\u06CC"
    },
    flag: "https://restcountries.eu/data/gbr.svg",
    regionalBlocs: [
      {
        acronym: "EU",
        name: "European Union",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "GBR"
  },
  {
    name: "United States of America",
    topLevelDomain: [".us"],
    alpha2Code: "US",
    alpha3Code: "USA",
    callingCodes: ["1"],
    capital: "Washington, D.C.",
    altSpellings: ["US", "USA", "United States of America"],
    region: "Americas",
    subregion: "Northern America",
    population: 323947e3,
    latlng: [38, -97],
    demonym: "American",
    area: 9629091,
    gini: 48,
    timezones: [
      "UTC-12:00",
      "UTC-11:00",
      "UTC-10:00",
      "UTC-09:00",
      "UTC-08:00",
      "UTC-07:00",
      "UTC-06:00",
      "UTC-05:00",
      "UTC-04:00",
      "UTC+10:00",
      "UTC+12:00"
    ],
    borders: ["CAN", "MEX"],
    nativeName: "United States",
    numericCode: "840",
    currencies: [
      {
        code: "USD",
        name: "United States dollar",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Vereinigte Staaten von Amerika",
      es: "Estados Unidos",
      fr: "\xC9tats-Unis",
      ja: "\u30A2\u30E1\u30EA\u30AB\u5408\u8846\u56FD",
      it: "Stati Uniti D'America",
      br: "Estados Unidos",
      pt: "Estados Unidos",
      nl: "Verenigde Staten",
      hr: "Sjedinjene Ameri\u010Dke Dr\u017Eave",
      fa: "\u0627\u06CC\u0627\u0644\u0627\u062A \u0645\u062A\u062D\u062F\u0647 \u0622\u0645\u0631\u06CC\u06A9\u0627"
    },
    flag: "https://restcountries.eu/data/usa.svg",
    regionalBlocs: [
      {
        acronym: "NAFTA",
        name: "North American Free Trade Agreement",
        otherAcronyms: [],
        otherNames: [
          "Tratado de Libre Comercio de Am\xE9rica del Norte",
          "Accord de Libre-\xE9change Nord-Am\xE9ricain"
        ]
      }
    ],
    cioc: "USA"
  },
  {
    name: "Uruguay",
    topLevelDomain: [".uy"],
    alpha2Code: "UY",
    alpha3Code: "URY",
    callingCodes: ["598"],
    capital: "Montevideo",
    altSpellings: [
      "UY",
      "Oriental Republic of Uruguay",
      "Rep\xFAblica Oriental del Uruguay"
    ],
    region: "Americas",
    subregion: "South America",
    population: 3480222,
    latlng: [-33, -56],
    demonym: "Uruguayan",
    area: 181034,
    gini: 39.7,
    timezones: ["UTC-03:00"],
    borders: ["ARG", "BRA"],
    nativeName: "Uruguay",
    numericCode: "858",
    currencies: [
      {
        code: "UYU",
        name: "Uruguayan peso",
        symbol: "$"
      }
    ],
    languages: [
      {
        iso639_1: "es",
        iso639_2: "spa",
        name: "Spanish",
        nativeName: "Espa\xF1ol"
      }
    ],
    translations: {
      de: "Uruguay",
      es: "Uruguay",
      fr: "Uruguay",
      ja: "\u30A6\u30EB\u30B0\u30A2\u30A4",
      it: "Uruguay",
      br: "Uruguai",
      pt: "Uruguai",
      nl: "Uruguay",
      hr: "Urugvaj",
      fa: "\u0627\u0631\u0648\u06AF\u0648\u0626\u0647"
    },
    flag: "https://restcountries.eu/data/ury.svg",
    regionalBlocs: [
      {
        acronym: "USAN",
        name: "Union of South American Nations",
        otherAcronyms: ["UNASUR", "UNASUL", "UZAN"],
        otherNames: [
          "Uni\xF3n de Naciones Suramericanas",
          "Uni\xE3o de Na\xE7\xF5es Sul-Americanas",
          "Unie van Zuid-Amerikaanse Naties",
          "South American Union"
        ]
      }
    ],
    cioc: "URU"
  },
  {
    name: "Uzbekistan",
    topLevelDomain: [".uz"],
    alpha2Code: "UZ",
    alpha3Code: "UZB",
    callingCodes: ["998"],
    capital: "Tashkent",
    altSpellings: [
      "UZ",
      "Republic of Uzbekistan",
      "O\u2018zbekiston Respublikasi",
      "\u040E\u0437\u0431\u0435\u043A\u0438\u0441\u0442\u043E\u043D \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0441\u0438"
    ],
    region: "Asia",
    subregion: "Central Asia",
    population: 31576400,
    latlng: [41, 64],
    demonym: "Uzbekistani",
    area: 447400,
    gini: 36.7,
    timezones: ["UTC+05:00"],
    borders: ["AFG", "KAZ", "KGZ", "TJK", "TKM"],
    nativeName: "O\u2018zbekiston",
    numericCode: "860",
    currencies: [
      {
        code: "UZS",
        name: "Uzbekistani so'm",
        symbol: null
      }
    ],
    languages: [
      {
        iso639_1: "uz",
        iso639_2: "uzb",
        name: "Uzbek",
        nativeName: "O\u02BBzbek"
      },
      {
        iso639_1: "ru",
        iso639_2: "rus",
        name: "Russian",
        nativeName: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439"
      }
    ],
    translations: {
      de: "Usbekistan",
      es: "Uzbekist\xE1n",
      fr: "Ouzb\xE9kistan",
      ja: "\u30A6\u30BA\u30D9\u30AD\u30B9\u30BF\u30F3",
      it: "Uzbekistan",
      br: "Uzbequist\xE3o",
      pt: "Usbequist\xE3o",
      nl: "Oezbekistan",
      hr: "Uzbekistan",
      fa: "\u0627\u0632\u0628\u06A9\u0633\u062A\u0627\u0646"
    },
    flag: "https://restcountries.eu/data/uzb.svg",
    regionalBlocs: [],
    cioc: "UZB"
  },
  {
    name: "Vanuatu",
    topLevelDomain: [".vu"],
    alpha2Code: "VU",
    alpha3Code: "VUT",
    callingCodes: ["678"],
    capital: "Port Vila",
    altSpellings: [
      "VU",
      "Republic of Vanuatu",
      "Ripablik blong Vanuatu",
      "R\xE9publique de Vanuatu"
    ],
    region: "Oceania",
    subregion: "Melanesia",
    population: 277500,
    latlng: [-16, 167],
    demonym: "Ni-Vanuatu",
    area: 12189,
    gini: null,
    timezones: ["UTC+11:00"],
    borders: [],
    nativeName: "Vanuatu",
    numericCode: "548",
    currencies: [
      {
        code: "VUV",
        name: "Vanuatu vatu",
        symbol: "Vt"
      }
    ],
    languages: [
      {
        iso639_1: "bi",
        iso639_2: "bis",
        name: "Bislama",
        nativeName: "Bislama"
      },
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      },
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      }
    ],
    translations: {
      de: "Vanuatu",
      es: "Vanuatu",
      fr: "Vanuatu",
      ja: "\u30D0\u30CC\u30A2\u30C4",
      it: "Vanuatu",
      br: "Vanuatu",
      pt: "Vanuatu",
      nl: "Vanuatu",
      hr: "Vanuatu",
      fa: "\u0648\u0627\u0646\u0648\u0627\u062A\u0648"
    },
    flag: "https://restcountries.eu/data/vut.svg",
    regionalBlocs: [],
    cioc: "VAN"
  },
  {
    name: "Venezuela (Bolivarian Republic of)",
    topLevelDomain: [".ve"],
    alpha2Code: "VE",
    alpha3Code: "VEN",
    callingCodes: ["58"],
    capital: "Caracas",
    altSpellings: [
      "VE",
      "Bolivarian Republic of Venezuela",
      "Rep\xFAblica Bolivariana de Venezuela"
    ],
    region: "Americas",
    subregion: "South America",
    population: 31028700,
    latlng: [8, -66],
    demonym: "Venezuelan",
    area: 916445,
    gini: 44.8,
    timezones: ["UTC-04:00"],
    borders: ["BRA", "COL", "GUY"],
    nativeName: "Venezuela",
    numericCode: "862",
    currencies: [
      {
        code: "VEF",
        name: "Venezuelan bol\xEDvar",
        symbol: "Bs F"
      }
    ],
    languages: [
      {
        iso639_1: "es",
        iso639_2: "spa",
        name: "Spanish",
        nativeName: "Espa\xF1ol"
      }
    ],
    translations: {
      de: "Venezuela",
      es: "Venezuela",
      fr: "Venezuela",
      ja: "\u30D9\u30CD\u30BA\u30A8\u30E9\u30FB\u30DC\u30EA\u30D0\u30EB\u5171\u548C\u56FD",
      it: "Venezuela",
      br: "Venezuela",
      pt: "Venezuela",
      nl: "Venezuela",
      hr: "Venezuela",
      fa: "\u0648\u0646\u0632\u0648\u0626\u0644\u0627"
    },
    flag: "https://restcountries.eu/data/ven.svg",
    regionalBlocs: [
      {
        acronym: "USAN",
        name: "Union of South American Nations",
        otherAcronyms: ["UNASUR", "UNASUL", "UZAN"],
        otherNames: [
          "Uni\xF3n de Naciones Suramericanas",
          "Uni\xE3o de Na\xE7\xF5es Sul-Americanas",
          "Unie van Zuid-Amerikaanse Naties",
          "South American Union"
        ]
      }
    ],
    cioc: "VEN"
  },
  {
    name: "Viet Nam",
    topLevelDomain: [".vn"],
    alpha2Code: "VN",
    alpha3Code: "VNM",
    callingCodes: ["84"],
    capital: "Hanoi",
    altSpellings: [
      "VN",
      "Socialist Republic of Vietnam",
      "C\u1ED9ng h\xF2a X\xE3 h\u1ED9i ch\u1EE7 ngh\u0129a Vi\u1EC7t Nam"
    ],
    region: "Asia",
    subregion: "South-Eastern Asia",
    population: 927e5,
    latlng: [16.16666666, 107.83333333],
    demonym: "Vietnamese",
    area: 331212,
    gini: 35.6,
    timezones: ["UTC+07:00"],
    borders: ["KHM", "CHN", "LAO"],
    nativeName: "Vi\u1EC7t Nam",
    numericCode: "704",
    currencies: [
      {
        code: "VND",
        name: "Vietnamese \u0111\u1ED3ng",
        symbol: "\u20AB"
      }
    ],
    languages: [
      {
        iso639_1: "vi",
        iso639_2: "vie",
        name: "Vietnamese",
        nativeName: "Ti\u1EBFng Vi\u1EC7t"
      }
    ],
    translations: {
      de: "Vietnam",
      es: "Vietnam",
      fr: "Vi\xEAt Nam",
      ja: "\u30D9\u30C8\u30CA\u30E0",
      it: "Vietnam",
      br: "Vietn\xE3",
      pt: "Vietname",
      nl: "Vietnam",
      hr: "Vijetnam",
      fa: "\u0648\u06CC\u062A\u0646\u0627\u0645"
    },
    flag: "https://restcountries.eu/data/vnm.svg",
    regionalBlocs: [
      {
        acronym: "ASEAN",
        name: "Association of Southeast Asian Nations",
        otherAcronyms: [],
        otherNames: []
      }
    ],
    cioc: "VIE"
  },
  {
    name: "Wallis and Futuna",
    topLevelDomain: [".wf"],
    alpha2Code: "WF",
    alpha3Code: "WLF",
    callingCodes: ["681"],
    capital: "Mata-Utu",
    altSpellings: [
      "WF",
      "Territory of the Wallis and Futuna Islands",
      "Territoire des \xEEles Wallis et Futuna"
    ],
    region: "Oceania",
    subregion: "Polynesia",
    population: 11750,
    latlng: [-13.3, -176.2],
    demonym: "Wallis and Futuna Islander",
    area: 142,
    gini: null,
    timezones: ["UTC+12:00"],
    borders: [],
    nativeName: "Wallis et Futuna",
    numericCode: "876",
    currencies: [
      {
        code: "XPF",
        name: "CFP franc",
        symbol: "Fr"
      }
    ],
    languages: [
      {
        iso639_1: "fr",
        iso639_2: "fra",
        name: "French",
        nativeName: "fran\xE7ais"
      }
    ],
    translations: {
      de: "Wallis und Futuna",
      es: "Wallis y Futuna",
      fr: "Wallis-et-Futuna",
      ja: "\u30A6\u30A9\u30EA\u30B9\u30FB\u30D5\u30C4\u30CA",
      it: "Wallis e Futuna",
      br: "Wallis e Futuna",
      pt: "Wallis e Futuna",
      nl: "Wallis en Futuna",
      hr: "Wallis i Fortuna",
      fa: "\u0648\u0627\u0644\u06CC\u0633 \u0648 \u0641\u0648\u062A\u0648\u0646\u0627"
    },
    flag: "https://restcountries.eu/data/wlf.svg",
    regionalBlocs: [],
    cioc: ""
  },
  {
    name: "Western Sahara",
    topLevelDomain: [".eh"],
    alpha2Code: "EH",
    alpha3Code: "ESH",
    callingCodes: ["212"],
    capital: "El Aai\xFAn",
    altSpellings: ["EH", "Tane\u1E93roft Tutrimt"],
    region: "Africa",
    subregion: "Northern Africa",
    population: 510713,
    latlng: [24.5, -13],
    demonym: "Sahrawi",
    area: 266e3,
    gini: null,
    timezones: ["UTC+00:00"],
    borders: ["DZA", "MRT", "MAR"],
    nativeName: "\u0627\u0644\u0635\u062D\u0631\u0627\u0621 \u0627\u0644\u063A\u0631\u0628\u064A\u0629",
    numericCode: "732",
    currencies: [
      {
        code: "MAD",
        name: "Moroccan dirham",
        symbol: "\u062F.\u0645."
      },
      {
        code: "DZD",
        name: "Algerian dinar",
        symbol: "\u062F.\u062C"
      }
    ],
    languages: [
      {
        iso639_1: "es",
        iso639_2: "spa",
        name: "Spanish",
        nativeName: "Espa\xF1ol"
      }
    ],
    translations: {
      de: "Westsahara",
      es: "Sahara Occidental",
      fr: "Sahara Occidental",
      ja: "\u897F\u30B5\u30CF\u30E9",
      it: "Sahara Occidentale",
      br: "Saara Ocidental",
      pt: "Saara Ocidental",
      nl: "Westelijke Sahara",
      hr: "Zapadna Sahara",
      fa: "\u062C\u0645\u0647\u0648\u0631\u06CC \u062F\u0645\u0648\u06A9\u0631\u0627\u062A\u06CC\u06A9 \u0639\u0631\u0628\u06CC \u0635\u062D\u0631\u0627"
    },
    flag: "https://restcountries.eu/data/esh.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: ""
  },
  {
    name: "Yemen",
    topLevelDomain: [".ye"],
    alpha2Code: "YE",
    alpha3Code: "YEM",
    callingCodes: ["967"],
    capital: "Sana'a",
    altSpellings: ["YE", "Yemeni Republic", "al-Jumh\u016Briyyah al-Yamaniyyah"],
    region: "Asia",
    subregion: "Western Asia",
    population: 27478e3,
    latlng: [15, 48],
    demonym: "Yemeni",
    area: 527968,
    gini: 37.7,
    timezones: ["UTC+03:00"],
    borders: ["OMN", "SAU"],
    nativeName: "\u0627\u0644\u064A\u064E\u0645\u064E\u0646",
    numericCode: "887",
    currencies: [
      {
        code: "YER",
        name: "Yemeni rial",
        symbol: "\uFDFC"
      }
    ],
    languages: [
      {
        iso639_1: "ar",
        iso639_2: "ara",
        name: "Arabic",
        nativeName: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"
      }
    ],
    translations: {
      de: "Jemen",
      es: "Yemen",
      fr: "Y\xE9men",
      ja: "\u30A4\u30A8\u30E1\u30F3",
      it: "Yemen",
      br: "I\xEAmen",
      pt: "I\xE9men",
      nl: "Jemen",
      hr: "Jemen",
      fa: "\u06CC\u0645\u0646"
    },
    flag: "https://restcountries.eu/data/yem.svg",
    regionalBlocs: [
      {
        acronym: "AL",
        name: "Arab League",
        otherAcronyms: [],
        otherNames: [
          "\u062C\u0627\u0645\u0639\u0629 \u0627\u0644\u062F\u0648\u0644 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
          "J\u0101mi\u02BBat ad-Duwal al-\u02BBArab\u012Byah",
          "League of Arab States"
        ]
      }
    ],
    cioc: "YEM"
  },
  {
    name: "Zambia",
    topLevelDomain: [".zm"],
    alpha2Code: "ZM",
    alpha3Code: "ZMB",
    callingCodes: ["260"],
    capital: "Lusaka",
    altSpellings: ["ZM", "Republic of Zambia"],
    region: "Africa",
    subregion: "Eastern Africa",
    population: 15933883,
    latlng: [-15, 30],
    demonym: "Zambian",
    area: 752612,
    gini: 54.6,
    timezones: ["UTC+02:00"],
    borders: ["AGO", "BWA", "COD", "MWI", "MOZ", "NAM", "TZA", "ZWE"],
    nativeName: "Zambia",
    numericCode: "894",
    currencies: [
      {
        code: "ZMW",
        name: "Zambian kwacha",
        symbol: "ZK"
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      }
    ],
    translations: {
      de: "Sambia",
      es: "Zambia",
      fr: "Zambie",
      ja: "\u30B6\u30F3\u30D3\u30A2",
      it: "Zambia",
      br: "Z\xE2mbia",
      pt: "Z\xE2mbia",
      nl: "Zambia",
      hr: "Zambija",
      fa: "\u0632\u0627\u0645\u0628\u06CC\u0627"
    },
    flag: "https://restcountries.eu/data/zmb.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "ZAM"
  },
  {
    name: "Zimbabwe",
    topLevelDomain: [".zw"],
    alpha2Code: "ZW",
    alpha3Code: "ZWE",
    callingCodes: ["263"],
    capital: "Harare",
    altSpellings: ["ZW", "Republic of Zimbabwe"],
    region: "Africa",
    subregion: "Eastern Africa",
    population: 14240168,
    latlng: [-20, 30],
    demonym: "Zimbabwean",
    area: 390757,
    gini: null,
    timezones: ["UTC+02:00"],
    borders: ["BWA", "MOZ", "ZAF", "ZMB"],
    nativeName: "Zimbabwe",
    numericCode: "716",
    currencies: [
      {
        code: "BWP",
        name: "Botswana pula",
        symbol: "P"
      },
      {
        code: "GBP",
        name: "British pound",
        symbol: "\xA3"
      },
      {
        code: "CNY",
        name: "Chinese yuan",
        symbol: "\xA5"
      },
      {
        code: "EUR",
        name: "Euro",
        symbol: "\u20AC"
      },
      {
        code: "INR",
        name: "Indian rupee",
        symbol: "\u20B9"
      },
      {
        code: "JPY",
        name: "Japanese yen",
        symbol: "\xA5"
      },
      {
        code: "ZAR",
        name: "South African rand",
        symbol: "Rs"
      },
      {
        code: "USD",
        name: "United States dollar",
        symbol: "$"
      },
      {
        code: "(none)",
        name: null,
        symbol: null
      }
    ],
    languages: [
      {
        iso639_1: "en",
        iso639_2: "eng",
        name: "English",
        nativeName: "English"
      },
      {
        iso639_1: "sn",
        iso639_2: "sna",
        name: "Shona",
        nativeName: "chiShona"
      },
      {
        iso639_1: "nd",
        iso639_2: "nde",
        name: "Northern Ndebele",
        nativeName: "isiNdebele"
      }
    ],
    translations: {
      de: "Simbabwe",
      es: "Zimbabue",
      fr: "Zimbabwe",
      ja: "\u30B8\u30F3\u30D0\u30D6\u30A8",
      it: "Zimbabwe",
      br: "Zimbabwe",
      pt: "Zimbabu\xE9",
      nl: "Zimbabwe",
      hr: "Zimbabve",
      fa: "\u0632\u06CC\u0645\u0628\u0627\u0648\u0647"
    },
    flag: "https://restcountries.eu/data/zwe.svg",
    regionalBlocs: [
      {
        acronym: "AU",
        name: "African Union",
        otherAcronyms: [],
        otherNames: [
          "\u0627\u0644\u0627\u062A\u062D\u0627\u062F \u0627\u0644\u0623\u0641\u0631\u064A\u0642\u064A",
          "Union africaine",
          "Uni\xE3o Africana",
          "Uni\xF3n Africana",
          "Umoja wa Afrika"
        ]
      }
    ],
    cioc: "ZIM"
  }
];

// src/routes/countries.ts
var Countries = new Hono2();
Countries.get("/all-country", async ({ env, req, res, json: json2 }) => {
  const countries = CountryTable(env);
  const data = await countries.findAll();
  return json2({
    message: "liste des Pays",
    data
  });
});
Countries.get("/save-countries", async ({ json: json2, env }) => {
  const countries = CountryTable(env);
  PAYS.forEach(async (element) => {
    await countries.create({
      id: v4_default(),
      name: element.name,
      code_2: element.alpha2Code,
      code_3: element.alpha3Code,
      phoneCode: element.callingCodes[0]
    });
  });
  return json2({
    message: "pays sauvegard\xE9"
  });
});
var countries_default = Countries;

// src/routes/auth.ts
var auth = new Hono2();
auth.post("/login", async ({ req, res, json: json2, env }) => {
  await UsersAccount(env).createTable();
  const Users = UsersAccount(env);
  const Notes2 = Notes(env);
  const user = await req.json();
  const JWT_SECRET = env.JWT_SECRET;
  JWTService.initialize(JWT_SECRET);
  try {
    const check_user_exist = await Users.findOne({
      where: {
        email: user.email
      }
    });
    if (check_user_exist) {
      const modifiedUser = await Users.update(check_user_exist.id, {
        ...check_user_exist,
        lastlogin: (/* @__PURE__ */ new Date()).toISOString(),
        modified: (/* @__PURE__ */ new Date()).toISOString()
      });
      if (modifiedUser) {
        const notes2 = await Notes2.findAll({
          where: {
            creator: modifiedUser?.id
          },
          count: true
        });
        const tokens2 = await JWTService.generateTokenPair(
          modifiedUser.id,
          modifiedUser.email,
          modifiedUser.church_status
        );
        return json2({
          success: true,
          user: {
            ...modifiedUser,
            notes: {
              count: notes2.count
            }
          },
          ...tokens2
        });
      }
    }
    const tokens = await JWTService.generateTokenPair(
      user.id,
      user.email,
      user.church_status
    );
    const user_info = await Users.create({
      id: v4_default(),
      ...user,
      lastlogin: (/* @__PURE__ */ new Date()).toISOString(),
      created: (/* @__PURE__ */ new Date()).toISOString(),
      modified: (/* @__PURE__ */ new Date()).toISOString()
    });
    return json2({
      status: "success",
      data: {
        ...user_info,
        notes: {
          count: 0
        }
      },
      ...tokens
    });
  } catch (error) {
    console.log(error);
    return json2({
      message: "il y a une erreur " + error,
      data: null
    });
  }
});
auth.post("/refresh", async (c) => {
  const JWT_SECRET = c.env.JWT_SECRET;
  JWTService.initialize(JWT_SECRET);
  try {
    const { refreshToken } = await c.req.json();
    if (!refreshToken) {
      return c.json({ error: "Refresh token manquant" }, 400);
    }
    const payload = await JWTService.verifyToken(refreshToken);
    if (!payload || payload.type !== "refresh") {
      return c.json({ error: "Refresh token invalide" }, 401);
    }
    const blacklist = new TokenBlacklist(c.env);
    if (await blacklist.isBlacklisted(refreshToken)) {
      return c.json({ error: "Token r\xE9voqu\xE9" }, 401);
    }
    const Users = UsersAccount(c.env);
    const user = await Users.findById(payload.userId);
    if (!user) {
      return c.json({ error: "Utilisateur non trouv\xE9" }, 404);
    }
    const newTokens = await JWTService.generateTokenPair(
      user.id,
      user.email,
      user.church_status
    );
    await blacklist.add(refreshToken, user.id, payload.exp);
    return c.json({
      status: "success",
      ...newTokens
    });
  } catch (error) {
    console.error("[Refresh] Erreur:", error);
    return c.json({ error: "Erreur serveur" }, 500);
  }
});
auth.post("/logout", authMiddleware, async (c) => {
  const Users = UsersAccount(c.env);
  const JWT_SECRET = c.env.JWT_SECRET;
  JWTService.initialize(JWT_SECRET);
  try {
    const token = JWTService.extractToken(c.req.header("Authorization"));
    if (!token) {
      return c.json({ error: "Token manquant" }, 400);
    }
    const payload = await JWTService.verifyToken(token);
    if (!payload) {
      return c.json({ error: "Token invalide" }, 401);
    }
    const check_user_exist = await Users.findOne({
      where: {
        email: payload.email
      }
    });
    if (check_user_exist) {
      await Users.update(check_user_exist.id, {
        lastlogout: (/* @__PURE__ */ new Date()).toISOString(),
        modified: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    const blacklist = new TokenBlacklist(c.env);
    await blacklist.add(token, payload.userId, payload.exp);
    return c.json({
      success: true,
      message: "D\xE9connexion r\xE9ussie"
    });
  } catch (error) {
    console.error("[Logout] Erreur:", error);
    return c.json({ error: "Erreur serveur" }, 500);
  }
});
auth.get("/me", authMiddleware, async (c) => {
  const user = c.get("user");
  const Users = UsersAccount(c.env);
  const fullUser = await Users.findById(user.userId);
  if (!fullUser) {
    return c.json({ error: "Utilisateur non trouv\xE9", user }, 404);
  }
  return c.json({
    success: true,
    user: {
      id: fullUser.id,
      email: fullUser.email,
      name: fullUser.name,
      first_name: fullUser.first_name,
      photo: fullUser.photo,
      biography: fullUser.biography,
      role: fullUser.church_status,
      lastlogin: fullUser.lastlogin,
      lastlogout: fullUser.lastlogout
    }
  });
});
var auth_default = auth;

// src/routes/syncState.ts
var syncState = new Hono2();
var ALLOWED_TABLES = [
  "notes",
  "groupes",
  "articles",
  "publish",
  "comments",
  "appreciations"
];
var getD1 = /* @__PURE__ */ __name((env) => env?.DB ?? null, "getD1");
syncState.get("/", async (c) => {
  const D1 = getD1(c.env);
  if (!D1) return c.json({ error: "D1 indisponible" }, 500);
  const since = Number(c.req.query("since") ?? 0);
  const table = c.req.query("table");
  const limit = Math.min(Number(c.req.query("limit") ?? 500), 1e3);
  if (table && !ALLOWED_TABLES.includes(table)) {
    return c.json({ error: `table inconnue: ${table}` }, 400);
  }
  try {
    const stmt = table ? D1.prepare(
      `SELECT table_name, element_id, version, updatedAt, updatedBy, deleted
           FROM sync_state
           WHERE version > ? AND table_name = ?
           ORDER BY version ASC
           LIMIT ?`
    ).bind(since, table, limit) : D1.prepare(
      `SELECT table_name, element_id, version, updatedAt, updatedBy, deleted
           FROM sync_state
           WHERE version > ?
           ORDER BY version ASC
           LIMIT ?`
    ).bind(since, limit);
    const { results } = await stmt.all();
    const maxVersion = results.reduce(
      (m, r) => r.version > m ? r.version : m,
      since
    );
    return c.json({
      success: true,
      since,
      count: results.length,
      maxVersion,
      rows: results
    });
  } catch (e) {
    console.log("[sync-state] error:", e);
    return c.json({ error: "Erreur lecture sync_state" }, 500);
  }
});
syncState.get("/full", async (c) => {
  const D1 = getD1(c.env);
  if (!D1) return c.json({ error: "D1 indisponible" }, 500);
  const table = c.req.query("table");
  const since = Number(c.req.query("since") ?? 0);
  const limit = Math.min(Number(c.req.query("limit") ?? 200), 500);
  if (!table || !ALLOWED_TABLES.includes(table)) {
    return c.json({ error: `table requise parmi ${ALLOWED_TABLES.join(",")}` }, 400);
  }
  try {
    const { results } = await D1.prepare(
      `SELECT s.table_name, s.element_id, s.version, s.updatedAt as syncUpdatedAt,
              s.updatedBy, s.deleted, t.*
       FROM sync_state s
       LEFT JOIN ${table} t ON t.id = s.element_id
       WHERE s.version > ? AND s.table_name = ?
       ORDER BY s.version ASC
       LIMIT ?`
    ).bind(since, table, limit).all();
    const maxVersion = results.reduce(
      (m, r) => r.version > m ? r.version : m,
      since
    );
    return c.json({
      success: true,
      table,
      since,
      count: results.length,
      maxVersion,
      rows: results
    });
  } catch (e) {
    console.log("[sync-state/full] error:", e);
    return c.json({ error: "Erreur lecture sync_state/full" }, 500);
  }
});
var syncState_default = syncState;

// src/routes/notifications.ts
var notifications = new Hono2();
notifications.post("/register-token", authMiddleware, async ({ req, env, json: json2, status }) => {
  const user = req.get("user");
  const { token, platform, deviceId } = await req.json();
  if (!token || !platform || !deviceId) {
    status(400);
    return json2({ success: false, message: "token, platform et deviceId sont requis" });
  }
  const PushTokens = PushTokensTable(env);
  try {
    const existing = await PushTokens.findOne({ where: { token } });
    if (existing) {
      const updated = await PushTokens.update(existing.id, {
        userid: user.userId,
        platform,
        deviceId,
        modified: (/* @__PURE__ */ new Date()).toISOString()
      });
      return json2({ success: true, data: updated });
    }
    const created = await PushTokens.create({
      id: v4_default(),
      userid: user.userId,
      token,
      platform,
      deviceId
    });
    return json2({ success: true, data: created });
  } catch (error) {
    status(500);
    return json2({ success: false, error: String(error) });
  }
});
notifications.delete("/register-token", authMiddleware, async ({ req, env, json: json2, status }) => {
  const user = req.get("user");
  const { token } = await req.json();
  const PushTokens = PushTokensTable(env);
  try {
    const existing = await PushTokens.findOne({ where: { token, userid: user.userId } });
    if (!existing) {
      return json2({ success: true, message: "Aucun token \xE0 supprimer" });
    }
    await PushTokens.delete(existing.id);
    return json2({ success: true });
  } catch (error) {
    status(500);
    return json2({ success: false, error: String(error) });
  }
});
notifications.post("/comment-reply", authMiddleware, async ({ req, env, json: json2, status }) => {
  const user = req.get("user");
  const { articleId, commentId, articleTitle, content } = await req.json();
  if (!articleId || !commentId) {
    status(400);
    return json2({ success: false, message: "articleId et commentId sont requis" });
  }
  try {
    const { getDB: getDB3 } = await Promise.resolve().then(() => (init_instant(), instant_exports));
    const db2 = getDB3(env);
    const { comments: comments2 } = await db2.query({
      comments: {
        $: { where: { articleId } }
      }
    });
    const recipientIds = Array.from(
      new Set(
        (comments2 || []).map((comment) => comment.creator).filter((creatorId) => creatorId && creatorId !== user.userId)
      )
    );
    if (recipientIds.length === 0) {
      return json2({ success: true, notified: 0 });
    }
    const actor = await UsersAccount(env).findOne({ where: { id: user.userId } });
    const actorName = actor ? `${actor.name} ${actor.first_name}`.trim() : "Quelqu'un";
    const preview = (content || "").toString().slice(0, 120);
    const messages = recipientIds.map((recipientUserId) => ({
      recipientUserId,
      type: "comment_reply",
      title: `${actorName} a comment\xE9 ${articleTitle ? `\xAB ${articleTitle} \xBB` : "un article que vous suivez"}`,
      body: preview,
      actorUserId: user.userId,
      articleId,
      commentId
    }));
    for (let i2 = 0; i2 < messages.length; i2 += 100) {
      await env.NOTIFICATIONS_QUEUE.sendBatch(
        messages.slice(i2, i2 + 100).map((body) => ({ body }))
      );
    }
    return json2({ success: true, notified: messages.length });
  } catch (error) {
    console.error("[Notifications] Error queuing comment-reply notifications:", error);
    status(500);
    return json2({ success: false, error: String(error) });
  }
});
notifications.post("/broadcast", authMiddleware, async ({ req, env, json: json2, status }) => {
  const user = req.get("user");
  if (user.role !== "admin") {
    status(403);
    return json2({ success: false, message: "Acc\xE8s r\xE9serv\xE9 aux administrateurs" });
  }
  const { title, body, type } = await req.json();
  if (!title || !body) {
    status(400);
    return json2({ success: false, message: "title et body sont requis" });
  }
  try {
    const users2 = await UsersAccount(env).findAll({ select: ["id"] });
    const messages = users2.map((u) => ({
      recipientUserId: u.id,
      type: type === "prayer_topic" ? "prayer_topic" : "announcement",
      title,
      body,
      actorUserId: user.userId
    }));
    for (let i2 = 0; i2 < messages.length; i2 += 100) {
      await env.NOTIFICATIONS_QUEUE.sendBatch(
        messages.slice(i2, i2 + 100).map((msg) => ({ body: msg }))
      );
    }
    return json2({ success: true, notified: messages.length });
  } catch (error) {
    status(500);
    return json2({ success: false, error: String(error) });
  }
});
notifications.get("/:userId/ws", async (c) => {
  const { userId } = c.req.param();
  try {
    const id2 = c.env.NOTIFICATIONS_DO.idFromName(userId);
    const stub = c.env.NOTIFICATIONS_DO.get(id2);
    const url = new URL(c.req.url);
    url.searchParams.set("userId", userId);
    return stub.fetch(url.toString(), c.req.raw);
  } catch (err) {
    console.error("[Notifications] Error connecting to Durable Object:", err);
    return new Response("Error connecting to WebSocket", { status: 500 });
  }
});
var notifications_default = notifications;

// src/queue-consumer.ts
init_instant();
var EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
async function sendExpoPush(tokens, title, body, data) {
  if (tokens.length === 0) return;
  const messages = tokens.map((to) => ({
    to,
    sound: "default",
    title,
    body,
    data
  }));
  try {
    await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate"
      },
      body: JSON.stringify(messages)
    });
  } catch (err) {
    console.error("[Queue] Error sending Expo push:", err);
  }
}
__name(sendExpoPush, "sendExpoPush");
async function queueHandler(batch, env) {
  const db2 = getDB(env);
  for (const message of batch.messages) {
    const payload = message.body;
    try {
      const notificationId = id_default();
      const createdAt = /* @__PURE__ */ new Date();
      await db2.transact(
        db2.tx.notifications[notificationId].create({
          id: notificationId,
          recipientUserId: payload.recipientUserId,
          type: payload.type,
          title: payload.title,
          body: payload.body,
          data: {
            articleId: payload.articleId ?? null,
            commentId: payload.commentId ?? null
          },
          read: false,
          actorUserId: payload.actorUserId,
          articleId: payload.articleId,
          commentId: payload.commentId,
          createdAt
        })
      );
      const PushTokens = PushTokensTable(env);
      const tokens = await PushTokens.findAll({ where: { userid: payload.recipientUserId } });
      const tokenValues = (tokens || []).map((t) => t.token).filter(Boolean);
      await sendExpoPush(tokenValues, payload.title, payload.body, {
        type: payload.type,
        articleId: payload.articleId,
        commentId: payload.commentId,
        notificationId
      });
      try {
        const doId = env.NOTIFICATIONS_DO.idFromName(payload.recipientUserId);
        const stub = env.NOTIFICATIONS_DO.get(doId);
        await stub.fetch(`http://dummy/notify?userId=${payload.recipientUserId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            notification: {
              id: notificationId,
              type: payload.type,
              title: payload.title,
              body: payload.body,
              articleId: payload.articleId,
              commentId: payload.commentId,
              createdAt: createdAt.toISOString()
            }
          })
        });
      } catch (err) {
        console.error("[Queue] Error notifying Durable Object:", err);
      }
      message.ack();
    } catch (err) {
      console.error("[Queue] Error processing notification message:", err);
      message.retry();
    }
  }
}
__name(queueHandler, "queueHandler");

// src/durable-objects/CommentsDurableObject.ts
import { DurableObject } from "cloudflare:workers";
var CommentsDurableObject = class extends DurableObject {
  static {
    __name(this, "CommentsDurableObject");
  }
  sessions;
  articleId;
  env;
  constructor(state, env) {
    super(state, env);
    this.sessions = /* @__PURE__ */ new Set();
    this.articleId = "";
    this.env = env;
  }
  async fetch(request) {
    const url = new URL(request.url);
    this.articleId = url.searchParams.get("articleId") || "";
    if (url.pathname === "/notify") {
      return this.handleNotification(request);
    }
    const upgradeHeader = request.headers.get("Upgrade");
    if (upgradeHeader !== "websocket") {
      return new Response("Expected websocket", { status: 400 });
    }
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.ctx.acceptWebSocket(server);
    this.sessions.add(server);
    await this.sendInitialState(server);
    server.addEventListener("close", () => {
      this.sessions.delete(server);
      console.log(`[CommentsDO] Client disconnected. Active sessions: ${this.sessions.size}`);
    });
    server.addEventListener("error", (err) => {
      console.error("[CommentsDO] WebSocket error:", err);
      this.sessions.delete(server);
    });
    return new Response(null, {
      status: 101,
      webSocket: client
    });
  }
  /**
   * Envoyer l'état initial au client qui se connecte
   */
  async sendInitialState(ws) {
    try {
      const count = await this.getCommentsCount();
      const message = {
        type: "connected",
        articleId: this.articleId,
        count,
        message: "Connected to comments stream",
        timestamp: Date.now()
      };
      ws.send(JSON.stringify(message));
      console.log(`[CommentsDO] Client connected to article ${this.articleId}. Active sessions: ${this.sessions.size}`);
    } catch (err) {
      console.error("[CommentsDO] Error sending initial state:", err);
    }
  }
  /**
   * Gérer les notifications internes (depuis les routes HTTP)
   */
  async handleNotification(request) {
    try {
      const data = await request.json();
      switch (data.type) {
        case "comment_added":
          await this.broadcastCommentAdded(data.comment);
          break;
        case "comment_updated":
          await this.broadcastCommentUpdated(data.comment);
          break;
        case "comment_deleted":
          await this.broadcastCommentDeleted(data.commentId);
          break;
        default:
          console.log("[CommentsDO] Unknown notification type:", data.type);
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      console.error("[CommentsDO] Error handling notification:", err);
      return new Response(JSON.stringify({ success: false, error: String(err) }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
  /**
   * Broadcaster qu'un commentaire a été ajouté
   */
  async broadcastCommentAdded(comment) {
    const count = await this.getCommentsCount();
    const message = {
      type: "comment_added",
      comment,
      count,
      articleId: this.articleId,
      timestamp: Date.now()
    };
    this.broadcast(JSON.stringify(message));
    console.log(`[CommentsDO] Broadcasted comment_added to ${this.sessions.size} sessions`);
  }
  /**
   * Broadcaster qu'un commentaire a été supprimé
   */
  async broadcastCommentDeleted(commentId) {
    const count = await this.getCommentsCount();
    const message = {
      type: "comment_deleted",
      commentId,
      count,
      articleId: this.articleId,
      timestamp: Date.now()
    };
    this.broadcast(JSON.stringify(message));
    console.log(`[CommentsDO] Broadcasted comment_deleted to ${this.sessions.size} sessions`);
  }
  /**
   * Broadcaster qu'un commentaire a été mis à jour (upvotes/signals)
   */
  async broadcastCommentUpdated(comment) {
    const count = await this.getCommentsCount();
    const message = {
      type: "comment_updated",
      comment,
      count,
      articleId: this.articleId,
      timestamp: Date.now()
    };
    this.broadcast(JSON.stringify(message));
    console.log(`[CommentsDO] Broadcasted comment_updated to ${this.sessions.size} sessions`);
  }
  /**
   * Broadcaster un message à toutes les sessions connectées
   */
  broadcast(message) {
    this.sessions.forEach((session) => {
      try {
        session.send(message);
      } catch (err) {
        console.error("[CommentsDO] Error broadcasting to session:", err);
        this.sessions.delete(session);
      }
    });
  }
  /**
   * Récupérer le nombre de commentaires depuis D1
   */
  async getCommentsCount() {
    try {
      if (!this.articleId || !this.env.DB) {
        return 0;
      }
      const result = await this.env.DB.prepare(
        "SELECT COUNT(*) as count FROM comments WHERE articleId = ?"
      ).bind(this.articleId).first();
      return result?.count || 0;
    } catch (err) {
      console.error("[CommentsDO] Error getting comments count:", err);
      return 0;
    }
  }
  /**
   * Méthode appelée par Cloudflare pour gérer les messages WebSocket
   */
  async webSocketMessage(ws, message) {
    try {
      if (typeof message !== "string") return;
      const data = JSON.parse(message);
      if (data.type === "request_count") {
        await this.sendCount(ws);
      }
    } catch (err) {
      console.error("[CommentsDO] Error handling WebSocket message:", err);
    }
  }
  /**
   * Envoyer le count actuel à un client spécifique
   */
  async sendCount(ws) {
    const count = await this.getCommentsCount();
    const message = {
      type: "count_update",
      count,
      articleId: this.articleId,
      timestamp: Date.now()
    };
    try {
      ws.send(JSON.stringify(message));
    } catch (err) {
      console.error("[CommentsDO] Error sending count:", err);
    }
  }
};

// src/durable-objects/AppreciationsDurableObject.ts
import { DurableObject as DurableObject2 } from "cloudflare:workers";
var AppreciationsDurableObject = class extends DurableObject2 {
  static {
    __name(this, "AppreciationsDurableObject");
  }
  sessions;
  articleId;
  env;
  constructor(state, env) {
    super(state, env);
    this.sessions = /* @__PURE__ */ new Set();
    this.articleId = "";
    this.env = env;
  }
  async fetch(request) {
    const url = new URL(request.url);
    this.articleId = url.searchParams.get("articleId") || "";
    if (url.pathname === "/notify") {
      return this.handleNotification(request);
    }
    const upgradeHeader = request.headers.get("Upgrade");
    if (upgradeHeader !== "websocket") {
      return new Response("Expected websocket", { status: 400 });
    }
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.ctx.acceptWebSocket(server);
    this.sessions.add(server);
    await this.sendInitialState(server);
    server.addEventListener("close", () => {
      this.sessions.delete(server);
      console.log(`[AppreciationsDO] Client disconnected. Active sessions: ${this.sessions.size}`);
    });
    server.addEventListener("error", (err) => {
      console.error("[AppreciationsDO] WebSocket error:", err);
      this.sessions.delete(server);
    });
    return new Response(null, {
      status: 101,
      webSocket: client
    });
  }
  /**
   * Envoyer l'état initial au client qui se connecte
   */
  async sendInitialState(ws) {
    try {
      const count = await this.getAppreciationsCount();
      const appreciations = await this.getAppreciations();
      const message = {
        type: "connected",
        articleId: this.articleId,
        count,
        appreciations,
        message: "Connected to appreciations stream",
        timestamp: Date.now()
      };
      ws.send(JSON.stringify(message));
      console.log(`[AppreciationsDO] Client connected to article ${this.articleId}. Active sessions: ${this.sessions.size}`);
    } catch (err) {
      console.error("[AppreciationsDO] Error sending initial state:", err);
    }
  }
  /**
   * Gérer les notifications internes (depuis les routes HTTP)
   */
  async handleNotification(request) {
    try {
      const data = await request.json();
      switch (data.type) {
        case "like_added":
          await this.broadcastLikeAdded(data.userid);
          break;
        case "like_removed":
          await this.broadcastLikeRemoved(data.userid);
          break;
        case "like_toggled":
          await this.broadcastLikeToggled(data.userid, data.action);
          break;
        default:
          console.log("[AppreciationsDO] Unknown notification type:", data.type);
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      console.error("[AppreciationsDO] Error handling notification:", err);
      return new Response(JSON.stringify({ success: false, error: String(err) }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
  /**
   * Broadcaster qu'un like a été ajouté
   */
  async broadcastLikeAdded(userid) {
    const count = await this.getAppreciationsCount();
    const appreciations = await this.getAppreciations();
    const message = {
      type: "like_added",
      userid,
      count,
      appreciations,
      articleId: this.articleId,
      timestamp: Date.now()
    };
    this.broadcast(JSON.stringify(message));
    console.log(`[AppreciationsDO] Broadcasted like_added to ${this.sessions.size} sessions`);
  }
  /**
   * Broadcaster qu'un like a été supprimé
   */
  async broadcastLikeRemoved(userid) {
    const count = await this.getAppreciationsCount();
    const appreciations = await this.getAppreciations();
    const message = {
      type: "like_removed",
      userid,
      count,
      appreciations,
      articleId: this.articleId,
      timestamp: Date.now()
    };
    this.broadcast(JSON.stringify(message));
    console.log(`[AppreciationsDO] Broadcasted like_removed to ${this.sessions.size} sessions`);
  }
  /**
   * Broadcaster qu'un like a été toggleé
   */
  async broadcastLikeToggled(userid, action) {
    if (action === "added") {
      await this.broadcastLikeAdded(userid);
    } else {
      await this.broadcastLikeRemoved(userid);
    }
  }
  /**
   * Broadcaster un message à toutes les sessions connectées
   */
  broadcast(message) {
    this.sessions.forEach((session) => {
      try {
        session.send(message);
      } catch (err) {
        console.error("[AppreciationsDO] Error broadcasting to session:", err);
        this.sessions.delete(session);
      }
    });
  }
  /**
   * Récupérer le nombre d'appreciations depuis D1
   */
  async getAppreciationsCount() {
    try {
      if (!this.articleId || !this.env.DB) {
        return 0;
      }
      const result = await this.env.DB.prepare(
        "SELECT COUNT(*) as count FROM appreciations WHERE articleId = ?"
      ).bind(this.articleId).first();
      return result?.count || 0;
    } catch (err) {
      console.error("[AppreciationsDO] Error getting appreciations count:", err);
      return 0;
    }
  }
  /**
   * Récupérer toutes les appreciations depuis D1
   */
  async getAppreciations() {
    try {
      if (!this.articleId || !this.env.DB) {
        return [];
      }
      const result = await this.env.DB.prepare(
        "SELECT * FROM appreciations WHERE articleId = ?"
      ).bind(this.articleId).all();
      return result.results || [];
    } catch (err) {
      console.error("[AppreciationsDO] Error getting appreciations:", err);
      return [];
    }
  }
  /**
   * Méthode appelée par Cloudflare pour gérer les messages WebSocket
   */
  async webSocketMessage(ws, message) {
    try {
      if (typeof message !== "string") return;
      const data = JSON.parse(message);
      if (data.type === "request_update") {
        await this.sendUpdate(ws);
      }
    } catch (err) {
      console.error("[AppreciationsDO] Error handling WebSocket message:", err);
    }
  }
  /**
   * Envoyer l'état actuel à un client spécifique
   */
  async sendUpdate(ws) {
    const count = await this.getAppreciationsCount();
    const appreciations = await this.getAppreciations();
    const message = {
      type: "update",
      count,
      appreciations,
      articleId: this.articleId,
      timestamp: Date.now()
    };
    try {
      ws.send(JSON.stringify(message));
    } catch (err) {
      console.error("[AppreciationsDO] Error sending update:", err);
    }
  }
};

// src/durable-objects/NotificationsDurableObject.ts
import { DurableObject as DurableObject3 } from "cloudflare:workers";
var NotificationsDurableObject = class extends DurableObject3 {
  static {
    __name(this, "NotificationsDurableObject");
  }
  sessions;
  userId;
  env;
  constructor(state, env) {
    super(state, env);
    this.sessions = /* @__PURE__ */ new Set();
    this.userId = "";
    this.env = env;
  }
  async fetch(request) {
    const url = new URL(request.url);
    this.userId = url.searchParams.get("userId") || "";
    if (url.pathname === "/notify") {
      return this.handleNotification(request);
    }
    const upgradeHeader = request.headers.get("Upgrade");
    if (upgradeHeader !== "websocket") {
      return new Response("Expected websocket", { status: 400 });
    }
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.ctx.acceptWebSocket(server);
    this.sessions.add(server);
    server.send(JSON.stringify({
      type: "connected",
      userId: this.userId,
      timestamp: Date.now()
    }));
    server.addEventListener("close", () => {
      this.sessions.delete(server);
    });
    server.addEventListener("error", () => {
      this.sessions.delete(server);
    });
    return new Response(null, {
      status: 101,
      webSocket: client
    });
  }
  /**
   * Appelé par le consumer de la Queue une fois la notification écrite dans InstantDB.
   */
  async handleNotification(request) {
    try {
      const data = await request.json();
      this.broadcast(JSON.stringify({
        type: "notification",
        notification: data.notification,
        timestamp: Date.now()
      }));
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      console.error("[NotificationsDO] Error handling notification:", err);
      return new Response(JSON.stringify({ success: false, error: String(err) }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
  broadcast(message) {
    this.sessions.forEach((session) => {
      try {
        session.send(message);
      } catch (err) {
        this.sessions.delete(session);
      }
    });
  }
  async webSocketMessage(ws, message) {
  }
};

// src/index.ts
var app = new Hono2();
app.use("*", async (c, next) => {
  try {
    SyncStateTable(c.env);
    await ensureSeed(c.env);
  } catch (e) {
    console.log("[sync_state] init middleware error:", e);
  }
  await next();
});
app.get("/", ({ json: json2 }) => {
  const teste = {
    name: "yaounde",
    pays: "Cameroun"
  };
  return json2(teste);
});
app.get("/health", ({ json: json2, env }) => {
  return json2({
    status: true
  });
});
app.get("/test-sse", (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test SSE - Commentaires en temps r\xE9el</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        h1 {
            font-size: 28px;
            margin-bottom: 10px;
        }

        .status {
            display: inline-block;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 14px;
            margin-top: 10px;
        }

        .status.connected {
            background: #10b981;
        }

        .status.disconnected {
            background: #ef4444;
        }

        .content {
            padding: 30px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #374151;
        }

        input, textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.3s;
        }

        input:focus, textarea:focus {
            outline: none;
            border-color: #667eea;
        }

        textarea {
            min-height: 100px;
            resize: vertical;
        }

        .buttons {
            display: flex;
            gap: 10px;
            margin-bottom: 30px;
        }

        button {
            flex: 1;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }

        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
            background: #6b7280;
            color: white;
        }

        .btn-success {
            background: #10b981;
            color: white;
        }

        .btn-danger {
            background: #ef4444;
            color: white;
        }

        .comments-section {
            margin-top: 30px;
        }

        .comments-section h2 {
            color: #1f2937;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e5e7eb;
        }

        .comment {
            background: #f9fafb;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 12px;
            border-left: 4px solid #667eea;
            animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .comment.new {
            background: #dbeafe;
            border-left-color: #3b82f6;
        }

        .comment-meta {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 12px;
            color: #6b7280;
        }

        .comment-content {
            color: #1f2937;
            line-height: 1.6;
        }

        .logs {
            margin-top: 20px;
            padding: 16px;
            background: #1f2937;
            color: #10b981;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            max-height: 200px;
            overflow-y: auto;
        }

        .log-entry {
            margin-bottom: 4px;
        }

        .log-entry.error {
            color: #ef4444;
        }

        .log-entry.success {
            color: #10b981;
        }

        .log-entry.info {
            color: #60a5fa;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>\u{1F4E1} Commentaires en Temps R\xE9el (SSE)</h1>
            <span class="status disconnected" id="status">D\xE9connect\xE9</span>
        </div>

        <div class="content">
            <div class="form-group">
                <label for="articleId">ID de l'article</label>
                <input type="text" id="articleId" placeholder="ex: article-123" value="article-123">
            </div>

            <div class="buttons">
                <button class="btn-primary" onclick="connectSSE()">\u{1F50C} Connecter au Stream</button>
                <button class="btn-danger" onclick="disconnectSSE()">\u{1F50C} D\xE9connecter</button>
            </div>

            <div class="form-group">
                <label for="creator">Votre nom</label>
                <input type="text" id="creator" placeholder="John Doe" value="User Test">
            </div>

            <div class="form-group">
                <label for="content">Nouveau commentaire</label>
                <textarea id="content" placeholder="\xC9crivez votre commentaire..."></textarea>
            </div>

            <div class="buttons">
                <button class="btn-success" onclick="postComment()">\u{1F4AC} Envoyer le commentaire</button>
                <button class="btn-secondary" onclick="loadComments()">\u{1F504} Charger tous les commentaires</button>
            </div>

            <div class="comments-section">
                <h2>Commentaires (<span id="commentCount">0</span>)</h2>
                <div id="comments"></div>
            </div>

            <div class="logs" id="logs"></div>
        </div>
    </div>

    <script>
        let eventSource = null;
        const API_BASE = window.location.origin;

        function log(message, type = 'info') {
            const logs = document.getElementById('logs');
            const entry = document.createElement('div');
            entry.className = \`log-entry \${type}\`;
            entry.textContent = \`[\${new Date().toLocaleTimeString()}] \${message}\`;
            logs.insertBefore(entry, logs.firstChild);
            
            while (logs.children.length > 50) {
                logs.removeChild(logs.lastChild);
            }
        }

        function updateStatus(connected) {
            const status = document.getElementById('status');
            if (connected) {
                status.textContent = '\u{1F7E2} Connect\xE9';
                status.className = 'status connected';
            } else {
                status.textContent = '\u{1F534} D\xE9connect\xE9';
                status.className = 'status disconnected';
            }
        }

        function connectSSE() {
            const articleId = document.getElementById('articleId').value;
            
            if (!articleId) {
                alert('Veuillez entrer un ID d\\'article');
                return;
            }

            if (eventSource) {
                eventSource.close();
            }

            const url = \`\${API_BASE}/comments/\${articleId}/stream\`;
            log(\`Connexion \xE0 \${url}...\`, 'info');
            
            eventSource = new EventSource(url);

            eventSource.addEventListener('connected', (event) => {
                const data = JSON.parse(event.data);
                log(\`\u2705 \${data.message}\`, 'success');
                updateStatus(true);
            });

            eventSource.addEventListener('update', (event) => {
                const data = JSON.parse(event.data);
                log(\`\u{1F4E9} Nouveaux commentaires re\xE7us: \${data.count}\`, 'success');
                
                data.comments.forEach(comment => {
                    addComment(comment, true);
                });
            });

            eventSource.addEventListener('ping', (event) => {
                // Keep-alive
            });

            eventSource.onerror = (error) => {
                log('\u274C Erreur de connexion SSE', 'error');
                updateStatus(false);
            };
        }

        function disconnectSSE() {
            if (eventSource) {
                eventSource.close();
                eventSource = null;
                updateStatus(false);
                log('\u{1F50C} D\xE9connect\xE9 du stream', 'info');
            }
        }

        function addComment(comment, isNew = false) {
            const commentsDiv = document.getElementById('comments');
            const commentCount = document.getElementById('commentCount');
            
            if (document.getElementById(\`comment-\${comment.id}\`)) {
                return;
            }

            const commentEl = document.createElement('div');
            commentEl.className = isNew ? 'comment new' : 'comment';
            commentEl.id = \`comment-\${comment.id}\`;
            
            commentEl.innerHTML = \`
                <div class="comment-meta">
                    <span><strong>\${comment.creator}</strong></span>
                    <span>\${new Date(comment.created).toLocaleString()}</span>
                </div>
                <div class="comment-content">\${comment.content}</div>
            \`;

            commentsDiv.insertBefore(commentEl, commentsDiv.firstChild);
            commentCount.textContent = commentsDiv.children.length;

            if (isNew) {
                setTimeout(() => {
                    commentEl.classList.remove('new');
                }, 3000);
            }
        }

        async function loadComments() {
            const articleId = document.getElementById('articleId').value;
            
            if (!articleId) {
                alert('Veuillez entrer un ID d\\'article');
                return;
            }

            try {
                log(\`\u{1F4E5} Chargement des commentaires...\`, 'info');
                const response = await fetch(\`\${API_BASE}/comments/\${articleId}\`);
                const data = await response.json();
                
                document.getElementById('comments').innerHTML = '';
                
                data.comments.forEach(comment => {
                    addComment(comment, false);
                });
                
                log(\`\u2705 \${data.count} commentaire(s) charg\xE9(s)\`, 'success');
            } catch (error) {
                log(\`\u274C Erreur: \${error.message}\`, 'error');
            }
        }

        async function postComment() {
            const articleId = document.getElementById('articleId').value;
            const creator = document.getElementById('creator').value;
            const content = document.getElementById('content').value;

            if (!articleId || !creator || !content) {
                alert('Veuillez remplir tous les champs');
                return;
            }

            try {
                log(\`\u{1F4E4} Envoi du commentaire...\`, 'info');
                const response = await fetch(\`\${API_BASE}/comments/\${articleId}\`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        creator,
                        content
                    })
                });

                const data = await response.json();
                
                if (data.success) {
                    log(\`\u2705 Commentaire envoy\xE9 avec succ\xE8s\`, 'success');
                    document.getElementById('content').value = '';
                } else {
                    log(\`\u274C Erreur: \${data.error}\`, 'error');
                }
            } catch (error) {
                log(\`\u274C Erreur: \${error.message}\`, 'error');
            }
        }

        window.addEventListener('beforeunload', () => {
            if (eventSource) {
                eventSource.close();
            }
        });

        log('\u{1F4A1} Application charg\xE9e. Entrez un ID d\\'article et connectez-vous au stream.', 'info');
    <\/script>
</body>
</html>`);
});
app.get("/test-polling", (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Long Polling - Commentaires en temps r\xE9el</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            padding: 20px;
            min-height: 100vh;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        h1 {
            font-size: 28px;
            margin-bottom: 10px;
        }

        .status {
            display: inline-block;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 14px;
            margin-top: 10px;
        }

        .status.connected {
            background: #10b981;
        }

        .status.disconnected {
            background: #ef4444;
        }

        .content {
            padding: 30px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #374151;
        }

        input, textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.3s;
        }

        input:focus, textarea:focus {
            outline: none;
            border-color: #10b981;
        }

        textarea {
            min-height: 100px;
            resize: vertical;
        }

        .buttons {
            display: flex;
            gap: 10px;
            margin-bottom: 30px;
        }

        button {
            flex: 1;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }

        .btn-primary {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }

        .btn-secondary {
            background: #6b7280;
            color: white;
        }

        .btn-success {
            background: #10b981;
            color: white;
        }

        .btn-danger {
            background: #ef4444;
            color: white;
        }

        .comments-section {
            margin-top: 30px;
        }

        .comments-section h2 {
            color: #1f2937;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e5e7eb;
        }

        .comment {
            background: #f9fafb;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 12px;
            border-left: 4px solid #10b981;
            animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .comment.new {
            background: #d1fae5;
            border-left-color: #059669;
        }

        .comment-meta {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 12px;
            color: #6b7280;
        }

        .comment-content {
            color: #1f2937;
            line-height: 1.6;
        }

        .logs {
            margin-top: 20px;
            padding: 16px;
            background: #1f2937;
            color: #10b981;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            max-height: 200px;
            overflow-y: auto;
        }

        .log-entry {
            margin-bottom: 4px;
        }

        .log-entry.error {
            color: #ef4444;
        }

        .log-entry.success {
            color: #10b981;
        }

        .log-entry.info {
            color: #60a5fa;
        }

        .badge {
            font-size: 11px;
            padding: 2px 8px;
            border-radius: 12px;
            background: #10b981;
            color: white;
            margin-left: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>\u{1F504} Commentaires en Temps R\xE9el (Long Polling)</h1>
            <span class="badge">Plus fiable pour Cloudflare Workers</span>
            <br>
            <span class="status disconnected" id="status">Arr\xEAt\xE9</span>
        </div>

        <div class="content">
            <div class="form-group">
                <label for="articleId">ID de l'article</label>
                <input type="text" id="articleId" placeholder="ex: article-123" value="article-123">
            </div>

            <div class="buttons">
                <button class="btn-primary" onclick="startPolling()">\u25B6\uFE0F D\xE9marrer le Polling</button>
                <button class="btn-danger" onclick="stopPolling()">\u23F9\uFE0F Arr\xEAter</button>
            </div>

            <div class="form-group">
                <label for="creator">Votre nom</label>
                <input type="text" id="creator" placeholder="John Doe" value="User Test">
            </div>

            <div class="form-group">
                <label for="content">Nouveau commentaire</label>
                <textarea id="content" placeholder="\xC9crivez votre commentaire..."></textarea>
            </div>

            <div class="buttons">
                <button class="btn-success" onclick="postComment()">\u{1F4AC} Envoyer le commentaire</button>
                <button class="btn-secondary" onclick="loadComments()">\u{1F504} Charger tous les commentaires</button>
            </div>

            <div class="comments-section">
                <h2>Commentaires (<span id="commentCount">0</span>)</h2>
                <div id="comments"></div>
            </div>

            <div class="logs" id="logs"></div>
        </div>
    </div>

    <script>
        let pollingInterval = null;
        let lastTimestamp = Date.now();
        const API_BASE = window.location.origin;

        function log(message, type = 'info') {
            const logs = document.getElementById('logs');
            const entry = document.createElement('div');
            entry.className = \`log-entry \${type}\`;
            entry.textContent = \`[\${new Date().toLocaleTimeString()}] \${message}\`;
            logs.insertBefore(entry, logs.firstChild);
            
            while (logs.children.length > 50) {
                logs.removeChild(logs.lastChild);
            }
        }

        function updateStatus(active) {
            const status = document.getElementById('status');
            if (active) {
                status.textContent = '\u{1F7E2} Polling actif';
                status.className = 'status connected';
            } else {
                status.textContent = '\u{1F534} Arr\xEAt\xE9';
                status.className = 'status disconnected';
            }
        }

        async function pollComments() {
            const articleId = document.getElementById('articleId').value;
            
            try {
                const response = await fetch(\`\${API_BASE}/comments/\${articleId}/poll?since=\${lastTimestamp}\`);
                const data = await response.json();
                
                if (data.count > 0) {
                    log(\`\u{1F4E9} \${data.count} nouveau(x) commentaire(s) re\xE7u(s)\`, 'success');
                    
                    data.comments.forEach(comment => {
                        addComment(comment, true);
                    });
                }
                
                // Mettre \xE0 jour le timestamp
                lastTimestamp = data.timestamp;
                
            } catch (error) {
                log(\`\u274C Erreur de polling: \${error.message}\`, 'error');
            }
        }

        function startPolling() {
            const articleId = document.getElementById('articleId').value;
            
            if (!articleId) {
                alert('Veuillez entrer un ID d\\'article');
                return;
            }

            if (pollingInterval) {
                clearInterval(pollingInterval);
            }

            log(\`\u25B6\uFE0F D\xE9marrage du polling pour l'article \${articleId}\`, 'info');
            updateStatus(true);
            
            // Poll imm\xE9diatement puis toutes les 3 secondes
            pollComments();
            pollingInterval = setInterval(pollComments, 3000);
        }

        function stopPolling() {
            if (pollingInterval) {
                clearInterval(pollingInterval);
                pollingInterval = null;
                updateStatus(false);
                log('\u23F9\uFE0F Polling arr\xEAt\xE9', 'info');
            }
        }

        function addComment(comment, isNew = false) {
            const commentsDiv = document.getElementById('comments');
            const commentCount = document.getElementById('commentCount');
            
            if (document.getElementById(\`comment-\${comment.id}\`)) {
                return;
            }

            const commentEl = document.createElement('div');
            commentEl.className = isNew ? 'comment new' : 'comment';
            commentEl.id = \`comment-\${comment.id}\`;
            
            commentEl.innerHTML = \`
                <div class="comment-meta">
                    <span><strong>\${comment.creator}</strong></span>
                    <span>\${new Date(comment.created).toLocaleString()}</span>
                </div>
                <div class="comment-content">\${comment.content}</div>
            \`;

            commentsDiv.insertBefore(commentEl, commentsDiv.firstChild);
            commentCount.textContent = commentsDiv.children.length;

            if (isNew) {
                setTimeout(() => {
                    commentEl.classList.remove('new');
                }, 3000);
            }
        }

        async function loadComments() {
            const articleId = document.getElementById('articleId').value;
            
            if (!articleId) {
                alert('Veuillez entrer un ID d\\'article');
                return;
            }

            try {
                log(\`\u{1F4E5} Chargement des commentaires...\`, 'info');
                const response = await fetch(\`\${API_BASE}/comments/\${articleId}\`);
                const data = await response.json();
                
                document.getElementById('comments').innerHTML = '';
                
                data.comments.forEach(comment => {
                    addComment(comment, false);
                });
                
                log(\`\u2705 \${data.count} commentaire(s) charg\xE9(s)\`, 'success');
            } catch (error) {
                log(\`\u274C Erreur: \${error.message}\`, 'error');
            }
        }

        async function postComment() {
            const articleId = document.getElementById('articleId').value;
            const creator = document.getElementById('creator').value;
            const content = document.getElementById('content').value;

            if (!articleId || !creator || !content) {
                alert('Veuillez remplir tous les champs');
                return;
            }

            try {
                log(\`\u{1F4E4} Envoi du commentaire...\`, 'info');
                const response = await fetch(\`\${API_BASE}/comments/\${articleId}\`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        creator,
                        content
                    })
                });

                const data = await response.json();
                
                if (data.success) {
                    log(\`\u2705 Commentaire envoy\xE9 avec succ\xE8s\`, 'success');
                    document.getElementById('content').value = '';
                    
                    // Forcer un poll imm\xE9diat pour voir le nouveau commentaire
                    if (pollingInterval) {
                        setTimeout(pollComments, 500);
                    }
                } else {
                    log(\`\u274C Erreur: \${data.error}\`, 'error');
                }
            } catch (error) {
                log(\`\u274C Erreur: \${error.message}\`, 'error');
            }
        }

        window.addEventListener('beforeunload', () => {
            stopPolling();
        });

        log('\u{1F4A1} Application charg\xE9e. Utilisez Long Polling au lieu de SSE pour plus de fiabilit\xE9.', 'info');
    <\/script>
</body>
</html>`);
});
app.route("/users", users_default);
app.route("/articles", articles_default);
app.route("/notes", notes_default);
app.route("/groups", groups_default);
app.route("/image", images_default);
app.route("/bible", bible_default);
app.route("/comments", comments_default);
app.route("/appreciations", appreciation_default);
app.route("/countries", countries_default);
app.route("/auth", auth_default);
app.route("/sync-state", syncState_default);
app.route("/notifications", notifications_default);
var index_default = {
  fetch: app.fetch,
  queue: queueHandler
};
export {
  AppreciationsDurableObject,
  CommentsDurableObject,
  NotificationsDurableObject,
  index_default as default
};
//# sourceMappingURL=index.js.map
