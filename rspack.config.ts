import { Configuration } from '@rspack/core'

function defineConfig(...configs: Configuration[]) {
  return configs
}

export default defineConfig(
  {
    entry: {
      react: './src/react.ts',
    },
    output: {
      clean: true,
      filename: '[name].umd.js',
      library: {
        type: 'umd',
        name: 'React',
      },
    },
    optimization: {
      // minimize: false,
    },
  },
  {
    entry: {
      'react-dom': './src/react-dom.ts',
    },
    externals: {
      react: {
        root: 'React',
        amd: 'react',
        commonjs: 'react',
        commonjs2: 'react',
      },
    },
    output: {
      filename: '[name].umd.js',
      library: {
        type: 'umd',
        name: 'ReactDOM',
      },
    },
    optimization: {
      // minimize: false,
    },
  },
)
