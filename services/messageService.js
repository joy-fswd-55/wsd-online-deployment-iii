import client from "../database/database.js";

const addMessage = async (sender, message) => {
  await client.queryArray("INSERT INTO messages (sender, message) VALUES ($1, $2)", [sender, message]);
};

const getRecentMessages = async () => {
  const result = await client.queryObject("SELECT * FROM messages ORDER BY id DESC LIMIT 5");
  return result.rows;
};

export { addMessage, getRecentMessages };
