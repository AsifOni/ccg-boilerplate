#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

if (process.argv.length < 3) {
  console.log("You have to provide a name to your app.");
  console.log("For example :");
  console.log("    npx create-ccg-app my-app");
  process.exit(1);
} else if (process.argv.length < 4) {
  console.log(
    "You have to provide a Line of business type to your app. Reserved names are Insurance, Rewards, CAASCOnt"
  );
  console.log("For example :");
  console.log("    npx create-ccg-app my-app rewards Rewards");
  process.exit(1);
}

const projectName = process.argv[2];
const lobType = process.argv[3].toLowerCase();
const currentPath = process.cwd();
const projectPath = path.join(currentPath, projectName);
const git_repo_id = {
  rewards: "my-stackbit-site",
  insurance: "insurance-benefit",
  caascont: "caascont-benefit",
}[lobType];

if (!git_repo_id) {
  console.log("Invalid Line of Business name");
  console.log(
    "You have to provide a Line of business type to your app. Reserved names are Insurance, Rewards, CAASCOnt"
  );
  console.log("For example :");
  console.log("    npx create-ccg-app my-app rewards Rewards");
  process.exit(1);
}
const git_repo = `https://github.com/AsifOni/${git_repo_id}.git`;

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
    console.log("Downloading Rewards files...");
    execSync(`git clone --depth 1 ${git_repo} ${projectPath}`);

    process.chdir(projectPath);

    console.log("Installing project dependencies...");
    execSync("npm install");

    console.log("Removing useless files");
    execSync("npx rimraf ./.git");
    fs.rmdirSync(path.join(projectPath, "bin"), { recursive: true });

    console.log("The installation is done, this is ready to use !");
  } catch (error) {
    console.log(error);
  }
}
main();
