// entrypoint.js
const { Toolkit } = require("actions-toolkit");
const tools = new Toolkit();
const argv = tools.arguments;

const { event, payload, sha } = tools.context;

// check pre-requirements
if (!checkForMissingEnv) tools.exit.failure("Failed!");

// run the script
run();

async function run() {
  try {
    if (event === "pull_request") {
      tools.log("### Action triggered! ###");

      const ciBaseUrl = process.env.CI_BASE_URL || "";
      const octokit = tools.github;
      const comment = `${ciBaseUrl}${payload.number}/`;
      const { owner, repo } = tools.context.repo({ ref: `${payload.ref}` });

      await octokit.repos.createCommitComment({
        owner,
        repo,
        sha,
        body: comment
      });

      tools.exit.success("Succesfully run!");
    }
  } catch (error) {
    tools.log.error(`Something went wrong ${error}!`);
  }
}

/**
 * Log warnings to the console for missing environment variables
 */
function checkForMissingEnv() {
  const requiredEnvVars = [
    "HOME",
    "GITHUB_WORKFLOW",
    "GITHUB_ACTION",
    "GITHUB_ACTOR",
    "GITHUB_REPOSITORY",
    "GITHUB_EVENT_NAME",
    "GITHUB_EVENT_PATH",
    "GITHUB_WORKSPACE",
    "GITHUB_SHA",
    "GITHUB_REF",
    "GITHUB_TOKEN",
    "CI_BASE_URL"
  ];

  const requiredButMissing = requiredEnvVars.filter(
    key => !process.env.hasOwnProperty(key)
  );
  if (requiredButMissing.length > 0) {
    // This isn't being run inside of a GitHub Action environment!
    const list = requiredButMissing.map(key => `- ${key}`).join("\n");
    const warning = `There are environment variables missing from this runtime.\n${list}`;
    tools.log.warn(warning);
    return false;
  } else {
    return true;
  }
}
