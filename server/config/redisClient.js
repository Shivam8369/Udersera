const Redis = require("ioredis");

exports.redisConnect = () => {
  try {
    const redis = new Redis({
      username: process.env.REDIS_SERVICE_NAME || null,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD || null,
      //tls:true  //uncomment it when you use render redis 
    });

    redis.on("connect", () => console.log("✅ Redis Connected"));
    redis.on("error", (err) => console.error("❌ Redis Error:", err));

    return redis;
  } catch (error) {
    console.error("❌ Error connecting to Redis: ", error);
  }
};
