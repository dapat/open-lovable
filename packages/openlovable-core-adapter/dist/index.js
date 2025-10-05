import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import fs from 'node:fs';
const pExecFile = promisify(execFile);
function findRepoRoot(startDir) {
    let dir = startDir;
    const { root } = path.parse(startDir);
    while (true) {
        if (fs.existsSync(path.join(dir, '.git')))
            return dir;
        if (dir === root)
            return null;
        dir = path.dirname(dir);
    }
}
export { parseSpec } from './spec';
export { renderHTML, renderLegacyHTML } from './render';
export { renderThemedHTML } from './renderThemed';
export { promptToSpec, generateFromPrompt, mulberry32, seededShuffle } from './promptAdapter';
export { buildExportZip } from './exporter';
async function tryGitShortSha(cwd) {
    try {
        const { stdout } = await pExecFile('git', ['rev-parse', '--short', 'HEAD'], { cwd });
        const sha = stdout.trim();
        return sha.length ? sha : null;
    }
    catch {
        return null;
    }
}
function tryReadCoreVersionFile(corePath) {
    try {
        const verPath = path.join(corePath, 'CORE_VERSION');
        if (fs.existsSync(verPath)) {
            const txt = fs.readFileSync(verPath, 'utf8').trim();
            return txt.length ? txt : null;
        }
    }
    catch { }
    return null;
}
export async function getCoreInfo() {
    // Assume dev runs from apps/demo. Compute likely core path.
    const fromCwd = path.resolve(process.cwd(), '../../packages/openlovable-core');
    const candidates = [
        fromCwd,
        // __dirname substitute for ESM
        path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../openlovable-core'),
    ];
    const corePath = candidates.find((p) => fs.existsSync(p)) ?? fromCwd;
    // Prefer using git info from submodule or core dir
    const repoRoot = findRepoRoot(process.cwd());
    let sha = null;
    if (repoRoot) {
        // If submodule exists, we can still just ask git in the core directory
        sha = await tryGitShortSha(corePath);
    }
    if (!sha) {
        // Fallback to git in corePath directly
        sha = await tryGitShortSha(corePath);
    }
    if (!sha) {
        // Final fallback: read baked version file (available in prod builds without .git)
        sha = tryReadCoreVersionFile(corePath);
    }
    if (!sha) {
        sha = 'local-core';
    }
    return { sha, path: corePath };
}
