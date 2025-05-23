type TestFunction<TOut = any> = (value: any) => value is TOut;
type KVTestFunction<T> = (kv: [string, T]) => boolean;

export function objectKeyValueFilter<T extends any, TOut extends T = T>(obj: Record<string, T>, test: KVTestFunction<T>): Record<string, TOut> {
	const out: Record<string, TOut> = {};
	for (const k of Object.keys(obj)) {
		if (test([k, obj[k]])) out[k] = obj[k] as TOut;
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