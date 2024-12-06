import { defineConfig } from '@rslib/core'

export default defineConfig({
  source: {
    entry: {
      'react-dom': ['./src/react-dom.ts'],
    },
  },

  output: {
    cleanDistPath: false,
    minify: false,
    externals: {
      root: 'React',
      amd: 'react',
      commonjs: 'react',
      commonjs2: 'react',
    },
  },

  lib: [
    {
      format: 'umd',
      umdName: 'ReactDOM',
      autoExternal: false,
    },
  ],
})
