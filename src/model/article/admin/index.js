const getAdmin = async viewer =>
  viewer.username === "vicjicama" ? viewer : null;

export { getAdmin };
