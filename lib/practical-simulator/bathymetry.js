// Training bathymetry interface. Values must be replaced by validated chart-derived data before certification.
export function trainingDepthAt(lat,lon){const axis=-43.17+(lat+22.90)*.18;const cross=Math.abs(lon-axis);const channel=18-Math.min(11,cross*95);const northPenalty=Math.max(0,(lat+22.91)*55);return Math.max(3.5,channel-northPenalty)}
export const DEPTH_DATA_STATUS="TRAINING_MODEL_NOT_CHART_DERIVED";
