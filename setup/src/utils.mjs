import github from '@actions/github';

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


export function cameCaseToUpperSnakeCase(str) {
    return str.charAt(0).toLocaleLowerCase() + str.slice(1).replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
}

export function cameCaseToDash(str) {
    return str.charAt(0).toLocaleLowerCase() + str.slice(1).replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export function getStackName(stage, project) {
    const stageName = stage.charAt(0).toUpperCase() + stage.slice(1);
    const projectName = project.charAt(0).toUpperCase() + project.slice(1);
    return `${projectName}${stageName}`;
}
