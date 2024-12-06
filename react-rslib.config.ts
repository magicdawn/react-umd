import { defineConfig } from '@rslib/core'

export default defineConfig({
  source: {
    entry: {
      react: ['./src/react.ts'],
    },
  },

  output: {
    minify: false,
  },

  lib: [
    {
      format: 'umd',
      umdName: 'React',
      autoExternal: false,
    },
  ],
})
