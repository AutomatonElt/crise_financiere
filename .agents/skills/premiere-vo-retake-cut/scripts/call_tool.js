// Call one Premiere MCP tool over stdio, without a Claude session that has the server loaded.
//
//   node call_tool.js <tool_name> ['<json args>']
//   node call_tool.js verify_premiere_connection
//   node call_tool.js list_sequences '{}'
//
// Why this exists: the MCP server is registered user-scope, so a Claude session started BEFORE the
// registration cannot see the tools. This speaks the same JSON-RPC the client speaks, so it works
// from any shell - and it is the fastest way to test the bridge without restarting anything.
const { spawn } = require('child_process');

// Point these at your own install, or set NODE_BIN / PREMIERE_MCP_SERVER / PREMIERE_TEMP_DIR.
const NODE = process.env.NODE_BIN || 'node';
const SERVER = process.env.PREMIERE_MCP_SERVER
  || require('path').join(process.env.APPDATA || '', 'npm/node_modules/premiere-pro-mcp/dist/index.js');
const BRIDGE = process.env.PREMIERE_TEMP_DIR
  || require('path').join(require('os').tmpdir(), 'premiere-mcp-bridge');

const tool = process.argv[2];
if (!tool) {
  console.error('usage: node call_tool.js <tool_name> [json_args]');
  process.exit(2);
}
// Args are JSON, either inline or - far safer on Windows - '@path\to\args.json'.
// Inline JSON loses a level of backslashes on the way through a shell, so any argument
// carrying a Windows path (mogrtPath, presetPath, project paths) must use the @file form.
let args = {};
if (process.argv[3]) {
  const raw = process.argv[3].startsWith('@')
    ? require('fs').readFileSync(process.argv[3].slice(1), 'utf8')
    : process.argv[3];
  try {
    args = JSON.parse(raw);
  } catch (e) {
    console.error('args must be JSON: ' + e.message);
    process.exit(2);
  }
}

// leancoderkavy/premiere-pro-mcp serves all 365 core tools with no toolset flag, and its
// telemetry is opt-in (POSTHOG_API_KEY unset), so neither of hetpatel's switches applies.
// The default capability profile is inspect,edit,export,filesystem - enough to build a
// timeline, and deliberately without `unsafe-script`.
const env = Object.assign({}, process.env, {
  PREMIERE_TEMP_DIR: BRIDGE,
  PREMIERE_TIMEOUT_MS: '120000',
});

const p = spawn(NODE, [SERVER], { env });
let buf = '';
const send = (o) => p.stdin.write(JSON.stringify(o) + '\n');

send({
  jsonrpc: '2.0', id: 1, method: 'initialize',
  params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'call_tool', version: '1' } },
});

p.stdout.on('data', (d) => {
  buf += d.toString();
  let i;
  while ((i = buf.indexOf('\n')) >= 0) {
    const line = buf.slice(0, i);
    buf = buf.slice(i + 1);
    if (!line.trim()) continue;
    let m;
    try { m = JSON.parse(line); } catch (e) { continue; }

    if (m.id === 1) {
      send({ jsonrpc: '2.0', method: 'notifications/initialized', params: {} });
      send({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: tool, arguments: args } });
    }
    if (m.id === 2) {
      if (m.error) {
        console.log('ERROR: ' + JSON.stringify(m.error, null, 2));
        p.kill();
        process.exit(1);
      }
      const c = (m.result && m.result.content) || [];
      for (const part of c) console.log(part.type === 'text' ? part.text : JSON.stringify(part));
      if (m.result && m.result.isError) { p.kill(); process.exit(1); }
      p.kill();
      process.exit(0);
    }
  }
});

p.stderr.on('data', (d) => process.stderr.write(d));
setTimeout(() => { console.log('TIMEOUT after 60s - the CEP panel is almost certainly not started'); p.kill(); process.exit(1); }, 60000);
