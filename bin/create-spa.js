#!/usr/bin/env node

// bin/create-spa.ts
import { execSync } from "child_process";
import * as fs from "fs";

// node_modules/neverthrow/dist/index.cjs.js
var defaultErrorConfig = {
  withStackTrace: false
};
var createNeverThrowError = (message, result, config = defaultErrorConfig) => {
  const data = result.isOk() ? { type: "Ok", value: result.value } : { type: "Err", value: result.error };
  const maybeStack = config.withStackTrace ? new Error().stack : undefined;
  return {
    data,
    message,
    stack: maybeStack
  };
};
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m)
    return m.call(o);
  if (o && typeof o.length === "number")
    return {
      next: function() {
        if (o && i >= o.length)
          o = undefined;
        return { value: o && o[i++], done: !o };
      }
    };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}
function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function awaitReturn(f) {
    return function(v) {
      return Promise.resolve(v).then(f, reject);
    };
  }
  function verb(n, f) {
    if (g[n]) {
      i[n] = function(v) {
        return new Promise(function(a, b) {
          q.push([n, v, a, b]) > 1 || resume(n, v);
        });
      };
      if (f)
        i[n] = f(i[n]);
    }
  }
  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f, v) {
    if (f(v), q.shift(), q.length)
      resume(q[0][0], q[0][1]);
  }
}
function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function(e) {
    throw e;
  }), verb("return"), i[Symbol.iterator] = function() {
    return this;
  }, i;
  function verb(n, f) {
    i[n] = o[n] ? function(v) {
      return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v;
    } : f;
  }
}
function __asyncValues(o) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function(v) {
      return new Promise(function(resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }
  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function(v2) {
      resolve({ value: v2, done: d });
    }, reject);
  }
}
class ResultAsync {
  constructor(res) {
    this._promise = res;
  }
  static fromSafePromise(promise) {
    const newPromise = promise.then((value) => new Ok(value));
    return new ResultAsync(newPromise);
  }
  static fromPromise(promise, errorFn) {
    const newPromise = promise.then((value) => new Ok(value)).catch((e) => new Err(errorFn(e)));
    return new ResultAsync(newPromise);
  }
  static fromThrowable(fn, errorFn) {
    return (...args) => {
      return new ResultAsync((() => __awaiter(this, undefined, undefined, function* () {
        try {
          return new Ok(yield fn(...args));
        } catch (error) {
          return new Err(errorFn ? errorFn(error) : error);
        }
      }))());
    };
  }
  static combine(asyncResultList) {
    return combineResultAsyncList(asyncResultList);
  }
  static combineWithAllErrors(asyncResultList) {
    return combineResultAsyncListWithAllErrors(asyncResultList);
  }
  map(f) {
    return new ResultAsync(this._promise.then((res) => __awaiter(this, undefined, undefined, function* () {
      if (res.isErr()) {
        return new Err(res.error);
      }
      return new Ok(yield f(res.value));
    })));
  }
  andThrough(f) {
    return new ResultAsync(this._promise.then((res) => __awaiter(this, undefined, undefined, function* () {
      if (res.isErr()) {
        return new Err(res.error);
      }
      const newRes = yield f(res.value);
      if (newRes.isErr()) {
        return new Err(newRes.error);
      }
      return new Ok(res.value);
    })));
  }
  andTee(f) {
    return new ResultAsync(this._promise.then((res) => __awaiter(this, undefined, undefined, function* () {
      if (res.isErr()) {
        return new Err(res.error);
      }
      try {
        yield f(res.value);
      } catch (e) {}
      return new Ok(res.value);
    })));
  }
  orTee(f) {
    return new ResultAsync(this._promise.then((res) => __awaiter(this, undefined, undefined, function* () {
      if (res.isOk()) {
        return new Ok(res.value);
      }
      try {
        yield f(res.error);
      } catch (e) {}
      return new Err(res.error);
    })));
  }
  mapErr(f) {
    return new ResultAsync(this._promise.then((res) => __awaiter(this, undefined, undefined, function* () {
      if (res.isOk()) {
        return new Ok(res.value);
      }
      return new Err(yield f(res.error));
    })));
  }
  andThen(f) {
    return new ResultAsync(this._promise.then((res) => {
      if (res.isErr()) {
        return new Err(res.error);
      }
      const newValue = f(res.value);
      return newValue instanceof ResultAsync ? newValue._promise : newValue;
    }));
  }
  orElse(f) {
    return new ResultAsync(this._promise.then((res) => __awaiter(this, undefined, undefined, function* () {
      if (res.isErr()) {
        return f(res.error);
      }
      return new Ok(res.value);
    })));
  }
  match(ok, _err) {
    return this._promise.then((res) => res.match(ok, _err));
  }
  unwrapOr(t) {
    return this._promise.then((res) => res.unwrapOr(t));
  }
  safeUnwrap() {
    return __asyncGenerator(this, arguments, function* safeUnwrap_1() {
      return yield __await(yield __await(yield* __asyncDelegator(__asyncValues(yield __await(this._promise.then((res) => res.safeUnwrap()))))));
    });
  }
  then(successCallback, failureCallback) {
    return this._promise.then(successCallback, failureCallback);
  }
  [Symbol.asyncIterator]() {
    return __asyncGenerator(this, arguments, function* _a() {
      const result = yield __await(this._promise);
      if (result.isErr()) {
        yield yield __await(errAsync(result.error));
      }
      return yield __await(result.value);
    });
  }
}
function errAsync(err) {
  return new ResultAsync(Promise.resolve(new Err(err)));
}
var fromPromise = ResultAsync.fromPromise;
var fromSafePromise = ResultAsync.fromSafePromise;
var fromAsyncThrowable = ResultAsync.fromThrowable;
var combineResultList = (resultList) => {
  let acc = ok([]);
  for (const result of resultList) {
    if (result.isErr()) {
      acc = err(result.error);
      break;
    } else {
      acc.map((list) => list.push(result.value));
    }
  }
  return acc;
};
var combineResultAsyncList = (asyncResultList) => ResultAsync.fromSafePromise(Promise.all(asyncResultList)).andThen(combineResultList);
var combineResultListWithAllErrors = (resultList) => {
  let acc = ok([]);
  for (const result of resultList) {
    if (result.isErr() && acc.isErr()) {
      acc.error.push(result.error);
    } else if (result.isErr() && acc.isOk()) {
      acc = err([result.error]);
    } else if (result.isOk() && acc.isOk()) {
      acc.value.push(result.value);
    }
  }
  return acc;
};
var combineResultAsyncListWithAllErrors = (asyncResultList) => ResultAsync.fromSafePromise(Promise.all(asyncResultList)).andThen(combineResultListWithAllErrors);
var $Result = undefined;
(function(Result) {
  function fromThrowable(fn, errorFn) {
    return (...args) => {
      try {
        const result = fn(...args);
        return ok(result);
      } catch (e) {
        return err(errorFn ? errorFn(e) : e);
      }
    };
  }
  Result.fromThrowable = fromThrowable;
  function combine(resultList) {
    return combineResultList(resultList);
  }
  Result.combine = combine;
  function combineWithAllErrors(resultList) {
    return combineResultListWithAllErrors(resultList);
  }
  Result.combineWithAllErrors = combineWithAllErrors;
})($Result || ($Result = {}));
function ok(value) {
  return new Ok(value);
}
function err(err2) {
  return new Err(err2);
}
class Ok {
  constructor(value) {
    this.value = value;
  }
  isOk() {
    return true;
  }
  isErr() {
    return !this.isOk();
  }
  map(f) {
    return ok(f(this.value));
  }
  mapErr(_f) {
    return ok(this.value);
  }
  andThen(f) {
    return f(this.value);
  }
  andThrough(f) {
    return f(this.value).map((_value) => this.value);
  }
  andTee(f) {
    try {
      f(this.value);
    } catch (e) {}
    return ok(this.value);
  }
  orTee(_f) {
    return ok(this.value);
  }
  orElse(_f) {
    return ok(this.value);
  }
  asyncAndThen(f) {
    return f(this.value);
  }
  asyncAndThrough(f) {
    return f(this.value).map(() => this.value);
  }
  asyncMap(f) {
    return ResultAsync.fromSafePromise(f(this.value));
  }
  unwrapOr(_v) {
    return this.value;
  }
  match(ok2, _err) {
    return ok2(this.value);
  }
  safeUnwrap() {
    const value = this.value;
    return function* () {
      return value;
    }();
  }
  _unsafeUnwrap(_) {
    return this.value;
  }
  _unsafeUnwrapErr(config) {
    throw createNeverThrowError("Called `_unsafeUnwrapErr` on an Ok", this, config);
  }
  *[Symbol.iterator]() {
    return this.value;
  }
}

