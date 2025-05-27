import {registerMFilter} from "@/util/RegisterMFilter.ts";
import UnsharpMask from "@/MFilters/builtin/UnsharpMask.ts";
import Monotone from "@/MFilters/builtin/Monotone.ts";
import nativeInterpreters from "@/MFilters/native.ts";

export default function () {
	registerMFilter(UnsharpMask, Monotone);
	for (const interpreter of nativeInterpreters()) {
		registerMFilter(interpreter);
	}
}