import core from '@actions/core';
import github from '@actions/github';

export async function checkFolder(targetPath) {
    const commitMessage = await getMessageCommit()

    if (commitMessage.includes('--deploy-all')) {
        console.log('Commit message contains --deploy-all, skipping folder check');
        Object.keys(foldersToCheck).forEach((name) => {
            if (name === 'all') {
                return;
            }

            core.setOutput(name, true);
        })
        return;
    }

    if (commitMessage.includes('--no-ci')) {
        console.log('Commit message contains --no-ci, skipping conventional commit check');
        Object.keys(foldersToCheck).forEach((name) => {
            if (name === 'all') {
                return;
            }

            core.setOutput(name, false);
        })
        return;
    }

    const changedFiles = await getChangedFiles();

    for (let i = 0; i < changedFiles.length; i++) {
        if (changedFiles[i].startsWith(targetPath)) {
            return true
        }
    }

    return false
}

export async function getMessageCommit() {
    const token = process.env.GITHUB_TOKEN;
    const octokit = github.getOctokit(token);
    const { owner, repo } = github.context.repo;
    const sha = github.context.sha;

    const commitResponse = await octokit.rest.repos.getCommit({
        owner,
        repo,
        ref: sha,
    });

    return commitResponse.data.commit.message;
}

export async function getChangedFiles() {
    const token = process.env.GITHUB_TOKEN;
    const octokit = github.getOctokit(token);

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

// get args
const targetPath = process.argv[2];

console.log('Checking folder: ', targetPath);
// get args

checkFolder(targetPath).then((changed) => {
    core.setOutput('changed', changed);
});