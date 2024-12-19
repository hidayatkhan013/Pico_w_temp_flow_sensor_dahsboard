import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChartsScreen from './component/ChartsScreen';
import TableScreen from './component/TableScreen';
import ConnectionScreen from './component/ConnectionScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  const [db, setDb] = useState<any>(null);

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Connection">
          {() => <ConnectionScreen onConnect={setDb} />}
        </Tab.Screen>
        <Tab.Screen name="Charts">
          {() => <ChartsScreen db={db} />}
        </Tab.Screen>
        <Tab.Screen name="Table">
          {() => <TableScreen db={db} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
