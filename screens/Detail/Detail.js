import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'

const Detail = ({ route, navigation }) => {
  const { item } = route.params;
  console.log(item);
  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Text>Chi tiết</Text>
        </View>
        <View></View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Detail