class Err {
  constructor(error) {
    this.error = error;
  }
  isOk() {
    return false;
  }
  isErr() {
    return !this.isOk();
  }
  map(_f) {
    return err(this.error);
  }
  mapErr(f) {
    return err(f(this.error));
  }
  andThrough(_f) {
    return err(this.error);
  }
  andTee(_f) {
    return err(this.error);
  }
  orTee(f) {
    try {
      f(this.error);
    } catch (e) {}
    return err(this.error);
  }
  andThen(_f) {
    return err(this.error);
  }
  orElse(f) {
    return f(this.error);
  }
  asyncAndThen(_f) {
    return errAsync(this.error);
  }
  asyncAndThrough(_f) {
    return errAsync(this.error);
  }
  asyncMap(_f) {
    return errAsync(this.error);
  }
  unwrapOr(v) {
    return v;
  }
  match(_ok, err2) {
    return err2(this.error);
  }
  safeUnwrap() {
    const error = this.error;
    return function* () {
      yield err(error);
      throw new Error("Do not use this generator out of `safeTry`");
    }();
  }
  _unsafeUnwrap(config) {
    throw createNeverThrowError("Called `_unsafeUnwrap` on an Err", this, config);
  }
  _unsafeUnwrapErr(_) {
    return this.error;
  }
  *[Symbol.iterator]() {
    const self = this;
    yield self;
    return self;
  }
}
var fromThrowable = $Result.fromThrowable;
var $err = err;
var $fromThrowable = fromThrowable;
var $ok = ok;

