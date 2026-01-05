import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    server: {
      port: 3000,
      host: "0.0.0.0",
      proxy: {
        "/api/shopify": {
          target: `https://${env.VITE_SHOPIFY_SHOP_URL}/admin/api/2024-01`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/shopify/, ""),
          configure: (proxy, _options) => {
            proxy.on("proxyReq", (proxyReq, _req, _res) => {
              proxyReq.setHeader(
                "X-Shopify-Access-Token",
                env.VITE_SHOPIFY_ACCESS_TOKEN
              );
              proxyReq.setHeader("Content-Type", "application/json");
            });
          },
        },
      },
    },
    plugins: [react()],
    define: {
      "process.env.API_KEY": JSON.stringify(env.GEMINI_API_KEY),
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
    base: "/Visiora.V.2/",
  };
});
