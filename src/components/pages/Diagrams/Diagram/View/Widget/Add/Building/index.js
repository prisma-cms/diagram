import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Additem from "../";

class AddBuilding extends Additem {

  static defaultProps = {
    ...Additem.defaultProps,
    label: "Добавить здание",
  }



  // renderEditableView() {

  //   return this.getTextField({
  //     label: "Название здания",
  //   });
  // }

}


export default AddBuilding;