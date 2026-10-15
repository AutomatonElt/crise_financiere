// Run many Premiere MCP tool calls over ONE stdio session.
//
//   node batch_tool.js <calls.json> [out.jsonl]
//
// calls.json is [{ "tool": "...", "args": {...} }, ...].
//
// Why this exists: call_tool.js spawns a server per call, which costs a second each and
// makes a 600-call job unusable. Proven on a 480-piece VO retake review: bulk calls go through one session that re-checks the active sequence every
// GUARD_EVERY calls, because the bridge writes to whatever sequence has FOCUS. If the user
// clicks another sequence mid-run, every later call lands in the wrong timeline.
//
// Set GUARD_SEQUENCE to the sequence id that must stay active; the run aborts on a mismatch.
const { spawn } = require('child_process');
const fs = require('fs');

// Point these at your own install, or set NODE_BIN / PREMIERE_MCP_SERVER / PREMIERE_TEMP_DIR.
const NODE = process.env.NODE_BIN || 'node';
const SERVER = process.env.PREMIERE_MCP_SERVER
  || require('path').join(process.env.APPDATA || '', 'npm/node_modules/premiere-pro-mcp/dist/index.js');
const BRIDGE = process.env.PREMIERE_TEMP_DIR
  || require('path').join(require('os').tmpdir(), 'premiere-mcp-bridge');
const GUARD_EVERY = 25;

const callsPath = process.argv[2];
const outPath = process.argv[3] || null;
const guardSeq = process.env.GUARD_SEQUENCE || null;
if (!callsPath) { console.error('usage: node batch_tool.js <calls.json> [out.jsonl]'); process.exit(2); }

const calls = JSON.parse(fs.readFileSync(callsPath, 'utf8'));
const out = outPath ? fs.createWriteStream(outPath) : null;

const env = Object.assign({}, process.env, {
  PREMIERE_TEMP_DIR: BRIDGE,
  PREMIERE_TIMEOUT_MS: '120000',
});

const p = spawn(NODE, [SERVER], { env });
let buf = '';
let nextId = 10;
const pending = new Map();
const send = (o) => p.stdin.write(JSON.stringify(o) + '\n');

function call(tool, args) {
  return new Promise((resolve) => {
    const id = nextId++;
    pending.set(id, resolve);
    send({ jsonrpc: '2.0', id, method: 'tools/call', params: { name: tool, arguments: args } });
  });
}

p.stdout.on('data', (d) => {
  buf += d.toString();
  let i;
  while ((i = buf.indexOf('\n')) >= 0) {
    const line = buf.slice(0, i); buf = buf.slice(i + 1);
    if (!line.trim()) continue;
    let m; try { m = JSON.parse(line); } catch (e) { continue; }
    if (m.id === 1) { send({ jsonrpc: '2.0', method: 'notifications/initialized', params: {} }); run(); continue; }
    const res = pending.get(m.id);
    if (res) { pending.delete(m.id); res(m); }
  }
});

function textOf(m) {
  if (m.error) return 'ERROR ' + JSON.stringify(m.error);
  const c = (m.result && m.result.content) || [];
  return c.map((x) => (x.type === 'text' ? x.text : JSON.stringify(x))).join('\n');
}

async function guard(n) {
  if (!guardSeq) return true;
  const m = await call('get_active_sequence', {});
  const t = textOf(m);
  if (!t.includes(guardSeq)) {
    console.error(`[batch] ABORT at call ${n}: active sequence is not ${guardSeq}`);
    console.error(t.slice(0, 400));
    return false;
  }
  return true;
}

async function run() {
  if (!(await guard(0))) { p.kill(); process.exit(3); }
  let ok = 0, bad = 0;
  for (let n = 0; n < calls.length; n++) {
    const c = calls[n];
    const m = await call(c.tool, c.args || {});
    const t = textOf(m);
    const failed = m.error || /"(ok|success|created|verified|applied)"\s*:\s*false/.test(t) || /^ERROR/.test(t);
    if (failed) bad++; else ok++;
    if (out) out.write(JSON.stringify({ n, tool: c.tool, args: c.args, label: c.label || null, result: t }) + '\n');
    if ((n + 1) % 50 === 0) console.log(`[batch] ${n + 1}/${calls.length}  ok=${ok} bad=${bad}`);
    if ((n + 1) % GUARD_EVERY === 0 && !(await guard(n + 1))) { p.kill(); process.exit(3); }
  }
  console.log(`[batch] done: ${ok} ok, ${bad} failed, of ${calls.length}`);
  if (out) out.end();
  p.kill();
  process.exit(bad ? 1 : 0);
}

send({ jsonrpc: '2.0', id: 1, method: 'initialize',
  params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'batch_tool', version: '1' } } });
