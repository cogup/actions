import core from '@actions/core';
import github from '@actions/github';
const octokit = github.getOctokit(process.env.GITHUB_TOKEN);

const options = {
    "force-ci-path": [],
    "force-ci": false,
    "no-ci-path": [],
    "no-ci": false
}

async function checkFolder(targetPath) {
    const commitMessage = await getMessageCommit()
    const commands = getArgs(commitMessage, options)

    console.log('Commit message: ', commitMessage);

    if (commands["force-ci"] === true) {
        console.log("Forcing CI")
        return true
    }

    for (const forcePath in commands["force-ci-path"]) {
        if (forcePath === targetPath) {
            console.log("Forcing CI for path found: " + forcePath)
            return true
        }
    }

    if (commands["no-ci"] === true) {
        console.log("No CI found")
        return false
    }

    for (const noPath in commands["no-ci-path"]) { 
        if (noPath === targetPath) {
            console.log("No CI for path found: " + noPath)
            return false
        }
    }

    console.log('Checking for changed files')

    const changedFiles = await getChangedFiles();

    for (let i = 0; i < changedFiles.length; i++) {
        if (changedFiles[i].startsWith(targetPath)) {
            console.log('Found changed file: ', changedFiles[i]);
            return true
        }
    }

    console.log('No changed files found');

    return false
}

async function getMessageCommit() {
    const { owner, repo } = github.context.repo;
    const sha = github.context.sha;

    const commitResponse = await octokit.rest.repos.getCommit({
        owner,
        repo,
        ref: sha,
    });

    return commitResponse.data.commit.message;
}

async function getChangedFiles() {
    const { owner, repo } = github.context.repo;
    const beforeSha = github.context.payload.before;
    const afterSha = github.context.payload.after;

    const compareCommitsResponse = await octokit.rest.repos.compareCommitsWithBasehead({
        owner,
        repo,
        basehead: `${beforeSha}...${afterSha}`,
    });

    const files = [];

    compareCommitsResponse.data.files.forEach((file) => {
        files.push(file.filename);
    });

    return files;
}

function getArgs(commitMessage, defaultArgs) {
    const commands = commitMessage.split(' ')
    const args = defaultArgs

    commands.forEach((command) => {
        if (command.indexOf('--') === 0) {
            const comm = command.split(":")
            const key = comm[0].replace('--', '');

            console.log(comm, args[key])

            if (args[key] !== undefined) {
                if (comm[1] !== undefined) {
                    args[key].push(comm[1])
                } else {
                    args[key] = true
                }
            }
        }
    })

    return args
}

const targetPath = process.argv[2];

console.log('Checking folder: ', targetPath);

checkFolder(targetPath).then((changed) => {
    core.setOutput('changed', changed);
});
