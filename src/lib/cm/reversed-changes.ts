import type { Text } from '@uiw/react-codemirror'
import type { OffsetChange } from './offset-change'

export const reversedChanges = (
  initialValue: Text,
  advances: ReadonlyArray<typeof OffsetChange.Type>,
): ReadonlyArray<typeof OffsetChange.Type> => {
  const reverses: Array<typeof OffsetChange.Type> = []
  let currentValue = initialValue

  for (let i = 0; i < advances.length; i++) {
    const [offset, [changeSet]] = advances[i]!
    const invertedChangeSet = changeSet.invert(currentValue)

    const selection = i > 0 ? advances[i - 1]![1][1] : undefined
    reverses.push([offset, [invertedChangeSet, selection]])
    currentValue = changeSet.apply(currentValue)
  }

  return reverses
}
