import core from '@actions/core';
import github from '@actions/github';
const octokit = github.getOctokit(process.env.GITHUB_TOKEN);

export async function checkFolder(targetPath) {
    const commitMessage = await getMessageCommit()
    const commands = commitMessage.split(' ')

    console.log('Commit message: ', commitMessage);

    if (commands.includes('--force-ci-path')) {
        console.log("Forcing CI for path")
        const forcePath = commands.split('--force-ci-path:')[1].split(' ')[0].trim();

        if (forcePath === targetPath) {
            console.log("Forcing CI for path found: " + forcePath)
            return true;
        }

        console.log("Forcing CI for path not found: " + forcePath)
    }
    
    if (!commands.includes('--force-ci-path') && commitMessage.includes('--force-ci-all')) {
        console.log("Forcing CI")
        return true;
    }

    if (commands.includes('--no-ci-path')) {
        console.log("Forcing no CI for path")
        const forcePath = commitMessage.split('--no-ci-path:')[1].split(' ')[0].trim();

        if (forcePath === targetPath) {
            console.log("Forcing no CI for path found: " + forcePath)
            return false;
        }

        console.log("Forcing no CI for path not found: " + forcePath)
    }
    
    if (!commands.includes('--no-ci-path') && commitMessage.includes('--no-ci-all')) {
        console.log("Forcing no CI")
        return false;
    }

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
