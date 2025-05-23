export default function setIntersect<T = any>(a: Set<T>, b: Set<T>): Set<T> {
	// @ts-ignore (This isn't a standard feature to TypeScript might not know about it.)
	if (Set.prototype.intersect) return a.intersect(b);
	const [smaller, larger] = a.size < b.size ? [a,b] : [b, a];
	return new Set([...smaller].filter(entry => larger.has(entry)));
}
