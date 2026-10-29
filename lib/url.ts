// Safe for client components (no server imports).

// Images can be pasted URLs from any host; those skip the optimizer instead of needing remotePatterns.
export const isRemote = (src: string) => /^https?:\/\//i.test(src);
