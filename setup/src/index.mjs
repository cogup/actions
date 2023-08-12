import {
    getStackName,
    cameCaseToDash,
    getStageVariables
} from './utils.mjs';
import core from '@actions/core';

const { stage, stageUpperCase } = getStageVariables();
const projectName = process.env.PROJECT_NAME
const stackName = getStackName(stage, projectName)
const bucketName = `${cameCaseToDash(projectName)}-lambda-artifacts`;

console.log(`Setting repo name to ${bucketName}`);

core.setOutput('stage', stage);
core.setOutput('stage-name', stageUpperCase);
core.setOutput('stack-name', stackName);
core.setOutput('lambda-artifacts', bucketName);