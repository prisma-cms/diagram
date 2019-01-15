
import React from "react";
import PropTypes from "prop-types";

import EditableView from 'apollo-cms/lib/DataView/Object/Editable';

import {
  DiagramEngine,
  DiagramModel as DiagramModelBase,
  DefaultNodeModel,
  LinkModel,
  DefaultPortModel,
  DiagramWidget,
  LinkWidget,
  LinkProps,
  DefaultLinkWidget,
  DefaultLinkModel,
  DefaultLinkFactory
} from "storm-react-diagrams";
// import { action } from "@storybook/addon-actions";

import "storm-react-diagrams/dist/style.min.css";

export class AdvancedLinkModel extends DefaultLinkModel {
  constructor() {
    super("advanced");
    this.width = 10;
  }
}

export class AdvancedPortModel extends DefaultPortModel {
  createLinkModel() {
    return new AdvancedLinkModel();
  }
}

export class AdvancedLinkSegment extends React.Component {
  // path: SVGPathElement;
  // circle: SVGCircleElement;
  // callback: () => any;
  // percent: number;
  // handle: any;
  // mounted: boolean;

  constructor(props) {
    super(props);
    this.percent = 0;
  }

  componentDidMount() {
    this.mounted = true;
    this.callback = () => {
      if (!this.circle || !this.path) {
        return;
      }

      this.percent += 2;
      if (this.percent > 100) {
        this.percent = 0;
      }

      let point = this.path.getPointAtLength(this.path.getTotalLength() * (this.percent / 100.0));

      this.circle.setAttribute("cx", "" + point.x);
      this.circle.setAttribute("cy", "" + point.y);

      if (this.mounted) {
        requestAnimationFrame(this.callback);
      }
    };
    requestAnimationFrame(this.callback);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    return (
      <>
        <path
          ref={ref => {
            this.path = ref;
          }}
          strokeWidth={this.props.model.width}
          stroke="rgba(255,0,0,0.5)"
          d={this.props.path}
        />
        <circle
          ref={ref => {
            this.circle = ref;
          }}
          r={10}
          fill="orange"
        />
      </>
    );
  }
}

export class AdvancedLinkFactory extends DefaultLinkFactory {
  constructor() {
    super();
    this.type = "advanced";
  }

  getNewInstance(initialConfig) {
    return new AdvancedLinkModel();
  }

  generateLinkSegment(model, widget, selected, path) {
    return (
      <g>
        <AdvancedLinkSegment model={model} path={path} />
      </g>
    );
  }
}


class DiagramModel extends DiagramModelBase {

  constructor(props) {

    super(props);

    // this.links = {};
    // this.nodes = {};

    // this.offsetX = -100;
    // this.offsetY = 100;
    // this.zoom = 50;
    // this.rendered = false;
    // this.gridSize = 0;
    // console.log("DiagramModel props", props);
    Object.assign(this, { ...props });
  }

}


export class DiagramView extends EditableView {


  // constructor(props) {

  //   super(props);

  //   console.log("DiagramView constructor");

  //   this.state = {
  //     ...super.state,
  //     // diagramModel: new DiagramModel({ offsetX: 153.01807389520047, offsetY: 45.88437425910112 }),
  //   }

  //   console.log("const", this.getObjectWithMutations());

  // }


  // componentWillMount() {

  //   console.log("componentWillMount", this.getObjectWithMutations());

  //   super.componentWillMount && super.componentWillMount();
  // }

  componentDidMount() {

    // console.log("componentDidMount", this.getObjectWithMutations());

    this.initDiagram();

    super.componentDidMount && super.componentDidMount();
  }


