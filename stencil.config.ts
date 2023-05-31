import { Config } from '@stencil/core';
import dotenvPlugin from 'rollup-plugin-dotenv';

export const config: Config = {
  namespace: 'cineflix',
  globalStyle: 'src/global/global.css',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      baseUrl: 'https://iseto.github.io/wc-cineflix/',
      serviceWorker: null, // disable service workers
    },
  ],
  plugins: [dotenvPlugin()],
};
