'use client'

import { AnimatePresence } from 'motion/react'
import { usePathname } from 'next/navigation'
import { type PropsWithChildren, useEffect, useMemo, useState } from 'react'
import iconSrc from '~/app/icon.png'
import { Image, defaultImageSizes } from '~/lib/media/image'
import { motion } from '~/lib/motion/motion'
import { createStrictContext } from '~/lib/react/create-strict-context'

export type BackgroundImageProps = {
  sizes: string
  quality: number
} & (
  | {
      src: typeof iconSrc
      'data-key': string
    }
  | { src: string }
)

export type BackgroundContextValue = {
  setBackground: (props: BackgroundImageProps | null) => void
}

export const [BackgroundContext, useBackgroundContext] =
  createStrictContext<BackgroundContextValue>({
    name: 'BackgroundContext',
  })

export const useBackgroundEffect = (props: BackgroundImageProps | null) => {
  const { setBackground } = useBackgroundContext()

  useEffect(() => {
    setTimeout(() => {
      setBackground(props)
    })
  }, [setBackground, props])
}

export function BackgroundEffect(props: BackgroundImageProps | null) {
  useBackgroundEffect(props)

  return null
}

export const defaultImagePropsConst: BackgroundImageProps = {
  'data-key': 'icon',
  src: iconSrc,
  sizes: defaultImageSizes,
  quality: 1,
} as const

export function BackgroundProvider({
  children,
  defaultImageProps = defaultImagePropsConst,
}: PropsWithChildren<{
  defaultImageProps?: BackgroundImageProps | undefined
}>) {
  const [imageProps, setImageProps] = useState(defaultImageProps)

  const pathname = usePathname()

  const value: BackgroundContextValue = useMemo(
    () => ({
      setBackground: (it) => setImageProps(it ?? defaultImageProps),
    }),
    [defaultImageProps],
  )

  useEffect(() => {
    if (pathname) {
      setImageProps(defaultImageProps)
    }
  }, [pathname, defaultImageProps])

  return (
    <BackgroundContext value={value}>
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 -z-10 overflow-hidden pointer-events-none isolate"
          key={
            'data-key' in imageProps ? imageProps['data-key'] : imageProps.src
          }
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Image
            {...imageProps}
            fill
            alt="Background"
            className="blur-[120px] saturate-150 scale-125 opacity-60 transform-gpu size-full object-cover"
          />
        </motion.div>
      </AnimatePresence>
      {children}
    </BackgroundContext>
  )
}
