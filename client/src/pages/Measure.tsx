import { useFingerprintAPI } from "@/apis/fingerprint";
import { defineComponent, reactive } from "vue";

export default defineComponent({
    name: "measure",
    setup() {
        const state = reactive({
            buildingId: "",
            markerId: "",
            signals: []
        })
        const { register } = useFingerprintAPI()

        return () => {
            return <div>
                <div>
                    <div>빌딩 id</div>
                    <input type="text" value={state.buildingId} onInput={(e) => state.buildingId = (e.target as HTMLInputElement).value} />
                </div>
                <div>
                    <div>마커 id</div>
                    <input type="text" value={state.markerId} onInput={(e) => state.markerId = (e.target as HTMLInputElement).value} />
                </div>
                <button onClick={() => register({}, {}, state)}>등록</button>
            </div>
        }
    }
})






