import {
    getStackName,
    cameCaseToDash,
    getStageVariables
} from './utils.mjs';
import core from '@actions/core';

const { stage, stageUpperCase } = getStageVariables();

core.setOutput('stage', stage);
core.setOutput('stage-name', stageUpperCase);

const projectName = process.env.PROJECT_NAME
const stackName = getStackName(stage, projectName)

core.setOutput('stack-name', stackName);

const bucketName = `${cameCaseToDash(projectName)}-lambda-artifacts`;

console.log(`Setting repo name to ${bucketName}`);

core.setOutput('lambda-artifacts', bucketName);