
import React, { Component, Fragment } from 'react';

import PropTypes from 'prop-types';

import PrismaCmsPageLayout from "@prisma-cms/front/lib/modules/pages/layout";
 

export default class PageLayout extends PrismaCmsPageLayout {


  getPaginationParams() {

    const {
      first,
    } = this.props;


    const page = this.getPage();

    const skip = page > 1 && first > 0 ? (page - 1) * first : undefined;

    return {
      page,
      skip,
      first,
    }
  }
  

  getFilters() {

    const {
      uri,
    } = this.context;


    let {
      page,
      ...filters
    } = uri.query(true);

    // let {
    //   status_in,
    // } = uri.query(true);

    // if(status_in && !Array.isArray(status_in)){
    //   status_in = [status_in];
    // }



    // let filters = {
    //   status_in,
    // };

    return filters;
  }


  setFilters(filters) {


    const {
      uri,
      router: {
        history,
      },
    } = this.context;

    let newUri = uri.clone();

    let query = newUri.query(true);

    Object.assign(query, {
      ...filters,
    });

    newUri.query(query);

    history.push(newUri.toString());
  }


  render(content) {

    return content === null ? null : super.render(<div
      style={{
        padding: "20px 10px",
        maxWidth: 1260,
        margin: "0 auto",
      }}
    >
      {content}
    </div>);
  }

}