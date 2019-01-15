import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Typography from "material-ui/Typography";


import Context from "@prisma-cms/context";

export class DiagramLink extends Component {


  static contextType = Context;

  render() {

    const {
      object,
      children,
      ...other
    } = this.props;


    if (!object) {
      return null;
    }

    const {
      Link,
    } = this.context;

    let {
      id,
      name,
    } = object;


    if (!id) {
      return null;
    }

    name = name || id;

    return <Link
      to={`/diagrams/${id}`}
      title={name}
      {...other}
    >
      {children || <Typography
        component="span"
      >
        {name}
      </Typography>}
    </Link>
  }
}


export default DiagramLink;