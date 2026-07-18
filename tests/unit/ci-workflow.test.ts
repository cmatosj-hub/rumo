import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

describe('workflow da fundação', () => {
  it('usa instalação reproduzível e mantém package Windows dependente de quality', async () => {
    const workflow = await readFile(
      path.resolve('.github/workflows/ci.yml'),
      'utf8',
    );

    expect(workflow).toContain('push:');
    expect(workflow).toContain('pull_request:');
    expect(workflow).toContain('contents: read');
    expect(workflow).toContain('needs: quality');
    expect(workflow).toContain('runs-on: windows-2022');
    expect(workflow.match(/run: npm ci/g)).toHaveLength(2);
    expect(workflow).not.toContain('npm install');
  });

  it('não publica releases e envia somente artefatos internos do Squirrel', async () => {
    const workflow = await readFile(
      path.resolve('.github/workflows/ci.yml'),
      'utf8',
    );

    expect(workflow).toContain('npm run make -- --arch=x64');
    expect(workflow).toContain('npm run test:e2e');
    expect(workflow).toContain('npm run test:packaged');
    expect(workflow).toContain('retention-days: 14');
    expect(workflow).not.toContain('release-action');
    expect(workflow).not.toContain('npm publish');
    expect(workflow).not.toContain('secrets.');
  });
});
