export default function percent(proportion: number, fix: number = 3) {
	return (proportion * 100).toFixed(fix) + "%";
}