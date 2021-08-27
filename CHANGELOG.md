# [2.0.1] - 2021-8-27 [PR: #17](https://github.com/dolittle/write-version-to-file-action/pull/17)
## Summary

Pull before pushing commit

### Changed

- Does a git pull before git push


# [2.0.0] - 2021-8-18 [PR: #16](https://github.com/dolittle/write-version-to-file-action/pull/16)
## Summary

Changed the action to commit and push the updates to the specified version file using the build server `git` command rather than the GitHub API. Same setup as the https://github.com/dolittle/add-to-changelog-action code, with slight changes using environment variables instead of updating the git configuration for the user name and email for committing.

### Changed

- Uses the `git` command to commit and push changes rather than the GitHub API.

