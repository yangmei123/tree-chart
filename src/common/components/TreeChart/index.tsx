import styles from './style.less';

/* eslint no-param-reassign: 0 */

/**
 * @param {array} props.data 数据源
 * @param {number} props.marginBottom 每个单元格的下间距
 * @param {number} props.itemHeight 每个单元占用的高度
 * @param {number} props.itemWidth 每个单元占用的宽度
 * @param {number} props.boxWidth 单元格展示宽
 * @param {number} props.lineWidth 单元格前面横向宽
 * @param {number} props.fontSize 字体大小
 * @param {number} props.parentYWidth 父级Y竖线宽度
 * @param {function} props.doLabelClick 点击指标回调
 * @returns
 */
export default function TreeChart(props) {
  const {
    data = [],
    marginBottom = 10,
    itemHeight = 40,
    itemWidth = 150,
    boxWidth = 100,
    lineWidth = 25,
    fontSize = 12,
    parentYWidth = 1,
    doLabelClick = () => {
      // console.log('点击指标');
    },
  } = props;
  // 数据源
  const treeDemoData = data;
  // 画布最大的高度
  let canvasHeight = 0;
  // 最大层级
  const maxLevel = Math.max(...treeDemoData.map((i) => i.level));
  // 单元格展示高
  const boxHeight = itemHeight - marginBottom;
  // 画布最大宽度
  const canvasWidth = itemWidth * (maxLevel + 1);
  // 父级X横线
  const parentXWidth = itemWidth - boxWidth - lineWidth - parentYWidth;
  // 父级横线X偏移
  const pXTranslateX = boxWidth - parentYWidth;
  // 正负字体偏移
  const fontTranslateX = lineWidth - fontSize / 2;
  // 乘除字体偏移
  const pFontTranslateX = pXTranslateX + fontSize / 2;
  // 升序排列
  const levelArr = [];
  // 降序序排列
  const levelArrDESC = [];
  for (let index = maxLevel; index > -1; index -= 1) {
    levelArr.push(treeDemoData.filter((t) => t.level === index));
  }
  levelArr.forEach((l) => {
    l.forEach((item) => {
      let height = itemHeight;
      const currentItem = treeDemoData.find((i) => i.id === item.id);
      if (item.level !== maxLevel && item.childrenLength > 0) {
        height = treeDemoData
          .filter((t) => item.id === t.parentId)
          .map((i) => i.newHeight)
          .reduce((p, c) => p + c);
      }
      currentItem.newHeight = height;
    });
    levelArrDESC.unshift(l);
  });
  canvasHeight = (
    treeDemoData.find((i) => i.level === 0) || { newHeight: itemHeight }
  ).newHeight;

  const countPosition = (item) => {
    const { level, index, parentId, newHeight } = item;
    const parent = treeDemoData.find((i) => i.id === parentId);
    const { y: pY = 0, newHeight: pNewHeight = 0 } = parent || {};
    // 兄弟节点
    const brothers = treeDemoData.filter(
      (i) => i.parentId === parentId && i.index < index && i.level !== 0,
    );
    const halfHeight = itemHeight / 2;
    const parentY = level === 0 ? 0 : pY - pNewHeight / 2 + halfHeight;
    const position = {
      x: itemWidth * level,
      y: canvasHeight / 2 - halfHeight,
    };
    position.y = newHeight / 2 - halfHeight + parentY;
    if (brothers.length > 0) {
      const Y = brothers.map((i) => i.newHeight).reduce((p, c) => p + c);
      position.y += Y;
      position.brothersY = Y;
    }
    return position;
  };
  // 计算每个单元格的X和Y
  levelArrDESC.forEach((l) => {
    l.forEach((t) => {
      const { x, y } = countPosition(t);
      treeDemoData.forEach((item) => {
        if (item.id === t.id) {
          item.x = x;
          item.y = y;
        }
      });
    });
  });

  // 计算父级Y轴竖线
  treeDemoData.forEach((item) => {
    const { childrenLength } = item;
    item.lineYTranslateX = parentXWidth + boxWidth;
    if (childrenLength > 0) {
      const firstChild = treeDemoData.find(
        (t) => t.parentId === item.id && t.index === 0,
      );
      const lastChild = treeDemoData.find(
        (t) => t.parentId === item.id && t.index === childrenLength - 1,
      );
      if (firstChild && lastChild) {
        item.lineYHeight = lastChild.y - firstChild.y;
        item.lineYTranslateY =
          item.y - firstChild.y - boxHeight / 2 + parentYWidth;
      }
    }
    switch (item.count) {
      case '正':
        item.color = 'red';
        break;
      case '负':
        item.color = 'green';
        break;
      default:
        item.color = 'black';
        break;
    }
  });

  return (
    <div
      style={{
        height: `${canvasHeight}px`,
        width: `${canvasWidth}px`,
        position: 'relative',
      }}
    >
      {treeDemoData.map((item) => {
        return (
          <div
            className={styles.item}
            style={{
              width: `${boxWidth}px`,
              height: `${boxHeight}px`,
              transform: `translate(${item.x}px, ${item.y}px)`,
            }}
            key={item.id}
            onClick={() => {
              doLabelClick(item);
            }}
          >
            <div className={styles['text-content']}>{item.label}</div>
            {item.childrenLength > 0 ? (
              <>
                <span
                  className={styles.line}
                  style={{
                    width: `${parentXWidth}px`,
                    transform: `translateX(${pXTranslateX}px)`,
                  }}
                />
                <span
                  className={styles['parent-Y-line']}
                  style={{
                    height: `${item.lineYHeight}px`,
                    transform: `translate(${item.lineYTranslateX}px, -${item.lineYTranslateY}px)`,
                  }}
                />
                <span
                  className={styles['count-text']}
                  style={{
                    width: `${parentXWidth}px`,
                    transform: `translate(${pFontTranslateX}px, -${fontSize}px)`,
                    color: item.color,
                  }}
                >
                  {item.count}
                </span>
              </>
            ) : null}
            {item.level !== 0 ? (
              <>
                <span
                  className={styles.line}
                  style={{
                    width: `${lineWidth}px`,
                    transform: `translateX(-${lineWidth}px)`,
                  }}
                />
                {item.count === '正' || item.count === '负' ? (
                  <>
                    <span
                      className={styles['count-text']}
                      style={{
                        width: `${parentXWidth}px`,
                        transform: `translate(-${fontTranslateX}px, -${fontSize}px)`,
                        color: item.color,
                      }}
                    >
                      {item.count}
                    </span>
                  </>
                ) : null}
              </>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
