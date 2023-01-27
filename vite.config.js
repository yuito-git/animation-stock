import legacy from "@vitejs/plugin-legacy";
import { defineConfig } from "vite";
import stylelint from 'vite-plugin-stylelint';
import { resolve } from "path";
import viteImagemin from "vite-plugin-imagemin";

export default defineConfig({
  root: "src",//作業中ディレクトリからindex.htmlが置かれている場所

  plugin: [
    legacy({
      targets: ["defaults", "not IE 11"]
    }),
    stylelint({
      fix: true,
      build: true
    }),
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 20,
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4,
      },
      svgo: {
        plugins: [
          {
            name: "removeViewBox",
          },
          {
            name: "removeEmptyAttrs",
            active: false,
          },
        ],
      },
    }),

  ],
  resolve: {//何用？
    alias: {
      "@": resolve(__dirname, "src")
    }
  },
  server: {
    port: 3000
  },
  optimizeDeps: {

    entries: "src"// Could not auto-determine entry point from rollupOptions or html files and there are no explicit optimizeDeps.include patternsの解決
  },

  build: {
    outDir: "../dist",
    assetsDir: "assets",
    emptyOutDir: true,
    minify: false,
    rollupOptions: {
      //rollupに設定するオプション

      input: "src/index.html",//エントリーポイントを変更
      output: {
        entryFileNames: `assets/js/[name].js`,
        chunkFileNames: `assets/js/[name].js`,
        format: "es",
        assetFileNames: ({ name }) => {
          if (/\.( gif|jpeg|jpg|png|svg|webp| )$/.test(name ?? '')) {
            return 'assets/images/[name].[ext]';
          }
          if (/\.css$/.test(name ?? '')) {
            return 'assets/css/[name].[ext]';
          }
          if (/\.js$/.test(name ?? '')) {
            return 'assets/js/[name].[ext]';
          }
          return 'assets/[name].[ext]';
        }
      }

    },
  }

})
