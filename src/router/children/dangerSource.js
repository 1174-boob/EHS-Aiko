import { dangerList } from './dangerSource/dangerList'
import { dangerBook } from './dangerSource/dangerBook'
import { dangerApprove } from './dangerSource/dangerApprove'
import { risk } from './dangerSource/risk'
import { hiddenTrouble } from './dangerSource/hiddenTrouble'
import { riskFreqency } from './dangerSource/hiddenTrouble/riskFrequency'
import { fourColor } from './dangerSource/fourColor'
export const dangerSource = [
  ...dangerList,
  ...dangerBook,
  ...dangerApprove,
  ...risk,
  ...hiddenTrouble,
  ...riskFreqency,
  ...fourColor
]

export const dangerSourceMap = dangerSource.reduce((prev, item) => {
  const { name, meta, component } = item
  prev[item.path] = {
    name,
    meta,
    component
  }
  return prev
}, {})
