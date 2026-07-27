<script setup lang="ts">
import { computed } from 'vue'
import type { Node, Edge } from '@vue-flow/core'
import { VueFlow, MarkerType, Position } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { NodeToolbar } from '@vue-flow/node-toolbar'
// Vue Flow's CSS is only needed where the diagram renders. Importing it here
// (instead of globally in main.css) keeps its self-referential --vf-node-color
// out of the global stylesheet that nuxt-og-image's renderer scans.
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import ContainerNode from './nodes/ContainerNode.vue'
import ToolbarNode from './nodes/ToolbarNode.vue'
import ConfigNode from './nodes/ConfigNode.vue'

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

// Litestar configuration layers
const nodes = computed<Node[]>(() => [
  // Main box (blue)
  {
    id: 'application-layer-box',
    type: 'container',
    data: { label: 'Application layer' },
    position: { x: 0, y: 20 },
    height: 640,
    width: 500,
    style: {
      backgroundColor: isDark.value ? '#1e3a5f' : '#EFF6FF',
      border: isDark.value ? '1px solid #374151' : '1px solid #d1d5db',
      borderRadius: '8px',
      zIndex: -1,
      pointerEvents: 'none',
    },
    draggable: false,
  },
  // Router/Controller layer (purple) inside main box
  {
    id: 'router-controller-layer-box',
    type: 'container',
    data: { label: 'Router/Controller layer' },
    parentNode: 'application-layer-box',
    position: { x: 20, y: 200 },
    width: 460,
    height: 420,
    style: {
      backgroundColor: isDark.value ? '#4a1d4a' : '#fae8ff',
      border: isDark.value ? '1px solid #374151' : '1px solid #d1d5db',
      borderRadius: '8px',
      zIndex: -1,
      pointerEvents: 'none',
    },
    draggable: false,
  },
  // Handler layers (green) inside Router/Controller layer
  {
    id: 'handler-layer-box-1',
    type: 'container',
    data: { label: 'Handler layer' },
    parentNode: 'router-controller-layer-box',
    position: { x: 20, y: 200 },
    width: 200,
    height: 200,
    style: {
      backgroundColor: isDark.value ? '#2d4a2d' : '#D9E7D6',
      border: isDark.value ? '1px solid #374151' : '1px solid #d1d5db',
      borderRadius: '8px',
      zIndex: -1,
      pointerEvents: 'none',
    },
    draggable: false,
  },
  // Second handler layer (green) inside Router/Controller layer
  {
    id: 'handler-layer-box-2',
    type: 'container',
    data: { label: 'Handler layer', labelPosition: 'right' },
    parentNode: 'router-controller-layer-box',
    position: { x: 240, y: 200 },
    width: 200,
    height: 200,
    style: {
      backgroundColor: isDark.value ? '#2d4a2d' : '#D9E7D6',
      border: isDark.value ? '1px solid #374151' : '1px solid #d1d5db',
      borderRadius: '8px',
      zIndex: -1,
      pointerEvents: 'none',
    },
    draggable: false,
  },
  // Production configuration (top)
  {
    id: 'production',
    type: 'config',
    data: {
      label: 'Application configuration',
      backgroundColor: isDark.value ? '#1e40af' : '#DBEAFE',
    },
    position: { x: 150, y: 70 },
    width: 200,
    height: 50,
  },
  // Icon node in application layer
  {
    id: 'application-layer-config',
    type: 'icon',
    data: {
      label: '⎇+',
      tooltip: `<strong>Application Layer Config:</strong>
<strong>response_headers:</strong> {"X-App-Version": "1.0"}
<strong>tags:</strong> ["public-api"]
<strong>cache:</strong> 300`,
      toolbarPosition: Position.Right,
    },
    position: { x: 230, y: 155 },
    style: {
      backgroundColor: isDark.value ? '#1f2937' : '#ffffff',
      border: isDark.value ? '1px solid #374151' : '1px solid #d1d5db',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      cursor: 'pointer',
      color: isDark.value ? '#f3f4f6' : '#000000',
    },
  },
  // Router controller configuration (middle)
  {
    id: 'staging',
    type: 'config',
    data: {
      label: 'Router/Controller configuration',
      backgroundColor: isDark.value ? '#6b21a8' : '#f3e8ff',
    },
    position: { x: 150, y: 270 },
    width: 200,
    height: 50,
  },
  // Icon node router controller configuration
  {
    id: 'branchPlus',
    type: 'icon',
    data: {
      label: '⎇+',
      tooltip: `<strong>Router/Controller Layer:</strong>
<em>Inherits from Application:</em>
<strong>response_headers:</strong> {"X-App-Version": "1.0"}
<strong>tags:</strong> ["public-api"]
<strong>cache:</strong> 300

<em>Adds/Overrides:</em>
<strong>tags:</strong> ["public-api", "users"] <em>(extended)</em>
<strong>guards:</strong> [AuthGuard]`,
      toolbarPosition: Position.Right,
    },
    position: { x: 230, y: 335 },
    style: {
      backgroundColor: isDark.value ? '#1f2937' : '#ffffff',
      border: isDark.value ? '1px solid #374151' : '1px solid #d1d5db',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      cursor: 'pointer',
      color: isDark.value ? '#f3f4f6' : '#000000',
    },
  },
  // Get users
  {
    id: 'get-users',
    type: 'config',
    data: {
      label: 'GET /users',
      backgroundColor: isDark.value ? '#166534' : '#C1D9BC',
    },
    position: { x: 20, y: 60 },
    parentNode: 'handler-layer-box-1',
    width: 160,
    height: 40,
  },
  // Post users
  {
    id: 'post-users',
    type: 'config',
    data: {
      label: 'POST /users',
      backgroundColor: isDark.value ? '#166534' : '#C1D9BC',
    },
    position: { x: 20, y: 60 },
    parentNode: 'handler-layer-box-2',
    width: 160,
    height: 40,
  },
  // Icon nodes in handler layers
  {
    id: 'get-users-icon',
    type: 'icon',
    data: {
      label: '⎇+',
      tooltip: `<strong>GET /users Handler:</strong>
<em>Inherits from Router/Controller:</em>
<strong>response_headers:</strong> {"X-App-Version": "1.0"}
<strong>tags:</strong> ["public-api", "users"]
<strong>cache:</strong> 300
<strong>guards:</strong> [AuthGuard]

<em>Adds/Overrides:</em>
<strong>cache:</strong> 600 <em>(overridden)</em>
<strong>summary:</strong> "List all users"
<strong>response_description:</strong> "List of users"`,
      toolbarPosition: Position.Right,
    },
    position: { x: 80, y: 130 },
    parentNode: 'handler-layer-box-1',
    style: {
      backgroundColor: isDark.value ? '#1f2937' : '#ffffff',
      border: isDark.value ? '1px solid #374151' : '1px solid #d1d5db',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      cursor: 'pointer',
      color: isDark.value ? '#f3f4f6' : '#000000',
    },
  },
  {
    id: 'post-users-icon',
    type: 'icon',
    data: {
      label: '⎇+',
      tooltip: `<strong>POST /users Handler:</strong>
<em>Inherits from Router/Controller:</em>
<strong>response_headers:</strong> {"X-App-Version": "1.0"}
<strong>tags:</strong> ["public-api", "users"]
<strong>cache:</strong> 300
<strong>guards:</strong> [AuthGuard]

<em>Adds/Overrides:</em>
<strong>cache:</strong> None <em>(disabled)</em>
<strong>guards:</strong> [AuthGuard, AdminGuard] <em>(extended)</em>
<strong>summary:</strong> "Create a new user"
<strong>status_code:</strong> 201`,
      toolbarPosition: Position.Right,
    },
    position: { x: 80, y: 130 },
    parentNode: 'handler-layer-box-2',
    style: {
      backgroundColor: isDark.value ? '#1f2937' : '#ffffff',
      border: isDark.value ? '1px solid #374151' : '1px solid #d1d5db',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      cursor: 'pointer',
      color: isDark.value ? '#f3f4f6' : '#000000',
    },
  },
])

