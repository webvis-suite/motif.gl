import some from 'lodash/some';
import isUndefined from 'lodash/isUndefined';
import { getGraph } from '../redux/accessors';

import {
  fetchBegin,
  fetchError,
  fetchDone,
  postMessage,
  setBottomLock,
  setBottomOpen,
} from '../redux/graphInitSlice';
import { addQuery, processGraphResponse } from '../redux/graphSlice';
import { processData } from '../Utilities/graphUtils';

// API Methods
const checkMetaData = metadata => {
  if (metadata) {
    return metadata.search_size > metadata.retrieved_size;
  }
  return false;
};

const checkNewData = (graphList, newData) => {
  const graphListKeys = graphList.map(graph => graph.metadata.key);
  return (
    newData &&
    !some(graphListKeys, key => key === newData.metadata.key) &&
    newData.edges.length > 0
  );
};

const checkEdgeTime = newData => {
  return isUndefined(newData.edges[0].data.blk_ts_unix);
};

const processResponse = (dispatch, graphList, newData) => {
  dispatch(fetchBegin());
  const { metadata } = newData;
  if (checkMetaData(metadata)) {
    const message = `${metadata.retrieved_size} / ${metadata.search_size} of the most recent transactions retrieved.
        We plan to allow large imports and visualization in the full version.
        Feel free to reach out to timothy at timothy.lin@cylynx.io if you are interesting in retrieving the full results.`;
    dispatch(postMessage(message));
  }
  // Need to check edges for new data as it might just return nodes and repetition
  if (checkNewData(graphList, newData)) {
    dispatch(addQuery(newData));
    dispatch(processGraphResponse(newData));
    dispatch(fetchDone());
    // Need to check if TimeBar should be opened
    if (checkEdgeTime) {
      dispatch(setBottomOpen(true));
    } else {
      dispatch(setBottomLock());
    }
  } else {
    dispatch(fetchDone());
    throw new Error('Data has already been imported');
  }
};

// Asynchronous forEach to ensure graph renders in a nice circle
const waitFor = ms => new Promise(r => setTimeout(r, ms));

async function asyncForEach(array, callback) {
  for (const item of array) {
    await callback(item);
  }
}

// One function to rule them all
// Thunk to dispatch our calls
export default data => (dispatch, getState) => {
  const { graphList, getFns } = getGraph(getState());
  if (Array.isArray(data)) {
    asyncForEach(data, async graph => {
      try {
        await waitFor(0);
        processResponse(dispatch, graphList, processData(graph, getFns));
      } catch (err) {
        dispatch(fetchError(err));
      }
    });
  } else {
    try {
      processResponse(dispatch, graphList, processData(data, getFns));
    } catch (err) {
      dispatch(fetchError(err));
    }
  }
};
