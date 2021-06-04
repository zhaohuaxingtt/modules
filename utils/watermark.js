/**
 * str 水印内容
 *  option: {
 *      width: 水印宽度,
        height: 水印高度,
        rotate: 角度旋转,
        font: 字体，默认15 vedana,
        fillStyle: 背景颜色#4444,
        textAlign: 文字位置,
        textBaseline: 文字线,
        bottom: 底部距离,
        right: 右部距离,
        opacity: 透明度,
        position: 位置,
        zIndex: 页面索引,
        repeat: 重复
 *  }
 *
 * @param str 水印内容
 * @param option
 * @returns {string}
 */
let setWatermark = (str, option) => {
    let id = '1.23452384164.123412415'
    if (document.getElementById(id) !== null) {
        document.body.removeChild(document.getElementById(id))
    }
    let defStyle = {
        width: 120,
        height: 40,
        rotate: -20,
        font: '15px Vedana',
        fillStyle: '#444444',
        textAlign: 'center',
        textBaseline: 'Middle',
        bottom: '50px',
        right: '50px',
        opacity: '0.15',
        position: 'fixed',
        zIndex: '999999',
        repeat: true

    };
    defStyle = Object.assign({}, defStyle, option || {});
    let can = document.createElement('canvas')
    // 设置canvas画布大小
    can.width = defStyle.width
    can.height = defStyle.height

    let cans = can.getContext('2d')
    cans.rotate(defStyle.rotate * Math.PI / 180) // 水印旋转角度
    cans.font = defStyle.font
    cans.fillStyle = defStyle.fillStyle
    cans.textAlign = defStyle.textAlign
    cans.textBaseline = defStyle.textBaseline
    cans.fillText(str, can.width / 2, can.height) // 水印在画布的位置x，y轴

    let div = document.createElement('div')
    div.id = id
    div.style.pointerEvents = 'none'
    div.style.bottom = defStyle.bottom
    div.style.right = defStyle.right
    div.style.opacity = defStyle.opacity
    div.style.position = defStyle.position
    div.style.zIndex = defStyle.zIndex
    div.style.width = document.documentElement.clientWidth + 'px'
    div.style.height = document.documentElement.clientHeight + 'px'
    div.style.background = 'url(' + can.toDataURL('image/png') + ') right bottom ' + (defStyle.repeat ? 'repeat' : 'no-repeat')
    document.body.appendChild(div);
    return id
}

// 添加水印方法
export const setWaterMark = (str, option) => {
    let id = setWatermark(str, option)
    setInterval(() => {
        if (document.getElementById(id) === null) {
            id = setWatermark(str, option);
        }
    }, 500);
}

// 移除水印方法
export const removeWatermark = () => {
    let id = '1.23452384164.123412415'
    if (document.getElementById(id) !== null) {
        document.body.removeChild(document.getElementById(id))
    }
}