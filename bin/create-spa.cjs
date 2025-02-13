#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

if (process.argv.length < 3) {
  console.log("You have to provide a name to your app.");
  console.log("For example :");
  console.log("    npx create-beyram-react-spa my-app");
  process.exit(1);
}

const projectName = process.argv[2];
const currentPath = process.cwd();
const projectPath = path.join(currentPath, projectName);
const git_repo = "https://github.com/BeyramTaglietti/beyram-react-spa";

try {
  fs.mkdirSync(projectPath);
} catch (err) {
  if (err.code === "EEXIST") {
    console.log(
      `The file ${projectName} already exist in the current directory, please give it another name.`
    );
  } else {
    console.log(error);
  }
  process.exit(1);
}

async function main() {
  try {
    console.log("Downloading files...\n");
    execSync(`git clone --depth 1 ${git_repo} ${projectPath}`);

    process.chdir(projectPath);

    console.log("\nRemoving useless files");

    const gitPath = path.join(projectPath, ".git");
    if (fs.existsSync(gitPath)) {
      fs.rmSync(gitPath, { recursive: true });
      console.log("Removed .git directory");
    } else {
      console.log(".git directory not found. Skipping removal.");
    }

    console.log("\nSetting up package.json");
    const packageJsonPath = path.join(projectPath, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));
    packageJson.name = projectName;
    packageJson.version = "0.0.0";
    delete packageJson.bin;

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    const binPath = "bin";
    if (fs.existsSync(binPath)) {
      fs.rmSync(path.join(projectPath, binPath), { recursive: true });
      console.log("Removed bin directory");
    } else {
      console.log("bin directory not found. Skipping removal.");
    }

    console.log("\nThe installation is done\n");
    console.log("You can now do the following:\n");
    console.log(`    cd ${projectName}`);
    console.log("    pnpm install");
    console.log("    code .\n");
  } catch (error) {
    console.log(error);
  }
}
main();
