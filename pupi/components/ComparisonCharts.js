import {
    SafeAreaView,
    StyleSheet,
    Text,
    Dimensions,
    View,
    ScrollView
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import {Realm} from '@realm/react';
import {Session} from '../models/Session';
import {Tag} from '../models/Tag';
import {SessionRealmContext} from '../models';
const {useRealm, useQuery, useObject} = SessionRealmContext;

import { useState } from 'react';

import {
    LineChart,
    BarChart,
  } from "react-native-chart-kit";

const formatDate = d => [
(d.getMonth() + 1).toString().padStart(2, '0'),
d.getDate().toString().padStart(2, '0')
].join('/');

function map_to_array(map, arr) {
    for (let value of map.values()) {
        arr.push(value);
    }
}
  

function ComparisonCharts({route, navigation}) {
    // Tag states
    const tags = useQuery(Tag);

    const [open1, setOpen1] = useState(false);
    const [value1, setValue1] = useState("");
    const [items1, setItems1] = useState(tags);

    const [open2, setOpen2] = useState(false);
    const [value2, setValue2] = useState("");
    const [items2, setItems2] = useState(tags);

    const schema = {
        label: 'name',
        value: 'name',
    };


    
    // Chart states
    const now = new Date();
    const start = new Date(now.getTime() - 1209600000);  // subtract two weeks
    const end = now;
    let start_millis = start.getTime() + 86400000;


    const pu_hist1 = new Map();
    const pu_hist2 = new Map();

    const pu_count1 = new Map();
    const pu_count2 = new Map();
    const pi_count1 = new Map();
    const pi_count2 = new Map();
    

    // propagate dates
    let first_week_label = "";
    let second_week_label = "";
    for (let d = 0; d < 14; d++) {
        const day = new Date(start_millis);
        const key = formatDate(day);
        if (d == 0) {
            first_week_label = key;
        }
        if (d == 7) {
            second_week_label = key;
        }
        pu_count1.set(key, 0);
        pu_count2.set(key, 0);
        pi_count1.set(key, 0);
        pi_count2.set(key, 0);
        start_millis += 86400000;
    }
    
    // propagate histogram
    for (let type = 1; type <= 7; type++) {
        pu_hist1.set(type, 0);
        pu_hist2.set(type, 0);
    }

    function fill_maps(tag_name, pu_count, pu_hist, pi_count) {
        const tag_object = tags.filtered("name == $0", tag_name)[0];
        const within_range = tag_object['rel_sessions'].filtered("timestamp > $0 AND timestamp < $1", start, end);

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
    }

    let pu_hist_data1 = [];
    let pu_hist_data2 = [];
    
    let pu_data1 = [];
    let pu_data2 = [];
    let pi_data1 = [];
    let pi_data2 = [];


    if ((value1 != "") && (value2 != "") && (value1 != value2)) {
        fill_maps(value1, pu_count1, pu_hist1, pi_count1);
        fill_maps(value2, pu_count2, pu_hist2, pi_count2);
        map_to_array(pu_count1, pu_data1);
        map_to_array(pu_count2, pu_data2);
        map_to_array(pi_count1, pi_data1);
        map_to_array(pi_count2, pi_data2);
        map_to_array(pu_hist1, pu_hist_data1);
        map_to_array(pu_hist2, pu_hist_data2);
    }
    const puHistData = {
        labels: ['1', '2', '3', '4', '5', '6', '7'],
        datasets: [
          {
            data: pu_hist_data1,
            color: (opacity = 1) => `rgba(0, 190, 248, ${opacity})`,
            strokeWidth: 2,
          },
          {
            data: pu_hist_data2,
            color: (opacity = 1) => `rgba(248, 0, 190, ${opacity})`,
            strokeWidth: 2,
          }
        ],
        legend: [value1, value2],
    };
    const puData = {
        labels: [first_week_label, second_week_label],
        datasets: [
          {
            data: pu_data1,
            color: (opacity = 1) => `rgba(0, 190, 248, ${opacity})`,
            strokeWidth: 2 
          },
          {
            data: pu_data2,
            color: (opacity = 1) => `rgba(248, 0, 190, ${opacity})`,
            strokeWidth: 2 
          },
        ],
        legend: [value1, value2],
    };
    const piData = {
        labels: [first_week_label, second_week_label],
        datasets: [
          {
            data: pi_data1,
            color: (opacity = 1) => `rgba(0, 190, 248, ${opacity})`,
            strokeWidth: 2 
          },
          {
            data: pi_data2,
            color: (opacity = 1) => `rgba(248, 0, 190, ${opacity})`,
            strokeWidth: 2
          },
        ],
        legend: [value1, value2],
    };

    const screenWidth = Dimensions.get("window").width;
    const chartConfig = {
        backgroundGradientFrom: "#FFFFFF",
        backgroundGradientFromOpacity: 1,
        backgroundGradientTo: "#FFFFFF",
        backgroundGradientToOpacity: 1,
        useShadowColorFromDataset: true,
        
        color: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
        decimalPlaces: 1,
    };

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <DropDownPicker
                    open={open1}
                    value={value1}
                    items={items1}
                    setOpen={setOpen1}
                    setValue={setValue1}
                    setItems={setItems1}
                    style={styles.dropdown1}
                    listMode="MODAL"
                    schema={schema}
                    placeholder="Choose tag 1"
                />
                <DropDownPicker
                    open={open2}
                    value={value2}
                    items={items2}
                    setOpen={setOpen2}
                    setValue={setValue2}
                    setItems={setItems2}
                    style={styles.dropdown2}
                    listMode="MODAL"
                    schema={schema}
                    placeholder="Choose tag 2"
                />
            </View>
            <ScrollView>
                { ((value1 != "") && (value2 != "") && (value1 != value2)) ? // conditional
                <>
                <View style={styles.item}>
                    <Text style={styles.titleText}>Histogram of Bristol Stool Types in the Past 2 Weeks</Text>
                </View>
                <LineChart
                    bezier
                    data={puHistData}
                    width={screenWidth}
                    height={200}
                    chartConfig={chartConfig}
                    style={{
                        borderRadius: 20,
                        marginBottom: 30,
                    }}
                />
                <View style={styles.item}>
                    <Text style={styles.titleText}>Count of Daily Pu in the Past 2 Weeks</Text>
                </View>
                <LineChart
                    bezier
                    data={puData}
                    width={screenWidth}
                    height={200}
                    chartConfig={chartConfig}
                    style={{
                        borderRadius: 20,
                        marginBottom: 30,
                    }}
                />
                <View style={styles.item}>
                    <Text style={styles.titleText}>Count of Daily Pi in the Past 2 Weeks</Text>
                </View>
                <LineChart
                    bezier
                    data={piData}
                    width={screenWidth}
                    height={200}
                    chartConfig={chartConfig}
                    style={{
                        borderRadius: 20,
                        marginBottom: 30,
                    }}
                />
                </>
                
                : // if the tags are not selected or not equal
                <Text> Select two non-equal tags.</Text>}

            </ScrollView>

            
        </SafeAreaView>
    );
}

export default ComparisonCharts;


const styles = StyleSheet.create({
    dropdown1: {
        backgroundColor: 'rgba(0, 190, 248, 0.05)',
        borderColor: 'rgba(0, 190, 248, 1)',
    },
    dropdown2: {
        backgroundColor: 'rgba(248, 0, 190, 0.05)',
        borderColor: 'rgba(248, 0, 190, 1)',
    },
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
});