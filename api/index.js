import fetch from "node-fetch";

const GRAPHQL_URL = "https://leetcode.com/graphql";

export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          reputation
          ranking
        }
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    const data = await response.json();

    if (!data.data?.matchedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(data.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data", details: error.message });
  }
}
