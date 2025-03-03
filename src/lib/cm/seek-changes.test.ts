import {
  ChangeSet,
  EditorSelection,
  EditorState,
  Text,
} from '@uiw/react-codemirror'
import { expect, it } from 'vitest'
import type { OffsetChange } from './offset-change'
import { reversedChanges } from './reversed-changes'
import { seekChanges } from './seek-changes'

type Scenario = {
  params: {
    initialValue: Text
    advances: ReadonlyArray<typeof OffsetChange.Type>
  }
  states: Record<
    'undefined' | number,
    {
      doc: Text
      selection: EditorSelection | undefined
    }
  >
}

const scenario1: Scenario = {
  params: {
    initialValue: Text.of(['0123456789']),
    advances: [
      [
        0.1,
        [ChangeSet.of({ from: 0, insert: 'a' }, 10), EditorSelection.single(0)],
      ],
      [0.2, [ChangeSet.empty(11), EditorSelection.single(5)]],
      [0.3, [ChangeSet.of({ from: 3, to: 5 }, 11), EditorSelection.single(2)]],
      [
        0.4,
        [
          ChangeSet.of({ from: 4, to: 6, insert: '!' }, 9),
          EditorSelection.single(1),
        ],
      ],
      [0.5, [ChangeSet.empty(8), EditorSelection.single(8)]],
    ],
  },
  states: {
    undefined: {
      doc: Text.of(['0123456789']),
      selection: undefined,
    },
    0: {
      doc: Text.of(['a0123456789']),
      selection: EditorSelection.single(0),
    },
    1: {
      doc: Text.of(['a0123456789']),
      selection: EditorSelection.single(5),
    },
    2: {
      doc: Text.of(['a01456789']),
      selection: EditorSelection.single(2),
    },
    3: {
      doc: Text.of(['a014!789']),
      selection: EditorSelection.single(1),
    },
    4: {
      doc: Text.of(['a014!789']),
      selection: EditorSelection.single(8),
    },
  },
}

it.each<
  [anchor: number | undefined, head: number | undefined, scenario: Scenario]
>([
  [undefined, undefined, scenario1],
  [undefined, 0, scenario1],
  [undefined, 1, scenario1],
  [undefined, 2, scenario1],
  [undefined, 3, scenario1],
  [undefined, 4, scenario1],
  [4, 3, scenario1],
  [4, 2, scenario1],
  [4, 1, scenario1],
  [4, 0, scenario1],
  [4, undefined, scenario1],
  [1, 2, scenario1],
  [1, 3, scenario1],
  [3, 2, scenario1],
  [3, 1, scenario1],
  [0, 1, scenario1],
  [0, 2, scenario1],
  [1, 0, scenario1],
  [1, 2, scenario1],
])(
  '%i -> %i',
  (anchor, head, { params: { initialValue, advances }, states }) => {
    const anchorState = states[anchor ?? 'undefined']!
    const headState = states[head ?? 'undefined']!

    const currentState = EditorState.create({ doc: anchorState.doc })
    const reverses = reversedChanges(initialValue, advances)

    const spec = seekChanges({
      currentValue: currentState.doc,
      initialValue,
      advances,
      reverses,
      anchor,
      head,
    })

    const transaction = currentState.update(spec)

    expect(transaction.newDoc.toString()).toEqual(headState.doc.toString())

    {
      const actual = transaction.selection
      const expected = headState.selection
      expect(
        (!actual && !expected) || (actual && expected && actual.eq(expected)),
      ).toBeTruthy()
    }

    // custom scrolling behavior is implemented
    expect(transaction.scrollIntoView).toBe(false)
  },
)
