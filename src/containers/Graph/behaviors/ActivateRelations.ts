import Graphin, { IG6GraphEvent } from '@antv/graphin';
import { G6Event, IEdge, INode } from '@antv/g6';
import { interactionStates } from '../../../constants/graph-shapes';

export default (graphin: typeof Graphin) => {
  graphin.registerBehavior('activate-relations', {
    getDefaultCfg() {
      return {
        activeState: 'active',
        inactiveState: 'inactive',
      };
    },
    getEvents(): { [key in G6Event]?: string } {
      return {
        'node:mouseenter': 'onNodeHover',
        'node:mouseleave': 'clearAllStats',
      };
    },
    onNodeHover(e: IG6GraphEvent) {
      const { item } = e;
      const { graph } = this as any;
      const { cfg } = e.currentTarget;
      if (cfg.nodes.length + cfg.edges.length > this.limit) {
        return;
      }
      graph.setAutoPaint(false);
      graph.getNodes().forEach((node: INode) => {
        if (!node.hasState('selected')) {
          graph.clearItemStates(node, interactionStates);
          graph.setItemState(node, 'highlight.dark', true);
        }
      });
      // selected and highlight.light should be kept mutually exclusive
      // If it is already selected, no need to add highlight.light
      if (!item.hasState('selected')) {
        graph.setItemState(item, 'highlight.dark', false);
        graph.setItemState(item, 'highlight.light', true);
      }
      graph.getEdges().forEach((edge: IEdge) => {
        if (edge.getSource() === item) {
          if (!edge.getTarget().hasState('selected')) {
            graph.setItemState(edge.getTarget(), 'highlight.dark', false);
            graph.setItemState(edge.getTarget(), 'highlight.light', true);
          }
          graph.setItemState(edge, 'highlight.light', true);
          edge.toFront();
        } else if (edge.getTarget() === item) {
          if (!edge.getSource().hasState('selected')) {
            graph.setItemState(edge.getSource(), 'highlight.dark', false);
            graph.setItemState(edge.getSource(), 'highlight.light', true);
          }
          graph.setItemState(edge, 'highlight.light', true);
          edge.toFront();
        } else if (!edge.hasState('selected')) {
          graph.setItemState(edge, 'highlight.light', false);
        }
      });
      graph.paint();
      graph.setAutoPaint(true);
    },
    clearAllStats(e: IG6GraphEvent) {
      const { cfg } = e.currentTarget;
      const { graph } = this as any;
      if (cfg.nodes.length + cfg.edges.length > this.limit) {
        return;
      }
      graph.setAutoPaint(false);
      graph.getNodes().forEach((node: INode) => {
        if (!node.hasState('selected')) {
          graph.clearItemStates(node, interactionStates);
        }
      });
      graph.getEdges().forEach((edge: IEdge) => {
        if (!edge.hasState('selected')) {
          graph.clearItemStates(edge, interactionStates);
        }
      });
      graph.paint();
      graph.setAutoPaint(true);
    },
  });
};