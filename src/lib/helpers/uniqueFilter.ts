// Filters out duplicates in array
/**
 *
 * @param arr
 * @returns
 */
export const uniqueFilter = (arr: string[]): string[] => {
  return arr.filter((cv, idx, self) => {
    return self.indexOf(cv) === idx
  })
}

export const uniqueDateFilter = (arr: Date[]): Date[] => {
  return arr.filter((cv, idx, self) => {
    return self.indexOf(cv) === idx
  })
}

// Filter out objects in array based on one or two property names
/**
 *
 * @param array
 * @param propertyName1
 * @param propertyName2
 * @returns
 */
export const uniqueObjFilter = (
  array: void[],
  propertyName1: string,
  propertyName2?: string
): any[] => {
  if (propertyName2 !== undefined) {
    return array.filter(
      (e, i) =>
        array.findIndex(
          a => a[propertyName1] === e[propertyName1] && a[propertyName2] === e[propertyName2]
        ) === i
    )
  } else {
    return array.filter((e, i) => {
      return array.findIndex(a => a[propertyName1] === e[propertyName1]) === i
    })
  }
}

/**
 *
 * @param array
 * @param propertyName1
 * @param propertyName2
 * @returns
 */
export const uniqueDateObjFilter = (
  array: any[],
  propertyName1: string,
  propertyName2?: string
) => {
  if (propertyName2 !== undefined) {
    return array.filter(
      (e, i) =>
        array.findIndex(
          a =>
            a[propertyName1].getTime() === e[propertyName1].getTime() &&
            a[propertyName2].getTime() === e[propertyName2].getTime()
        ) === i
    )
  } else {
    return array.filter(
      (e, i) =>
        array.findIndex(a => a[propertyName1].getTime() === e[propertyName1].getTime()) === i
    )
  }
}
