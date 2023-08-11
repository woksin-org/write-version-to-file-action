# GitHub Action - Write Version To File

This GitHub action writes the version information from a given variable into a file with a well known JSON structure.
Once the file is written it will perform a commit to the repository with the changed version file.

## Usage

Create a workflow `.yml` file in your `.github/workflows` directory. An [example workflow](#example-workflow) is available below.

For more information, reference the GitHub Help Documentation for [Creating a workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file)

### Inputs

- `version`: The version number to use.
- `path`: The path to the file within the repository.
- `user-email`: The email of the user that commits the version file.
- `user-name`: The name of the user that commits the version file.

For information on how GitHub actions tokens work, read more [here](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/authenticating-with-the-github_token#about-the-github_token-secret).

### Example Workflow

```yaml
on:
  pull_request:
    types: [closed]

name: GitHub action workflow name

jobs:
  context:
    name: Job name
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Write version
        uses: woksin-org/write-version-to-file-action@v3
        with:
          version: '1.2.4'
          path: ./Source/version.json
```

## Contributing

We're always open for contributions and bug fixes!
