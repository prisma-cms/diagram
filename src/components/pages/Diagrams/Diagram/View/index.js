
import React from "react";
import PropTypes from "prop-types";

import EditableView from 'apollo-cms/lib/DataView/Object/Editable';


import {
  MoveItemsAction,
  PointModel,
  NodeModel,
} from "storm-react-diagrams";

// import Widget from "./Widget/test";
import Widget from "./Widget";
import gql from "graphql-tag";
// import Node from "../../../../Node";

export class DiagramView extends EditableView {




  // async resetEdit() {

  //   await super.resetEdit();

  //   // await this.resetEdit__();

  //   this.initDiagram();

  // }


  canEdit() {

    const {
      user: currentUser,
    } = this.context;

    const {
      id: objectId,
      CreatedBy,
    } = this.getObjectWithMutations() || {};

    const {
      id: createdById,
    } = CreatedBy || {};

    const {
      id: currentUserId,
      sudo,
    } = currentUser || {};

    return !objectId || (createdById && createdById === currentUserId) || sudo ? true : false;
  }


  onOffsetUpdated(data) {

    // console.log("DiagramView onOffsetUpdated", data);

    const {
      offsetX,
      offsetY,
    } = data;

    this.updateObject({
      offsetX,
      offsetY,
    });

    return data;
  }


  onZoomUpdated(data) {

    // console.log("DiagramView onZoomUpdated", data);

    const {
      zoom,
    } = data;

    // console.log("DiagramView onZoomUpdated zoom", zoom);

    // this.updateObject({
    //   zoom,
    //   wefwe: "DSfsdf",
    // });

    this.updateObject({
      zoom,
    });

    return data;
  }



  // updateObject(data) {

  //   console.log("updateObject data", data);

  //   const {
  //     _dirty = {},
  //   } = this.state;

  //   const {
  //     localStorage,
  //   } = this.context;

  //   const newData = Object.assign({ ..._dirty }, data);


  //   console.log("updateObject newData", newData);

  //   const key = this.getCacheKey();

  //   if (key && newData && localStorage) {

  //     localStorage.setItem(this.getCacheKey(), JSON.stringify(newData));
  //   }

  //   this.state._dirty = { ...newData }

  //   // this.setState({
  //   //   _dirty: newData,
  //   // });

  //   console.log("updateObject _dirty", this._dirty);

  //   this.forceUpdate();

  // }



  actionStartedFiring = e => {

    if (e instanceof MoveItemsAction) {

      // console.log("actionStillFiring MoveItemsAction e", e);

    }
    else {

      console.log("actionStartedFiring e", e);
    }

    return e;
  }


  actionStillFiring = e => {


    if (e instanceof MoveItemsAction) {

      // console.log("actionStillFiring MoveItemsAction e", e);

    }
    else {

      console.log("actionStillFiring e", e);
    }

    return e;
  }


  actionStoppedFiring = e => {


    if (e instanceof MoveItemsAction) {

      // console.log("actionStoppedFiring MoveItemsAction e", e);

      this.onItemMoved(e);

    }
    else {

      console.log("actionStoppedFiring e", e)
    }
    console.log("actionStoppedFiring e", e)

    return e;
  }


  onItemMoved(e) {


    console.log("onItemMoved e", e)

    const {
      mouseX,
      mouseY,
      selectionModels,
    } = e;

    const {
      client,
      query: {
        updateDiagramNodeProcessor,
        createDiagramLinkProcessor,
      },
    } = this.context;




    selectionModels.map(n => {

      const {
        initialX,
        initialY,
        model,
      } = n;

      const {
        id,
        x,
        y,
      } = model;

      if (model instanceof NodeModel) {

        const mutation = gql(updateDiagramNodeProcessor);

        this.mutate({
          mutation,
          variables: {
            where: {
              id,
            },
            data: {
              // x: mouseX,
              // y: mouseY,
              x,
              y,
            },
          },
        });

      }
      else if (model instanceof PointModel) {

        console.log("onItemMoved PointModel e", e, model)

        const {
          parent: {
            sourcePort,
            targetPort,
          },
        } = model;


        if (sourcePort && targetPort) {

          const {
            id: portOutId,
          } = sourcePort;


          const {
            id: portInId,
          } = targetPort;


          const mutation = gql(createDiagramLinkProcessor);

          this.mutate({
            mutation,
            variables: {
              data: {
                PortOut: {
                  connect: {
                    id: portOutId,
                  },
                },
                PortIn: {
                  connect: {
                    id: portInId,
                  }
                },
              },
            },
          });

        }


      }


    });

  }



  renderDefaultView() {


    const canEdit = this.canEdit();

    const object = this.getObjectWithMutations();

    return <Widget
      actionStartedFiring={this.actionStartedFiring}
      actionStillFiring={this.actionStillFiring}
      actionStoppedFiring={this.actionStoppedFiring}
      {...object}
      {...{
        listeners: {
          // linksUpdated:   this.onUpdateLinks.bind(this),
          // offsetUpdated:  _.debounce(this.updateOffset.bind(this),500),
          // zoomUpdated:    this.updateZoom.bind(this),
          linksUpdated: data => console.log("linksUpdated", data),
          // offsetUpdated: data => console.log(data),
          // offsetUpdated: data => console.log("offsetUpdated", data),
          selectionChanged: data => console.log("selectionChanged", data),
          // zoomUpdated: canEdit ? data => this.onZoomUpdated(data) : undefined,
          // zoomUpdated: data => this.onZoomUpdated({
          //   zoom: 95,
          // }),
          // zoomUpdated: data => console.log("zoomUpdated", data),
          // actionStartedFiring: (a) => console.log('actionStartedFiring', a),
          // actionStillFiring: (a) => console.log('actionStillFiring', a),

          zoomUpdated: canEdit ? data => this.onZoomUpdated(data) : undefined,
          offsetUpdated: canEdit ? data => this.onOffsetUpdated(data) : undefined,
        },
      }}
    >
      {/* <Node
        color="red"
      />
      <Node
        color="blue"
      /> */}
    </Widget>

  }

  renderEditableView() {
    return this.renderDefaultView();
  }

  // shouldComponentUpdate(){
  //   return false;
  // }

}

export default DiagramView;
