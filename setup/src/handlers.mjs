import core from '@actions/core';
import { cameCaseToDash, getChangedFiles, getMessageCommit, cameCaseToUpperSnakeCase } from './utils.mjs';

export async function checkFolder(foldersToCheck) {
    try {
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

        const changed = {}

        Object.entries(foldersToCheck).map(([name, path]) => {
            changed[name] = false;

            changedFiles.forEach((file) => {
                if (file.startsWith(path)) {
                    changed[name] = true;
                }
            })
        })

        console.log(changed)

        Object.entries(changed).forEach(([name, value]) => {
            if (name === 'all') {
                return;
            }

            core.setOutput(name, changed.all || value);
        })
    } catch (error) {
        core.setFailed(error.message);
    }
}

export function setStageVariables() {
    try {
        const branch = process.env.BRANCH;
        const stage = branch === 'main' ? 'prod' : 'dev';
        const stageUpperCase = stage.charAt(0).toUpperCase() + stage.slice(1);

        console.log(`Setting stage to ${stage}`);

        core.setOutput('stage', stage);
        core.setOutput('stage_name', stageUpperCase);
        return {
            stage,
            stageUpperCase,
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

export function setStackNameVariable(stackName) {
    console.log(`Setting stack name to ${stackName}`);
    core.setOutput('stack_name', stackName);
}

export function setApiSyntheseServiceRepoName(projectName) {
    const repoName = `${cameCaseToDash(projectName)}/synthese-api`;

    console.log(`Setting repo name to ${repoName}`);
    core.setOutput('synthese_api_repo_name', repoName);
}

export function setLambdaArtifactoryBucketName(projectName) {
    const bucketName = `${cameCaseToDash(projectName)}-lambda-artifacts`;

    console.log(`Setting repo name to ${bucketName}`);

    core.setOutput('lambda_artifactory_bucket_name', bucketName);
}

export function setVars(vars) {
    try {
        Object.entries(vars).forEach(([name, value]) => {
            console.log(`Setting ${name} to ${value}`)
            core.setOutput(name, value);
        })
    } catch (error) {
        core.setFailed(error.message);
    }
}

