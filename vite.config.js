// import legacy from "@vitejs/plugin-legacy";//レガシー対応
import { defineConfig } from "vite";
import stylelint from 'vite-plugin-stylelint';
import { resolve } from "path";
import viteImagemin from "vite-plugin-imagemin";
import globule from "globule";
import vitePluginPugStatic from '@macropygia/vite-plugin-pug-static'



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
const documents = globule.find([`./${dir.src}/**/*.html`, `./${dir.src}/**/*.pug`], {
  ignore: [`./${dir.src}/html/**/_*.html`, `./${dir.src}/pug/**/_*.pug`],
});
documents.forEach((document) => {
  const fileName = document.replace(`./${dir.src}/`, "");
  inputs[fileName] = resolve(__dirname, dir.src, fileName);
});


export default defineConfig({
  root: 'src',
  server: {
    host: true,
    port: 3000
  },
  optimizeDeps: {
    entries: dir.src
  },

  build: {
    outDir: dir.outDir,
    assetsDir: dir.assetsDir,
    emptyOutDir: true,
    minify: false,
    rollupOptions: {
      input: { ...inputs },
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
    }
  },
  plugins: [
    // legacy({
    //   targets: ["defaults", "not IE 11"]
    // }),
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
    vitePluginPugStatic({
      buildOptions: { basedir: "./src" },
      serveOptions: { basedir: "./src" },
    }),
  ],
})