const OutsideConnections = Object.freeze({
	"SourceGraphic": Symbol("SourceGraphic"),
	"SourceAlpha": Symbol("SourceAlpha"),
	"BackgroundImage": Symbol("BackgroundImage"),
	"BackgroundAlpha": Symbol("BackgroundAlpha"),
	"FillPaint": Symbol("FillPaint"),
	"StrokePaint": Symbol("StrokePaint")
} as const);

const OutsideConnectionsKeys: Record<symbol, string> = {};
for (const [k,v] of Object.entries<symbol>(OutsideConnections)) {
	OutsideConnectionsKeys[v] = k;
}

export {OutsideConnectionsKeys};
export default OutsideConnections;
