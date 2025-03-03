import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { type Editor, Extension } from '@tiptap/react'
import { findBlockAncestorDepth } from './find-block-ancestor-depth'

const name = 'PositionHighlight'

type State = number

const key = new PluginKey<State>(name)

export const PositionHighlight = Extension.create({
  name,
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key,
        state: {
          init: (): State => 0,
          apply(tr, value) {
            const newPosition = tr.getMeta(key)
            return typeof newPosition === 'number' ? newPosition : value
          },
        },
        props: {
          decorations(state) {
            const position = key.getState(state)!

            const $pos = state.doc.resolve(position)

            const depth = findBlockAncestorDepth($pos)

            if (depth === undefined) {
              return DecorationSet.empty
            }

            const blockStart = $pos.start(depth)
            const blockEnd = $pos.end(depth)

            const decorations = []
            if (blockStart <= position && position <= blockEnd) {
              decorations.push(
                Decoration.inline(blockStart, position, {
                  class: 'h',
                }),
              )
            }

            return DecorationSet.create(state.doc, decorations)
          },
        },
      }),
    ]
  },
})

export const setHighlightPosition = (editor: Editor, position: number) => {
  const tr = editor.state.tr.setMeta(key, position)

  editor.view.dispatch(tr)
  return true
}
