import { Value } from 'baseui/select';
import {
  EdgeNode,
  GraphAttribute,
  SearchOptions,
  Node,
  EdgeInformation,
} from '../../../redux/graph';

export type TActiveKey = {
  activeKey: GraphAttribute;
};

export interface IUseSearchOptions {
  searchOptions: SearchOptions;
  updateNodeSearch: (value: Value) => void;
  updateEdgeSearch: (value: Value) => void;
  updateTabs: (activeTab: GraphAttribute) => void;
  updateNodeResults: (node: Node[]) => void;
  updateEdgeResults: (edge: EdgeInformation[]) => void;
}