// const PrerenderSPAPlugin = require('prerender-spa-plugin');

/**
 * This is an extension for the webpack that resides in the cli-service Plugin.
 * This extension configures the prerender-spa-plugin
 * @author Sujil Maharjan
 */
/* eslint-disable */
module.exports = {
  configureWebpack: (config) => {
    if (process.env.NODE_ENV !== 'production') return;

    return {
      plugins: [
        /*
        new PrerenderSPAPlugin({
          // Absolute path to compiled SPA
          staticDir: path.resolve(__dirname, 'dist'),
          // List of routes to prerender
          routes: ['/', '/about','/login'],
        }),
        */
      ],
    };
  },

  devServer: {
    port: 5201,
    host: '0.0.0.0',
    client: {
      webSocketURL: 'auto://0.0.0.0:0/ws',
    },
    allowedHosts: 'all',
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  },
};
