const LOCAL_DEVELOPMENT_HOSTS = new Set(['127.0.0.1', 'localhost']);

export function isAllowedApplicationUrl(
  candidateUrl: string,
  expectedUrl: string,
): boolean {
  try {
    const candidate = new URL(candidateUrl);
    const expected = new URL(expectedUrl);

    if (expected.protocol === 'file:') {
      return candidate.href === expected.href;
    }

    const isLocalDevelopmentUrl =
      expected.protocol === 'http:' &&
      LOCAL_DEVELOPMENT_HOSTS.has(expected.hostname);

    return isLocalDevelopmentUrl && candidate.origin === expected.origin;
  } catch {
    return false;
  }
}
