#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

if (process.argv.length < 3) {
  console.log("You have to provide a name to your app.");
  console.log("For example :");
  console.log("    npx create-beyram-react-spa my-app");
  console.log("    npx create-beyram-react-spa .");
  process.exit(1);
}

let projectName = process.argv[2];
const currentPath = process.cwd();
let projectPath;

if (projectName === ".") {
  projectPath = currentPath;
  projectName = path.basename(currentPath);
  console.log(`Using current directory: ${projectName}`);
} else {
  projectPath = path.join(currentPath, projectName);
  // Create the project directory
  try {
    fs.mkdirSync(projectPath);
  } catch (err) {
    if (err.code === "EEXIST") {
      console.log(
        `The file ${projectName} already exists in the current directory, please give it another name.`
      );
    } else {
      console.log(err);
    }
    process.exit(1);
  }
}

const git_repo = "https://github.com/BeyramTaglietti/beyram-react-spa";
const tempDir = path.join(currentPath, `__temp_${projectName}`);

async function main() {
  try {
    console.log("Downloading files...\n");

    execSync(`git clone --depth 1 --branch master ${git_repo} ${tempDir}`);

    // Copy template/default contents to the project directory
    const templatePath = path.join(tempDir, "template/default");

    if (fs.existsSync(templatePath)) {
      // Copy all contents from template/default to project directory
      fs.cpSync(templatePath, projectPath, { recursive: true });
      console.log("Template files copied successfully");
    } else {
      console.log("Template directory not found. Aborting installation.");
      process.exit(1);
    }

    // Clean up the temporary directory
    fs.rmSync(tempDir, { recursive: true, force: true });

    process.chdir(projectPath);

    console.log("\nSetting up package.json");
    const packageJsonPath = path.join(projectPath, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));
      packageJson.name = projectName;
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    } else {
      console.log("package.json not found in template");
    }

    console.log("\nThe installation is done\n");
    console.log("You can now do the following:\n");

    if (projectPath !== currentPath) {
      console.log(`    cd ${projectName}`);
    }

    console.log("    pnpm install");
    console.log("    code .\n");
  } catch (error) {
    console.log(error);
    // Clean up if something went wrong
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
}

main();
