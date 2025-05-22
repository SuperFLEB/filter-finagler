export type NoiseChannelOptions = "R" | "G" | "B" | "A" | "K" | "KA" | "RGBA" | "RGB";
let pixelPile = new Uint8ClampedArray(0);

const getPixels = (requested: number): Uint8ClampedArray => {
	const available = pixelPile.length;
	if (requested > available) {
		const morePixelsCount = Math.ceil((requested - available) / 4) * 4;
		const morePixels = new Uint8ClampedArray(morePixelsCount)
			.map(_ => Math.floor(Math.random() * 256));
		const biggerPixelPile = new Uint8ClampedArray(requested);
		biggerPixelPile.set(pixelPile, 0);
		biggerPixelPile.set(morePixels, pixelPile.length);
		pixelPile = biggerPixelPile;
	}
	return pixelPile.slice(0, requested);
};

type NoiseProps = {channels: NoiseChannelOptions, width: number, height: number};
const cache = new Map<NoiseProps, string>();

const noise = async (channels: NoiseChannelOptions, width: number, height: number) => {
	const key: NoiseProps = {channels, width, height};
	const memo = cache.get(key);
	if (memo) {
		return memo;
	}

	const can = document.createElement("canvas");
	can.width = width;
	can.height = height;
	const ctx = can.getContext("2d");

	if (!ctx) throw new Error("Could not get canvas context");

	const dataSize = width * height * 4;
	const data = getPixels(dataSize);

	const channelsActive = {} as Record<"R"|"G"|"B"|"A"|"K", boolean>;
	for (const ch of (["R", "G", "B", "A", "K"] as const)) {
		if (channels.includes(ch)) channelsActive[ch] = true;
	}

	const offsetsKv = { R: 0, G: 1, B: 2, A: 3 } as const;
	const offsets = Object.entries(offsetsKv);

	for (let pxl = 0; pxl < dataSize; pxl += 4) {
		if (channelsActive.K) {
			data[pxl] = data[pxl+1] = data[pxl+2] = Math.round(Math.random() * 255);
			continue;
		}
		for (const [ch, ofs] of offsets) {
			if (!channelsActive[ch as keyof typeof offsetsKv]) data[pxl+ofs] = ch === "A" ? 255 : 0;
		}
	}

	ctx.putImageData(new ImageData(data, width, height), 0, 0);
	const blob: Blob | null = await new Promise((resolve) => {
		can.toBlob((blob) => { resolve(blob); }, "image/png")
	});
	const url = blob ? await new Promise((resolve) => {
		const fr = new FileReader();
		fr.onload = () => { resolve(fr.result); };
		fr.readAsDataURL(blob);
	}) : null;
	return url;
};

export default noise;