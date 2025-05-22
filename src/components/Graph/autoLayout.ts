import dagre from "@dagrejs/dagre";
import { type Node } from "@vue-flow/core";

type EnoughNodeProps = { id: string };
type EnoughEdgeProps = { source: string, target: string };

export default function layout(nodes: EnoughNodeProps[], edges: EnoughEdgeProps[]): Node[] {
	const graph = new dagre.graphlib.Graph();
	graph.setGraph({});
	graph.setDefaultNodeLabel(function() { return {}; });
	graph.setDefaultEdgeLabel(function() { return {}; });

	for (const node of nodes) {
		graph.setNode(node.id, { label: node.id, width: 200, height: 200 });
	}

	for (const edge of edges) {
		graph.setEdge(edge.source, edge.target);
	}

	graph.setGraph({ rankdir: "LR" })
	dagre.layout(graph);

	return nodes.map(node => {
		const { x, y } = graph.node(node.id);
		return {
			...node, position: { x, y }
		};
	});
}