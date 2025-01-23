import { useSelector } from "react-redux";
import { AreaChart } from '@tremor/react';

export function AreaChartHero() {
  const { batches, courses } = useSelector((state) => state.groupdata);

  // Process data for chart
  const chartdata = [
    {
      category: 'Current',
      'Active Batches': batches?.batches?.filter(b => b.status === 'Active').length || 0,
      'Active Courses': courses?.courses?.filter(c => c.Status === 'Active').length || 0,
      'Total Students': batches?.batches?.reduce((acc, batch) => acc + (batch.totalSeats - batch.availableSeats), 0) || 0,
      'Available Seats': batches?.batches?.reduce((acc, batch) => acc + batch.availableSeats, 0) || 0,
    }
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
      Analytics Overview
      </h3>
      <AreaChart
        className="h-80"
        data={chartdata}
        index="category"
        categories={['Active Batches', 'Active Courses', 'Total Students', 'Available Seats']}
        colors={['#5570F1', '#7b9dff', '#4b5563', '#9ca3af']}
        valueFormatter={(number) => number.toString()}
        yAxisWidth={40}
      />
    </div>
  );
}
