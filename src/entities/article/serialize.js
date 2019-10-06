const Complete = {
  serialize: ({
    id,
    title,
    abstract,
    content,
    url,
    status,
    authorid,
    created_at
  }) => ({
    id,
    title,
    abstract,
    content,
    url,
    status,
    authorid,
    created_at: created_at.toString()
  }),
  deserialize: obj => ({
    ...obj,
    created_at: new Date(obj.created_at)
  })
};

const List = {
  serialize: ({ id, title, abstract, url, status, authorid, created_at }) =>
    JSON.stringify({
      id,
      title,
      abstract,
      url,
      status,
      authorid,
      created_at: created_at.toString()
    }),
  deserialize: ostr => {
    const obj = JSON.parse(ostr);
    return {
      ...obj,
      created_at: new Date(obj.created_at)
    };
  }
};

export { Complete, List };
