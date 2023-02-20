// import legacy from "@vitejs/plugin-legacy";//レガシー対応
import { defineConfig } from "vite";
import stylelintVite from 'vite-plugin-stylelint';
import eslint from '@nabla/vite-plugin-eslint';
import path from "path";
import viteImagemin from "vite-plugin-imagemin";
import globule from "globule";
import vitePluginPugStatic from '@macropygia/vite-plugin-pug-static'
import browserslistToEsbuild from "browserslist-to-esbuild";
import checker from 'vite-plugin-checker';



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
const documents = globule.find([`./${dir.src}/**/*.html`, `./${dir.src}/**/*.pug`, `./${dir.src}/scss/common.scss`], {
  ignore: [`./${dir.src}/html/**/_*.html`, `./${dir.src}/pug/**/_*.pug`,],
});

documents.forEach((document) => {
  const fileName = document.replace(`./${dir.src}/`, "");
  const key = path.parse(document).name
  inputs[key] = path.resolve(__dirname, dir.src, fileName);
});


export default defineConfig({
  root: 'src',
  server: {
    host: true,
    port: 3000
  },
  // optimizeDeps: {
  //   entries: dir.src
  // },
  esbuild: {
    supported: {
      "top-level-await": true
    }
  },

  build: {
    outDir: dir.outDir,
    target: browserslistToEsbuild(),
    // assetsDir: dir.assetsDir,
    emptyOutDir: true,
    // minify: false,
    rollupOptions: {

      input: { ...inputs },
      output: {
        entryFileNames: "assets/js/[name].js",
        chunkFileNames: "assets/js/[name].js",
        assetFileNames: (assetInfo) => {
          if (/\.( gif|jpeg|jpg|png|svg|webp| )$/.test(assetInfo.name)) {
            return 'assets/images/[name].[ext]';
          }
          if (/\.css$/.test(assetInfo.name)) {
            return 'assets/css/[name].[ext]';
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
    stylelintVite({
      fix: true,
      build: true,
    }),
    checker({
      typescript: true,
    }),
    eslint({
      fix: true,
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
        quality: 80,
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
      buildOptions: { basedir: "src" },
      serveOptions: { basedir: "src" },
    }),
  ],
})