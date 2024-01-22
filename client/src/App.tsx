import { defineComponent } from 'vue'
import image from './assets/vue.svg'
import { HelloWorld } from './components/HelloWorld'

{
  /* <style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style> */
}

export default defineComponent({
  name: 'App',
  setup () {
    return () => {
      return [
        <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src="/vite.svg" class="logo" alt="Vite logo" />
          </a>
          <a href="https://vuejs.org/" target="_blank">
            <img src={image} class="logo vue" alt="Vue logo" />
          </a>
        </div>,
        <HelloWorld msg="Vite + Vue" />
      ]
    }
  }
})
