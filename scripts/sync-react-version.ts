import axios from 'axios'
import dayjs from 'dayjs'
import { execa } from 'execa'
import { Logger } from 'tslog'
import type { PackageJson } from 'type-fest'

const logger = new Logger()

const $ = execa({ stdio: 'inherit', verbose: 'short', shell: true })

const request = axios.create({ timeout: 10000 })

function compareVersionAsc(version1: string, version2: string) {
  const v1 = version1.split('.')
  const v2 = version2.split('.')
  const len = Math.max(v1.length, v2.length)
  for (let i = 0; i < len; i++) {
    const num1 = v1[i] ? Number.parseInt(v1[i], 10) : 0
    const num2 = v2[i] ? Number.parseInt(v2[i], 10) : 0
    if (num1 > num2) return 1
    if (num1 < num2) return -1
  }
  return 0
}

async function getVersions(pkg: string, versionLt = '19.0.0') {
  const res = await request.get(`https://registry.npmjs.org/${pkg}`)
  const json = res.data as { versions: Record<string, PackageJson> }
  const versions = Object.keys(json.versions).filter((v) => /^\d+\.\d+\.\d+$/.test(v))
  const versionsQueue = versions.filter((v) => compareVersionAsc(v, versionLt) > 0).toSorted(compareVersionAsc)
  return versionsQueue
}

async function publishVersion(version: string, dev = true) {
  let pkgVersion = version
  let gitTagName = `v${version}`
  let gitBranchName = `main`
  let publishExtraArgs: string[] = []
  if (dev) {
    pkgVersion = `${version}-dev.${dayjs().format('YYMMDDHHmm')}`
    gitBranchName = 'dev'
    gitTagName = `v${version}-dev`
    publishExtraArgs = ['--tag', 'dev']
  }

  const branch = (await $`git rev-parse --abbrev-ref HEAD`).stdout
  if (branch !== gitBranchName) {
    throw new Error(`current branch is ${branch}, should be ${gitBranchName}`)
  }

  await $`pnpx npm-check-updates -u '@types/react*'` // always use latest @types/react*
  await $`npm pkg set dependencies.react=^${version}` // use specific version of `react` & `react-dom`
  await $`npm pkg set dependencies.react-dom=^${version}`
  await $`pnpm install`

  await $`npm pkg set version=${pkgVersion}`

  // publish
  await $`npm publish --access public ${publishExtraArgs}`

  // git tag
  await $`git add package.json pnpm-lock.yaml`
  await $`git commit -m "deps: upgrade react to v${version}"`
  await $`git tag -f ${gitTagName}`
  await $`git push -f origin ${gitBranchName} && git push -f origin ${gitTagName}`
}

if (import.meta.main) {
  const currentVersion = (await import('../package.json')).default.version
  const versions = await getVersions('react', currentVersion)
  const dev = process.env.DEV === 'true'
  logger.info('DEV: %s, current version: %s, new versions: %j', dev, currentVersion, versions)
  for (const v of versions) {
    await publishVersion(v, dev)
  }
}
