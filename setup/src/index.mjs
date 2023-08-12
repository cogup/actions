import {
    checkFolder,
    setStageVariables,
    setVars,
    setStackNameVariable,
    setApiSyntheseServiceRepoName,
    setLambdaArtifactoryBucketName,
} from './handlers.mjs';
import yaml from 'js-yaml';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { getStackName } from './utils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.resolve(__dirname, '../data.yml');
const data = yaml.load(fs.readFileSync(dataPath, 'utf8'));

console.log(data)

checkFolder(data.watchs);

const { stage } = setStageVariables()

const projectName = process.env.PROJECT_NAME
const stackName = getStackName(stage, projectName)

setStackNameVariable(stackName)

setApiSyntheseServiceRepoName(projectName)

setLambdaArtifactoryBucketName(projectName)

if (data.vars) {
    setVars(data.vars)
}

