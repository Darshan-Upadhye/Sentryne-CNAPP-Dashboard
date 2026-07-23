import { BarChart3 } from 'lucide-react';

export default function EmptyWidget({ data }) {
  return (
    <div className="empty-widget">
      <BarChart3 size={30} strokeWidth={1.5} />
      <span>{data?.message || 'No graph data available!'}</span>
    </div>
  );
}
