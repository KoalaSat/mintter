import type {ForgeConfig} from '@electron-forge/shared-types'
import {MakerSquirrel} from '@electron-forge/maker-squirrel'
import {MakerZIP} from '@electron-forge/maker-zip'
import {MakerDeb, MakerDebConfig} from '@electron-forge/maker-deb'
// import {MakerRpm} from '@electron-forge/maker-rpm'
import {VitePlugin} from '@electron-forge/plugin-vite'
import path from 'path'
import packageJson from './package.json'
// import setLanguages from 'electron-packager-languages'

const {version} = packageJson

const devProjectRoot = path.join(process.cwd(), '../../..')
const LLVM_TRIPLES = {
  'darwin/x64': 'x86_64-apple-darwin',
  'darwin/arm64': 'aarch64-apple-darwin',
  'win32/x64': 'x86_64-pc-windows-msvc.exe',
  'linux/x64': 'x86_64-unknown-linux-gnu',
  'linux/arm64': 'aarch64-unknown-linux-gnu',
}

function getPlatformTriple() {
  return (
    process.env.DAEMON_NAME ||
    // @ts-ignore
    LLVM_TRIPLES[`${process.platform}/${process.arch}`]
  )
}

const daemonBinaryPath = path.join(
  devProjectRoot,
  // TODO: parametrize this for each platform
  `plz-out/bin/backend/mintterd-${getPlatformTriple()}`,
)

console.log(`===== ~ daemonBinaryPath:`, daemonBinaryPath)

let iconsPath = process.env.CI
  ? path.resolve(__dirname, 'assets', 'icons-nightly', 'icon')
  : path.resolve(__dirname, 'assets', 'icons', 'icon')

const commonLinuxConfig: MakerDebConfig = {
  options: {
    categories: ['Development', 'Utility'],
    icon: `${iconsPath}.png`,
    maintainer: 'Mintter Inc.',
    description: 'Mintter: a hyper.media protocol client',
    productName: 'Mintter',
    mimeType: ['x-scheme-handler/hm'],
    version,
    bin: 'Mintter',
  },
}

const config: ForgeConfig = {
  packagerConfig: {
    appVersion: process.env.APP_VERSION,
    asar: true,
    darwinDarkModeSupport: true,
    icon: iconsPath,
    name: 'Mintter',
    appBundleId: 'com.mintter.app',
    executableName: 'Mintter',
    appCategoryType: 'public.app-category.productivity',
    // packageManager: 'yarn',
    extraResource: [daemonBinaryPath],
    // beforeCopy: [setLanguages(['en', 'en_US'])],
    win32metadata: {
      CompanyName: 'Mintter Inc.',
      OriginalFilename: 'Mintter',
    },
    protocols: [{name: 'Mintter Hypermedia', schemes: ['hm']}],
  },
  makers: [
    new MakerDeb(commonLinuxConfig),
    new MakerZIP({}, ['darwin']),
    new MakerSquirrel({
      name: 'Mintter',
      authors: 'Mintter inc.',
      exe: 'mintter.exe',
      description: 'Mintter: a hyper.media protocol client',
      // An URL to an ICO file to use as the application icon (displayed in Control Panel > Programs and Features).
      iconUrl: `${iconsPath}.ico`,
      noMsi: true,
      setupIcon: `${iconsPath}.ico`,
      setupExe: `mintter-${version}-win32-${process.arch}-setup.exe`,
      // The ICO file to use as the icon for the generated Setup.exe
      loadingGif: path.resolve(__dirname, 'assets', 'loading.gif'),

      // certificateFile: process.env.WINDOWS_PFX_FILE,
      // certificatePassword: process.env.WINDOWS_PFX_PASSWORD,
    }),
  ],
  plugins: [
    // {
    //   name: '@electron-forge/plugin-electronegativity',
    //   config: {
    //     isSarif: true,
    //   },
    // },
    // {
    //   name: '@electron-forge/plugin-auto-unpack-natives',
    //   config: {},
    // },
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: 'src/main.ts',
          config: 'vite.main.config.ts',
        },
        {
          entry: 'src/preload.ts',
          config: 'vite.preload.config.ts',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
  ],
  publishers: [],
}

function notarizeMaybe() {
  if (process.platform !== 'darwin') {
    console.log(
      `[FORGE CONFIG]: 🍎 The platform we are building is not 'darwin'. skipping (platform: ${process.platform})`,
    )
    return
  }

  if (!process.env.CI) {
    console.log(`[FORGE CONFIG]: 🤖 Not in CI, skipping sign and notarization`)
    return
  }

  if (!process.env.APPLE_ID || !process.env.APPLE_ID_PASSWORD) {
    console.warn(
      `[FORGE CONFIG]: ❌ Should be notarizing, but environment variables APPLE_ID or APPLE_ID_PASSWORD are missing!`,
    )
    return
  }

  console.log(
    `[FORGE CONFIG]: 🎉 adding 'osxNotarize' and 'osxSign' values to the config. Proceed to Sign and Notarize`,
  )

  // @ts-expect-error
  config.packagerConfig.osxNotarize = {
    tool: 'notarytool',
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
    teamId: process.env.APPLE_TEAM_ID,
  }

  // @ts-expect-error
  config.packagerConfig.osxSign = {
    // @ts-expect-error
    entitlements: './entitlements.plist',
    executableName: 'Mintter',
    entitlementsInherit: './entitlements.plist',
    gatekeeperAssess: false,
    hardenedRuntime: true,
    identity:
      'Developer ID Application: Mintter Technologies S.L. (XSKC6RJDD8)',
    binaries: [daemonBinaryPath],
  }
}

notarizeMaybe()

module.exports = config
