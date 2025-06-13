#!/usr/bin/env node

import { err, fromThrowable, ok, type Result } from "neverthrow";
import { execSync } from "node:child_process";
import * as fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const log = {
  colors: {
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    reset: "\x1b[0m",
  },
  error: (message: string): void => {
    console.error(`${log.colors.red}${message}${log.colors.reset}`);
  },
  success: (message: string): void => {
    console.log(`${log.colors.green}${message}${log.colors.reset}`);
  },
};

const safeFns = {
  execSync: fromThrowable(execSync, (error: unknown): CliError => {
    return {
      code: "OTHER",
      message: `Failed to execute command: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }),

  mkdirSync: fromThrowable(fs.mkdirSync, (error: unknown): CliError => {
    return {
      code: "FS",
      message: `Failed to create directory: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }),

  cpSync: fromThrowable(fs.cpSync, (error: unknown): CliError => {
    return {
      code: "FS",
      message: `Failed to copy files: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }),

  rmSync: fromThrowable(fs.rmSync, (error: unknown): CliError => {
    return {
      code: "FS",
      message: `Failed to remove directory: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }),

  readFileSync: fromThrowable(fs.readFileSync, (error: unknown): CliError => {
    return {
      code: "FS",
      message: `Failed to read file: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }),

  readdirSync: fromThrowable(
    (path: string) => fs.readdirSync(path),
    (error: unknown): CliError => {
      return {
        code: "FS",
        message: `Failed to read directory: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  ),

  writeFileSync: fromThrowable(fs.writeFileSync, (error: unknown): CliError => {
    return {
      code: "FS",
      message: `Failed to write file: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }),

  JSONParse: fromThrowable(JSON.parse, (error: unknown): CliError => {
    return {
      code: "PARSING",
      message: `Failed to parse JSON: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }),
};

type CliError = {
  code: "MISSING_PROJECT_NAME" | "FS" | "CLONING" | "PARSING" | "OTHER";
  message: string;
};

const parseCliArgs = (): Result<string, CliError> => {
  if (process.argv.length < 3) {
    return err({
      code: "MISSING_PROJECT_NAME",
      message:
        "Project name is required. Please provide a name as the first argument.",
    });
  }

  const projectName = process.argv[2];

  if (!projectName) {
    return err({
      code: "MISSING_PROJECT_NAME",
      message: "Project name cannot be empty. Please provide a valid name.",
    });
  }

  return ok(projectName);
};

const copyTemplate = (
  projectPath: string,
  templateName: string
): Result<void, CliError> => {
  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    "../..",
    "template",
    templateName
  );

  if (!fs.existsSync(templateDir)) {
    return err({
      code: "FS",
      message: `Template '${templateName}' not found.`,
    });
  }

  const readingResult = safeFns.readdirSync(templateDir);
  if (readingResult.isErr()) {
    return err({
      code: "FS",
      message: `Failed to read template directory: ${readingResult.error.message}`,
    });
  }

  const files = readingResult.value;

  for (const file of files) {
    const srcFile = path.join(templateDir, file);
    const destFile = path.join(projectPath, file);

    const copyResult = safeFns.cpSync(srcFile, destFile, { recursive: true });
    if (copyResult.isErr()) {
      return err({
        code: "FS",
        message: `Failed to copy template file '${file}': ${copyResult.error.message}`,
      });
    }
  }

  return ok();
};

const readAndUpdatePackageJson = (
  projectPath: string,
  projectName: string
): Result<void, CliError> => {
  const packageJsonPath = path.join(projectPath, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    return err({
      code: "FS",
      message: `package.json not found at ${packageJsonPath}`,
    });
  }

  return safeFns
    .readFileSync(packageJsonPath)
    .andThen((content) => safeFns.JSONParse(content.toString()))
    .andThen((packageJson) => {
      packageJson.name = projectName;
      return safeFns.writeFileSync(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2)
      );
    });
};

const initCli = async () => {
  const projectNameResult = parseCliArgs();

  if (projectNameResult.isErr()) {
    log.error(`Error: ${projectNameResult.error.message}`);
    process.exit(1);
  }

  let projectName = projectNameResult.value;
  let projectPath: string = "";
  const currentPath = process.cwd();

  if (projectName === ".") {
    projectName = path.basename(currentPath);
    projectPath = currentPath;
    console.log(
      "Creating project based on current directory's name:",
      projectName
    );
  } else {
    projectPath = path.join(currentPath, projectName);

    const mkdirResult = safeFns.mkdirSync(projectPath);
    if (mkdirResult.isErr()) {
      log.error(`Error: ${mkdirResult.error.message}`);
      process.exit(1);
    }
  }

  console.log("Downloading files...\n");

  const cloningResult = copyTemplate(projectPath, "default");

  if (cloningResult.isErr()) {
    log.error(`Error: ${cloningResult.error.message}`);
    process.exit(1);
  }

  process.chdir(projectPath);
  console.log("\nSetting up package.json");

  const updatingPackageJSONResult = readAndUpdatePackageJson(
    projectPath,
    projectName
  );
  if (updatingPackageJSONResult.isErr()) {
    log.error(`Error: ${updatingPackageJSONResult.error.message}`);
    process.exit(1);
  }

  console.log("package.json updated");

  log.success(`\nProject ${projectName} created successfully!\n`);

  console.log("You can now do the following:\n");

  console.log(`    cd ${projectName}`);

  console.log("    pnpm install");
  console.log("    code .\n");
};

initCli();
