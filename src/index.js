/*
 * @Author: your name
 * @Date: 2021-04-08 11:21:51
 * @LastEditTime: 2021-06-22 17:34:06
 * @LastEditors: Please set LastEditors
 * @Description: 作为打包的入口，批量打包为一个vue可以use的minjs，但是在rise项目中，基本上不会用到全量使用的情况，
 * 为了组件库的完整性而设计的。
 * @FilePath: \front-modules\src\index.js
 */
import iButton from './components/iButton'
import iCard from './components/iCard'
import icon from './components/icon'
import iDialog from './components/iDialog'
import iDrawer from './components/iDrawer'
import iInput from './components/iInput'
import iNavMvp from './components/iNavMvp'
import iPage from './components/iPage'
import iFormGroup from './components/iPageItemsGroup/iFormGroup'
import iFormItem from './components/iPageItemsGroup/iFormItem'
import iLabel from './components/iPageItemsGroup/iLabel'
import iText from './components/iPageItemsGroup/iText'
import iPagination from './components/iPagination'
import iRadio from './components/iRadio'
import iSearch from './components/iSearch'
import iSelect from './components/iSelect'
import iTabs from './components/iTabs'
import iTabsList from './components/iTabsList'
import iMessage from './components/iMessage'
import iMessageBox from './components/iMessageBox'
import iDatePicker from './components/iDatePicker'
import iTableCustom from './components/iTableCustom'
import iEditor from './components/iEditor'
import iUpload from './components/iUpload'
import iDownload from './components/iDownload'
import iDropdown from './components/iDropdown'
import iLog from './components/iLog'
const components = [
  iMessage,
  iMessageBox,
  iInput,
  iButton,
  iCard,
  icon,
  iDialog,
  iDrawer,
  iNavMvp,
  iPage,
  iFormGroup,
  iFormItem,
  iLabel,
  iText,
  iPagination,
  iRadio,
  iSearch,
  iSelect,
  iTabs,
  iTabsList,
  iTableCustom,
  iEditor,
  iUpload,
  iDownload,
  iDropdown,
  iLog
]
const install = function(Vue) {
  components.map(component => {
    Vue.component(component.name, component)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}
export {
  install,
  iInput,
  iButton,
  iCard,
  icon,
  iDialog,
  iDrawer,
  iNavMvp,
  iPage,
  iFormGroup,
  iFormItem,
  iLabel,
  iText,
  iPagination,
  iRadio,
  iSearch,
  iTabs,
  iTabsList,
  iMessage,
  iMessageBox,
  iDatePicker,
  iTableCustom,
  iEditor,
  iUpload,
  iDownload,
  iDropdown,
  iLog
}
