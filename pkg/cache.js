const redis = require("async-redis");

export const connect = async ({ host, port, password }) => {
  const client = redis.createClient({
    port,
    host,
    password
  });

  client.on("connect", function() {
    console.log(" -> connected");
  });

  client.on("error", function(e) {
    console.log(" -> error");
    console.log(e.toString());
  });

  return { client };
};

export const object = async (key, { getter, serializer }, cxt) => {
  const {
    services: {
      cache: { client: cache }
    }
  } = cxt;

  const obj = await cache.hgetall(key);

  if (obj) {
    return serializer.deserialize(obj);
  } else {
    const res = await getter(cxt);

    const mapped = serializer.serialize(res);
    cache.hmset(key, mapped);
    return mapped;
  }
};

export const list = async (key, { getter, serializer }, cxt) => {
  const {
    services: {
      cache: { client: cache }
    }
  } = cxt;

  const list = await cache.lrange(key, 0, -1);

  if (list) {
    return list.map(serializer.deserialize);
  } else {
    const res = await getter(cxt);
    const mapped = res.map(serializer.serialize);
    await cache.rpush(key, mapped);
    return res;
  }
};

export const remove = async (key, cxt) => {
  const {
    services: {
      cache: { client: cache }
    }
  } = cxt;

  await cache.del(key);
};
