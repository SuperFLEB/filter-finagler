import {registerMFilter} from "@/util/RegisterMFilter.ts";
import SvgInputs from "@/MFilters/utility/SvgInputs.ts";
import SvgOutput from "@/MFilters/utility/SvgOutput.ts";

export default function registerRequiredMFilters() {
	registerMFilter(
		SvgInputs, SvgOutput
	)
}