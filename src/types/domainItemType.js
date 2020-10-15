import { keyBy, getOr } from "lodash/fp";

export default class DomainItemType {
  constructor(id, name, description, center, geogson, weightedAttributes) {
    this.id = id
    this.name = name
    this.description = description
    this.weightedAttributes = weightedAttributes
    this.prevIdx = -1
    this.currIdx = -1
    this.score = -1
    this.center = center
    this.geogson = geogson
    this.expanded = false
  }

  static copyDomainItem(domainItem) {
    const newDomainItem = new DomainItemType(domainItem.id, domainItem.name, domainItem.description, domainItem.center, domainItem.geogson, domainItem.weightedAttributes)
    newDomainItem.prevIdx = domainItem.prevIdx
    newDomainItem.currIdx = domainItem.currIdx
    newDomainItem.score = domainItem.score
    newDomainItem.expanded = domainItem.expanded
    return newDomainItem
  }

  updateScore(weights) {
    let score = 0
    const weightedAttributesObject = keyBy("key", this.weightedAttributes)
    weights.forEach(weight => {
      score += getOr(0, `${weight.key}.value`, weightedAttributesObject) * weight.value
    });
    this.score = score
    return score
  }

  isIndexChanged() {
    const result = this.prevIdx !== this.currIdx
    return result
  }

  syncIndex() {
    this.prevIdx = this.currIdx
  }

  setIndex(index) {
    this.prevIdx = this.currIdx
    this.currIdx = index
  }
}