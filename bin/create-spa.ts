#!/usr/bin/env node

import { execSync } from "child_process";
import * as fs from "fs";
import { err, fromThrowable, ok, type Result } from "neverthrow";
import path from "path";

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

const cleanupTempDir = (tempDir: string): Result<void, CliError> => {
  console.log("Cleaning up temporary files...");
  if (fs.existsSync(tempDir)) {
    return safeFns.rmSync(tempDir, { recursive: true, force: true });
  } else {
    return err({
      code: "FS",
      message: `Temporary directory ${tempDir} does not exist.`,
    });
  }
};

const cloneAndCopyTemplate = (
  git_repo: string,
  tempDir: string,
  projectPath: string
): Result<void, CliError> => {
  return safeFns
    .execSync(`git clone --depth 1 --branch master ${git_repo} ${tempDir}`)
    .andThen(() => {
      const templatePath = path.join(tempDir, "template/default");

      if (!fs.existsSync(templatePath)) {
        return err<void, CliError>({
          code: "FS",
          message: "Template directory not found in the repository.",
        });
      }

      return safeFns.cpSync(templatePath, projectPath, {
        recursive: true,
      });
    })
    .map(() => {
      console.log("Template files copied successfully");
    });
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

  const git_repo = "https://github.com/BeyramTaglietti/beyram-react-spa";
  const tempDir = path.join(currentPath, `__temp_${projectName}`);

  console.log("Downloading files...\n");

  // Clone the repository into a temporary directory
  const cloningResult = cloneAndCopyTemplate(git_repo, tempDir, projectPath);

  if (cloningResult.isErr()) {
    log.error(`Error: ${cloningResult.error.message}`);
    cleanupTempDir(tempDir).mapErr((err) => {
      log.error(`Error: ${err.message}`);
    });
    process.exit(1);
  }

  cleanupTempDir(tempDir).mapErr((cleanupResult) => {
    log.error(`\nError during cleanup: ${cleanupResult.message}`);
    log.error(
      `\nPlease remove the temporary directory manually if it exists.\n`
    );
  });

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
