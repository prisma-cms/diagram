import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EditableView from 'apollo-cms/lib/DataView/Object/Editable';
import { Button } from 'material-ui';

class AddNode extends EditableView {

  static propTypes = {
    ...EditableView.propTypes,
    label: PropTypes.string.isRequired,
    inputProps: PropTypes.object.isRequired,
  };

  static defaultProps = {
    ...EditableView.defaultProps,
    data: {
      object: {},
    },
    mutate: async () => {
      console.error("mutate");
    },
  }

  state = {
    ...super.state,
    opened: false,
  }


  renderHeader() {
    return null;
  }


  canEdit() {
    return true;
  }


  renderDefaultView() {


    const {
      label,
    } = this.props;

    return <Button
      onClick={() => {
        this.updateObject({
          name: "",
        });
      }}
      size="small"
    >
      {label}
    </Button>;

  }


  renderEditableView() {

    const {
      Grid,
    } = this.context;

    const {
      label,
      inputProps,
    } = this.props;


    const object = this.getObjectWithMutations();

    const {
      name,
    } = object;

    return <Grid
      container
    >

      <Grid
        item
      >
        {this.getTextField({
          ...inputProps,
          name: "name",
        })}
      </Grid>

      <Grid
        item
      >
        {this.getButtons()}
      </Grid>

    </Grid>
      ;
  }

}


export default AddNode;