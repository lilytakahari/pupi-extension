import {
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  View,
} from 'react-native';

import { useState, useEffect } from 'react';
import {
  LineChart,
  BarChart,
} from "react-native-chart-kit";

// Calendar
import {Session} from '../models/Session';
import {SessionRealmContext} from '../models';

const {useRealm, useQuery, useObject} = SessionRealmContext;

/* AnalysisScreen()
 * Description: Shows analysis of your pupi record.
 *
 */

const formatDate = d => [
  (d.getMonth() + 1).toString().padStart(2, '0'),
  d.getDate().toString().padStart(2, '0')
].join('/');

function AnalysisScreen(props) {
  // TODO: un-comment this line
  const now = new Date();
  // const now = new Date('2023-03-14T08:20');
  const sessions = useQuery(Session);

  const start = new Date(now.getTime() - 1209600000);  // subtract two weeks
  const end = now;
  const within_range = sessions.filtered("timestamp > $0 AND timestamp < $1", start, end);

  const month = (now.getMonth()+1).toString().padStart(2, '0');
  const day_int = now.getDate();

  const pu_count = new Map();
  const pi_count = new Map();
  const pu_hist = new Map();
  let start_millis = start.getTime() + 86400000;

  let first_week_label = "";
  let second_week_label = "";
  // populate map with keys for each day in the past 2 weeks
  for (let d = 0; d < 14; d++) {
    const day = new Date(start_millis);
    const key = formatDate(day);
    if (d == 0) {
      first_week_label = key;
    }
    if (d == 7) {
      second_week_label = key;
    }

    pu_count.set(key, 0);
    pi_count.set(key, 0);
    start_millis += 86400000;
  }
  for (let type = 1; type <= 7; type++) {
    pu_hist.set(type, 0);
  }
  
  for (let i = 0; i < within_range.length; i++) {
    const key = formatDate(within_range[i]['timestamp']);
    if (pu_count.has(key)) {
      if (within_range[i]['pupi_type'] == 'pu') {
        pu_count.set(key, pu_count.get(key) + 1);
        const pu_type = within_range[i]['stool_shape']
        pu_hist.set(pu_type, pu_hist.get(pu_type) + 1);
      } else {
        pi_count.set(key, pi_count.get(key) + 1);
      }
    }
  }
  const pu_hist_data = [];
  for (let value of pu_hist.values()){
    pu_hist_data.push(value);
  }
  const pi_data = [];
  for (let value of pi_count.values()){
    pi_data.push(value);
  }
  const pu_data = [];
  for (let value of pu_count.values()){
    pu_data.push(value);
  }
  console.log(pu_hist_data);
  console.log(pu_data);
  console.log(pi_data);
  const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length;
  const weekAvg = arr => arr.reduce((a,b) => a + b, 0) / 2;
  const pi_avg = arrAvg(pi_data).toFixed(2);
  const pu_avg = weekAvg(pu_data).toFixed(2);

  const screenWidth = Dimensions.get("window").width;
  const piData = {
    labels: [first_week_label, second_week_label],
    datasets: [
      {
        data: pi_data,
        color: (opacity = 1) => `rgba(252, 226, 116, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
  };
  const puData = {
    labels: [first_week_label, second_week_label],
    datasets: [
      {
        data: pu_data,
        strokeWidth: 2 // optional
      }
    ],
  };
  const puHistData = {
    labels: ['1', '2', '3', '4', '5', '6', '7'],
    datasets: [
      {
        data: pu_hist_data,
      }
    ],
  };
  const piChartConfig = {
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: "#FFFFFF",
    backgroundGradientToOpacity: 1,
    
    color: (opacity = 1) => `rgba(252, 226, 116, ${opacity})`,
    decimalPlaces: 1, // optional, defaults to 2dp
    labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
    propsForBackgroundLines: {
      stroke: '#DDDDDD',
    },
  };
  const puChartConfig = {
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: "#FFFFFF",
    backgroundGradientToOpacity: 1,
    
    color: (opacity = 1) => `rgba(171, 106, 75, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
    decimalPlaces: 1, // optional, defaults to 2dp
  };
  const puHistChartConfig = {
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: "#FFFFFF",
    backgroundGradientToOpacity: 1,
    
    color: (opacity = 1) => `rgba(156, 67, 26, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
    decimalPlaces: 1, // optional, defaults to 2dp
    barPercentage: 0.7,
  };
  // ^^^^^^^^^


  return (
    <SafeAreaView>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic">
          
          <View style={styles.item}>
            <Text style={styles.titleText}>Histogram of Bristol Stool Types in the Past 2 Weeks</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.descText}>You tend to have more constipation-form stools!
            Check that you're drinking enough liquids and/or eating enough fiber.</Text>
          </View>
          <BarChart
            data={puHistData}
            width={screenWidth}
            height={200}
            chartConfig={puHistChartConfig}
            style={{
              borderRadius: 20,
              paddingRight: 50,
              marginBottom: 30,
            }}
            fromZero={true}
            showValuesOnTopOfBars={true}
            withInnerLines={false}
          />
          <View style={styles.item}>
            <Text style={styles.titleText}>Count of Daily Pu in the Past 2 Weeks</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.descText}>On average, you're defecating {pu_avg} times a week. 
            This is on the lower end of the normal range for pu frequency (which is between 3 times a week to 3 times a day).</Text>
          </View>
          <LineChart
            data={puData}
            width={screenWidth}
            height={220}
            chartConfig={puChartConfig}
            style={{
              borderRadius: 20,
              marginBottom: 30,
            }}
            fromZero={true}
          />
          <View style={styles.item}>
            <Text style={styles.titleText}>Count of Daily Pi in the Past 2 Weeks</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.descText}>On average, you're only urinating {pi_avg} times a day.
             The normal amount is 6-7 times per day. Are you drinking enough liquids?</Text>
          </View>
          <LineChart
            data={piData}
            width={screenWidth}
            height={220}
            chartConfig={piChartConfig}
            style={{
              borderRadius: 20,
            }}
            fromZero={true}
          />

      </ScrollView>
    </SafeAreaView>
  );
}

export default AnalysisScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 20,
    padding: 10,
  },
  titleText: {
    color: '#888',
    fontSize: 16,
  },
  descText: {
    color: '#888',
    fontSize: 14,
  },
});