const edges = computed<Edge[]>(() => {
  const edgeColor = isDark.value ? '#9ca3af' : '#71717a'
  return [
    {
      id: 'e-prod-staging',
      source: 'production',
      target: 'application-layer-config',
      animated: true,
      style: { stroke: edgeColor, strokeWidth: 1, strokeDasharray: '5,5' },
      markerEnd: MarkerType.ArrowClosed,
    },
    {
      id: 'e-application-layer-config-staging',
      source: 'application-layer-config',
      target: 'staging',
      animated: true,
      style: { stroke: edgeColor, strokeWidth: 1, strokeDasharray: '5,5' },
      markerEnd: MarkerType.ArrowClosed,
    },
    {
      id: 'e-staging-branchPlus',
      source: 'staging',
      target: 'branchPlus',
      animated: true,
      style: { stroke: edgeColor, strokeWidth: 1, strokeDasharray: '5,5' },
      markerEnd: MarkerType.ArrowClosed,
    },
    {
      id: 'e-branchPlus-get-users',
      source: 'branchPlus',
      target: 'get-users',
      animated: true,
      style: { stroke: edgeColor, strokeWidth: 1, strokeDasharray: '5,5' },
      markerEnd: MarkerType.ArrowClosed,
    },
    {
      id: 'e-branchPlus-post-users',
      source: 'branchPlus',
      target: 'post-users',
      animated: true,
      style: { stroke: edgeColor, strokeWidth: 1, strokeDasharray: '5,5' },
      markerEnd: MarkerType.ArrowClosed,
    },
    {
      id: 'e-get-users-icon',
      source: 'get-users',
      target: 'get-users-icon',
      animated: true,
      style: { stroke: edgeColor, strokeWidth: 1, strokeDasharray: '5,5' },
      markerEnd: MarkerType.ArrowClosed,
    },
    {
      id: 'e-post-users-icon',
      source: 'post-users',
      target: 'post-users-icon',
      animated: true,
      style: { stroke: edgeColor, strokeWidth: 1, strokeDasharray: '5,5' },
      markerEnd: MarkerType.ArrowClosed,
    },
  ]
})
</script>

