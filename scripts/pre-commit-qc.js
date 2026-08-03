#!/usr/bin/env node
/**
 * Pre-commit hook: chạy QC trước khi commit.
 * Tự động install bằng: `npm run qc:install-hook`
 *
 * Hook này fail nếu có ERROR (không phải warning).
 * Warning sẽ hiển thị nhưng vẫn cho commit.
 */

const { spawnSync } = require("child_process");
const path = require("path");

const result = spawnSync("node", [path.join(__dirname, "qc.js")], {
  stdio: "inherit",
  cwd: path.join(__dirname, ".."),
});

process.exit(result.status || 0);
