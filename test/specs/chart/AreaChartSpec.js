import React from 'react';
import { expect } from 'chai';
// eslint-disable-next-line import/no-unresolved
import { AreaChart, Area, XAxis, YAxis, Tooltip, Brush, CartesianAxis } from 'recharts';
import { mount } from 'enzyme';
import sinon from 'sinon';

/* eslint-disable max-len */

const data = [
  { name: 'Page A', uv: 400, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 300, pv: 4567, amt: 2400 },
  { name: 'Page C', uv: 300, pv: 1398, amt: 2400 },
  { name: 'Page D', uv: 200, pv: 9800, amt: 2400 },
  { name: 'Page E', uv: 278, pv: 3908, amt: 2400 },
  { name: 'Page F', uv: 189, pv: 4800, amt: 2400 },
];

describe('<AreaChart />', () => {
  it('Renders customized active dot when activeDot is set to be a function', () => {
    // eslint-disable-next-line react/jsx-filename-extension
    const renderActiveDot = ({ cx, cy }) => <circle cx={cx} cy={cy} r={10} className="customized-active-dot" />;
    const wrapper = mount(
      <AreaChart width={100} height={50} data={data}>
        <Area
          isAnimationActive={false}
          activeDot={renderActiveDot}
          type="monotone"
          dataKey="uv"
          stroke="#ff7300"
          fill="#ff7300"
        />
        <Tooltip />
      </AreaChart>,
    );

    wrapper.setState({
      isTooltipActive: true,
      activeTooltipIndex: 4,
      activeTooltipLabel: 4,
      activeTooltipCoord: {
        x: 95,
        y: 21,
      },
    });

    expect(wrapper.find('.customized-active-dot').length).to.equal(1);
  });

  // @TODO wait for implements
  // it.only('simulate mouseEnter on AreaChart', () => {
  //   const onMouseEnter = sinon.spy();
  //   const wrapper = mount(
  //     <AreaChart onMouseEnter={onMouseEnter} width={100} height={50} data={data}>
  //       <Area type='monotone' dataKey='uv' stroke='#ff7300' fill='#ff7300'/>
  //     </AreaChart>
  //   );
  //   const area = wrapper.find(Area);
  //   area.simulate('mouseEnter');
  //   expect(onMouseEnter.calledOnce).to.equal(true);
  // });
});

describe('<AreaChart /> - Pure Rendering', () => {
  const pureElements = [Area];

  const spies = [];
  // CartesianAxis is what is actually render for XAxis and YAxis
  let axisSpy;

  // spy on each pure element before each test, and restore the spy afterwards
  beforeEach(() => {
    pureElements.forEach((el, i) => {
      spies[i] = sinon.spy(el.prototype, 'render');
    });
    axisSpy = sinon.spy(CartesianAxis.prototype, 'render');
  });
  afterEach(() => {
    pureElements.forEach((el, i) => spies[i].restore());
    axisSpy.restore();
  });

  const chart = (
    <AreaChart width={400} height={400} data={data}>
      <Area isAnimationActive={false} type="monotone" dot label dataKey="uv" />
      <Tooltip />
      <XAxis />
      <YAxis />
      <Brush />
    </AreaChart>
  );

  // protect against the future where someone might mess up our clean rendering
  it("should only render Area once when the brush moves but doesn't change start/end indices", () => {
    const wrapper = mount(chart);

    spies.forEach(el => expect(el.callCount).to.equal(1));
    expect(axisSpy.callCount).to.equal(2);
    wrapper.instance().handleBrushChange({ startIndex: 0, endIndex: data.length - 1 });
    spies.forEach(el => expect(el.callCount).to.equal(1));
    expect(axisSpy.callCount).to.equal(2);
  });
});
