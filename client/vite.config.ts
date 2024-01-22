import vueJsx from "@vitejs/plugin-vue-jsx"
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ vueJsx({})],
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false"
  }
})
