import axios from "axios";

// === Whisper ASR Axios Runtime Tracer ===
const original = axios.request;

axios.request = async function(config) {
  const method = (config.method || "GET").toUpperCase();
  const url = config.url || "";
  const timestamp = new Date().toISOString();

  console.log(`🧩 [AXIOS TRACE] ${timestamp}`);
  console.log(`→ METHOD: ${method}`);
  console.log(`→ URL: ${url}`);
  if (config.data) {
    console.log(`→ DATA TYPE: ${typeof config.data}`);
  }

  const res = await original.apply(this, arguments);
  console.log(`← RESPONSE STATUS: ${res.status} ${res.statusText}`);
  return res;
};

export default axios;
