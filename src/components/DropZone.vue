<template>
  <div
    @drop.prevent="$emit('dropped', $event.dataTransfer.files)"
    @drag.prevent
    @dragover.prevent="$emit('hovered', true)"
    @dragleave.prevent="$emit('hovered', false)"
  >
    <slot/>
  </div>
</template>
<script>
export default {
  name: 'dropZone',
};
</script>
