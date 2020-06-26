import inRange from 'lodash/inRange';
import { CATEGORIES_COLOR } from './categories';

export const findConnectedEdges = (data, id) => {
  return data.edges.filter(e => e.source === id || e.target === id);
};

export const getDegree = (data, id) => {
  return findConnectedEdges(data, id).length;
};

export const getGraphDegree = data => {
  const nodeIds = [];
  const degree = {};
  for (const item of data.nodes) {
    nodeIds.push(item.id);
  }
  for (const id of nodeIds) {
    // Calculate degree
    degree[id] = getDegree(data, id);
  }
  return degree;
};

export const adjustNodeSize = (data, nodeSize) => {
  const degree = getGraphDegree(data);
  const min = Math.min(...Object.values(degree));
  const max = Math.max(...Object.values(degree));
  const modNodes = [];
  for (const node of data.nodes) {
    const nodeCopy = { ...node };

    // nodeSize
    if (nodeSize === 'degree' && max !== min) {
      // Scale by degree, from 8-30
      nodeCopy.style = {
        ...nodeCopy.style,
        nodeSize: (((degree[node.id] - min) / (max - min)) * (30 - 8) + 8) * 3,
      };
    }
    // nodeLabel
    // default
    nodeCopy.label = `${node.label ? node.label : node.data.category}`;
    modNodes.push(nodeCopy);
  }
  return modNodes;
};

const isGroupEdges = edge =>
  // Check edge.data.value is array to determine if it is grouped
  Array.isArray(edge.data.value);

export const getMinMaxValue = data => {
  const arrValue = [];
  for (const edge of data.edges) {
    if (isGroupEdges(edge)) {
      // Sum all values in array
      arrValue.push(edge.data.value.reduce((a, b) => a + parseInt(b, 10), 0));
    } else {
      arrValue.push(edge.data.value);
    }
  }
  return { min: Math.min(...arrValue), max: Math.max(...arrValue) };
};

export const styleGroupedEdge = (data, mode) => {
  const modEdges = [];
  const { min, max } = getMinMaxValue(data);
  for (const edge of data.edges) {
    const edgeCopy = { ...edge };
    let w = 2; // default
    if (mode === 'eth') {
      w =
        ((edge.data.value.reduce((a, b) => a + parseInt(b, 10), 0) - min) /
          (max - min)) *
          (10 - 2) +
        2;
    }
    edgeCopy.style = {
      ...edgeCopy.style,
      line: {
        width: w,
      },
    };
    modEdges.push(edgeCopy);
  }
  return modEdges;
};

export const styleEdge = (data, mode) => {
  // Scales width based on min, max value of edges
  // mode = eth (scale width from 0.5-5) or fix (default value of 0.5)
  const modEdges = [];
  const { min, max } = getMinMaxValue(data);
  for (const edge of data.edges) {
    const edgeCopy = { ...edge };
    let w = 2;
    if (mode === 'eth') {
      w = ((edge.data.value - min) / (max - min)) * (10 - 2) + 2;
    }
    edgeCopy.style = {
      ...edgeCopy.style,
      line: {
        width: w,
      },
    };
    modEdges.push(edgeCopy);
  }
  return modEdges;
};

const combineEdges = edges => {
  const modEdges = [
    ...edges
      .reduce((r, o) => {
        const key = `${o.source}-${o.target}`;
        // Changed [from, to] TO [source, target]
        const item = r.get(key) || {
          id: o.id,
          source: o.source,
          target: o.target,
          style: o.style,
          data: {
            blk_num: [],
            blk_ts_unix: [],
            score_vector: [],
            txn_hash: [],
            value: [],
            count: 0,
          },
        };

        item.data.blk_num.push(o.data.blk_num);
        item.data.blk_ts_unix.push(o.data.blk_ts_unix);
        item.data.score_vector.push(o.data.score_vector);
        item.data.txn_hash.push(o.data.txn_hash);
        item.data.value.push(o.data.value);
        item.data.count += 1;
        item.label = item.data.count.toString();

        item.title = `${item.data.value
          .reduce((a, b) => a + b, 0)
          .toPrecision(3)} ETH`;

        return r.set(key, item);
      }, new Map())
      .values(),
  ];
  return modEdges;
};

export const filterDataByTime = (data, timerange) => {
  const { nodes, edges } = data;
  // Because our time data is on links, the timebar's filteredData object only contains links.
  // But we need to show nodes in the chart too: so for each link, track the connected nodes
  const filteredEdges = edges.filter(edge =>
    inRange(edge.data.blk_ts_unix, timerange[0], timerange[1])
  );
  // Filter nodes which are connected to the edges
  const filteredNodesId = [];
  filteredEdges.forEach(edge => {
    filteredNodesId.push(edge.source);
    filteredNodesId.push(edge.target);
  });

  const filteredNodes = nodes.filter(node => filteredNodesId.includes(node.id));

  const newFilteredData = {
    nodes: [...filteredNodes],
    edges: [...filteredEdges],
  };
  return newFilteredData;
};

const mapEdgeKeys = edge => {
  // Identifies the graph source and target field in edge object
  const edgeKeys = Object.keys(edge);
  if (edgeKeys.includes('source') && edgeKeys.includes('target')) {
    return ['source', 'target'];
  }
  if (edgeKeys.includes('from') && edgeKeys.includes('to')) {
    return ['from', 'to'];
  }
  if (edgeKeys.includes('src') && edgeKeys.includes('dst')) {
    return ['src', 'dst'];
  }
  return false;
};

