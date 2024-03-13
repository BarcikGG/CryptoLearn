import React from 'react';
import { View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const ChartComponent = ({ data }: any) => {
    if (!data || !data.prices) {
        return <View />;
    }

    const marketCaps = data.prices;
    console.log(marketCaps);
    const chartData = {
        labels: marketCaps.map((item: (string | number | Date)[]) => new Date(item[0]).toLocaleTimeString()),
        datasets: [
        {
            data: marketCaps.map((item: any) => item[1]),
        },
        ],
    };

  return (
    <View>
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width}
        height={220}
        yAxisLabel="$"
        yAxisSuffix="k"
        yAxisInterval={1}
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
            r: '6',
            strokeWidth: '2',
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