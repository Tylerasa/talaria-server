import * as vscode from "vscode";
import * as path from "path";

let isActivated = false;
let uriHandler: MyUriHandler | undefined;

class MyUriHandler implements vscode.UriHandler {
  async handleUri(uri: vscode.Uri): Promise<void> {
    let message = "";
    if (uri.query) {
      const params = new URLSearchParams(uri.query);
      const fileValue = params.get("file");
      const lineValue = params.get("line");
      const framework = params.get("framework");

      // const relativePath = "/Users/mac/Desktop/talaria-dev/vue-test/src/App.vue"
      const workspaceFolders = vscode.workspace.workspaceFolders;

      if (workspaceFolders) {
        for (const folder of workspaceFolders) {
          if (framework === "vue") {
            openFile(fileValue, lineValue);
          } else {
            const pattern = new vscode.RelativePattern(folder, `**/${fileValue}`);
            
            try {
              const files = await vscode.workspace.findFiles(pattern, null, 1);
              if (files.length > 0) {
                const fileUri = files[0];
                console.log("fileUri", fileUri);
                console.log("filePath", fileUri.fsPath);
    
                await vscode.workspace.fs.stat(fileUri); 
                openFile(fileUri.fsPath, lineValue);
                return;
              } else {
                console.log("File not found: ", fileValue);
              }
            } catch (err) {
              console.log("Error accessing file: ", err);
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
  const startServer = async () => {
    if (isActivated) {
      vscode.window.showInformationMessage(
        "Talaria server is already activated."
      );
      return;
    }
    uriHandler = new MyUriHandler();

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
  };

  const startCommand = vscode.commands.registerCommand(
    "talaria-server.start",
    startServer
  );

  startServer();

  const stopCommand = vscode.commands.registerCommand(
    "talaria-server.stop",
    () => {
      if (!isActivated) {
        vscode.window.showInformationMessage(
          "Talaria server is not currently activated."
        );
        return;
      }

      if (uriHandler) {
        uriHandler = undefined;
      }

      isActivated = false;
      vscode.window.showInformationMessage("Talaria server has been stopped.");
    }
  );

  const restartCommand = vscode.commands.registerCommand(
    "talaria-server.restart",
    async () => {
      if (isActivated) {
        if (uriHandler) {
          uriHandler = undefined;
        }
        isActivated = false;
      }

      uriHandler = new MyUriHandler();

      context.subscriptions.push(vscode.window.registerUriHandler(uriHandler));

      await vscode.env.asExternalUri(
        vscode.Uri.parse(
          `${vscode.env.uriScheme}://sylvestersarpong.talaria-server`
        )
      );
      vscode.window.showInformationMessage(
        `Restarting the Talaria Server, ready to handle requests.`
      );

      isActivated = true;
    }
  );

  context.subscriptions.push(startCommand, stopCommand, restartCommand);
}

// async function openFile(file: string | null, line: string | null) {
//   if (file && line) {
//     const filePath = vscode.Uri.parse(`file://${file}`);
//     console.log("filePath", filePath);
//     console.log("file", file);
//     console.log("line", line);

//     const document = await vscode.workspace.openTextDocument(filePath);
//     await vscode.window.showTextDocument(document, {
//       selection: new vscode.Range(parseInt(line) - 1, 0, parseInt(line) - 1, 0),
//     });
//   }
// }

async function openFile(file: string | null, line: string | null) {
  if (file) {
    const filePath = vscode.Uri.parse(`file://${file}`);
    console.log("opening", filePath);
    

    const document = await vscode.workspace.openTextDocument(filePath);

    if (line && !isNaN(parseInt(line))) {
      await vscode.window.showTextDocument(document, {
        selection: new vscode.Range(
          parseInt(line) - 1,
          0,
          parseInt(line) - 1,
          0
        ),
      });
    } else {
      await vscode.window.showTextDocument(document);
    }
  }
}
