<template>
  <div class="greetings">
    <div ref="myElement" class="fullScale">
      <!-- This div will be used as the container for the map -->
    </div>
    <div class="flex">
      <input type="text" v-model="coordinates" placeholder="Longitude, Latitude"/>
      <input type="number" v-model="radius" placeholder="Radius (meters)" @keyup.enter="handleKeyPress" />
    </div>
    <div>
      <div class="flex">
          <div
            v-for="(x) in data.radius"
            :key="x"
            class="flex items-center me-4 mr-4"
          >
            <input
              id="inline-radio"
              type="radio"
              :value="x"
              name="inline-radio-group"
              v-model="selectedRadius"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              for="inline-radio"
              class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >{{ x }}m</label>
          </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted, watch } from 'vue';
import { initializeMap, map, view, graphicsLayer } from './mapFunctions'; // Import initialization function
import { updateCenter } from './mapUtils'; // Import utility functions

const props = defineProps<{
  data: {
      radius: number[],
      features: string[]
		}
}>()

const myElement = ref<HTMLDivElement | null>(null);
const coordinates = ref<string>('115.909195,-31.910865');
const radius = ref<number>(0);
const selectedRadius = ref(null);

onMounted(() => {
  // Load the ArcGIS API modules
  initializeMap(myElement, coordinates.value, selectedRadius.value);

});

async function handleKeyPress(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    updateCenter(view, coordinates, selectedRadius, graphicsLayer);
  }
}
// Watch for changes in selectedRadius
watch(selectedRadius, (newValue, oldValue) => {
  console.log('Selected radius changed:', newValue);
  updateCenter(view, coordinates, selectedRadius, graphicsLayer);
  // Trigger any necessary actions or updates here
});
</script>

<style scoped>
@import "https://js.arcgis.com/4.29/@arcgis/core/assets/esri/themes/dark/main.css";

.greetings {
  height: 400px; /* Adjust height as needed */
  width: 500px;
}

.fullScale{
  height: 100%;
  width: 100%;
}
</style>