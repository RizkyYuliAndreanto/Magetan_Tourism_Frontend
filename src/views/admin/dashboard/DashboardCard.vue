<template>
  <div class="dashboard-card" :class="cardVariant">
    <div class="card-header">
      <div class="card-icon-wrapper">
        <div class="card-icon">
          <svg
            :width="iconSize"
            :height="iconSize"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round">
            <path
              v-for="(path, index) in currentIconPaths"
              :key="index"
              :d="path" />
          </svg>
        </div>
      </div>
      <h4 class="card-title">{{ title }}</h4>
    </div>
    <div class="card-content">
      <p class="card-value">{{ formatValue(value) }}</p>
      <div v-if="subtitle" class="card-subtitle">{{ subtitle }}</div>
      <div v-if="trend" class="card-trend" :class="trendClass">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round">
          <path
            v-for="(path, index) in trendIconPaths"
            :key="index"
            :d="path" />
        </svg>
        <span>{{ trend }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    default: "primary",
    validator: (value) =>
      ["primary", "success", "warning", "danger", "info"].includes(value),
  },
  subtitle: {
    type: String,
    default: "",
  },
  trend: {
    type: String,
    default: "",
  },
  trendDirection: {
    type: String,
    default: "neutral",
    validator: (value) => ["up", "down", "neutral"].includes(value),
  },
});

// Icon mapping using Lucide Icons (SVG paths)
const iconPaths = {
  "map-pin": [
    "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z",
    "M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0",
  ],
  "file-text": [
    "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
    "M14 2v4a2 2 0 0 0 2 2h4",
    "M10 9H8",
    "M16 13H8",
    "M16 17H8",
  ],
  calendar: [
    "M8 2v4",
    "M16 2v4",
    "M3 6h18v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z",
    "M3 10h18",
  ],
  home: [
    "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",
    "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  ],
  "shopping-bag": [
    "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z",
    "M3 6h18",
    "M16 10a4 4 0 0 1-8 0",
  ],
  image: [
    "M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Z",
    "M9 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",
    "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",
  ],
  "book-open": [
    "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z",
    "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
  ],
  bell: [
    "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9",
    "M10.3 21a1.94 1.94 0 0 0 3.4 0",
  ],
  info: ["M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0", "m9 12 2 2 4-4"],
  users: [
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
    "M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0",
    "M22 21l-3-3m0 0a2 2 0 1 1-3-3 2 2 0 0 1 3 3Z",
  ],
  building: [
    "M4 4h16a2 2 0 0 1 2 2v16H2V6a2 2 0 0 1 2-2Z",
    "M9 22v-4h6v4",
    "M8 6h.01",
    "M16 6h.01",
    "M12 6h.01",
    "M12 10h.01",
    "M12 14h.01",
    "M16 10h.01",
    "M16 14h.01",
    "M8 10h.01",
    "M8 14h.01",
  ],
  default: ["M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0", "M12 6v6l4 2"],
};

const cardVariant = computed(() => `variant-${props.variant}`);
const iconSize = computed(() => 32);

const currentIconPaths = computed(() => {
  return iconPaths[props.icon] || iconPaths["default"];
});

const trendClass = computed(() => {
  if (!props.trendDirection) return "trend-neutral";
  switch (props.trendDirection) {
    case "up":
      return "trend-up";
    case "down":
      return "trend-down";
    default:
      return "trend-neutral";
  }
});

const trendIconPaths = computed(() => {
  switch (props.trendDirection) {
    case "up":
      return ["m3 17 6-6 4 4 8-8", "m14 5 7 0 0 7"];
    case "down":
      return ["m3 7 6 6 4-4 8 8", "m14 19 7 0 0-7"];
    default:
      return ["M5 12h14"];
  }
});

const formatValue = (value) => {
  if (value === null || value === undefined) {
    return "0";
  }
  if (typeof value === "number" && !isNaN(value)) {
    return value.toLocaleString("id-ID");
  }
  return String(value);
};
</script>
<style scoped>
/* =========== Modern Professional Dashboard Card =========== */
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

.dashboard-card {
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  min-height: 140px;
  cursor: pointer;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.dashboard-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #1e90ff 0%, #2563eb 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.dashboard-card:hover::before {
  opacity: 1;
}

.dashboard-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 15px 35px rgba(30, 144, 255, 0.12),
    0 8px 20px rgba(0, 0, 0, 0.08);
}

.dashboard-card.variant-primary:hover {
  border-color: #bfdbfe;
  background: linear-gradient(135deg, #ffffff 0%, #eaf4ff 100%);
}

/* Card Layout */
.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.card-icon-wrapper {
  position: relative;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
  flex-shrink: 0;
  position: relative;
  transition: all 0.3s ease;
  border: 2px solid #bfdbfe;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.08);
}

.dashboard-card:hover .card-icon {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  color: white;
  transform: scale(1.08);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.25);
  border-color: #2563eb;
}

