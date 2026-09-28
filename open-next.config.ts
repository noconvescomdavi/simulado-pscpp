import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // Keep the default Next server function small enough for Workers by splitting
  // the large PSCPP question-bank routes into their own Workers.
  functions: {
    pscpp: {
      routes: [
        "app/api/pscpp/**",
        "app/api/simulado/**",
        "app/simulado/**"
      ]
    }
  }
});
