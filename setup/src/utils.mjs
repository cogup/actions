export function cameCaseToDash(str) {
    return str.charAt(0).toLocaleLowerCase() + str.slice(1).replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export function getStackName(stage, project) {
    const stageName = stage.charAt(0).toUpperCase() + stage.slice(1);
    const projectName = project.charAt(0).toUpperCase() + project.slice(1);
    return `${projectName}${stageName}`;
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

