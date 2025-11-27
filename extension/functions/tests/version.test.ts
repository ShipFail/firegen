// functions/tests/version.test.ts
import {describe, test, expect} from "vitest";
import {readFileSync} from "fs";
import {resolve} from "path";

import {FIREGEN_VERSION} from "../src/version.js";

describe("Version Consistency", () => {
  test("extension.yaml, package.json, and src/version.ts must have the same version", () => {
    // Read extension.yaml
    const extensionYamlPath = resolve(__dirname, "../../extension.yaml");
    const extensionYamlContent = readFileSync(extensionYamlPath, "utf-8");
    // Parse version from YAML (simple regex since we only need the version field)
    const versionMatch = extensionYamlContent.match(/^version:\s*(.+)$/m);
    if (!versionMatch) {
      throw new Error("Could not find version in extension.yaml");
    }
    const extensionVersion = versionMatch[1].trim();

    // Read package.json
    const packageJsonPath = resolve(__dirname, "../package.json");
    const packageJsonContent = readFileSync(packageJsonPath, "utf-8");
    const packageJson = JSON.parse(packageJsonContent);
    const packageVersion = packageJson.version as string;

    // Assert all three match
    expect(extensionVersion).toBe(packageVersion);
    expect(extensionVersion).toBe(FIREGEN_VERSION);

    // Additional check: all should be valid semver format
    const semverRegex = /^\d+\.\d+\.\d+$/;
    expect(extensionVersion).toMatch(semverRegex);
    expect(packageVersion).toMatch(semverRegex);
    expect(FIREGEN_VERSION).toMatch(semverRegex);
  });
});
