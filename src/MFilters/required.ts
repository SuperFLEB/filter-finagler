import {registerMFilter} from "@/util/RegisterMFilter.ts";
import SvgInputs from "@/MFilters/utility/SvgInputs.ts";

export default function registerRequiredMFilters() {
	registerMFilter(
		SvgInputs
	)
}