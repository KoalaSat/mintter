import {zodResolver} from '@hookform/resolvers/zod'
import {Profile} from '@mintter/shared'
import {
  Button,
  DialogTitle,
  Form,
  Label,
  Spinner,
  XStack,
  YStack,
} from '@mintter/ui'
import {useEffect} from 'react'
import {Control, useController, useForm} from 'react-hook-form'
import {z} from 'zod'
import {useMyAccount, useSetProfile} from '../models/accounts'
import {getAvatarUrl} from '../utils/account-url'
import {AvatarForm} from './avatar-form'
import {useAppDialog} from './dialog'
import {FormError, FormInput, FormTextArea} from './form-input'

export function useEditProfileDialog() {
  // for some reason the dialog doesn't work if the input is falsy
  // input is not needed for this dialog, so we just use "true", lol
  return useAppDialog<true>(EditProfileDialog)
}

function EditProfileDialog({onClose}: {onClose: () => void}) {
  const myAccount = useMyAccount()
  const profile = myAccount.data?.profile
  return (
    <>
      <DialogTitle>Edit Profile</DialogTitle>
      {profile ? (
        <ProfileForm profile={profile} onDone={onClose} />
      ) : (
        <Spinner />
      )}
    </>
  )
}

const profileSchema = z.object({
  alias: z.string().min(1, {message: 'Profile alias is required'}),
  bio: z.string().optional(),
  avatar: z.string().optional(),
})
type ProfileFields = z.infer<typeof profileSchema>

function AvatarInput({control}: {control: Control<ProfileFields>}) {
  const c = useController({control, name: 'avatar'})
  return (
    <AvatarForm
      onAvatarUpload={c.field.onChange}
      url={c.field.value ? getAvatarUrl(c.field.value) : undefined}
    />
  )
}

function ProfileForm({
  profile,
  onDone,
}: {
  profile: Profile
  onDone: () => void
}) {
  const setProfile = useSetProfile({
    onSuccess: onDone,
  })
  const {
    control,
    handleSubmit,
    setFocus,
    formState: {errors},
  } = useForm<ProfileFields>({
    resolver: zodResolver(profileSchema),
    // OMG wow, this object gets mutated! bad things will happen if we don't spread the profile into a new object:
    defaultValues: {...profile},
  })

  useEffect(() => {
    setFocus('alias')
  }, [setFocus])

  return (
    <XStack gap="$4">
      <YStack flex={0} alignItems="center" flexGrow={0}>
        <AvatarInput control={control} />
      </YStack>
      <YStack flex={1}>
        <Form
          onSubmit={handleSubmit((values) => {
            setProfile.mutate(values)
          })}
        >
          <Label htmlFor="alias">Alias</Label>
          <FormError name="alias" errors={errors} />
          <FormInput id="alias" name="alias" control={control} />
          <Label htmlFor="bio">Bio</Label>
          <FormError name="bio" errors={errors} />
          <FormTextArea
            id="bio"
            name="bio"
            control={control}
            placeholder="A little bit about yourself..."
          />

          <XStack gap="$4" alignItems="center" paddingTop="$3">
            <Form.Trigger asChild>
              <Button theme="green" disabled={setProfile.isLoading}>
                Save Profile
              </Button>
            </Form.Trigger>
          </XStack>
        </Form>
      </YStack>
    </XStack>
  )
}
