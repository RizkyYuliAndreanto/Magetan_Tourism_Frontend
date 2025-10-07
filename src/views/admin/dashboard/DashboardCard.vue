<template>
  <div class="dashboard-card" :class="cardVariant">
    <div class="card-icon">
      <i :class="icon"></i>
    </div>
    <div class="card-content">
      <h4 class="card-title">{{ title }}</h4>
      <p class="card-value">{{ formatValue(value) }}</p>
      <div v-if="subtitle" class="card-subtitle">{{ subtitle }}</div>
      <div v-if="trend" class="card-trend" :class="trendClass">
        <i :class="trendIcon"></i>
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

const cardVariant = computed(() => `variant-${props.variant}`);

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

const trendIcon = computed(() => {
  if (!props.trendDirection) return "fas fa-minus";
  switch (props.trendDirection) {
    case "up":
      return "fas fa-arrow-up";
    case "down":
      return "fas fa-arrow-down";
    default:
      return "fas fa-minus";
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
/* =========== Professional Admin Dashboard Card =========== */

.dashboard-card {
  background: #ffffff;
  padding: 1.75rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
  position: relative;
  min-height: 100px;
}



/* Card Base */
.card-icon {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
  position: relative;
}

/* Unified Blue Theme - Tourism Professional */
.variant-primary,
.variant-success,
.variant-warning,
.variant-danger,
.variant-info {
  border-left: 4px solid #3b82f6;
}

.variant-primary .card-icon,
.variant-success .card-icon,
.variant-warning .card-icon,
.variant-danger .card-icon,
.variant-info .card-icon {
  background: #3b82f6;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
}

/* Hover effect for all variants */
.dashboard-card:hover {
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.12);
  border-color: #3b82f6;
}

.card-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-title {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #64748b;
  margin: 0 0 0.375rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1.2;
}

.card-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.375rem 0;
  line-height: 1;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.card-subtitle {
  font-size: 0.8125rem;
  color: #64748b;
  margin-bottom: 0.5rem;
  line-height: 1.3;
  font-weight: 400;
}

.card-trend {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: #f8fafc;
  width: fit-content;
}

.trend-up {
  color: #3b82f6;
  background: #eff6ff;
}

.trend-down {
  color: #64748b;
  background: #f1f5f9;
}

.trend-neutral {
  color: #64748b;
  background: #f1f5f9;
}

.card-trend i {
  font-size: 0.625rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-card {
    padding: 1.25rem;
    gap: 1rem;
    min-height: 85px;
  }

  .card-icon {
    width: 48px;
    height: 48px;
    font-size: 1.25rem;
  }

  .card-value {
    font-size: 1.75rem;
  }

  .card-title {
    font-size: 0.75rem;
  }

  .card-subtitle {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .dashboard-card {
    padding: 1rem;
    gap: 0.875rem;
    min-height: 75px;
  }

  .card-icon {
    width: 44px;
    height: 44px;
    font-size: 1.125rem;
  }

  .card-value {
    font-size: 1.5rem;
  }

  .card-trend {
    font-size: 0.6875rem;
    padding: 0.1875rem 0.375rem;
  }
}
</style>
