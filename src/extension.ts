import * as vscode from "vscode";
import * as path from "path";

let isActivated = false;

class MyUriHandler implements vscode.UriHandler {
  async handleUri(uri: vscode.Uri): Promise<void> {
    let message = "";
    if (uri.query) {
      const params = new URLSearchParams(uri.query);
      const fileValue = params.get("file");
      const lineValue = params.get("line");
      const framework = params.get("framework");

      console.log("framework", framework);
      console.log("lineValue", lineValue);
      console.log("fileValue", fileValue);

      // const relativePath = "/Users/mac/Desktop/talaria-dev/vue-test/src/App.vue"
      const workspaceFolders = vscode.workspace.workspaceFolders;

      if (workspaceFolders) {
        for (const folder of workspaceFolders) {
          if (framework === "vue") {
            console.log("fileValue ==>", fileValue);

            openFile(fileValue, lineValue);
          } else {
            const folderPath = folder.uri.fsPath;
            const filePath = path.join(folderPath, fileValue ?? "");
            const fileUri = vscode.Uri.file(filePath);
            console.log("fileUri", fileUri);
            console.log("filePath", filePath);

            try {
              await vscode.workspace.fs.stat(fileUri);
              // vscode.window.showTextDocument(fileUri);
              openFile(fileUri.path, lineValue);
              return;
            } catch (err) {
              // File not found, continue to the next workspace folder
            }
          }
        }
      }

      message += `Redirecting file:${fileValue} to line number: ${lineValue}`;
    }
    vscode.window.showInformationMessage(message);
  }
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "talaria-server.start",
    async () => {
      if (isActivated) {
        vscode.window.showInformationMessage(
          "Talaria server is already activated."
        );
        return;
      }
      const uriHandler = new MyUriHandler();

      context.subscriptions.push(vscode.window.registerUriHandler(uriHandler));

      await vscode.env.asExternalUri(
        vscode.Uri.parse(
          `${vscode.env.uriScheme}://sylvestersarpong.talaria-server`
        )
      );
      vscode.window.showInformationMessage(
        `Talaria server ready to handle requests.`
      );

      isActivated = true;
    }
  );

  context.subscriptions.push(disposable);
}

async function openFile(file: string | null, line: string | null) {
  if (file && line) {
    const filePath = vscode.Uri.parse(`file://${file}`);
    console.log("filePath", filePath);
    console.log("file", file);
    console.log("line", line);

    const document = await vscode.workspace.openTextDocument(filePath);
    await vscode.window.showTextDocument(document, {
      selection: new vscode.Range(parseInt(line) - 1, 0, parseInt(line) - 1, 0),
    });
  }
}
