
import React, { Fragment } from "react";

import PropTypes from "prop-types";

import {
  DiagramEngine,
  DiagramModel as DiagramModelBase,
  DefaultNodeModel,
  LinkModel,
  DiagramWidget,
  DefaultLinkModel,
  NodeModel,
  DefaultPortModel,
  DefaultLinkFactory,
} from "storm-react-diagrams";



import Panel from "./Panel";


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

export class DemoWorkspaceWidget extends React.Component {

  static propTypes = {
    buttons: PropTypes.object,
  }

  state = {};

  render() {
    return (
      <div className="srd-demo-workspace">
        <div className="srd-demo-workspace__toolbar">{this.props.buttons}</div>
        <div className="srd-demo-workspace__content">{this.props.children}</div>
      </div>
    );
  }
}


export class AdvancedLinkModel extends DefaultLinkModel {
  constructor(isNew = true) {
    super("advanced");
    this.width = 3;
    this.isNew = isNew;
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
      <Fragment>
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
          r={5}
          fill="orange"
        />
      </Fragment>
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


class WidgetNodeModel extends DefaultNodeModel {

  // constructor(name, color) {
  //   console.log("WidgetNodeModel constructor", name, color);

  //   super(name, color)
  // }


  // setPosition(x, y) {

  //   console.log("WidgetNodeModel setPosition", x, y);
  //   super.setPosition(x, y);
  // }

}



export default (props) => {

  console.log("widget props", props);


  const action = console.log;

  const {
    id: diagramId,
    offsetX,
    offsetY,
    zoom,
    gridSize,
    // linksUpdated,
    // offsetUpdated,
    // zoomUpdated,
    // actionStillFiring,
    // selectionChanged,
    listeners,
    children,
    Nodes,
    actionStartedFiring,
    actionStillFiring,
    actionStoppedFiring,
    ...other
  } = props;

  React.Children.forEach(children, (child, childIndex) => {
    console.log("(child, childIndex)", child, childIndex);
  });

  //1) setup the diagram engine
  var engine = new DiagramEngine({
    // actionStartedFiring: e => console.log("actionStartedFiring e", e),
    // actionStillFiring: e => console.log("actionStillFiring e", e),
    // actionStoppedFiring: e => console.log("actionStoppedFiring e", e),
  });
  engine.installDefaultFactories();

  engine.registerLinkFactory(new AdvancedLinkFactory());

  // // create some nodes
  // var node11 = new DefaultNodeModel("Source", "rgb(0,11922,2255)");
  // let port11 = node11.addPort(new AdvancedPortModel(false, "out-11", "Out thick"));
  // let port22 = node11.addPort(new AdvancedPortModel(false, "out-22", "Out default"));
  // node11.setPosition(1100, 1100);

  // var node22 = new DefaultNodeModel("Target", "rgb(11922,2255,0)");
  // var port33 = node22.addPort(new AdvancedPortModel(true, "in-11", "In thick"));
  // var port44 = node22.addPort(new AdvancedPortModel(true, "in-22", "In default"));
  // node22.setPosition(3300, 1100);

  //2) setup the diagram model
  var model = new DiagramModel({
    offsetX,
    offsetY,
    gridSize,
    zoom,
    // actionStartedFiring: e => console.log("actionStartedFiring e", e),
    // actionStillFiring: e => console.log("actionStillFiring e", e),
    // actionStoppedFiring: e => console.log("actionStoppedFiring e", e),
  });

  if (diagramId) {
    model.id = diagramId;
  }


  console.log("DiagramModel Nodes", Nodes);

  let portsIn = [];
  let portsOut = [];

  Nodes.map(n => {

    let {
      id,
      x,
      y,
      name,
      color,
      PortsIn,
      PortsOut,
      Building,
      Checkpoint,
    } = n;

    if (!color) {

      if (Building) {
        color = "rgb(0,192,255)";
      }
      else if (Checkpoint) {
        color = "rgb(9, 197, 88)";
      }
    }

    let node = new WidgetNodeModel(name, color || "rgb(150,192,255)");


    model.addListener({
      actionStartedFiring: (a) => console.log('Node actionStartedFiring', a),
      actionStillFiring: (a) => console.log('Node actionStillFiring', a),
    });

    Object.assign(node, {
      id,
      x,
      y,
    });

    // console.log("node", node);

    // node.addListener({

    // });


    PortsIn && PortsIn.map(n => {

      const {
        id,
        name,
      } = n;

      let port = node.addPort(new AdvancedPortModel(true, name));

      Object.assign(port, {
        id,
      });

      port.addListener({
        actionStartedFiring: (a) => console.log('Port actionStartedFiring', a),
        actionStillFiring: (a) => console.log('Port actionStillFiring', a),
      });

      portsIn.push(port);

      // model.addAll(port);
    });


    PortsOut && PortsOut.map(n => {

      const {
        id,
        name,
      } = n;

      let port = node.addPort(new AdvancedPortModel(false, name));

      Object.assign(port, {
        ...n,
      });


      portsOut.push(port);

      // model.addAll(port);
    });


    model.addAll(node);

  });


  // const link1 = port1.link(port4);

  console.log("portsOut", portsOut);


  /**
   * Проходимся по всем портам исходящим и находим в них ссылки на входящие порты
   */
  portsOut.map(portOut => {

    const {
      Links,
    } = portOut;

    Links && Links.map(n => {

      console.log("Links", n);

      const {
        PortIn,
      } = n;

      const {
        id: portInId,
      } = PortIn;

      let portIn = portsIn.find(n => n.id === portInId);

      console.log("Links portIn", portIn);

      if (portIn) {

        const link = portOut.link(portIn);

        model.addAll(link);
      }

    });

  });


  // console.log("DiagramModel props", props);

  // console.log("DiagramModel", model);

  model.addListener({
    ...listeners,

    // // // linksUpdated:   this.onUpdateLinks.bind(this),
    // // // offsetUpdated:  _.debounce(this.updateOffset.bind(this),500),
    // // // zoomUpdated:    this.updateZoom.bind(this),
    // // linksUpdated: data => console.log("linksUpdated", data),
    // // offsetUpdated: data => console.log("offsetUpdated", data),
    // // zoomUpdated: data => console.log("zoomUpdated", data),
    nodesUpdated: data => console.log("nodesUpdated", data),
    // // // offsetUpdated: canEdit ? data => this.onOffsetUpdated(data) : undefined,
    // // // offsetUpdated: data => console.log("offsetUpdated", data),
    // // // zoomUpdated: canEdit ? data => this.onZoomUpdated(data) : undefined,
    // // // zoomUpdated: data => this.onZoomUpdated(data),
    // // // zoomUpdated: data => this.onZoomUpdated({
    // // //   zoom: 95,
    // // // }),
    // // actionStillFiring: (a) => console.log(a),

    // linksUpdated,
    // offsetUpdated,
    // zoomUpdated,
    // actionStillFiring,
  });


  // // create four nodes in a way that straight links wouldn't work
  // const node1 = new DefaultNodeModel("Node A", "rgb(0,192,255)");
  // const port1 = node1.addPort(new AdvancedPortModel(false, "out-1", "Out"));
  // node1.setPosition(100, 0);

  // const node2 = new DefaultNodeModel("Node B", "rgb(255,99,66)");
  // const port2 = node2.addPort(new AdvancedPortModel(false, "out-1", "Out"));
  // node2.setPosition(240, 80);
  // const node3 = new DefaultNodeModel("Node C", "rgb(192,255,255)");
  // const port3 = node3.addPort(new AdvancedPortModel(true, "in-1", "In"));
  // node3.setPosition(540, 180);
  // const node4 = new DefaultNodeModel("Node D", "rgb(192,0,255)");
  // const port4 = node4.addPort(new AdvancedPortModel(true, "in-1", "In"));
  // node4.setPosition(120, 120);
  // const node5 = new DefaultNodeModel("Node E", "rgb(192,255,0)");
  // node5.setPosition(250, 180);

  // // linking things together
  // const link1 = port1.link(port4);
  // const link2 = port2.link(port3);

  // // add all to the main model
  // model.addAll(node1, node2, node3, node4, node5, link1, link2);


  // let kpp1 = new DefaultNodeModel("КПП 1 (Пеш)", "rgb(0,192,255)");
  // kpp1.setPosition(0, 50);

  // let kpp2 = new DefaultNodeModel("КПП 2 (Авто)", "rgb(255,99,66)");
  // kpp2.setPosition(0, 200);

  // const kpp2port1In = kpp2.addPort(new AdvancedPortModel(true, "in-1", "Въезд"));
  // const kpp2port1Out = kpp2.addPort(new AdvancedPortModel(false, "out-1", "Выезд"));


  // let kpp3 = new DefaultNodeModel("КПП 3 (Пеш)", "rgb(0,192,255)");
  // kpp3
  //   .setPosition(700, 50);

  // let kpp4 = new DefaultNodeModel("КПП 4 (Авто)", "rgb(255,99,66)");
  // kpp4.setPosition(700, 200);


  // const building1 = new DefaultNodeModel("Здание 1", "rgb(192,0,255)");
  // building1.setPosition(350, 50);


  // const building2 = new DefaultNodeModel("Здание 2", "rgb(192,0,255)");
  // building2.setPosition(350, 150);
  // const building2port1In = building2.addPort(new AdvancedPortModel(true, "in-1", "Вход"));



  // // const building3 = new DefaultNodeModel("Здание 3", "rgb(192,0,255)");
  // // building3.setPosition(350, 150);

  // const kpp1port1In = kpp1.addPort(new AdvancedPortModel(true, "in-1", "Вход"));
  // const kpp1port1Out = kpp1.addPort(new AdvancedPortModel(false, "out-1", "Выход"));
  // // const kpp1port1Out = kpp1.addPort(new AdvancedPortModel(false, "out-1", "Выход"));
  // // const kpp1port2Out = kpp1.addPort(new AdvancedPortModel(false, "out-2", "Выход"));

  // // const link1 = kpp1port1.link(port4);

  // const building1port1In = building1.addPort(new AdvancedPortModel(true, "in-1", "Вход"));


  // model.addAll(
  //   kpp1,
  //   kpp2,
  //   kpp3,
  //   kpp4,
  //   building1,
  //   building2,
  //   // building3,

  //   kpp1port1Out.link(building1port1In),
  //   // kpp1port2Out,
  //   building2port1In,

  //   kpp2port1In,
  //   kpp2port1Out,
  // );

  // load model into engine and render
  engine.setDiagramModel(model);

  // return (<DiagramWidget
  //   className="srd-demo-canvas"
  //   diagramEngine={engine}
  //   smartRouting={true}
  //   maxNumberPointsPerLink={0}
  // />
  // );

  return (
    <Fragment>
      <Panel
        diagramId={diagramId}
      />
      <DiagramWidget
        className="srd-demo-canvas"
        diagramEngine={engine}
        smartRouting={true}
        maxNumberPointsPerLink={0}
        actionStartedFiring={actionStartedFiring}
        actionStillFiring={actionStillFiring}
        actionStoppedFiring={actionStoppedFiring}
      // actionStillFiring={e => console.log("actionStillFiring e", e)}
      // actionStoppedFiring={e => console.log("actionStoppedFiring e", e)}
      />
    </Fragment>
  );


};
