import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import {
  styles,
  TableView as TableViewProto,
} from 'apollo-cms/lib/DataView/List/Table';

import { withStyles } from 'material-ui/styles';


class TableView extends TableViewProto {


  static defaultProps = {
    ...TableViewProto.defaultProps,
    columnData: [],
  };


  renderContent() {

    return super.render();
  }


  componentDidMount() {

    const {
      data,
    } = this.props;


    const {
      loading,
      refetch,
    } = data || {}

    // console.log("componentDidMount loading", loading);

    /**
     * Если при монтировании загрузка не выполняется,
     * это значит, документ из кеша взять. Надо перезагрузить данные
     */
    if (loading === false && refetch) {
      refetch();
    }

    super.componentDidMount && super.componentDidMount();
  }
  

  render() {

    const {
      Pagination,
    } = this.context;


    const {
      data: {
        objectsConnection,
        loading,
        variables: {
          first: limit,
        },
      },
      page,
    } = this.props;


    const {
      edges,
      aggregate,
    } = objectsConnection || {};


    const {
      count = 0,
    } = aggregate || {};


    return <Fragment>
      {this.renderContent()}

      {limit && count ?
        <Pagination
          limit={limit}
          total={count}
          page={page || 1}
          style={{
            marginTop: 20,
          }}
        />
        : null
      }

    </Fragment>
  }

}


export {
  styles,
  TableView,
}

export default withStyles(styles)(props => <TableView
  {...props}
/>);