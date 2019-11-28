/**
 * Created by Anooj Krishnan at Synclovis Systems Pvt. Ltd. on 2019-06-24
 */

import {Platform} from 'react-native'

const fonts = {
    thin: Platform.OS==='ios'?"HelveticaNeueThin":"HelveticaNeueIt",
    light: Platform.OS==='ios'?"HelveticaNeueLight":"HelveticaNeueLt",
    medium: Platform.OS==='ios'?"HelveticaNeueMedium":"HelveticaNeueMed",
    bold: Platform.OS==='ios'?"HelveticaNeueBold":"HelveticaNeueBd"
};

export default fonts;