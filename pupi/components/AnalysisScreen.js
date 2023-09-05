import {
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  View,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useState, useEffect } from 'react';
import {
  LineChart,
  BarChart,
} from "react-native-chart-kit";
import DropDownPicker from 'react-native-dropdown-picker';

import {Tag} from '../models/Tag';
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

function AnalysisScreen({route, navigation}) {
  const tags = useQuery(Tag);
  const [open, setOpen] = useState(false);
  const [chosen_tag, setValue] = useState('');
  const [tag_options, setItems] = useState(tags);

  // Credit: https://stackoverflow.com/a/72615754
  const selectValue = (currentValue) => {
    let chosenValue = typeof currentValue === 'function' ? currentValue() : currentValue;
    if (chosenValue === chosen_tag) {
        setValue('');
    } else {
        setValue(currentValue);
    }
  };

  // TODO: un-comment this line
  const now = new Date();

  // const now = new Date('2023-03-14T08:20');
  const sessions = useQuery(Session);

  const start = new Date(now.getTime() - 1209600000);  // subtract two weeks
  const end = now;
  
  let within_range = [];
  if (chosen_tag == "") {
    within_range = sessions.filtered("timestamp > $0 AND timestamp < $1", start, end);
  } else {
    const tag_object = tags.filtered("name == $0", chosen_tag);
    within_range = tag_object[0]['rel_sessions'].filtered("timestamp > $0 AND timestamp < $1", start, end);
  }

  const pu_count = new Map();
  const pi_count = new Map();
  const pu_hist = new Map();
  let start_millis = start.getTime() + 86400000; // add 24 hours

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
      stroke: '#ECECEC',
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

  const constipation_quip = "You tend to have more constipation-form stools! \
  Check that you're drinking enough liquids, or eating enough food and/or fiber.";

  let diarrhea_count = pu_hist_data[6] + pu_hist_data[5];
  const diarrhea_quip = `You've had diarrhea ${diarrhea_count} time(s) recently. ` + 
    "Be sure to replenish your hydration. Contact your healthcare provider " +
    "if it becomes more severe or frequent or if you develop symptoms like fever, vomiting, or black tarry stools.";

  const normal_quip = "The middle section of stool forms is most frequent, \
   which means you've been having normal stool. Congratulations!";

  const constipation_count = pu_hist_data[0] + pu_hist_data[1];
  const normal_count = pu_hist_data.reduce((a,b) => a + b, 0) - constipation_count - diarrhea_count;
  let constipation_flag = false;

  let histogram_quip = "";
  if (diarrhea_count > 0) {
    histogram_quip = diarrhea_quip;
  } else if (normal_count > constipation_count) {
    histogram_quip = normal_quip;
  } else {
    histogram_quip = constipation_quip;
    constipation_flag = true;
  }

  const avg_pu_freq_quip = `On average, you're defecating ${pu_avg} times a week. `;
  const lo_pu_freq_quip =  "This is on the lower end ";
  const mid_pu_freq_quip = "This is toward the middle ";
  const hi_pu_freq_quip = "This is on the upper end ";

  const very_lo_pu_freq_quip = "This is a low amount; are you eating enough, or perhaps forgetting to fill in our forms?";

  const tail_pu_freq_quip = "of the normal range for pu frequency (which is between 3 times a week to 3 times a day).";

  let pu_freq_quip = avg_pu_freq_quip;
  if (pu_avg < 3) {
    pu_freq_quip += very_lo_pu_freq_quip;
  } else if (pu_avg < 8) {
    pu_freq_quip += lo_pu_freq_quip + tail_pu_freq_quip;
  } else if (pu_avg < 15) {
    pu_freq_quip += mid_pu_freq_quip + tail_pu_freq_quip;
  } else {
    pu_freq_quip += hi_pu_freq_quip + tail_pu_freq_quip;
  }

  const avg_pi_freq_quip = `On average, you're urinating ${pi_avg} times a day. `;
  const lo_pi_freq_quip = "The normal amount is 6-7 times per day. Are you drinking enough liquids?";
  const normal_pi_freq_quip = "This is around the normal frequency of 6-7 times a day.";
  const hi_pi_freq_quip = "Most people urinate 6-7 times a day, but you seem extra hydrated, well done!";
  let dehydrate_flag = false;
  let pi_freq_quip = avg_pi_freq_quip;

  if (pi_avg < 4.5) {
    dehydrate_flag = true;
    pi_freq_quip += lo_pi_freq_quip;
  } else if (pi_avg < 8.5) {
    pi_freq_quip += normal_pi_freq_quip;
  } else {
    pi_freq_quip += hi_pi_freq_quip;
  }
  return (
    <SafeAreaView style={{flex: 1}}>
      <DropDownPicker
          open={open}
          value={chosen_tag}
          items={tag_options}
          setOpen={setOpen}
          setValue={selectValue}
          setItems={setItems}
          schema={{
            label: 'name',
            value: 'name',
          }}
          placeholder="Filter entries by tag"
        />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{padding: 10}}>
          
          <View style={styles.item}>
            <Text style={styles.titleText}>Histogram of Pu Shapes in the Past 2 Weeks</Text>
            <Text style={styles.descText}>{histogram_quip}</Text>
            {constipation_flag?
            <>
            <View style={styles.flexRow}>
              <Text style={styles.notifText}>Consider setting up reminders to take fiber supplements with your meals!</Text>
              <TouchableOpacity style={styles.notifButton} onPress={() => navigation.navigate('Reminders')}>
                <Ionicons name="notifications"  color={"white"} size={20} />
              </TouchableOpacity>
            </View>
            </>:
            <></>}
            <BarChart
              data={puHistData}
              width={screenWidth-50}
              height={200}
              chartConfig={puHistChartConfig}
              style={{
                paddingRight: 40,
              }}
              fromZero={true}
              showValuesOnTopOfBars={true}
              withInnerLines={false}
            />
          </View>
          <View style={styles.item}>
            <Text style={styles.titleText}>Count of Daily Pu in the Past 2 Weeks</Text>
            <Text style={styles.descText}>{pu_freq_quip}</Text>
            <LineChart
              data={puData}
              width={screenWidth-30}
              height={220}
              chartConfig={puChartConfig}
              style={{
                paddingRight: 40,
                marginRight: 10,
              }}
              fromZero={true}
            />
          </View>
          <View style={styles.lastItem}>
            <Text style={styles.titleText}>Count of Daily Pi in the Past 2 Weeks</Text>
            <Text style={styles.descText}>{pi_freq_quip}</Text>
            {dehydrate_flag?
            <>
            <View style={styles.flexRow}>
              <Text style={styles.notifText}>Consider setting up a daily reminder to stay hydrated!</Text>
              <TouchableOpacity style={styles.notifButton} onPress={() => navigation.navigate('Reminders')}>
                <Ionicons name="notifications"  color={"white"} size={20} />
              </TouchableOpacity>
            </View>
            </>:
            <></>}
            <LineChart
              data={piData}
              width={screenWidth-30}
              height={220}
              chartConfig={piChartConfig}
              style={{
                paddingRight: 40,
                marginRight: 10,
              }}
              fromZero={true}
            />
          </View>

      </ScrollView>
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate('Comparison')}>
        <Ionicons name="layers-outline"  color={"white"} size={20} />
          <Text style={styles.buttonText}>Compare Tags</Text>
        </TouchableOpacity>
      </View>
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
    borderRadius: 10,
    padding: 10,
    marginBottom: 20
  },
  lastItem: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 80
  },
  titleText: {
    color: 'black',
    fontSize: 16,
    paddingVertical: 10,
  },
  notifText: {
    flex: 1,
    color: '#888',
    fontSize: 14,
    paddingRight: 10,
  },
  descText: {
    color: '#888',
    fontSize: 14,
    paddingBottom: 10,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 16, 
    alignSelf: 'center', 
  },
  floatingButton: {
    flexDirection: 'row',
    backgroundColor: '#00bef8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  notifButton: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    backgroundColor: '#00bef8',
    padding: 6,
    borderRadius: 100,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  }
});