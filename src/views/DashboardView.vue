<template>
  <section>
    <h1>Dashboard {{ $route.params.identifier }}</h1>
  </section>

  <section id="containerWrapper">
    <section id="cameraFeedContainer"></section>
    <section id="taxiHistoryContainer">
      <MapHistory></MapHistory>
    </section>
  </section>
</template>

<script setup lang="ts">
import MapHistory from "@/components/Dashboard/MapHistory.vue";
</script>

<style scoped lang="scss">
#containerWrapper {
  padding: 0 24px;
  display: flex;
  gap: 20px;
}
#cameraFeedContainer {
  height: 50vh;
  flex: 1;
  background-color: black;
}

#taxiHistoryContainer {
  flex: 1;
  height: 50vh;
  background-color: blue;
}

h1 {
  padding: 24px;
}
</style>
