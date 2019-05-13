// entrypoint.js
const { Toolkit } = require("actions-toolkit");
const tools = new Toolkit();
const webPageTest = require("webpagetest");
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

      const jenkinsBaseUrl = process.env.JENKINS_BASE_URL || "";
      const octokit = tools.github;
      const comment = `${jenkinsBaseUrl}${event.number}/`;
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
