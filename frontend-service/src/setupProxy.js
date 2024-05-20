const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api1",
    createProxyMiddleware({
      target: "http://34.150.75.254:8084/",
      changeOrigin: true,
      logLevel: "debug",
      pathRewrite: { "^/api1": "" }, // Add logging to see the proxy in action
      onProxyReq: function (proxyReq, req, res) {
        console.log("Proxying request to:", req.originalUrl);
      },
    })
  );
  app.use(
    "/api2",
    createProxyMiddleware({
      target: "http://34.150.75.254:8085/",
      changeOrigin: true,
      logLevel: "debug",
      pathRewrite: { "^/api2": "" },
      onProxyReq: function (proxyReq, req, res) {
        console.log("Proxying request to:", req.originalUrl);
      },
    })
  );

  app.use(
    "/api3",
    createProxyMiddleware({
      target: "http://34.150.75.254:8083/",
      changeOrigin: true,
      logLevel: "debug",
      pathRewrite: { "^/api3": "" },
      onProxyReq: function (proxyReq, req, res) {
        console.log("Proxying request to:", req.originalUrl);
      },
    })
  );
  app.use(
    "/api4",
    createProxyMiddleware({
      target: "http://34.150.75.254:8080/",
      changeOrigin: true,
      logLevel: "debug",
      pathRewrite: { "^/api4": "" }, // Add logging to see the proxy in action
      onProxyReq: function (proxyReq, req, res) {
        console.log("Proxying request to:", req.originalUrl);
      },
    })
  );
  app.use(
    "/api5",
    createProxyMiddleware({
      target: "http://34.96.237.62/",
      changeOrigin: true,
      logLevel: "debug",
      pathRewrite: { "^/api5": "" }, // Add logging to see the proxy in action
      onProxyReq: function (proxyReq, req, res) {
        console.log("Proxying request to:", req.originalUrl);
      },
    })
  );
};
