import { defineComponent } from 'vue'
import image from './assets/vue.svg'
import { HelloWorld } from './components/HelloWorld'

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
