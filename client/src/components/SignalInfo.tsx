import { PropType, defineComponent } from "vue";
import { APSignal } from "~/entities/fingerprint";

export default defineComponent({
  name: "Measure.SignalInfo",
  props: {
    signal: {
      type: Object as PropType<APSignal>,
      required: true,
    },
  },
  setup(props) {
    return () => {
      const { BSSID, SSID, level } = props.signal;
      return (
        <table>
          <tr>
            <td>BSSID</td>
            <td>{BSSID}</td>
          </tr>
          <tr>
            <td>SSID</td>
            <td>{SSID}</td>
          </tr>
          <tr>
            <td>Level</td>
            <td>{level}</td>
          </tr>
        </table>
      );
    };
  },
});
