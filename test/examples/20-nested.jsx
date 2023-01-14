// @flow
import _ from "lodash";
import * as React from "react";
import WidthProvider from '../../lib/components/WidthProvider';
import Responsive from '../../lib/ResponsiveReactGridLayout';
import type { OnLayoutChangeCallback, Breakpoint } from '../../lib/responsiveUtils';
import type { CompactType, Layout, LayoutItem, ReactChildren } from '../../lib/utils';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

type Props = {|
  className: string,
  cols: {[string]: number},
  onLayoutChange: Function,
  rowHeight: number,
|};
type State = {|
  currentBreakpoint: string,
  compactType: CompactType,
  mounted: boolean,
  layouts: {[string]: Layout},
  mainLayouts: {[string]: Layout}
|};

export default class ShowcaseLayout extends React.Component<Props, State> {
  static defaultProps: Props = {
    className: "layout",
    rowHeight: 30,
    onLayoutChange: function() {},
    cols: { lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }
  };

  state: State = {
    currentBreakpoint: "lg",
    compactType: "vertical",
    mounted: false,
    layouts: { lg: generateLayout() },
    mainLayouts: { lg: generateMainLayout() }
  };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  generateDOM(): ReactChildren {
    return _.map(this.state.layouts.lg, function(l, i) {
      return (
        <div key={i}>
          <span className="text">{i}</span>
        </div>
      );
    });
  }

  onBreakpointChange: (Breakpoint) => void = (breakpoint: Breakpoint) => {
    this.setState({
      currentBreakpoint: breakpoint
    });
  }

  onCompactTypeChange: () => void = () => {
    const { compactType: oldCompactType } = this.state;
    const compactType =
      oldCompactType === "horizontal"
        ? "vertical"
        : oldCompactType === "vertical"
        ? null
        : "horizontal";
    this.setState({ compactType });
  };

  onLayoutChange: OnLayoutChangeCallback = (layout, layouts) => {
    this.props.onLayoutChange(layout, layouts);
  };

  onNewLayout: EventHandler = () => {
    this.setState({
      layouts: { lg: generateLayout() }
    });
  };  

  onDrop: (layout: Layout, item: ?LayoutItem, e: Event) => void = (elemParams) => {
    alert(`Element parameters: ${JSON.stringify(elemParams)}`);
  };

  render(): React.Node {
    // eslint-disable-next-line no-unused-vars
    return (
      <div>
        <div>
          Current Breakpoint: {this.state.currentBreakpoint} (
          {this.props.cols[this.state.currentBreakpoint]} columns)
        </div>
        <div>
          Compaction type:{" "}
          {_.capitalize(this.state.compactType) || "No Compaction"}
        </div>
        <button onClick={this.onNewLayout}>Generate New Layout</button>
        <button onClick={this.onCompactTypeChange}>
          Change Compaction Type
        </button>
        <div
          className="droppable-element"
          draggable={true}
          unselectable="on"
          // this is a hack for firefox
          // Firefox requires some kind of initialization
          // which we can do by adding this attribute
          // @see https://bugzilla.mozilla.org/show_bug.cgi?id=568313
          onDragStart={e => e.dataTransfer.setData("text/plain", "")}
        >
          Droppable Element (Drag me!)
        </div>
        <ResponsiveReactGridLayout
          currentBreakpoint="lg"
          className="layout"          
          onLayoutChange={() => {}}
          cols={{ lg: 2, md: 2, sm: 2, xs: 2, xxs: 2 }}
          rowHeight={240}
          isDroppable={false}
          isBounded={true}
          draggableHandle=".container-draggable-handle"
          layouts={this.state.mainLayouts}
          onBreakpointChange={this.onBreakpointChange}
          onDrop={this.onDrop}
          // WidthProvider option
          measureBeforeMount={false}
          // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
          // and set `measureBeforeMount={true}`.
          useCSSTransforms={this.state.mounted}
          compactType={this.state.compactType}
          preventCollision={!this.state.compactType}
        >
            {[1,2,3,4].map(id => (
              <div key={id}>
                <span className="container-draggable-handle">drag</span>
                <ResponsiveReactGridLayout
                  {...this.props}                  
                  layouts={this.state.layouts}
                  onBreakpointChange={this.onBreakpointChange}
                  onLayoutChange={this.onLayoutChange}
                  onDrop={this.onDrop}
                  isBounded={true}
                  isDroppable={true}
                  droppingItem={{ i: "drop", w: 6, h: 2 }}
                  // WidthProvider option
                  measureBeforeMount={false}
                  // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
                  // and set `measureBeforeMount={true}`.
                  useCSSTransforms={this.state.mounted}
                  compactType={this.state.compactType}
                  preventCollision={!this.state.compactType}
                >
                  {this.generateDOM()}
                </ResponsiveReactGridLayout>
              </div>
            ))}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}

function generateMainLayout() {
  return _.map(_.range(0, 4), function(item, i) {    
    return {
      x: i % 2 ? 1 : 0,
      y: i % 2 ? 1 : 0,
      w: 1,
      h: 1,
      i: i.toString(),
    };
  });
}

function generateLayout() {
  return _.map(_.range(0, 4), function(item, i) {    
    return {
      x: i % 2 ? 6 : 0,
      y: i % 2 ? 1 : 0,
      w: 6,
      h: 2,
      i: i.toString(),
    };
  });
}

if (process.env.STATIC_EXAMPLES === true) {
  import("../test-hook.jsx").then(fn => fn.default(ShowcaseLayout));
}

console.log('main', generateMainLayout());