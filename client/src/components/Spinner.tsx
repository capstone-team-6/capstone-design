import { Teleport, defineComponent } from "vue";

export default defineComponent({
    name: "Spinner",
    setup() {
        return () => {
            return <Teleport to="body" >
                <div class="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
                    <div class="bg-white">로딩 중</div>
                </div>
            </Teleport>

        }
    }
})