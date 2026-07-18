export default {
  packagerConfig: {
    asar: true,
    ignore: (filePath: string): boolean => {
      if (filePath.length === 0) {
        return false;
      }

      return !(
        filePath.startsWith('/.vite') || filePath.startsWith('/node_modules')
      );
    },
  },
  rebuildConfig: {},
  makers: [],
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