.card-title {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  line-height: 1.2;
  flex: 1;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.card-value {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: all 0.3s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.dashboard-card:hover .card-value {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transform: scale(1.03);
}

.card-subtitle {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
  font-weight: 500;
}

.card-trend {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  width: fit-content;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.trend-up {
  color: #059669;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border: 1px solid #a7f3d0;
}

.trend-down {
  color: #dc2626;
  background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
  border: 1px solid #fca5a5;
}

.trend-neutral {
  color: #6b7280;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border: 1px solid #e5e7eb;
}

.dashboard-card:hover .card-trend {
  transform: translateX(4px);
}

/* Responsive Grid Layout */
@media (min-width: 1024px) {
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
}

@media (max-width: 767px) {
  .stats-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

/* Mobile Responsive Design */
@media (max-width: 768px) {
  .dashboard-card {
    padding: 1.5rem;
    min-height: 120px;
    border-radius: 12px;
  }

  .card-header {
    gap: 0.875rem;
    margin-bottom: 1.25rem;
  }

  .card-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }

  .card-title {
    font-size: 0.8125rem;
  }

  .card-value {
    font-size: 2rem;
  }

  .card-subtitle {
    font-size: 0.8125rem;
  }

  .card-trend {
    font-size: 0.6875rem;
    padding: 0.25rem 0.5rem;
  }
}

@media (max-width: 480px) {
  .dashboard-card {
    padding: 1.25rem;
    min-height: 100px;
    border-radius: 10px;
  }

  .card-header {
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .card-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
  }

  .card-title {
    font-size: 0.75rem;
  }

  .card-value {
    font-size: 1.75rem;
  }

  .card-subtitle {
    font-size: 0.75rem;
  }

  .card-trend {
    font-size: 0.625rem;
    padding: 0.2rem 0.4rem;
  }

  .dashboard-card:hover {
    transform: translateY(-2px) scale(1.01);
  }
}

/* Animation keyframes */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dashboard-card {
  animation: slideInUp 0.6s ease-out;
}

/* Card Variants - Konsisten dengan Recent Activity */
.dashboard-card.variant-primary::before {
  background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%);
}

/* Success Variant */
.dashboard-card.variant-success {
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
  border-color: #bbf7d0;
}

.dashboard-card.variant-success::before {
  background: linear-gradient(90deg, #059669 0%, #047857 100%);
}

.dashboard-card.variant-success .card-icon {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  color: #059669;
  border-color: #a7f3d0;
}

.dashboard-card.variant-success:hover {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border-color: #a7f3d0;
}

.dashboard-card.variant-success:hover .card-icon {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  color: white;
  border-color: #059669;
}

/* Warning Variant */
.dashboard-card.variant-warning {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border-color: #fed7aa;
}

.dashboard-card.variant-warning::before {
  background: linear-gradient(90deg, #d97706 0%, #b45309 100%);
}

.dashboard-card.variant-warning .card-icon {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  color: #d97706;
  border-color: #fed7aa;
}

.dashboard-card.variant-warning:hover {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-color: #f59e0b;
}

.dashboard-card.variant-warning:hover .card-icon {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  color: white;
  border-color: #d97706;
}

/* Danger Variant */
.dashboard-card.variant-danger {
  background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
  border-color: #fca5a5;
}

.dashboard-card.variant-danger::before {
  background: linear-gradient(90deg, #dc2626 0%, #b91c1c 100%);
}

.dashboard-card.variant-danger .card-icon {
  background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
  color: #dc2626;
  border-color: #fca5a5;
}

.dashboard-card.variant-danger:hover {
  background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
  border-color: #ef4444;
}

.dashboard-card.variant-danger:hover .card-icon {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
  border-color: #dc2626;
}

/* Info Variant */
.dashboard-card.variant-info {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-color: #bae6fd;
}

.dashboard-card.variant-info::before {
  background: linear-gradient(90deg, #0891b2 0%, #0e7490 100%);
}

.dashboard-card.variant-info .card-icon {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  color: #0891b2;
  border-color: #bae6fd;
}

.dashboard-card.variant-info:hover {
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  border-color: #0891b2;
}

.dashboard-card.variant-info:hover .card-icon {
  background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
  color: white;
  border-color: #0891b2;
}

/* Enhanced Shadow and Border for Better Contrast */
.dashboard-card.variant-primary {
  border: 1.5px solid #e2e8f0;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
}

/* Dark mode support (optional) */
@media (prefers-color-scheme: dark) {
  .dashboard-card {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    border-color: #475569;
    color: #f1f5f9;
  }

  .card-title {
    color: #94a3b8;
  }

  .card-value {
    color: #f1f5f9;
    background: linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .card-subtitle {
    color: #94a3b8;
  }
}
</style>
