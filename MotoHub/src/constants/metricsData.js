export const VEHICLE_METRICS = [
    {
        id: "oil_change",
        name: "Oil Change",
        category: "engine",
        tracking_type: "km_interval",
        inputs: ["last_done_km", "interval_km"],
        default_interval: { interval_km: 3000 },
        unit: "km",
        iconName: "Droplet"
    },
    {
        id: "regular_service",
        name: "Regular Service",
        category: "service",
        tracking_type: "km_interval",
        inputs: ["last_done_km", "interval_km"],
        default_interval: { interval_km: 6000 },
        unit: "km",
        iconName: "Wrench"
    },
    {
        id: "air_filter",
        name: "Air Filter Change",
        category: "engine",
        tracking_type: "km_interval",
        inputs: ["last_done_km", "interval_km"],
        default_interval: { interval_km: 10000 },
        unit: "km",
        iconName: "Wind"
    },
    {
        id: "spark_plug",
        name: "Spark Plug Replacement",
        category: "engine",
        tracking_type: "km_interval",
        inputs: ["last_done_km", "interval_km"],
        default_interval: { interval_km: 12000 },
        unit: "km",
        iconName: "Zap"
    },
    {
        id: "coolant_change",
        name: "Coolant Change",
        category: "engine",
        tracking_type: "km_interval",
        inputs: ["last_done_km", "interval_km"],
        default_interval: { interval_km: 20000 },
        unit: "km",
        iconName: "Thermometer"
    },
    {
        id: "brake_fluid",
        name: "Brake Fluid Change",
        category: "safety",
        tracking_type: "km_interval",
        inputs: ["last_done_km", "interval_km"],
        default_interval: { interval_km: 20000 },
        unit: "km",
        iconName: "Activity" // Brake-like
    },
    {
        id: "fuel_filter",
        name: "Fuel Filter Replacement",
        category: "engine",
        tracking_type: "km_interval",
        inputs: ["last_done_km", "interval_km"],
        default_interval: { interval_km: 15000 },
        unit: "km",
        iconName: "Filter"
    },
    {
        id: "tyre_rotation",
        name: "Tyre Rotation",
        category: "tyres",
        tracking_type: "km_interval",
        inputs: ["last_done_km", "interval_km"],
        default_interval: { interval_km: 8000 },
        unit: "km",
        iconName: "RefreshCw"
    },
    {
        id: "battery_check",
        name: "Battery Check",
        category: "safety",
        tracking_type: "date_interval",
        inputs: ["last_done_date", "interval_months"],
        default_interval: { interval_months: 6 },
        unit: "months",
        iconName: "Battery"
    },
    {
        id: "tyre_pressure",
        name: "Tyre Pressure Check",
        category: "tyres",
        tracking_type: "date_interval",
        inputs: ["last_done_date", "interval_months"],
        default_interval: { interval_months: 1 },
        unit: "months",
        iconName: "Gauge"
    },
    {
        id: "insurance",
        name: "Insurance Renewal",
        category: "documents",
        tracking_type: "expiry_date",
        inputs: ["expiry_date"],
        unit: "date",
        iconName: "ShieldCheck"
    },
    {
        id: "puc",
        name: "PUC Renewal",
        category: "documents",
        tracking_type: "expiry_date",
        inputs: ["expiry_date"],
        unit: "date",
        iconName: "FileText"
    }
];