export const processData = data => {
  for (const node of data.nodes) {
    // Give the display label of the node
    node.label = `${node.data.address.substring(2, 7)}...`;
    // Label nodes which have no defined category as 'Other'
    node.data = {
      category: node.data.category ? node.data.category : 'Other',
      ...node.data,
    };
    // Add style property to node
    node.style = {
      nodeSize: 20,
      primaryColor: CATEGORIES_COLOR[node.data.category],
    };
  }
  // Check keys used to represent graph source and target based on first data edge
  const [sourceField, targetField] = mapEdgeKeys(data.edges[0]);
  for (const edge of data.edges) {
    if (sourceField !== 'source' && targetField !== 'target') {
      // Map edge's source and target over to graphin's format
      delete Object.assign(edge, { source: edge[sourceField] })[sourceField];
      delete Object.assign(edge, { target: edge[targetField] })[targetField];
    }
    edge.label = edge.data.value.toPrecision(3);
    edge.title = `${edge.data.value.toPrecision(3)} ETH`;
    edge.style = {
      endArrow: true,
    };
  }
  return data;
};

export const replaceEdges = (oldData, newEdges) => {
  const modData = { ...oldData };
  modData.edges = [...newEdges];
  return modData;
};

export const replaceData = (oldData, newNodes, newEdges) => {
  const modData = { ...oldData };
  modData.edges = [...newEdges];
  modData.nodes = [...newNodes];
  return modData;
};

export const datatoTS = data => {
  const tsdata = data.edges
    .map(i => [i.data.blk_ts_unix, 1])
    .sort((a, b) => {
      return a[0] - b[0];
    });
  return tsdata;
};

export const chartRange = timeRange => {
  const range = Math.max((timeRange[1] - timeRange[0]) / 8, 1000 * 60 * 60 * 1);
  return [timeRange[0] - range, timeRange[1] + range];
};

export const removeDuplicates = (myArr, prop) => {
  // Remove duplicates from array by checking on prop
  return myArr.filter((obj, pos, arr) => {
    return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
};

export const combineProcessedData = (newData, oldData) => {
  if (oldData) {
    const modData = { ...oldData };
    modData.nodes = removeDuplicates(
      [...newData.nodes, ...oldData.nodes],
      'id'
    );
    modData.edges = removeDuplicates(
      [...newData.edges, ...oldData.edges],
      'id'
    );
    return modData;
  }
  return newData;
};

export const applyStyle = (data, defaultOptions) => {
  const { groupEdges, edgeWidth, nodeSize } = defaultOptions;
  if (groupEdges) {
    const styledEdges = styleGroupedEdge(data, edgeWidth);
    const styledNodes = adjustNodeSize(data, nodeSize);
    return { ...replaceData(data, styledNodes, styledEdges) };
  }
  const styledEdges = styleEdge(data, edgeWidth);
  const styledNodes = adjustNodeSize(data, nodeSize);
  return { ...replaceData(data, styledNodes, styledEdges) };
};

export const groupEdges = data => {
  // combineEdges removed source and target properties of my edge initially
  const newEdges = combineEdges(data.edges);
  return { ...replaceEdges(data, newEdges) };
};

export const sampleJSONData = [
  {
    nodes: [
      {
        id: 'address/82574506',
        data: {
          category: 'Other',
          _key: '82574506',
          _id: 'address/82574506',
          _rev: '_ane_iCm--x',
          address: '0xd96ba527be241c2c31fd66cbb0a9430702906a2a',
          created_ts_unix: 1557191325000,
        },
        label: 'd96ba...',
        style: { nodeSize: 20, primaryColor: '#008080' },
      },
      {
        id: 'address/83923613',
        data: {
          category: 'Other',
          _key: '83923613',
          _id: 'address/83923613',
          _rev: '_ane_f9i--y',
          address: '0xd4e79226f1e5a7a28abb58f4704e53cd364e8d11',
          created_ts_unix: 1558371616000,
        },
        label: 'd4e79...',
        style: { nodeSize: 20, primaryColor: '#008080' },
      },
    ],
    edges: [
      {
        id: 'transaction/288844035',
        data: {
          _from: 'address/82574506',
          _id: 'transaction/288844035',
          _key: '288844035',
          _rev: '_aneB-ZW--c',
          _to: 'address/83923613',
          blk_num: 7798067,
          blk_ts_unix: 1558371817000,
          score_vector: [
            2.4669448502752394e-8,
            0.0000015858786746827042,
            3.6277524748966577e-12,
            2.5527963821404863e-9,
            0.00002864326272102155,
            7.723923637444402e-9,
            4.003233853929708e-9,
            0.9999675128859348,
            1.5164078785901573e-9,
            3.9248534715014887e-7,
            0.0000016792011583752624,
            3.683347536863764e-8,
            1.7903039945332553e-9,
            8.348233243778563e-11,
            1.0710946419298142e-7,
          ],
          trace_addr: '-1',
          txn_hash:
            '0x9969ca31352a32f796320dac61594bca629f3b8a709ac7a8e40439fb74444624',
          value: 10000,
          to_address: '0xd4e79226f1e5a7a28abb58f4704e53cd364e8d11',
          from_address: '0xd96ba527be241c2c31fd66cbb0a9430702906a2a',
        },
        source: 'address/82574506',
        target: 'address/83923613',
        label: '1.00e+4',
        title: '1.00e+4 ETH',
        style: { endArrow: true },
      },
    ],
    metadata: {
      search_size: 1,
      retrieved_size: 1,
      title: 'Txn 9969c',
      key: 1592981050812,
    },
  },
];