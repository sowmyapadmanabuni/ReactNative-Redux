import InviteGuests from './InviteGuests.js';
import MyGuests from './MyGuest.js';
import QRCodeGeneration from './QRCodeGeneration.js';
import { createAppContainer, createStackNavigator } from 'react-navigation';

const MainNavigator = createStackNavigator(
  {
    MyGuests : {screen: MyGuests},
    InviteGuests : {screen: InviteGuests},
    QRCodeGeneration: {screen: QRCodeGeneration}
  }
  //, {
  //   defaultNavigationOptions: {
  //     headerTintColor: '#fff',
  //     header:null,
  //     headerStyle:{
  //       backgroundColor:'#b83227'
  //     },
  //     headerTitleStyle:{
  //       color:'#fff'
  //     }
  //   }
  // }
)

const App = createAppContainer(MainNavigator);
export default App;