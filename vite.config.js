import legacy from "@vitejs/plugin-legacy";
import { defineConfig } from "vite";
import stylelint from 'vite-plugin-stylelint';
import { resolve } from "path";
import viteImagemin from "vite-plugin-imagemin";
import globule from "globule";


const dir = {
  src: "src",
  base: "./",
  publicDir: "../public",
  assetsDir: "assets",
  outDir: "../dist",
};

// ==============================================
// マルチページの設定
// ==============================================
const inputs = {};
const documents = globule.find([`./${dir.src}/**/*.html`], {
  ignore: [`./${dir.src}/**/_*.html`],
});
documents.forEach((document) => {
  const fileName = document.replace(`./${dir.src}/`, "");
  const key = fileName.replace("index.html", "main").replace("/main", "");

  inputs[key] = resolve(__dirname, dir.src, fileName);
});


export default defineConfig({
  // base: dir.base,
  root: `${dir.src}`,//作業中ディレクトリからindex.htmlが置かれている場所

  plugin: [
    legacy({
      targets: ["defaults", "not IE 11"]
    }),
    stylelint({
      fix: true,
      build: true
    }),
    // pugPlugin({
    //   pretty: true,
    //   name: "my pug"
    // }),
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
      "@": resolve(__dirname, dir.src)
    }
  },
  server: {
    host: true,
    port: 3000
  },
  optimizeDeps: {

    entries: dir.src// Could not auto-determine entry point from rollupOptions or html files and there are no explicit optimizeDeps.include patternsの解決
  },

  build: {
    outDir: dir.outDir,
    assetsDir: dir.assetsDir,
    emptyOutDir: true,
    minify: false,
    rollupOptions: {
      //rollupに設定するオプション

      input: { ...inputs },//エントリーポイントを変更
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
