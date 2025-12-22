import { cpus } from 'node:os'
import { defineConfig } from '@rspack/cli'
import { SwcJsMinimizerRspackPlugin, type MultiRspackOptions, type RspackOptions } from '@rspack/core'
import { pick } from 'es-toolkit'
import fse from 'fs-extra'

export default defineConfig((env, argv) => {
  // clean dir
  fse.emptyDirSync(__dirname + '/dist')

  // use `--mode development` to disable minify
  const shared: RspackOptions = {
    optimization: {
      minimizer: [
        new SwcJsMinimizerRspackPlugin({
          extractComments: true,
        }),
      ],
    },
  }

  const externals = {
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
  }

  const arr: MultiRspackOptions = [
    {
      ...shared,
      entry: {
        react: './src/react.ts',
      },
      output: {
        filename: '[name].umd.js',
        library: {
          type: 'umd',
          name: 'React',
        },
      },
    },
    {
      ...shared,
      entry: {
        'react-dom': './src/react-dom.ts',
      },
      externals: pick(externals, ['react']),
      output: {
        filename: '[name].umd.js',
        library: {
          type: 'umd',
          name: 'ReactDOM',
        },
      },
    },
    {
      ...shared,
      entry: {
        'react-dom-client': './src/react-dom-client.ts',
      },
      externals,
      output: {
        filename: '[name].umd.js',
        library: {
          type: 'umd',
          name: 'ReactDOMClient',
        },
      },
    },
  ]

  arr.parallelism = cpus().length
  return arr
})
