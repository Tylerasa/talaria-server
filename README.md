# Talaria Server Extension

The Talaria Server Extension is a VS Code extension that allows you to handle custom URIs and perform actions based on the URI parameters. It provides a way to open files and navigate to specific line numbers in your workspace based on the information provided in the URI.

## Features

- Handles custom URIs with the scheme `talaria-server`.
- Extracts file path, line number, and framework information from the URI query parameters.
- Opens the specified file and navigates to the provided line number in VS Code.
- Supports Vue.js, Next.js, React and other frameworks.
- Provides commands to start, stop, and restart the extension.

## Installation

1. Clone the repository or download the extension package.
2. Install the extension in VS Code by running `npm install` in the extension directory.
3. Compile the TypeScript code by running `npm run compile`.


## Usage

1. Activate the extension by running the `talaria-server.start` command from the VS Code command palette.
2. Use the Talaria Client from [here](), which will safely jump you to the error file and line you want.  _**OR**_
3. Open a custom URI with the scheme `talaria-server` in your web browser.
   Example: `vscode://sylvestersarpong.talaria-server?file=/path/to/file.js&line=10`
4. The extension will handle the URI and open the specified file in VS Code, navigating to the provided line number.


## Configuration

The extension does not require any additional configuration. It automatically handles custom URIs with the `talaria-server` scheme.

## Commands

The extension provides the following commands:

- `talaria-server.start`: Activates the extension and starts handling custom URIs.
- `talaria-server.stop`: Stops the extension and disables the handling of custom URIs.
- `talaria-server.restart`: Restarts the extension, stopping and then reactivating it.

## URI Parameters

The extension supports the following URI query parameters:

- `file` (required): The path to the file to open in VS Code.
- `line` (optional): The line number to navigate to in the opened file.
- `framework` (optional): The framework being used (e.g., "vue" for Vue.js).

Example URI:
`vscode://sylvestersarpong.talaria-server?file=/path/to/file.js&line=10&framework=vue`

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request on the [GitHub repository](https://github.com/Tylerasa/talaria-server).

## License

This extension is licensed under the [MIT License](https://github.com/Tylerasa/talaria-server/blob/main/LICENSE).

