import {type FilterDef} from "@/MFilter/types.ts";
import objectMap from "@/util/objectMap.ts";
import xpath from "@/util/xpath.ts";
import {Namespaces} from "@/constants.ts";
import {numeric} from "@/util/numericParams.ts";

const funcVars = ["R", "G", "B", "A"].map(
	component => objectMap({
		type: {
			label: "Type",
			type: "SELECT",
			values: ["identity", "table", "discrete", "linear", "gamma"],
			defaultValue: "identity",
		},
		tableValues: {
			label: "Table Values",
			type: "TABLE",
			...numeric(0, 0, 1, .001, true, true)
		},
		slope: {
			label: "Slope",
			type: "NUMBER",
			...numeric(-10, 0, 10, .01, false, false)
		},
		intercept: {
			label: "Intercept",
			type: "NUMBER",
			...numeric(-10, 0, 10, .01, false, false)
		},
		amplitude: {
			label: "Amplitude",
			type: "NUMBER",
			...numeric(-10, 0, 10, .01, false, false)
		},
		exponent: {
			label: "Exponent",
			type: "NUMBER",
			...numeric(-10, 0, 10, .01, false, false)
		},
		offset: {
			label: "Offset",
			type: "NUMBER",
			...numeric(-10, 0, 10, .01, false, false)
		},
	}, (([name, def]) => [name + component, def]))
).reduce((accum, component) => ({...accum, ...component}), {});

const feComponentTransfer: FilterDef = {
	displayName: "Component Transfer",
	author: "(SVG Native)",
	appuid: "native:feComponentTransfer",
	native: true,
	interfaceFor: "feComponentTransfer",
	version: [1, 0, 0],
	template: `
<fragment xmlns:v="vars">
	<feComponentTransfer v:in="in" v:tableValues="tableValues"  v:result="result">
		<feFuncR v:type="typeR" v:tableValues="tableValuesR" v:slope="slopeR" v:intercept="interceptR" v:amplitude="amplitudeR" v:exponent="exponentR" v:offset="offsetR" />
		<feFuncG v:type="typeG" v:tableValues="tableValuesG" v:slope="slopeG" v:intercept="interceptG" v:amplitude="amplitudeG" v:exponent="exponentG" v:offset="offsetG" />
		<feFuncB v:type="typeB" v:tableValues="tableValuesB" v:slope="slopeB" v:intercept="interceptB" v:amplitude="amplitudeB" v:exponent="exponentB" v:offset="offsetB" />
		<feFuncA v:type="typeA" v:tableValues="tableValuesA" v:slope="slopeA" v:intercept="interceptA" v:amplitude="amplitudeA" v:exponent="exponentA" v:offset="offsetA" />
	</feComponentTransfer>
</fragment>`,
	contexts: ["//filter"],
	inputs: {
		in: { label: "Input" },
	},
	values: {
		tableValues: {
			type: "TABLE",
			label: "Table Values",
			defaultValue: [],
		},
		slope: {
			type: "NUMBER",
			...numeric(-5, 0, 5, 0.01, false, false),
		},
		intercept: {
			type: "NUMBER",
			...numeric(-5, 0, 5, 0.01, false, false),
		},
		...funcVars
	},
	outputs: {
		result: {label: "Result"}
	},
	transformAttributes(feElement, currentAttributes) {
		const attrChildren = xpath<Attr>(feElement, "./svg:feFuncR/@*|svg:feFuncG/@*|svg:feFuncB/@*|svg:feFuncA/@*", {svg: Namespaces.svg});
		const newAttributes: Record<string, string> = {};
		for (const attr of attrChildren) {
			const name = attr.ownerElement!.localName;
			const suffix = name.slice(-1);
			if (!(name.startsWith("feFunc") && ["R", "G", "B", "A"].includes(suffix))) continue;
			newAttributes[attr.localName + suffix] = attr.value;
		}
		console.log(newAttributes);
		return {...currentAttributes, ...newAttributes};
	},
};

export default feComponentTransfer;
