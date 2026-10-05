// Structural checks for the skill catalog: frontmatter that installers rely on,
// and relative links that must resolve once a skill folder is copied alone.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const root = process.cwd();
const skillsDir = join(root, "skills");
const errors = [];

// Agent Skills spec: lowercase letters, digits, and single hyphens; max 64 chars.
const NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_NAME = 64;
const MAX_DESCRIPTION = 1024;

function readFrontmatter(file) {
  const text = readFileSync(file, "utf8");
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return null;

  const fields = {};
  for (const line of match[1].split("\n")) {
    const field = line.match(/^([a-z-]+):\s*(.*)$/);
    if (field) fields[field[1]] = field[2].replace(/^"(.*)"$/, "$1").trim();
  }
  return fields;
}

function markdownFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    if (entry === "node_modules" || entry.startsWith(".")) return [];
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return markdownFiles(path);
    return entry.endsWith(".md") ? [path] : [];
  });
}

function checkLinks(file) {
  // Code is not prose: `[a](b)` inside a fence or an inline span is not a link.
  const prose = readFileSync(file, "utf8")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`\n]*`/g, "");

  for (const [, target] of prose.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
    if (/^(https?:|mailto:|#)/.test(target)) continue;
    const path = resolve(dirname(file), target.split("#")[0]);
    if (!existsSync(path)) {
      errors.push(`${relative(root, file)}: link target not found: ${target}`);
    }
  }
}

for (const dir of readdirSync(skillsDir)) {
  if (!statSync(join(skillsDir, dir)).isDirectory()) continue;

  const skillFile = join(skillsDir, dir, "SKILL.md");
  const label = relative(root, skillFile);
  if (!existsSync(skillFile)) {
    errors.push(`skills/${dir}: missing SKILL.md`);
    continue;
  }

  const fields = readFrontmatter(skillFile);
  if (!fields) {
    errors.push(`${label}: missing frontmatter`);
    continue;
  }

  if (fields.name !== dir) {
    errors.push(
      `${label}: name "${fields.name}" must match directory "${dir}"`,
    );
  }
  if (!NAME_PATTERN.test(fields.name ?? "") || fields.name.length > MAX_NAME) {
    errors.push(`${label}: name "${fields.name}" breaks the naming rule`);
  }
  if (!fields.description) {
    errors.push(`${label}: missing description`);
  } else if (fields.description.length > MAX_DESCRIPTION) {
    errors.push(`${label}: description exceeds ${MAX_DESCRIPTION} characters`);
  }
}

for (const file of markdownFiles(root)) checkLinks(file);

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("Skills check passed.");
