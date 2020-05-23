export function pluralize(s: string, n: number): string {
    if (n == 1) {
        return s;
    }
    if (s.endsWith("y")) {
        return `${s.slice(0, s.length - 1)}ies`;
    }
    return `${s}s`;
}