import {combineReducers} from "redux";
import NotificationReducer from "./NotificationReducer";
import AppReducer from "./AppReducer";
import DashboardReducer from "./DashboardReducer";
import UserReducer from "./UserReducer";
import OyespaceReducer from "./OyespaceReducer";
import PatrollingReducer from "./PatrollingReducer";
import StaffReducer from "./StaffReducer";
import JoinAssociationReducer from "./JoinAssociationReducer";
import SubscriptionReducer from "./SubscriptionReducer";

export default combineReducers({
    NotificationReducer: NotificationReducer,
    AppReducer: AppReducer,
    DashboardReducer: DashboardReducer,
    UserReducer: UserReducer,
    OyespaceReducer: OyespaceReducer,
    PatrollingReducer: PatrollingReducer,
    StaffReducer: StaffReducer,
    JoinAssociationReducer: JoinAssociationReducer,
    SubscriptionReducer:SubscriptionReducer

});