// bin/create-spa.ts
import path from "path";
var safeFns = {
  execSync: $fromThrowable(execSync, (error) => {
    return {
      code: "OTHER",
      message: `Failed to execute command: ${error instanceof Error ? error.message : String(error)}`
    };
  }),
  mkdirSync: $fromThrowable(fs.mkdirSync, (error) => {
    return {
      code: "FS",
      message: `Failed to create directory: ${error instanceof Error ? error.message : String(error)}`
    };
  }),
  cpSync: $fromThrowable(fs.cpSync, (error) => {
    return {
      code: "FS",
      message: `Failed to copy files: ${error instanceof Error ? error.message : String(error)}`
    };
  }),
  rmSync: $fromThrowable(fs.rmSync, (error) => {
    return {
      code: "FS",
      message: `Failed to remove directory: ${error instanceof Error ? error.message : String(error)}`
    };
  }),
  readFileSync: $fromThrowable(fs.readFileSync, (error) => {
    return {
      code: "FS",
      message: `Failed to read file: ${error instanceof Error ? error.message : String(error)}`
    };
  }),
  writeFileSync: $fromThrowable(fs.writeFileSync, (error) => {
    return {
      code: "FS",
      message: `Failed to write file: ${error instanceof Error ? error.message : String(error)}`
    };
  }),
  JSONParse: $fromThrowable(JSON.parse, (error) => {
    return {
      code: "PARSING",
      message: `Failed to parse JSON: ${error instanceof Error ? error.message : String(error)}`
    };
  })
};
var parseCliArgs = () => {
  if (process.argv.length < 3) {
    return $err({
      code: "MISSING_PROJECT_NAME",
      message: "Project name is required. Please provide a name as the first argument."
    });
  }
  const projectName = process.argv[2];
  if (!projectName) {
    return $err({
      code: "MISSING_PROJECT_NAME",
      message: "Project name cannot be empty. Please provide a valid name."
    });
  }
  return $ok(projectName);
};
var cleanupTempDir = (tempDir) => {
  console.log("Cleaning up temporary files...");
  if (fs.existsSync(tempDir)) {
    return safeFns.rmSync(tempDir, { recursive: true, force: true });
  } else {
    return $err({
      code: "FS",
      message: `Temporary directory ${tempDir} does not exist.`
    });
  }
};
var cloneAndCopyTemplate = (git_repo, tempDir, projectPath) => {
  return safeFns.execSync(`git clone --depth 1 --branch master ${git_repo} ${tempDir}`).andThen(() => {
    const templatePath = path.join(tempDir, "template/default");
    if (!fs.existsSync(templatePath)) {
      return $err({
        code: "FS",
        message: "Template directory not found in the repository."
      });
    }
    return safeFns.cpSync(templatePath, projectPath, {
      recursive: true
    });
  }).map(() => {
    console.log("Template files copied successfully");
  });
};
var readAndUpdatePackageJson = (projectPath, projectName) => {
  const packageJsonPath = path.join(projectPath, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    return $err({
      code: "FS",
      message: `package.json not found at ${packageJsonPath}`
    });
  }
  return safeFns.readFileSync(packageJsonPath).andThen((content) => safeFns.JSONParse(content.toString())).andThen((packageJson) => {
    packageJson.name = projectName;
    return safeFns.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  });
};
var initCli = async () => {
  const projectNameResult = parseCliArgs();
  if (projectNameResult.isErr()) {
    console.error(`Error: ${projectNameResult.error.message}`);
    process.exit(1);
  }
  let projectName = projectNameResult.value;
  let projectPath = "";
  const currentPath = process.cwd();
  if (projectName === ".") {
    projectName = path.basename(currentPath);
    projectPath = currentPath;
    console.log("Creating project based on current directory's name:", projectName);
  } else {
    projectPath = path.join(currentPath, projectName);
    const mkdirResult = safeFns.mkdirSync(projectPath);
    if (mkdirResult.isErr()) {
      console.error(`Error: ${mkdirResult.error.message}`);
      process.exit(1);
    }
  }
  const git_repo = "https://github.com/BeyramTaglietti/beyram-react-spa";
  const tempDir = path.join(currentPath, `__temp_${projectName}`);
  console.log(`Downloading files...
`);
  const cloningResult = cloneAndCopyTemplate(git_repo, tempDir, projectPath);
  if (cloningResult.isErr()) {
    console.error(`Error: ${cloningResult.error.message}`);
    cleanupTempDir(tempDir).mapErr((err2) => {
      console.error(`Error: ${err2.message}`);
    });
    process.exit(1);
  }
  const cleanupResult = cleanupTempDir(tempDir);
  if (cleanupResult.isErr()) {
    console.error(`Error: ${cleanupResult.error.message}`);
    process.exit(1);
  }
  process.chdir(projectPath);
  console.log(`
Setting up package.json`);
  const updatingPackageJSONResult = readAndUpdatePackageJson(projectPath, projectName);
  if (updatingPackageJSONResult.isErr()) {
    console.error(`Error: ${updatingPackageJSONResult.error.message}`);
    process.exit(1);
  }
  console.log(`package.json updated successfully
`);
  console.log(`You can now do the following:
`);
  console.log(`    cd ${projectName}`);
  console.log("    pnpm install");
  console.log(`    code .
`);
};
initCli();
