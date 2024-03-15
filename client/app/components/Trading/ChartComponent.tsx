import React from 'react';
import { Dimensions, View } from 'react-native';
import moment from 'moment';
import { LineChart } from 'react-native-chart-kit';
import { primaryColor } from '../../constants/Colors';

export const {width: SIZE} = Dimensions.get('window');

const ChartComponent = ({ data }: any) => {
  if (!data) {
    return <View />;
  }

  const chartData = data && data.prices ? data.prices.map((item: any) => ({
    x: item[0],
    y: item[1],
  })) : [];

  console.log(chartData);

  return (
    <View style={{ height: SIZE / 2, flexDirection: 'row', width: SIZE }}>
      <LineChart
        data={{
          labels: ['date', 'price'],
          datasets: chartData,
        }}
        width={400}
        height={220}
        yAxisLabel="$"
        xAxisLabel="Date"
        xLabelsOffset={-10}
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: 6,
            strokeWidth: 2,
            stroke: '#ffa726',
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
};

export default ChartComponent;