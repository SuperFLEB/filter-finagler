type TestFunction<TOut = any> = (value: any) => value is TOut;
type KVTestFunction<T extends Record<string, any>, K extends keyof T = string> = (kv: [K, T[K]]) => boolean;

export function objectKeyValueFilter<T extends Record<string, any>>(obj: T, test: KVTestFunction<T, keyof T>) {
	const out: Record<T> = {};
	for (const k of Object.keys(obj)) {
		if (test([k, obj[k]])) out[k] = obj[k];
	}
	return out;
}

export default function objectValueFilter<TOut = any>(obj: Record<string, any>, test: TestFunction<TOut>): Record<string, TOut> {
	const out: Record<string, TOut> = {};
	for (const k of Object.keys(obj)) {
		if (test(obj[k])) out[k] = obj[k];
	}
	return out;
}