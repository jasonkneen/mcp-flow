const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const util = require('util');

const app = express();
app.use(cors());
app.use(express.json());

// Convert exec to Promise-based
const execPromise = util.promisify(exec);

// Handle MCP tool requests
app.post('/mcp', async (req, res) => {
  try {
    const { server_name, tool_name, arguments: args } = req.body;
    console.log('Received MCP request:', { server_name, tool_name, args });

    // Create a Node.js script that will execute the MCP tool
    const script = `
      async function runMcpTool() {
        try {
          const result = await use_mcp_tool({
            server_name: '${server_name}',
            tool_name: '${tool_name}',
            arguments: ${JSON.stringify(args)}
          });
          console.log(JSON.stringify(result));
        } catch (error) {
          console.error(error);
          process.exit(1);
        }
      }
      runMcpTool();
    `;

    // Execute the script
    const { stdout, stderr } = await execPromise(`node -e "${script}"`, {
      env: process.env,
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    });

    if (stderr) {
      console.error('Script error:', stderr);
      throw new Error(stderr);
    }

    // Parse and send the result
    const result = JSON.parse(stdout);
    console.log('MCP request successful:', result);
    res.json(result);
  } catch (error) {
    console.error('Error processing MCP request:', error);
    res.status(500).json({ 
      error: 'Failed to process MCP request',
      details: error.message 
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`MCP bridge server running on port ${PORT}`);
  console.log(`Ready to handle MCP tool requests`);
});
