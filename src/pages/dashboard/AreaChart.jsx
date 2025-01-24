import { useSelector } from "react-redux";
import { AreaChart } from '@tremor/react';
import { Card } from "@material-tailwind/react";

export function AreaChartHero() {
  const { actionLogs } = useSelector((state) => state.groupdata);

  // Process action logs data for chart
  const createActions = actionLogs?.filter(log => log.action.includes('Create')).length || 0;
  const updateActions = actionLogs?.filter(log => log.action.includes('Update')).length || 0;
  const deleteActions = actionLogs?.filter(log => log.action.includes('Delete')).length || 0;
  const otherActions = actionLogs?.filter(log => !log.action.includes('Create') && !log.action.includes('Update') && !log.action.includes('Delete')).length || 0;

  const chartdata = [
    {
      date: 'Jan',
      'Create Actions': createActions,
      'Update Actions': updateActions,
      'Delete Actions': deleteActions,
      'Other Actions': otherActions,
    },
    {
      date: 'Feb',
      'Create Actions': createActions + 5,
      'Update Actions': updateActions + 3,
      'Delete Actions': deleteActions + 2,
      'Other Actions': otherActions + 4,
    },
    {
      date: 'Mar',
      'Create Actions': createActions + 8,
      'Update Actions': updateActions + 6,
      'Delete Actions': deleteActions + 4,
      'Other Actions': otherActions + 7,
    }
  ];

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-c-grays">
          System Activity Overview
        </h3>
      </div>
      
      <AreaChart
        className="h-80"
        data={chartdata}
        index="date"
        categories={['Create Actions', 'Update Actions', 'Delete Actions', 'Other Actions']}
        colors={['green', 'blue', 'red', 'purple']}
        valueFormatter={(number) => `${number} actions`}
        yAxisWidth={60}
        showLegend={true}
        showGridLines={true}
        showAnimation={true}
      />
    </Card>
  );
}
