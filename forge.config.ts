export default {
  packagerConfig: {
    asar: true,
    executableName: 'RUMO',
    extraResource: ['prisma/migrations'],
    ignore: (filePath: string): boolean => {
      if (filePath.length === 0) {
        return false;
      }

      return !(
        filePath.startsWith('/.vite') || filePath.startsWith('/node_modules')
      );
    },
  },
  rebuildConfig: {
    force: true,
    onlyModules: ['better-sqlite3'],
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        authors: 'RUMO',
        description: 'Controle financeiro e operacional pessoal.',
        exe: 'RUMO.exe',
        name: 'rumo',
        noMsi: true,
        setupExe: 'RUMO-0.1.0 Setup.exe',
        title: 'RUMO',
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    {
      name: '@electron-forge/plugin-vite',
      config: {
        build: [
          {
            entry: 'src/main/index.ts',
            config: 'vite.main.config.ts',
          },
          {
            entry: 'src/preload/index.ts',
            config: 'vite.preload.config.ts',
          },
        ],
        renderer: [
          {
            name: 'main_window',
            config: 'vite.renderer.config.ts',
          },
        ],
      },
    },
  ],
};
