import * as vscode from "vscode";

// Our implementation of a UriHandler.
class MyUriHandler implements vscode.UriHandler {
  // This function will get run when something redirects to VS Code
  // with your extension id as the authority.

  // vscode://tylerasa.talaria-server?file=app.tsx&line=30
  async handleUri(uri: vscode.Uri):  Promise<void> {
    let message = "Handled a Uri!";
    if (uri.query) {
      const params = new URLSearchParams(uri.query);
      const fileValue = params.get("file");
      const lineValue = params.get("line");

      console.log("File:", fileValue);
      console.log("Line:", lineValue);
      message += ` It came with this file: ${fileValue} and line: ${lineValue}`;

      if (fileValue && lineValue) {
        const filePath = vscode.Uri.parse(`file://${fileValue}`);
        
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document, { selection: new vscode.Range(parseInt(lineValue) - 1, 0, parseInt(lineValue) - 1, 0) });
      }
    }
    vscode.window.showInformationMessage(message);
  }
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "talaria-server.start",
    async () => {
      // Create our new UriHandler
      const uriHandler = new MyUriHandler();

      // And register it with VS Code. You can only register a single UriHandler for your extension.
      context.subscriptions.push(vscode.window.registerUriHandler(uriHandler));

      // You don't have to get the Uri from the `vscode.env.asExternalUri` API but it will add a query
      // parameter (ex: "windowId%3D14") that will help VS Code decide which window to redirect to.
      // If this query parameter isn't specified, VS Code will pick the last windows that was focused.
      const uri = await vscode.env.asExternalUri(
        vscode.Uri.parse(`${vscode.env.uriScheme}://tylerasa.talaria-server`)
      );
      vscode.window.showInformationMessage(
        `Starting to handle Uris. Open ${uri} in your browser to test.`
      );
    }
  );

  context.subscriptions.push(disposable);
}