  initDiagram() {

    // this.setState({
    //   diagramModel: new DiagramModel({ ...this.getObjectWithMutations() }),
    // });

    const canEdit = this.canEdit();

    // console.log("canEdit", canEdit);

    const diagramModel = new DiagramModel({ ...this.getObjectWithMutations() });

    // const diagramModel = new DiagramModel(object);

    //1) setup the diagram engine
    var engine = new DiagramEngine();
    engine.installDefaultFactories();
    engine.registerLinkFactory(new AdvancedLinkFactory());

    // create some nodes
    var node1 = new DefaultNodeModel("Source", "rgb(0,192,255)");
    let port1 = node1.addPort(new AdvancedPortModel(false, "out-1", "Out thick"));
    let port2 = node1.addPort(new DefaultPortModel(false, "out-2", "Out default"));
    node1.setPosition(100, 100);

    var node2 = new DefaultNodeModel("Target", "rgb(192,255,0)");
    var port3 = node2.addPort(new AdvancedPortModel(true, "in-1", "In thick"));
    var port4 = node2.addPort(new DefaultPortModel(true, "in-2", "In default"));
    node2.setPosition(300, 100);

    // var node3 = new DefaultNodeModel("Source", "rgb(0,192,255)");
    // node3.addPort(new AdvancedPortModel(false, "out-1", "Out thick"));
    // node3.addPort(new DefaultPortModel(false, "out-2", "Out default"));
    // node3.setPosition(100, 200);

    // console.log("node3", node3);

    // var node4 = new DefaultNodeModel("Target", "rgb(192,255,0)");
    // node4.addPort(new AdvancedPortModel(true, "in-1", "In thick"));
    // node4.addPort(new DefaultPortModel(true, "in-2", "In default"));
    // node4.setPosition(300, 200);


    diagramModel.addAll(port1.link(port3), port2.link(port4));

    // add everything else
    // diagramModel.addAll(node1, node2, node3, node4);
    diagramModel.addAll(node1, node2);

    // load model into engine
    engine.setDiagramModel(diagramModel);

    diagramModel.addListener({
      // linksUpdated:   this.onUpdateLinks.bind(this),
      // offsetUpdated:  _.debounce(this.updateOffset.bind(this),500),
      // zoomUpdated:    this.updateZoom.bind(this),
      linksUpdated: data => console.log(data),
      // offsetUpdated: data => console.log(data),
      offsetUpdated: canEdit ? data => this.onOffsetUpdated(data) : undefined,
      // offsetUpdated: data => console.log("offsetUpdated", data),
      // zoomUpdated: canEdit ? data => this.onZoomUpdated(data) : undefined,
      zoomUpdated: data => this.onZoomUpdated(data),
      // zoomUpdated: data => this.onZoomUpdated({
      //   zoom: 95,
      // }),
      // zoomUpdated: data => console.log("zoomUpdated", data),
      actionStillFiring: (a) => console.log(a),
    });

    console.log("diagramModel", diagramModel);


    this.setState({
      engine,
    });

  }



  // resetEdit() {

  //   this.clearCache();

  //   this.setState({
  //     inEditMode: false,
  //     _dirty: null,
  //   }, () => {

  //     this.initDiagram();
  //   });

  // }


  // resetEdit__() {


  //   return new Promise(resolve => {
  //     this.clearCache();

  //     this.setState({
  //       inEditMode: false,
  //       _dirty: null,
  //     }, resolve);

  //   });

  // }


  async resetEdit() {

    await super.resetEdit();

    // await this.resetEdit__();

    this.initDiagram();

  }


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


  renderDefaultView() {


    const canEdit = this.canEdit();

    const object = this.getObjectWithMutations();

    const {
      // diagramModel,
      engine,
    } = this.state;

    // if (!diagramModel) {
    //   return null;
    // }

    if (!engine) {
      return null;
    }

    // render the diagram!
    return <DiagramWidget
      className="srd-demo-canvas"
      diagramEngine={engine}
    />;
  }

  renderEditableView() {
    return this.renderDefaultView();
  }

  // shouldComponentUpdate(){
  //   return false;
  // }

}

export default DiagramView;
