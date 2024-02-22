import React, { useState } from 'react';
import { SafeAreaView, StatusBar, View, useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Clock from './screens/Clock/Clock';
import List from './screens/List/List';
import { createStackNavigator } from '@react-navigation/stack';

const ClockRoute = () => (
  <View style={{ flex: 1 }} >
    <Clock />
  </View>
);
const ListRoute = () => (
  <View style={{ flex: 1, backgroundColor: '#272727' }} >
    <List />
  </View>
);
const renderTabBar = (props) => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: '#d3d3d3' }}
    style={{ backgroundColor: '#4d4d4d' }}
  />
);
const renderScene = SceneMap({
  clock: ClockRoute,
  list: ListRoute,
});
const Stack = createStackNavigator();

export default function TabViewExample() {
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'clock', title: 'Clock' },
    { key: 'list', title: 'List' },
  ]);
  return (
    // <NavigationContainer>
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar hidden />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
      />
      {/* <Stack.Navigator>
          <Stack.Screen name="List" component={List} />
          <Stack.Screen name="Detail" component={Detail} />
        </Stack.Navigator> */}
    </SafeAreaView>
    // </NavigationContainer>
  );
}