function unescapeSplit(str: string, split: string, escapeChar: string, maxSplits: number = 1): string[] {
	const results = [];
	let result: string = "";
	let esc: boolean = false;
	for (const ch of str) {
		if (esc) {
			result += ch;
			esc = false;
			continue;
		}
		if (ch === escapeChar) {
			esc = true;
			continue;
		}
		if (ch === split && results.length < maxSplits + 1) {
			results.push(result);
			result = "";
			continue;
		}
		result += ch;
	}
	return [...results, result];
}

export function parseOutputRef(outputRef: string) {
	return unescapeSplit(outputRef, "@", "\\", 1);
}

export function getOutputRef(targetOutputName: string, targetInstanceId: string) {
	const escaped = [
		targetOutputName.replaceAll("\\", "\\\\").replaceAll("@", "\\@"),
		targetInstanceId.replaceAll("\\", "\\\\").replaceAll("@", "\\@")
	];
	return escaped.join("@");
}
