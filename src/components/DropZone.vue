<template>
    <div @drop.prevent="$emit('dropped', $event.dataTransfer.files)"
    @dragover="$emit('hovered', true)"
    @dragleave="$emit('hovered', false)">
        <slot/>
    </div>
</template>
<script>
export default {
  name: 'dropZone',
};
</script>