<template>
  <VueFlow
    :nodes="nodes"
    :edges="edges"
    fit-view-on-init
    :zoom-on-scroll="false"
    :zoom-on-pinch="false"
    :zoom-on-double-click="false"
    :nodes-draggable="false"
    :nodes-connectable="false"
    :pan-on-drag="false"
    :pan-on-scroll="false"
  >
    <template #node-container="{ data }">
      <ContainerNode :data="data" />
    </template>

    <template #node-config="{ data }">
      <ConfigNode :data="data" />
    </template>

    <template #node-icon="props">
      <ToolbarNode :id="props.id" :data="props.data" />
    </template>

    <template #node-default="{ data, id }">
      <div class="custom-node">
        {{ data.label }}
        <NodeToolbar v-if="data.tooltip" :node-id="id">
          <div class="toolbar-content">{{ data.tooltip }}</div>
        </NodeToolbar>
      </div>
    </template>

    <Background />
  </VueFlow>
</template>

<style scoped>
.vue-flow {
  width: 100%;
  height: 100%;
  background: #ffffff;
  overflow: visible !important;
}

.dark .vue-flow {
  background: #0f172a;
}

:deep(.vue-flow__viewport) {
  overflow: visible !important;
}

:deep(.vue-flow__transformationpane) {
  overflow: visible !important;
}

:deep(.vue-flow__node-toolbar) {
  z-index: 1000;
}

.vue-flow__node {
  cursor: default;
}

.vue-flow__node:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dark .vue-flow__node:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

/* Container boxes shouldn't respond to hover */
.vue-flow__node[data-id='your-cloud-box']:hover,
.vue-flow__node[data-id='xata-cloud-box']:hover {
  box-shadow: none;
}

/* Icon nodes get hover effect */
.vue-flow__node[data-id='application-layer-config']:hover,
.vue-flow__node[data-id='branchPlus']:hover,
.vue-flow__node[data-id='merge']:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease;
  cursor: help;
}

.custom-node {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toolbar-content {
  background: #18181b;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dark .toolbar-content {
  background: #1f2937;
  color: #f3f4f6;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
}
</style>
