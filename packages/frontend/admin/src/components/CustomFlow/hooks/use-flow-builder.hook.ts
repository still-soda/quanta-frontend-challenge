import { Edge, Node } from '@vue-flow/core';

class FlowNode {
   next: FlowNode | null = null;

   constructor(
      public node: Node,
      public isStartNode = node.data.terminal && node.data.terminal === 'start',
      public isEndNode = node.data.terminal && node.data.terminal === 'end',
      public id = node.id
   ) {}
}

/**
 * 将 flowData 解构为节点和边
 */
function destructureFlowData(flowData: any[]) {
   const nodes: Node[] = [];
   const edges: Edge[] = [];

   flowData.forEach((data, index) => {
      const node: Node = {
         id: `node-${index}`,
         type: `${data.type}:${data.detail.type}`,
         data: data,
         position: { x: 0, y: 0 },
      };
      nodes.push(node);

      if (index > 0) {
         const edge: Edge = {
            id: `edge-${index - 1}-${index}`,
            source: `node-${index - 1}`,
            target: `node-${index}`,
            sourceHandle: 'right',
            targetHandle: 'left',
            animated: true,
         };
         edges.push(edge);
      }
   });

   // 添加起始节点和结束节点
   const startNode: Node = {
      id: `node-start`,
      type: 'terminal:start',
      data: { terminal: 'start' },
      position: { x: 0, y: 0 },
   };
   const endNode: Node = {
      id: `node-end`,
      type: 'terminal:end',
      data: { terminal: 'end' },
      position: { x: 0, y: 0 },
   };
   nodes.unshift(startNode);
   nodes.push(endNode);

   // 添加起始节点和结束节点的边
   const startEdge: Edge = {
      id: `edge-start-0`,
      source: `node-start`,
      target: `node-0`,
      sourceHandle: 'right',
      targetHandle: 'left',
      animated: true,
   };
   const endEdge: Edge = {
      id: `edge-${nodes.length - 2}-end`,
      source: `node-${flowData.length - 1}`,
      target: `node-end`,
      sourceHandle: 'right',
      targetHandle: 'left',
      animated: true,
   };
   edges.unshift(startEdge);
   edges.push(endEdge);

   return { nodes, edges };
}

/**
 * 将节点和边转换为 flowData
 */
function buildFlowData(nodes: Node[], edges: Edge[]) {
   const nodeMap = new Map<string, FlowNode>();

   nodes.forEach((node) => {
      const flowNode = new FlowNode(node);
      nodeMap.set(flowNode.id, flowNode);
   });

   edges.forEach((edge) => {
      const sourceNode = nodeMap.get(edge.source);
      const targetNode = nodeMap.get(edge.target);

      if (sourceNode && targetNode) {
         sourceNode.next = targetNode;
      } else {
         return [];
      }
   });

   const startNode = Array.from(nodeMap.values()).find(
      (node) => node.isStartNode
   );
   const flowData: any[] = [];

   let currentNode = startNode?.next;
   let approachEndNode = false;
   while (currentNode) {
      if (currentNode.isEndNode) {
         approachEndNode = true;
         break;
      }
      flowData.push(currentNode.node.data);
      currentNode = currentNode.next;
   }

   if (!approachEndNode) {
      return [];
   }
   return flowData;
}

export const useFlowBuilder = () => {
   return {
      destructureFlowData,
      buildFlowData,
   };
};
