import React from 'react';
import {
  createStackNavigator,
  StackCardInterpolationProps,
} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {
  INITIAL,
  LOADING,
  HOME,
  CHOOSE_LOGIN,
  STATISTICS,
  USER_INFO,
  INPUT,
  SIGN_UP,
  SIGN_IN,
} from '../../constants/path';
import {
  Initial,
  Loading,
  ChooseLogin,
  Input,
  SignUp,
  SignIn,
} from '../../components/pages';
import Home from './Home';
import Statistics from './Statistics';
import UserInfo from './UserInfo';
import * as UiContext from '../../contexts/ui';
import {COLOR} from '../../constants/theme';
import {headerStyle, headerTintColor} from '../Header';

const Stack = createStackNavigator();
const ModalStack = createStackNavigator();
const ChooseLoginStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const HomeDrawer = createDrawerNavigator();
const StatisticsDrawer = createDrawerNavigator();

const forFade = ({current}: StackCardInterpolationProps) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const getActiveRouteName = (state: any): string => {
  if (!state || !state.routes) {
    return '';
  }
  const route = state.routes[state.index];
  if (route.state) {
    return getActiveRouteName(route.state);
  }
  return route.name;
};

const cardStyle = {
  backgroundColor: COLOR.MAIN,
};

const drawerStyle = {
  backgroundColor: COLOR.MAIN,
};

const drawerContentOptions = {
  activeTintColor: COLOR.PRIMARY,
  inactiveTintColor: COLOR.WHITE,
};

function HomeWithDrawer() {
  return (
    <HomeDrawer.Navigator
      initialRouteName={HOME}
      drawerStyle={drawerStyle}
      drawerContentOptions={drawerContentOptions}>
      <HomeDrawer.Screen name={HOME} component={Home} />
      <HomeDrawer.Screen name={USER_INFO} component={UserInfo} />
    </HomeDrawer.Navigator>
  );
}

function StatisticsWithDrawer() {
  return (
    <StatisticsDrawer.Navigator
      initialRouteName={STATISTICS}
      drawerStyle={drawerStyle}
      drawerContentOptions={drawerContentOptions}>
      <StatisticsDrawer.Screen name={STATISTICS} component={Statistics} />
      <StatisticsDrawer.Screen name={USER_INFO} component={UserInfo} />
    </StatisticsDrawer.Navigator>
  );
}

// TabBarController
function TabRoutes() {
  return (
    <Tab.Navigator
      initialRouteName={HOME}
      tabBarOptions={{
        inactiveTintColor: COLOR.WHITE,
        activeTintColor: COLOR.PRIMARY,
        style: {
          backgroundColor: COLOR.MAIN,
        },
      }}
      screenOptions={(props: any) => {
        const routeNeme = getActiveRouteName(props.route.state);
        return {
          tabBarVisible: routeNeme !== USER_INFO,
        };
      }}>
      <Tab.Screen name={HOME} component={HomeWithDrawer} />
      <Tab.Screen name={STATISTICS} component={StatisticsWithDrawer} />
    </Tab.Navigator>
  );
}

function TabWithModalRputes() {
  return (
    <ModalStack.Navigator
      mode="modal"
      headerMode="none"
      screenOptions={{cardStyle}}>
      <Stack.Screen name={HOME} component={TabRoutes} />
      <Stack.Screen name={INPUT} component={Input} />
    </ModalStack.Navigator>
  );
}

function ChooseLoginNavigator() {
  return (
    <ChooseLoginStack.Navigator
      initialRouteName={CHOOSE_LOGIN}
      screenOptions={{cardStyle, headerStyle, headerTintColor}}>
      <ModalStack.Screen
        name={CHOOSE_LOGIN}
        component={ChooseLogin}
        options={{title: 'Choose Login'}}
      />
      <ModalStack.Screen
        name={SIGN_IN}
        component={SignIn}
        options={{title: 'Sign In'}}
      />
      <ModalStack.Screen
        name={SIGN_UP}
        component={SignUp}
        options={{title: 'Sign Up'}}
      />
    </ChooseLoginStack.Navigator>
  );
}

// ボタンを押すと画面遷移する
function switchingAuthStatus(status: UiContext.Status) {
  switch (status) {
    case UiContext.Status.UN_AUTHORIZED:
      return (
        <Stack.Screen name={CHOOSE_LOGIN} component={ChooseLoginNavigator} />
      );
    case UiContext.Status.AUTHORIZED:
      return <Stack.Screen name={HOME} component={TabWithModalRputes} />;
    case UiContext.Status.FIRST_OPEN:
    default:
      return <Stack.Screen name={INITIAL} component={Initial} />;
  }
}

function AuthWithRoutes() {
  const uiContext = React.useContext(UiContext.Context);
  return (
    <Stack.Navigator
      initialRouteName={LOADING}
      headerMode="none"
      screenOptions={{cardStyleInterpolator: forFade}}>
      {uiContext.applicationState !== UiContext.Status.LOADING ? (
        switchingAuthStatus(uiContext.applicationState)
      ) : (
        <Stack.Screen name={LOADING} component={Loading} />
      )}
    </Stack.Navigator>
  );
}

export default AuthWithRoutes;
