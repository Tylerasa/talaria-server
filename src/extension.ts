import * as vscode from "vscode";
import * as path from "path";

console.log("vscode://open?url=/Users/mac/Desktop/ditch-hut/talaria/shadow.js");

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
          if(framework === "vue"){
            console.log("fileValue ==>", fileValue);
            
            openFile(fileValue, lineValue)
          }else{
            const folderPath = folder.uri.fsPath;
            const filePath = path.join(folderPath, fileValue?? "");
            const fileUri = vscode.Uri.file(filePath);
            console.log("fileUri", fileUri);
            console.log("filePath", filePath);
            
  
            try {
              await vscode.workspace.fs.stat(fileUri);
              // vscode.window.showTextDocument(fileUri);
              openFile(fileUri.path, lineValue)
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
      // "/src/App.vue"
      // app/dashboard/organizations/[id]/groups/[gid]/images/page.tsx
      // const relativePath "app/dashboard/organizations/[id]/groups/[gid]/images/page.tsx";
      // const relativePath = 'app/forgot-password/reset/page.tsx'
    

      const uriHandler = new MyUriHandler();
      console.log("uriHandler", uriHandler);
      

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

// if (workspaceFolders) {
//   for (const folder of workspaceFolders) {
//     // const pattern = new vscode.RelativePattern(folder, `**/${relativePath}`);
//     const pattern = new vscode.RelativePattern(
//       folder,
//       path.posix.join("**", escapedRelativePath)
//     );

//     const files = await vscode.workspace.findFiles(pattern , null, 1);
//     console.log("files", files);

//     if (files.length > 0) {
//       const fileUri = files[0];
//       vscode.window.showTextDocument(fileUri);
//       return;
//     }
//   }
//   vscode.window.showInformationMessage(`File not found: ${relativePath}`);
// }


// vscode://tylerasa.talaria-server?file=/Users/mac/Desktop/talaria-dev/vue-test/src/App.vue&line=10&framework=vue
async function openFile (file: string | null, line: string| null){

  if (file && line) {
    const filePath = vscode.Uri.parse(`file://${file}`);
    console.log("filePath", filePath);
    console.log("file", file);
    console.log("line", line);
    

    const document = await vscode.workspace.openTextDocument(filePath);
    await vscode.window.showTextDocument(document, {
      selection: new vscode.Range(
        parseInt(line) - 1,
        0,
        parseInt(line) - 1,
        0
      ),
    });
  }
}