export function cameCaseToDash(str) {
    return str.charAt(0).toLocaleLowerCase() + str.slice(1).replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export function getStackName(project, stage) {
    const fixName = snackToCamelCase(dashToCamelCase(project));
    const stackName = fixName.charAt(0).toUpperCase() + fixName.slice(1);
    const stageName = stage ? stage.charAt(0).toUpperCase() + stage.slice(1) : '';
    return `${stackName}${stageName}`;
}

export function snackToCamelCase(str) {
    return str.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

export function dashToCamelCase(str) {
    return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

export function getStageVariables() {
    const branch = process.env.GITHUB_REF.split('/')[2];
    console.log(`Branch: ${branch}`)
    const stage = branch === 'main' ? 'prod' : branch === 'develop' ? 'dev' : dashToCamelCase(snackToCamelCase(branch));
    const stageUpperCase = stage.charAt(0).toUpperCase() + stage.slice(1);

    return {
        stage,
        stageUpperCase,
    }
}

