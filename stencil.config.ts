import { Config } from '@stencil/core';
import dotenvPlugin from 'rollup-plugin-dotenv';

export const config: Config = {
  namespace: 'cineflix',
  globalStyle: 'src/global/global.css',
  globalScript: 'src/global/global.ts',
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
      serviceWorker: null, // disable service workers
      baseUrl: 'https://myapp.local/',
    },
  ],
  plugins: [dotenvPlugin()],
};
