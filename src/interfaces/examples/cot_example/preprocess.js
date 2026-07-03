const valueOrDefault = (path, defaultValue) => {
  return typeof data[path] === 'undefined' ? defaultValue : data[path];
};

return {
  required_data_picked_from_graphs:
    typeof data.required_data_picked_from_graphs === 'string'
      ? { content: data.required_data_picked_from_graphs }
      : (data.required_data_picked_from_graphs ?? { content: '' }),
  qa_pair: Array.isArray(data.qa_pair) ? data.qa_pair[0] : data.qa_pair,
};
