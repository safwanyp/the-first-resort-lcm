import { Agent, setGlobalDispatcher } from "undici";

const baseUrl = String(process.env.CRAFTY_BASE_URL);

const agent = new Agent({
  connect: {
    rejectUnauthorized: false,
  },
});

setGlobalDispatcher(agent);

const userCredentials = {
  username: String(process.env.CRAFTY_USERNAME),
  password: String(process.env.CRAFTY_PASSWORD),
};

const cachedToken = {
  value: undefined,
};

const getToken = async () => {
  if (cachedToken.value) {
    return cachedToken.value;
  }

  const response = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userCredentials),
  });

  if (!response.ok) {
    throw new Error("Failed to get token");
  }

  const data = await response.json();

  cachedToken.value = data.data.token;

  return data.data.token;
};

const revokeAllTokens = async () => {
  const token = cachedToken.value;

  if (!token) {
    throw new Error("No token available. No need to revoke.");
  }

  const response = await fetch(`${baseUrl}/auth/invalidate_tokens`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to revoke.");
  }

  const data = await response.json();

  return !!data.status;
};

const getServerId = async () => {
  const token = await getToken();

  const response = await fetch(`${baseUrl}/servers`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  const data = await response.json();

  return data.data[0].server_id;
};

const getServerStatus = async (id) => {
  const token = await getToken();

  const getServerStatusResponse = await fetch(
    `${baseUrl}/servers/${id}/stats`,
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    },
  );
  const serverStatus = await getServerStatusResponse.json();

  return serverStatus.data.running;
};

const startServer = async () => {
  const serverId = await getServerId();
  const status = await getServerStatus(serverId);

  if (status) {
    throw new Error("Server is already running.");
  }

  const token = await getToken();

  const startServerResponse = await fetch(
    `${baseUrl}/servers/${serverId}/action/start_server`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const startServerData = await startServerResponse.json();

  return startServerData.status;
};

const stopServer = async () => {
  const serverId = await getServerId();
  const status = await getServerStatus(serverId);

  if (!status) {
    throw new Error("Server is already stopped.");
  }

  const token = await getToken();

  const stopServerResponse = await fetch(
    `${baseUrl}/servers/${serverId}/action/stop_server`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const stopServerData = await stopServerResponse.json();

  return stopServerData.status;
};

export {
  baseUrl,
  getToken,
  revokeAllTokens,
  getServerId,
  getServerStatus,
  startServer,
  stopServer,
};
