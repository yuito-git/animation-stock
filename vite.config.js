import legacy from "@vitejs/plugin-legacy";
import { defineConfig } from "vite";
import stylelint from 'vite-plugin-stylelint';

export default defineConfig({
  root: "src",//作業中ディレクトリからindex.htmlが置かれている場所

  plugin: [
    legacy({
      targets: ["defaults", "not IE 11"]
    }),
    stylelint({
      fix: true
    })

  ],
  build: {
    outDir: "../dist",
    assetsDir: "assets",
    emptyOutDir: true,
    rollupOptions: {
      //rollupに設定するオプション
      input: "src/index.html"//エントリーポイントを変更

    },
  }

})
