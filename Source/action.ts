// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import * as core from '@actions/core';
import * as github from '@actions/github';
import { exec } from '@actions/exec';
import path from 'path';
import editJsonFile from 'edit-json-file';
import { Logger } from '@dolittle/github-actions.shared.logging';

const logger = new Logger();

run();
export async function run() {
    try {
        const version = core.getInput('version', { required: true });
        const path = core.getInput('path', { required: true });

        const userEmail = core.getInput('user-email', { required: false }) || 'build@dolittle.com';
        const userName = core.getInput('user-name', { required: false }) || 'dolittle-build';

        const commitSHA = github.context.sha;
        const buildDate = new Date().toISOString();

        logger.info('Writing build version information to file');
        logger.info(`\tPath : ${path}`);
        logger.info(`\tVersion: ${version}`);
        logger.info(`\tCommit: ${commitSHA}`);
        logger.info(`\tBuilt: ${buildDate}`);

        updateVersionFile(path, version, commitSHA, buildDate);
        await commitVersionFile(path, version, userEmail, userName);
        await pushChanges();

    } catch (error) {
        logger.info(`Error : ${error}`);
        fail(error);
    }
}

function fail(error: Error) {
    logger.error(error.message);
    core.setFailed(error.message);
}

function updateVersionFile(filePath: string, version: string, commitSHA: string, buildDate: string) {
    logger.info(`Updating version file ${filePath}`);
    const file = editJsonFile(filePath);
    file.set('version', version);
    file.set('commit', commitSHA);
    file.set('built', buildDate);
    file.save();
}

async function commitVersionFile(filePath: string, version: string, userEmail: string, userName: string) {
    logger.info(`Adding and committing ${filePath}`);
    await exec('git add', [filePath]);
    await exec(
        'git commit',
        [
            `-m "Update to ${version} in version file"`
        ],
        {
            env: {
                GIT_AUTHOR_NAME: userName,
                GIT_AUTHOR_EMAIL: userEmail,
                GIT_COMMITTER_NAME: userName,
                GIT_COMMITTER_EMAIL: userEmail,
            },
        });
}

async function pushChanges() {
    const branchName = path.basename(github.context.ref);
    logger.info(`Pushing changelog to origin ${branchName}`);
    await exec('git pull origin', [branchName]);
    await exec('git push origin', [branchName]);
}