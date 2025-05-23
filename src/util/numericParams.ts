export const numeric = (min: number, defaultValue: number, max: number, step: number = .001, hardMin = false, hardMax = false) => ({
	min,
	defaultValue,
	max,
	step,
	hardMin,
	hardMax
});
