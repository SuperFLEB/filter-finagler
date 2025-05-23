import {type FilterDef} from "@/MFilters/types.ts";
import average from "@/util/average.ts";

export default {
	appuid: "@superfleb/mfilters/monotone",
	displayName: "Monotone",
	author: "Built-in",
	version: [1, 0, 0],

	template: `<fragment xmlns:v="vars">
		<feColorMatrix type="matrix" v:in="in" v:values="matrix" />
	</fragment>`,
	contexts: ["//filter"],
	inputs: {
		in: {
			label: "Input",
		},
	},
	values: {
		ink: {
			type: "COLOR",
			label: "Color",
		},
		paper: {
			type: "COLOR",
			label: "Color",
			default: "#000",
		},
		mode: {
			type: "SELECT",
			values: ["add", "subtract", "auto"],
			defaultValue: "auto",
		}
	},
	derivations: {
		matrix: (inputs: Record<string, any>) => {
			if (!inputs.ink) return null;

			const ink =
				(inputs.ink.match(/rgba?\((\d+), (\d+), (\d+)/) ?? [0, 255, 255, 255])
					.slice(1)
					.map((s: string) => Number(s));

			const paper =
				(inputs.paper?.match(/rgba?\((\d+), (\d+), (\d+)/) ?? [0, 0, 0, 0])
					.slice(1)
					.map((s: string) => Number(s));

			const [r, g, b] = ink.map((h255: number, idx: number) => {
				const i = h255 / 255;
				const p = paper[idx] / 255;

				let mode = inputs.mode ?? "auto";
				if (mode === "auto") {
					mode = average(ink) > average(paper) ? "add" : "subtract";
				}

				return mode === "add" ? [i - p, p] : [p - i, i];
			});

			return [
				r[0], r[0], r[0], 0, r[1],
				g[0], g[0], g[0], 0, g[1],
				b[0], b[0], b[0], 0, b[1],
				0, 0, 0, 1, 0
			].map(m => m.toFixed(2)).join(" ");
		}
	},
	outputs: {
		result: {
			label: "Result"
		}
	}
} as FilterDef;
