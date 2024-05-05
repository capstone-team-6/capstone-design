import mapView from '@/components/MapView';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Map',
  components: {
    mapView
  },
  setup() {
    const imageSrc = '/test_assets/208-5F.svg';

    return () => (
      <div>
        <mapView imageSrc={imageSrc} />
      </div>
    );
  }
});
