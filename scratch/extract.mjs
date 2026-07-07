const fs = require('fs');
const readline = require('readline');

async function extractAppJsx() {
  const fileStream = fs.createReadStream('C:\\Users\\anky9\\.gemini\\antigravity-ide\\brain\\1e03221a-3f16-452e-89e5-1e54738bc54d\\.system_generated\\logs\\transcript.jsonl');
  const rl = readline.createInterface({ input: fileStream });

  let bestAppJsx = null;

  for await (const line of rl) {
    try {
      const entry = JSON.parse(line);
      
      // Look for replace_file_content where the file was App.jsx
      if (entry.tool_calls) {
        for (const call of entry.tool_calls) {
          if (call.name === 'replace_file_content' && call.args && call.args.TargetFile && call.args.TargetFile.includes('App.jsx')) {
            console.log('Found replace_file_content at step ' + entry.step_index);
            // We can't see the full file here, just the replacement.
          }
        }
      }
      
      // Look for view_file responses
      if (entry.type === 'TOOL_RESPONSE' && entry.content && entry.content.includes('File Path: `file:///d:/Desktop_March_26/svg-creator/src/App.jsx`')) {
        console.log('Found view_file response at step ' + entry.step_index);
        // This only gives us up to 800 lines...
      }

    } catch (e) {
      // ignore
    }
  }
}

extractAppJsx();
