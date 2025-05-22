export default function average(numbers: number[]) {
	return numbers.reduce((a: number, b: number) => a + b, 0) / numbers.length;
}