import { branchCorp } from './safeMonthReport/safeBranch'
import { mainCorp } from './safeMonthReport/safeMain'
export const safeCorp = [
  ...mainCorp,
  ...branchCorp,
]

export const safeCorpMap = safeCorp.reduce((prev, item) => {
  const { name, meta, component } = item
  prev[item.path] = {
    name,
    meta,
    component
  }
  return prev
}, {})