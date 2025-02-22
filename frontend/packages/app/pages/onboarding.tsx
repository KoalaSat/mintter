import {MintterIcon} from '@mintter/app/components/mintter-icon'
import appError from '@mintter/app/errors'
import {useSetProfile} from '@mintter/app/models/accounts'
import {useAccountRegistration, useMnemonics} from '@mintter/app/models/daemon'
import {Profile as ProfileType} from '@mintter/shared'
import {
  AnimatePresence,
  Button,
  ButtonProps,
  Copy,
  ErrorIcon,
  Fieldset,
  H1,
  H2,
  Input,
  Label,
  Next,
  ParagraphProps,
  Prev,
  Reload,
  SizableText,
  StepWrapper as StyledStepWrapper,
  TextArea,
  Tooltip,
  XStack,
  YStack,
  useTheme,
} from '@mintter/ui'
import copyTextToClipboard from 'copy-text-to-clipboard'
import {
  PropsWithChildren,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'
import toast from 'react-hot-toast'
import {trpc} from '@mintter/desktop/src/trpc'

const CONTENT_MAX_WIDTH = 500

export function Onboarding() {
  return (
    <OnboardingProvider>
      <OnboardingSteps />
    </OnboardingProvider>
  )
}

export function OnboardingSteps() {
  let obValue = useOnboarding()

  let direction = obValue.state.direction
  const enterVariant = direction == 1 ? 'isRight' : 'isLeft'
  const exitVariant = direction === 1 ? 'isLeft' : 'isRight'
  return (
    <>
      {obValue.state.key == 'welcome' && (
        <Welcome key={obValue.state.key} {...obValue} />
      )}
      {obValue.state.key == 'add new device' && (
        <NewDevice key={obValue.state.key} {...obValue} />
      )}
      {obValue.state.key == 'create new account' && (
        <Mnemonics key={obValue.state.key} {...obValue} />
      )}
      {obValue.state.key == 'profile' && (
        <Profile key={obValue.state.key} {...obValue} />
      )}
      {obValue.state.key == 'analytics' && (
        <Analytics key={obValue.state.key} {...obValue} />
      )}
      {obValue.state.key == 'account created' && (
        <Complete key={obValue.state.key} />
      )}
      {obValue.state.key == 'device complete' && (
        <Complete key={obValue.state.key} />
      )}
    </>
  )
}

type OnboardingStepProps = OBContext

function Welcome(props: OnboardingStepProps) {
  return (
    <StepWrapper>
      <XStack flex={1} gap="$10">
        <StepTitleSection step="welcome">
          <H2>Welcome to</H2>
          <H1>Mintter</H1>
        </StepTitleSection>

        <YStack flex={2} gap="$5">
          <StepParagraph>
            Welcome to Mintter, the decentralized knowledge collaboration app
            that fosters constructive dialogue and critical debate.
          </StepParagraph>
          <StepParagraph>
            Join us today to create and join communities, share knowledge, and
            connect with experts and peers around the world.
          </StepParagraph>
          <YStack flex={1} />
          <YStack alignItems="flex-start" justifyContent="center" space="$2">
            <Button
              size="$5"
              onPress={() => props.send('NEW_ACCOUNT')}
              id="btn-new-account"
            >
              Create a new Account
            </Button>
            <Button
              id="btn-new-device"
              size="$3"
              bg="transparent"
              flex={1}
              onPress={() => props.send('NEW_DEVICE')}
            >
              or add a new device to your current account
            </Button>
          </YStack>
        </YStack>
      </XStack>
    </StepWrapper>
  )
}

function Mnemonics(props: OnboardingStepProps) {
  const [ownSeed, setOwnSeed] = useState<string>('')
  const [useOwnSeed, setUseOwnSeed] = useState<boolean>(false)
  const [error, setError] = useState('')
  const mnemonics = useMnemonics()

  const register = useAccountRegistration({
    onError: () => {
      setError('Failed to register your words.')
      appError('Failed to register your words.')
    },
    onSuccess: () => props.send('NEXT'),
  })

  const handleSubmit = useCallback(() => {
    setError('')
    let words: Array<string> = mnemonics.data || []
    if (useOwnSeed) {
      if (!ownSeed) {
        setError(`must provide mnemonics (current: ${ownSeed})`)
      }

      let error = isInputValid(ownSeed)

      if (typeof error == 'string') {
        // this means is an error
        setError(`Invalid mnemonics: ${error}`)
        return
      } else {
        words = extractWords(ownSeed)
      }
    } else {
      // check if the mnemonics.data has content
      if (mnemonics.data) {
        words = mnemonics.data
      } else {
        setError(`No mnemonics returned from the API. please `)
        return
      }
    }

    if (!words) {
      setError('No mnemonics')
      return
    }

    register.mutate(words)

    function isInputValid(input: string): string | boolean {
      let res = extractWords(input)
      if (!res.length) {
        return `Can't extract words from input. malformed input => ${input}`
      }
      if (res.length == 12) {
        return false
      } else {
        return `input does not have a valid words amount, please add a 12 mnemonics word. current input is ${res.length}`
      }
    }

    function extractWords(input: string): Array<string> {
      const delimiters = [',', ' ', '.', ';', ':', '\n', '\t']
      let wordSplitting = [input]
      delimiters.forEach((delimiter) => {
        wordSplitting = wordSplitting.flatMap((word) => word.split(delimiter))
      })
      let words = wordSplitting.filter((word) => word.length > 0)
      return words
    }
  }, [mnemonics.data, ownSeed, useOwnSeed, register])

  function onCopy() {
    if (mnemonics.data) {
      copyTextToClipboard(mnemonics.data.join(' '))
      toast.success('Words copied to your clipboard!')
    } else {
      console.error(
        `Mnemonics: No mnemonics to copy: ${JSON.stringify(mnemonics.data)}`,
      )
    }
  }

  return (
    <StepWrapper>
      <XStack flex={1} gap="$10">
        <StepTitleSection step="mnemonics">
          <H2>Your Keys.</H2>
          <H1>Your Data.</H1>
        </StepTitleSection>
        <YStack flex={2}>
          <YStack gap="$5" maxWidth={500}>
            <StepParagraph>
              Please save these words securely! This will allow you to recreate
              your account and recover associated funds:
            </StepParagraph>
            {useOwnSeed ? (
              <YStack gap="$2">
                <XStack
                  backgroundColor="$backgroundHover"
                  borderRadius="$5"
                  elevation="$3"
                >
                  <TextArea
                    autoFocus
                    fontSize={18}
                    flex={1}
                    id="mnemonics-input"
                    placeholder={
                      'Add your 12 mnemonics words \n(food barrel buzz, ...)'
                    }
                    minHeight={130}
                    onChangeText={setOwnSeed}
                    fontFamily="$mono"
                    fontWeight="500"
                    borderColor="$backgroundHover"
                    borderWidth="$0.5"
                  />
                </XStack>
                {error || register.status == 'error' ? (
                  <XStack
                    alignItems="center"
                    gap="$2"
                    backgroundColor="$red10"
                    borderRadius="$1"
                    paddingHorizontal="$4"
                    paddingVertical={0}
                  >
                    <ErrorIcon size={12} color="$red1" />
                    <SizableText size="$1" fontWeight="600" color="$red1">
                      {error}
                    </SizableText>
                  </XStack>
                ) : null}
              </YStack>
            ) : mnemonics.isError ? (
              <XStack
                padding="$4"
                theme="yellow"
                backgroundColor="$background"
                borderRadius="$5"
                elevation="$1"
                borderColor="$backgroundHover"
                borderWidth="$0.5"
              >
                <SizableText
                  fontFamily="$mono"
                  fontSize={14}
                  fontWeight="700"
                  display="block"
                  color="$color"
                >
                  {JSON.stringify(mnemonics.error, null)}
                </SizableText>
              </XStack>
            ) : (
              <XStack
                padding="$2"
                space
                backgroundColor="$background"
                borderRadius="$5"
                elevation="$3"
                minHeight={130}
                borderColor="$backgroundHover"
                borderWidth="$0.5"
                alignItems="flex-start"
              >
                <SizableText
                  padding="$2"
                  fontFamily="$mono"
                  fontSize={18}
                  fontWeight="700"
                  display="block"
                  id="mnemonics"
                >
                  {mnemonics.data?.join(' ')}
                </SizableText>
                <XStack>
                  <Tooltip content="regenerate words">
                    <Button
                      id="btn-reload-mnemonics"
                      flex={0}
                      flexShrink={0}
                      icon={Reload}
                      onPress={() => mnemonics.refetch()}
                      size="$2"
                    />
                  </Tooltip>
                  <Tooltip content="Copy words to clipboard">
                    <Button
                      id="btn-copy-mnemonics"
                      flex={0}
                      flexShrink={0}
                      icon={Copy}
                      onPress={onCopy}
                      size="$2"
                    />
                  </Tooltip>
                </XStack>
              </XStack>
            )}
            <XStack>
              <Button
                size="$2"
                theme="green"
                id="btn-toggle-seed"
                onPress={() => {
                  setOwnSeed('')
                  if (useOwnSeed) {
                    // refetch here is so that user always sees new words when they click "generate a new seed"
                    // so they feel like they're getting a secure fresh seed
                    mnemonics.refetch()
                    setUseOwnSeed(false)
                  } else {
                    setUseOwnSeed(true)
                  }
                }}
              >
                {useOwnSeed ? 'Generate a new seed' : 'Provide your own seed'}
              </Button>
            </XStack>
          </YStack>
        </YStack>
      </XStack>
      <XStack alignItems="center" justifyContent="flex-start" gap="$4">
        <PrevButton onPress={() => props.send('PREV')}>PREV</PrevButton>
        <NextButton onPress={handleSubmit}>NEXT</NextButton>
      </XStack>
    </StepWrapper>
  )
}

function NewDevice(props: OnboardingStepProps) {
  const [ownSeed, setOwnSeed] = useState<string>('')
  const [error, setError] = useState('')

  const register = useAccountRegistration({
    onError: () => {
      setError('Failed to register your words.')
      appError('Failed to register your words.')
    },
    onSuccess: () => props.send('NEXT'),
  })

  const handleSubmit = useCallback(() => {
    setError('')
    let words: Array<string> = []
    if (!ownSeed) {
      setError(`must provide mnemonics (current: ${ownSeed})`)
    }

    let error = isInputValid(ownSeed)

    if (typeof error == 'string') {
      // this means is an error
      setError(`Invalid mnemonics: ${error}`)
      return
    } else {
      words = extractWords(ownSeed)
    }

    if (!words) {
      setError('No mnemonics')
      return
    }

    register.mutate(words)

    function isInputValid(input: string): string | boolean {
      let res = extractWords(input)

      if (!res.length) {
        return `Can't extract words from input. malformed input => ${input}`
      }
      if (res.length == 12) {
        return false
      } else {
        return `input does not have a valid words amount, please add a 12 mnemonics word. current input is ${res.length}`
      }
    }

    function extractWords(input: string): Array<string> {
      const delimiters = [',', ' ', '.', ';', ':', '\n', '\t']
      let wordSplitting = [input]
      delimiters.forEach((delimiter) => {
        wordSplitting = wordSplitting.flatMap((word) => word.split(delimiter))
      })
      let words = wordSplitting.filter((word) => word.length > 0)
      return words
    }
  }, [ownSeed, register])

  return (
    <StepWrapper>
      <XStack flex={1} gap="$10">
        <StepTitleSection step="new-device">
          <H2>Setup</H2>
          <H1>New device.</H1>
        </StepTitleSection>
        <YStack flex={2}>
          <YStack gap="$5" maxWidth={500}>
            <StepParagraph>
              Add your account&apos;s mnemonics in the input below separated by
              commas.
            </StepParagraph>
            <YStack gap="$2">
              <XStack
                backgroundColor="$backgroundHover"
                borderRadius="$5"
                elevation="$3"
              >
                <TextArea
                  autoFocus
                  fontSize={18}
                  flex={1}
                  id="mnemonic-input"
                  placeholder={
                    'Add your 12 mnemonics words \n(food, barrel, buzz, ...)'
                  }
                  minHeight={130}
                  onChangeText={setOwnSeed}
                  fontFamily="$mono"
                  fontWeight="500"
                  borderColor="$backgroundHover"
                  borderWidth="$0.5"
                />
              </XStack>
              {error || register.status == 'error' ? (
                <XStack
                  alignItems="center"
                  gap="$2"
                  backgroundColor="$red10"
                  borderRadius="$1"
                  paddingHorizontal="$4"
                  paddingVertical={0}
                >
                  <ErrorIcon size={12} color="$red1" />
                  <SizableText size="$1" fontWeight="600" color="$red1">
                    {error}
                  </SizableText>
                </XStack>
              ) : null}
            </YStack>
          </YStack>
        </YStack>
      </XStack>
      <XStack alignItems="center" justifyContent="flex-start" gap="$4">
        <PrevButton onPress={() => props.send('PREV')}>PREV</PrevButton>
        <NextButton onPress={handleSubmit}>NEXT</NextButton>
      </XStack>
    </StepWrapper>
  )
}

function Profile(props: OnboardingStepProps) {
  const setProfile = useSetProfile({
    onError: (e) => appError('Failed to set your profile', e),
    onSuccess: () => props.send('NEXT'),
  })

  const submitValue = useRef({alias: '', bio: ''} as ProfileType)
  function onSubmit() {
    if (submitValue.current.alias == '' && submitValue.current.bio == '') {
      props.send('NEXT')
    } else {
      setProfile.mutate(submitValue.current)
    }
  }

  return (
    <StepWrapper>
      <XStack flex={1} gap="$10">
        <StepTitleSection step="profile">
          <H2>Profile</H2>
          <H1>Information</H1>
        </StepTitleSection>

        <YStack flex={2}>
          <YStack gap="$5" maxWidth={500}>
            <StepParagraph>
              Link your personal data with your new Mintter account. You can
              fill this information later if you prefer.
            </StepParagraph>
            <XStack maxWidth={CONTENT_MAX_WIDTH}>
              <YStack flex={1}>
                <Fieldset
                  paddingHorizontal={0}
                  margin={0}
                  borderColor="transparent"
                  borderWidth={0}
                >
                  <Label size="$2" htmlFor="alias" role="complementary">
                    Alias
                  </Label>
                  <Input
                    id="alias"
                    testID="input-alias"
                    onChangeText={(val) => (submitValue.current.alias = val)}
                    placeholder="Readable alias or username. Doesn't have to be unique."
                  />
                </Fieldset>
                <Fieldset
                  paddingHorizontal={0}
                  margin={0}
                  borderColor="transparent"
                  borderWidth={0}
                >
                  <Label size="$2" htmlFor="bio" role="complementary">
                    Bio
                  </Label>
                  <TextArea
                    autoFocus
                    id="bio"
                    multiline
                    minHeight={100}
                    numberOfLines={4}
                    onChangeText={(val: string) =>
                      (submitValue.current.bio = val)
                    }
                    placeholder="A little bit about yourself..."
                  />
                </Fieldset>
              </YStack>
            </XStack>
          </YStack>
        </YStack>
      </XStack>
      <XStack alignItems="center" justifyContent="flex-start" gap="$4">
        <NextButton onPress={onSubmit}>NEXT</NextButton>
      </XStack>
    </StepWrapper>
  )
}

function Analytics(props: OnboardingStepProps) {
  return (
    <StepWrapper>
      <XStack flex={1} gap="$10">
        <StepTitleSection step="analytics">
          <H2>Crash</H2>
          <H1>Analytics</H1>
        </StepTitleSection>

        <YStack flex={2}>
          <YStack gap="$5" maxWidth={500}>
            <StepParagraph>
              Pre-release versions of Mintter automatically send anonymized
              crash reports when things go wrong. This helps us fix bugs and
              improve performance.
            </StepParagraph>
            <StepParagraph>
              We strongly believe privacy is a basic human right, so the full
              release of Mintter will never send your data to anyone.
            </StepParagraph>
          </YStack>
        </YStack>
      </XStack>
      <XStack alignItems="center" justifyContent="flex-start" gap="$4">
        <PrevButton onPress={() => props.send('PREV')}>PREV</PrevButton>
        <NextButton onPress={() => props.send('NEXT')}>NEXT</NextButton>
      </XStack>
    </StepWrapper>
  )
}

function Complete() {
  return (
    <StepWrapper>
      <XStack flex={1} gap="$10">
        <StepTitleSection step="complete">
          <H1>You are Ready!</H1>
        </StepTitleSection>

        <YStack flex={2}>
          <YStack gap="$5" width={440}>
            <StepParagraph width={360}>
              You just created your Mintter account. Please share it with others
              and help us spread the word.
            </StepParagraph>
          </YStack>
        </YStack>
      </XStack>
      <XStack alignItems="center" justifyContent="flex-start" gap="$4">
        <NextButton size="$4" onPress={() => window.location.reload()}>
          Open Mintter App
        </NextButton>
      </XStack>
    </StepWrapper>
  )
}

function StepWrapper({children, ...props}: PropsWithChildren<unknown>) {
  const theme = useTheme()
  return (
    <StyledStepWrapper
      fullscreen
      x={0}
      opacity={1}
      animation={
        import.meta.env.VITE_NO_ANIMS
          ? undefined
          : [
              'medium',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]
      }
      {...props}
    >
      <YStack
        flex={1}
        alignItems="center"
        justifyContent="center"
        className="window-drag"
      >
        <YStack
          className="no-window-drag"
          borderRadius="$7"
          elevation="$12"
          backgroundColor="$background1"
          minWidth={678}
          minHeight={500}
          maxWidth={1024}
        >
          <YStack alignItems="flex-start" padding="$6">
            <MintterIcon
              size="$3"
              color={theme.color8?.val || 'hsl(0, 0%, 81.0%)'}
            />
          </YStack>

          <YStack flex={1} padding="$6" gap="$5">
            {children}
          </YStack>
        </YStack>
      </YStack>
    </StyledStepWrapper>
  )
}

function StepParagraph({children, ...props}: ParagraphProps) {
  return (
    <SizableText size="$5" maxWidth={CONTENT_MAX_WIDTH}>
      {children}
    </SizableText>
  )
}

function NextButton(props: ButtonProps) {
  return <Button id="btn-next" iconAfter={Next} size="$4" {...props} />
}

function PrevButton(props: ButtonProps) {
  return (
    <Button
      id="btn-prev"
      chromeless
      icon={Prev}
      size="$2"
      opacity={0.5}
      {...props}
    />
  )
}

function StepTitleSection({
  children,
  step,
}: {
  children: ReactNode
  step: string
}) {
  return (
    <YStack id={`${step}-title-section`} flex={0} flexShrink={0} width={240}>
      {children}
    </YStack>
  )
}

let machine = {
  id: 'Onboarding',
  initial: 'welcome',
  states: {
    welcome: {
      on: {
        NEW_DEVICE: {
          target: 'add new device',
        },
        NEW_ACCOUNT: {
          target: 'create new account',
        },
      },
    },
    'add new device': {
      on: {
        NEXT: {
          target: 'device complete',
        },
        PREV: {
          target: 'welcome',
        },
      },
    },
    'create new account': {
      on: {
        PREV: {
          target: 'welcome',
        },
        NEXT: {
          target: 'profile',
        },
      },
    },
    'device complete': {
      final: true,
    },
    profile: {
      on: {
        NEXT: {
          target: 'analytics',
        },
        PREV: {
          target: 'create new account',
        },
      },
    },
    analytics: {
      on: {
        NEXT: {
          target: 'account created',
        },
        PREV: {
          target: 'profile',
        },
      },
    },
    'account created': {},
  },
}

function transition(state: OBState, event: OBAction): OBState {
  const nextState: {target: keyof typeof machine.states} | {} =
    // @ts-expect-error
    machine.states[state.key].on?.[event]?.target || state

  return {
    // @ts-expect-error
    key: nextState,
    direction: event == 'PREV' ? -1 : 1,
  }
}

type OBState = {
  key: keyof typeof machine.states
  direction: 1 | -1
}

type OBAction = 'NEXT' | 'PREV' | 'NEW_DEVICE' | 'NEW_ACCOUNT'

type OBContext = {
  state: OBState
  send: (action: OBAction) => void
}

let OnboardingContext = createContext<null | OBContext>(null)

export function OnboardingProvider({
  children,
  initialStep = {
    key: 'welcome',
    direction: 1,
  },
}: {
  children: ReactNode
  initialStep?: OBState
}) {
  let [state, send] = useReducer(transition, initialStep)
  const writeIsProbablyNewAccount =
    trpc.welcoming.writeIsProbablyNewAccount.useMutation()
  let value = useMemo(
    () => ({
      state,
      send: (action: OBAction) => {
        if (action === 'NEW_ACCOUNT') {
          writeIsProbablyNewAccount.mutate(true)
        } else if (action === 'NEW_DEVICE') {
          writeIsProbablyNewAccount.mutate(false)
        }
        send(action)
      },
    }),
    [state, writeIsProbablyNewAccount],
  )

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const ob = useContext(OnboardingContext)
  if (!ob)
    throw new Error('useOnboarding must be used within a OnboardingProvider')
  return ob
}
