/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-06-27
 */

import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import base from '../../base';

export default class EmptyView extends React.Component {
  static propTypes = {
    height: PropTypes.any,
    width: PropTypes.any,
    backgroundColor: PropTypes.string
  };
  static defaultProps = {
    height: '10%',
    width: '100%',
    backgroundColor: base.theme.colors.white
  };

  constructor(props) {
    super(props);
  }

  render() {
    console.log("EMPTY_VIEW",this.props.height,this.props.width)
    return (
      <View
        style={{
          height: this.props.height,
          width: this.props.width,
          backgroundColor: this.props.backgroundColor
        }}
      />
    );
  }
}
