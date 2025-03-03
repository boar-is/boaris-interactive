import { SubscriptionFormProvider } from '~/features/subscription-form-provider'
import { Button } from '~/lib/buttons/button'
import { Form } from '~/lib/forms/form'
import { Input, Label, TextField } from '~/lib/forms/text-field'
import { cx } from '~/lib/react/cx'
import { shadowInsetStyles } from '~/lib/surfaces/shadow-inset-styles'

export function PostSubscriptionSection() {
  return (
    <article
      className={cx(
        shadowInsetStyles,
        'mx-auto space-y-4 font-medium ~text-base/xl max-w-[80ch] bg-gray-4/30 bg-clip-padding border border-gray-9/50 ~rounded-2xl/4xl after:~rounded-2xl/4xl ~p-5/8 leading-relaxed drop-shadow-lg',
      )}
    >
      <p className="~text-lg/2xl font-semibold tracking-tight">
        Enjoyed the format?
      </p>
      <p>
        I’m on a mission to make learning more thoughtful and effective. This
        format is just the beginning, and I’d love for you to join me on this
        journey. Subscribe to stay updated on new posts and format refinements.
      </p>
      <SubscriptionFormProvider>
        <Form className="max-w-lg flex ~gap-2/4 items-stretch">
          <TextField name="email" type="email" isRequired className="basis-3/5">
            <Label className="sr-only">Email</Label>
            <Input
              placeholder="wow-person@domain.com"
              className="rounded-xl border border-accent-8 focus:border-accent-11 text-accent-11 bg-accent-3 ~px-3/4 ~py-1/2 ~text-base/xl h-full placeholder-accent-7 transition-colors w-full"
            />
          </TextField>
          <Button
            type="submit"
            intent="primary"
            className="rounded-xl basis-2/5"
          >
            Subscribe
          </Button>
        </Form>
      </SubscriptionFormProvider>
      <p>Let’s make learning better — together.</p>
    </article>
  )
}
