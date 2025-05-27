const SVGSource = Object.freeze({
	"SourceGraphic": Symbol("SourceGraphic"),
	"SourceAlpha": Symbol("SourceAlpha"),
	"BackgroundImage": Symbol("BackgroundImage"),
	"BackgroundAlpha": Symbol("BackgroundAlpha"),
	"FillPaint": Symbol("FillPaint"),
	"StrokePaint": Symbol("StrokePaint")
} as const);

const SVGSourceKeys: Record<symbol, string> = {};
for (const [k,v] of Object.entries<symbol>(SVGSource)) {
	SVGSourceKeys[v] = k;
}

export {SVGSourceKeys};
export default SVGSource;
