import {Avatar} from '@mintter/app/components/avatar'
import appError from '@mintter/app/errors'
import {useAccount} from '@mintter/app/models/accounts'
import {useNavigate} from '@mintter/app/utils/useNavigate'
import {Button, FontSizeTokens, Tooltip, YStack} from '@mintter/ui'
import {AlertCircle} from '@tamagui/lucide-icons'
import {getAvatarUrl} from '../utils/account-url'

export function ErrorDot() {
  return (
    <YStack
      backgroundColor={'#ff3333'}
      display="flex"
      position="absolute"
      top={-8}
      left={-8}
      padding={0}
      paddingLeft={-4}
      width={16}
      height={16}
      borderRadius={8}
    >
      <AlertCircle size={16} />
    </YStack>
  )
}

export function AccountLinkAvatar({
  accountId,
  size = 20,
}: {
  accountId?: string
  size?: FontSizeTokens | number
}) {
  const navigate = useNavigate()
  const account = useAccount(accountId)

  let content = account.data?.profile ? (
    <Avatar
      size={size}
      label={account.data.profile.alias}
      id={account.data.id}
      url={getAvatarUrl(account.data?.profile?.avatar)}
    />
  ) : (
    <>
      <Avatar size="$1" label={'?'} id={accountId!} />
      {account.error ? <ErrorDot /> : null}
    </>
  )
  return (
    <Tooltip content={account.data?.profile?.alias || account.data?.id || ''}>
      <Button
        id="avatar"
        className="no-window-drag"
        size="$1"
        backgroundColor="transparent"
        hoverStyle={{backgroundColor: 'transparent'}}
        minWidth={20}
        minHeight={20}
        padding={0}
        onPress={(e) => {
          e.preventDefault()
          e.stopPropagation()
          if (!accountId) return appError('No account ready to load')
          navigate({key: 'account', accountId})
        }}
        position="relative"
        height={size}
      >
        {content}
      </Button>
    </Tooltip>
  )
}
