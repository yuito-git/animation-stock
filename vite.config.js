import legacy from "@vitejs/plugin-legacy";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src",//index.htmlが置かれている場所

  plugin: [
    legacy({
      targets: ["defaults", "not IE 11"]
    })
  ],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      //rollupに設定するオプション
      input: "src/index.html"//エントリーポイントを変更

    },
  }

})