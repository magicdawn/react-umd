import { Configuration } from '@rspack/core'
import fse from 'fs-extra'

function defineConfig(...configs: Configuration[]) {
  return configs
}

fse.emptyDirSync(__dirname + '/dist')

const minify = true

export default defineConfig(
  {
    entry: {
      react: './src/react.ts',
    },
    output: {
      // clean: true,
      filename: '[name].umd.js',
      library: {
        type: 'umd',
        name: 'React',
      },
    },
    optimization: {
      minimize: minify,
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
      minimize: minify,
    },
  },
  {
    entry: {
      'react-dom-client': './src/react-dom-client.ts',
    },
    externals: {
      'react': {
        root: 'React',
        amd: 'react',
        commonjs: 'react',
        commonjs2: 'react',
      },
      'react-dom': {
        root: 'ReactDOM',
        amd: 'react-dom',
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
      },
    },
    output: {
      filename: '[name].umd.js',
      library: {
        type: 'umd',
        name: 'ReactDOMClient',
      },
    },
    optimization: {
      minimize: minify,
    },
  },
)
