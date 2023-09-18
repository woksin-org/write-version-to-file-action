// Copyright (c) woksin-org. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import * as core from '@actions/core';
import * as github from '@actions/github';
import { exec } from '@actions/exec';
import path from 'path';
import editJsonFile from 'edit-json-file';
import { Logger } from '@woksin/github-actions.shared.logging';
import { safeCommitAndPush } from '@woksin/github-actions.shared.git';

const logger = new Logger();

run();
/**
 * Runs the action.
 */
export async function run() {
    try {
        const version = core.getInput('version', { required: true });
        const versionFilePath = core.getInput('path', { required: true });

        const userEmail = core.getInput('user-email', { required: false });
        const userName = core.getInput('user-name', { required: false });

        const commitSHA = github.context.sha;
        const buildDate = new Date().toISOString();

        logger.info('Writing build version information to file');
        logger.info(`\tPath : ${versionFilePath}`);
        logger.info(`\tVersion: ${version}`);
        logger.info(`\tCommit: ${commitSHA}`);
        logger.info(`\tBuilt: ${buildDate}`);

        updateVersionFile(versionFilePath, version, commitSHA, buildDate);
        await safeCommitAndPush(logger, {
            userEmail,
            userName,
            branch: path.basename(github.context.ref),
            files: [versionFilePath],
            commitMessage: `Update to ${version} in version file`
        });

    } catch (error: any) {
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
