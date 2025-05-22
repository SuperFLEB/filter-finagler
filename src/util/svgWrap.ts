const svgWrap = (filters: string) => {
	return `<svg viewBox="0 0 100 100" width="100" height="100"><defs><filter id="wip">${filters}</filter></defs></svg>`
}