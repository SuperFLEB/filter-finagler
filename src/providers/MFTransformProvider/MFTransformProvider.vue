<script setup lang="ts">
import {provide, type Ref, ref, watch} from "vue";
import k from "./keys.ts";
import {Namespaces} from "@/constants.ts";
import prettyXML from "@/util/prettyXML.ts";
import objectMap from "@/util/objectMap.ts";
import {filterToClods} from "@/MFilter/clods.ts";
import xpath from "@/util/xpath.ts";
import clodsToSvg from "@/MFilter/clodsToSvg.ts";
import useDocumentProvider from "@/providers/SVGDocumentProvider/useDocumentProvider.ts";
import type {Clod} from "@t/Clod.ts";

const domParser = new DOMParser();
const xmlSerializer = new XMLSerializer();

const { document: doc } = useDocumentProvider();

type MFParseProvides = {
	error: true,
	doc: null,
	clodsByFilter: null,
	parsed: null,
	parsedString: null,
	parsedUrl: null,
} | {
	error: false,
	doc: XMLDocument,
	clodsByFilter: Record<string, Clod[]>,
	parsed: XMLDocument,
	parsedString: string,
	parsedUrl: string,
};

export type MFParseProvidesRefs = {
	[K in keyof MFParseProvides]: Ref<MFParseProvides[K]>
}

const errorState: MFParseProvides = {
	error: true,
	doc: null,
	clodsByFilter: null,
	parsed: null,
	parsedString: null,
	parsedUrl: null,
};

const provides: MFParseProvidesRefs = objectMap(errorState, (([k,v]) => [k, ref(v)]));

function setProvides(value: MFParseProvides) {
	for (const [k,v] of Object.entries(value)) {
		provides[k as keyof MFParseProvidesRefs].value = v;
	}
}

watch(() => doc.value.lastValidState.text, (text, textWas) => {
	if (!text || text === textWas) return;
	if (!text.includes("<svg")) {
		setProvides({...errorState});
		return;
	}

	const result = { error: false } as MFParseProvides;

	let svgDoc: XMLDocument;
	// TODO: Error handling
	try {
		svgDoc = domParser.parseFromString(text, "text/xml");
	} catch (e) {
		console.error("SVG XML Parsing Error", e);
		setProvides({...errorState});
		return;
	}

	result.error = false;
	result.doc = svgDoc;

	const filters = xpath(svgDoc, "/s:svg/s:defs/s:filter", {s: Namespaces.svg});

	result.clodsByFilter = Object.fromEntries(filters.map(f => [
		f.getAttribute("id") ?? "unknown",
		filterToClods(svgDoc, f)
	]));

	result.parsed = clodsToSvg(result.doc, result.clodsByFilter);
	result.parsedString = result.parsed ? prettyXML(xmlSerializer.serializeToString(result.parsed)) : null;
	result.parsedUrl = result.parsedString ? URL.createObjectURL(new Blob([result.parsedString], {type: "text/xml"})) : null;

	setProvides(result);
}, {immediate: true});

provide<MFParseProvidesRefs>(k.ALL, provides);
</script>

<template>
	<slot/>
</template>
