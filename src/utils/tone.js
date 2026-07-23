const TONE_COLOR = {
  indigo: 'var(--indigo-600)',
  'indigo-faint': 'var(--indigo-100)',
  danger: 'var(--danger)',
  warning: 'var(--warning)',
  'warning-strong': 'var(--warning-strong)',
  success: 'var(--success)',
  neutral: 'var(--neutral)',
};

export const toneColor = (tone) => TONE_COLOR[tone] || 'var(--neutral)';

export const formatNumber = (value) =>
  typeof value === 'number' ? value.toLocaleString('en-US') : value;
