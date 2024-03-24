# bundle-md

bundle-md is a command-line tool that generates a single Markdown bundle file (`*.bundle.md`) that includes the text from files in a specified directory and its subdirectories. Each file is represented as a Markdown header with its content in a code block.

## Features

- Bundle text files from a directory and its subdirectories into a single Markdown file.
- Specify an output file or directory for the generated Markdown bundle.
- Hide the content of specific files while still listing them in the bundle.
- Exclude certain paths from the output using glob patterns.
- Use a custom configuration file to set options such as output extension, ignore patterns, and hide patterns.

For more details on the available options and their usage, run `bundle-md --help`.

## Global Installation

To install dependencies, build code, and install globally, run:

```bash
npm run bin:install
```

To remove the global installation, run:

```bash
npm run bin:uninstall
```

## Examples

Basic usage to bundle the current directory:

```bash
bundle-md .
```

Ignoring specific files and hiding the content of others:

```bash
bundle-md . --ignore "**/*.test.js" README.md --hide package{-lock,}.json
```
