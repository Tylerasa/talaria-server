import * as vscode from "vscode";

class MyUriHandler implements vscode.UriHandler {
  async handleUri(uri: vscode.Uri):  Promise<void> {
    let message = "";
    if (uri.query) {
      const params = new URLSearchParams(uri.query);
      const fileValue = params.get("file");
      const lineValue = params.get("line");

      message += `Redirecting file:${fileValue} to line number: ${lineValue}`;

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
      const uriHandler = new MyUriHandler();

      context.subscriptions.push(vscode.window.registerUriHandler(uriHandler));

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
