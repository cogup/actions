import core from '@actions/core';
import github from '@actions/github';
const octokit = github.getOctokit(process.env.GITHUB_TOKEN);


export async function checkFolder(targetPath) {
    const commitMessage = await getMessageCommit()

    if (commitMessage.includes('--deploy-all')) {
        return true;
    }

    if (commitMessage.includes('--no-ci')) {
        return false;
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

const targetPath = process.argv[2];

console.log('Checking folder: ', targetPath);

checkFolder(targetPath).then((changed) => {
    core.setOutput('changed', changed);
});
