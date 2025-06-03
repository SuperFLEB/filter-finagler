import {type FilterDef} from "@/MFilter/types.ts";
import {numeric} from "@/util/numericParams.ts";

const filterDef: FilterDef = {
	type: "MFILTER",
	displayName: "Unsharp Mask",
	appuid: "@superfleb/mfilters/unsharpMask",
	version: [1, 0, 0],
	author: "Built-in",
	native: false,

	template: `<fragment xmlns:v="vars">
		<feGaussianBlur v:stdDeviation="radius" v:in="in" result="blurred" />
		<feComponentTransfer in="blurred" result="blurredInverted">
			<feFuncR type="linear" slope="-1" intercept="1"/>
			<feFuncG type="linear" slope="-1" intercept="1"/>
			<feFuncB type="linear" slope="-1" intercept="1"/>
		</feComponentTransfer>
		<feComposite v:in="in" in2="blurredInverted" v:result="result" operator="arithmetic" k1="0" v:k2="k2" v:k3="k3" v:k4="k4"/>
	</fragment>`,
	contexts: ["//filter"],
	inputs: {
		in: {
			label: "Input",
		},
	},
	values: {
		intensity: {
			type: "NUMBER",
			label: "Intensity",
			...numeric(0, 5, 10, .001, true),
		},
		radius: {
			type: "NUMBER",
			label: "Radius",
			...numeric(0, 5, 10, .001, true),
		},
	},
	derivations: {
		k2: (inputs: Record<string, any>): number => 1 + inputs.intensity,
		k3: (inputs: Record<string, any>): number => inputs.intensity,
		k4: (inputs: Record<string, any>): number => -inputs.intensity,
	},
	outputs: {
		result: {
			label: "Result"
		}
	}
};

export default filterDef;