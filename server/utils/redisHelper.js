const { redisConnect } = require("../config/redisClient");

// Initialize Redis client
const redisClient = redisConnect();

// Function to set a key with an optional expiration time
const setKey = async (key, value, expiry = null) => {
  try {
    if (expiry) {
      await redisClient.set(key, value, "EX", expiry); // Set key with expiry
    } else {
      await redisClient.set(key, value); // Set key without expiry
    }
    console.log(`✅ Redis key set: ${key}`);
  } catch (error) {
    console.error("❌ Redis setKey Error:", error);
  }
};

// Function to get a key
const getKey = async (key) => {
  try {
    const value = await redisClient.get(key);
    console.log(`🔍 Retrieved from Redis: ${key}`);
    return value;
  } catch (error) {
    console.error("❌ Redis getKey Error:", error);
  }
};

// Function to check if a key exists
const keyExists = async (key) => {
  try {
    const exists = await redisClient.exists(key); // Returns 1 if exists, 0 otherwise
    console.log(`🔎 Key ${key} ${exists ? "exists ✅" : "does not exist ❌"}`);
    return exists === 1;
  } catch (error) {
    console.error("❌ Redis keyExists Error:", error);
    return false;
  }
};

module.exports = { setKey, getKey, keyExists };
