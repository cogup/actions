import {
    getStackName,
    cameCaseToDash,
    getStageVariables
} from './utils.mjs';
import core from '@actions/core';

const { stage, stageUpperCase } = getStageVariables();
const projectName = cameCaseToDash(process.env.PROJECT_NAME)
const stackName = getStackName(stage, projectName)
const bucketName = `${projectName}-lambda-artifacts`;

console.log(`Setting repo name to ${bucketName}`);

core.setOutput('stage', stage);
core.setOutput('stage-name', stageUpperCase);
core.setOutput('stack-name', stackName);
core.setOutput('lambda-artifacts', bucketName);
core.setOutput('project-name', projectName);