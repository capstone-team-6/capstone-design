import { defineComponent, onMounted, onUnmounted, ref } from 'vue';

export default defineComponent({
  name: 'InteractiveMap',
  props: {
    imageSrc: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const imageRef = ref<HTMLImageElement | null>(null);
    const position = ref({ x: 0, y: 0 });
    let start = { x: 0, y: 0 };
    let dragging = false;

    const startDrag = (x: number, y: number) => {
      dragging = true;
      start.x = x - position.value.x;
      start.y = y - position.value.y;
    };

    const onDrag = (x: number, y: number) => {
      if (!dragging) return;
      position.value.x = x - start.x;
      position.value.y = y - start.y;
    };

    const endDrag = () => {
      dragging = false;
    };

    const onMouseDown = (event: MouseEvent) => {
      event.preventDefault();
      startDrag(event.clientX, event.clientY);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (event: MouseEvent) => {
      onDrag(event.clientX, event.clientY);
    };

    const onMouseUp = () => {
      endDrag();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      startDrag(touch.clientX, touch.clientY);
    };

    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      onDrag(touch.clientX, touch.clientY);
    };

    const onTouchEnd = () => {
      endDrag();
    };

    onMounted(() => {
      if (imageRef.value) {
        imageRef.value.addEventListener('mousedown', onMouseDown);
        imageRef.value.addEventListener('touchstart', onTouchStart);
        imageRef.value.addEventListener('touchmove', onTouchMove);
        imageRef.value.addEventListener('touchend', onTouchEnd);
      }
    });

    onUnmounted(() => {
      if (imageRef.value) {
        imageRef.value.removeEventListener('mousedown', onMouseDown);
        imageRef.value.removeEventListener('touchstart', onTouchStart);
        imageRef.value.removeEventListener('touchmove', onTouchMove);
        imageRef.value.removeEventListener('touchend', onTouchEnd);
      }
    });

    return () => (
      <div>
        <img ref={imageRef} src={props.imageSrc} style={{
          position: 'absolute',
          left: `${position.value.x}px`,
          top: `${position.value.y}px`,
          cursor: 'grab'
        }} alt="Draggable image" />
      </div>
    );
  }
});
