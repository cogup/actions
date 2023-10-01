import {
    getStackName,
    cameCaseToDash,
    getStageVariables
} from './utils.mjs';
import core from '@actions/core';

const { stage, stageUpperCase } = getStageVariables();
const projectName = cameCaseToDash(process.env.PROJECT_NAME)
const stackName = getStackName(process.env.PROJECT_NAME, stage)
const stackNameNoStage = getStackName(process.env.PROJECT_NAME)
const bucketName = `${projectName}-lambda-artifacts`;

console.log(`Setting repo name to ${bucketName}`);

core.setOutput('stage', stage);
core.setOutput('stage-name', stageUpperCase);
core.setOutput('stack-name', stackName);
core.setOutput('stack-name-no-stage', stackNameNoStage);
core.setOutput('lambda-artifacts', bucketName);
core.setOutput('project-name', projectName);