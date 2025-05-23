import {registerMFilter} from "@/util/RegisterMFilter.ts";
import UnsharpMask from "@/FilterDef/UnsharpMask.ts";
import Monotone from "@/FilterDef/Monotone.ts";

import nativeInterpreters from "@/FilterDef/native/native.ts";

export default function () {
	registerMFilter(UnsharpMask, Monotone);
	for (const interpreter of nativeInterpreters()) {
		registerMFilter(interpreter);
	}
}