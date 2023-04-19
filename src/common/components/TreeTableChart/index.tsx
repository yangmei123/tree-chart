import { useState } from 'react';
import { Table, Tooltip } from 'antd';
import './style.less';

/* eslint no-param-reassign: 0 */

/**
 * @param {array} props.data 数据源
 * @param {boolean} defaultExpandAllRows 是否全都展开
 * @param {boolean} props.isDetail 是否为详情
 * @param {function} props.doLabelClick 点击指标回调
 * @param {function} props.doMouseOver 指标鼠标放上回调
 * @param {number} props.tdHeight 单元格高度
 */
export default function TreeTableChart(props) {
  const {
    data = [],
    isDetail = false,
    defaultExpandAllRows = false,
    tdHeight = 54,
    // eslint-disable-next-line no-unused-vars
    doLabelClick = (_record = {}) => {
      // console.log('点击指标', record);
    },
    // eslint-disable-next-line no-unused-vars
    doLaunchAnalysis = (_record = {}) => {
      // console.log('发起异常分析', record);
    },
  } = props;
  const [operateId, setOperateId] = useState(0);
  const dataFlat = [];
  const collectData = (arr, parentObj) => {
    arr.forEach((i) => {
      const { index, level, childrenLength } = i;
      dataFlat.push(i);
      // 记录需要隐藏的Y轴
      if (index !== 0 && !parentObj.hideYLevel && level !== 0) {
        // 当前为第二个元素，需要记录隐藏的层级
        i.hideYLevel = `'${level - 1}'`;
      }
      if (
        index !== 0 &&
        parentObj.hideYLevel &&
        parentObj.index !== 0 &&
        childrenLength > 0 &&
        level !== 0
      ) {
        // 当前为第二个元素，父级也有需要隐藏的层级，父级层级不为第一个元素，有后代，则需要加上自身隐藏的层级
        i.hideYLevel = `${parentObj.hideYLevel},${level - 1}`;
      }
      if (
        (index === 0 && parentObj.hideYLevel) ||
        (index === 1 && childrenLength === 0)
      ) {
        // 当前为第一个元素，父级有需要隐藏的层级
        // 或者
        // 当前为第二个元素，无后代
        // 则要隐藏的Y轴元素为父级hideYLevel
        i.hideYLevel = parentObj.hideYLevel;
      }
      if (i.childrenLength > 0) {
        collectData(i.children, i);
      }
    });
  };
  collectData(data, {});
  const columns = [
    {
      title: '指标',
      align: 'left',
      dataIndex: 'label',
      key: 'label',
      // width: isDetail ? 400 : 600,
      render: (text, record) => {
        const xAxis = 36;
        const {
          level,
          id,
          count,
          index: recordIndex,
          parentId,
          hideYLevel = 0,
          explain = '',
        } = record;
        const parent = dataFlat.find((i) => i.id === parentId) || {};
        const { count: pCount } = parent;
        const levelArr = [];
        // 关系符号位置
        const countConfig = {
          x: level * xAxis - 10,
          y: 50,
          color: 'red',
          backgroundColor: 'pink',
        };
        // 渲染层级转为数组
        for (let index = 0; index < level + 1; index += 1) {
          levelArr.push(index);
        }
        if (count === '正' || count === '负') {
          countConfig.x = level * xAxis + 10;
          countConfig.y = 15;
          countConfig.color = count === '负' ? 'green' : 'red';
          countConfig.backgroundColor = count === '负' ? 'LightGreen' : 'pink';
        }
        const xLine =
          level === 0 ? null : (
            <span
              className="line"
              style={{
                transform: `translateX(${level * xAxis}px)`,
              }}
            />
          );
        const countText =
          level === 0 || recordIndex !== 0 ? null : (
            <span
              className="count"
              style={{
                borderColor: countConfig.color,
                backgroundColor: countConfig.backgroundColor,
                color: countConfig.color,
                transform: `translate(${countConfig.x}px, ${countConfig.y}px)`,
              }}
            >
              {pCount || count}
            </span>
          );
        const allLine = levelArr.map((l) => {
          return l === level ||
            (hideYLevel &&
              hideYLevel.indexOf(l) !== -1 &&
              l !== level - 1) ? null : (
            <span
              key={`${id}${level}${l}`}
              className="y-line"
              style={{
                transform: `translateX(${(l + 1) * xAxis}px)`,
                height: l === level - 1 ? `${tdHeight}px` : `calc(100% + 1px)`,
              }}
            />
          );
        });
        return (
          <>
            {xLine}
            {countText}
            {allLine}
            <Tooltip title={explain} placement="topLeft">
              <span
                className="label-text"
                onClick={() => {
                  if (!isDetail) {
                    doLabelClick(record);
                  }
                }}
              >
                {text}
                {id === operateId ? (
                  <span className="launch-wrap">
                    <span
                      className="launch-btn"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        doLaunchAnalysis(record);
                      }}
                    >
                      &nbsp;+&nbsp;发起功能事件
                      <br />
                      &nbsp;(功能尚在开发中，敬请期待)
                    </span>
                  </span>
                ) : null}
              </span>
            </Tooltip>
          </>
        );
      },
    },
  ];
  return (
    <>
      <Table
        onRow={(record) => {
          const { id } = record;
          return {
            onMouseEnter: () => {
              if (!isDetail) {
                setOperateId(id);
              }
            },
            onMouseLeave: () => {
              if (id === operateId) {
                setOperateId(0);
              }
            },
          };
        }}
        columns={columns}
        rowClassName="level-row"
        dataSource={data}
        indentSize={0}
        bordered
        defaultExpandAllRows={defaultExpandAllRows}
        pagination={false}
      />
    </>
  );
}
