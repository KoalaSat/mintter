import {Button, Text, YStack} from '@mintter/ui'

export function EmptyList({
  description,
  action,
}: {
  description: string
  action: () => void
}) {
  return (
    <YStack gap="$5" paddingVertical="$4">
      <Text fontFamily="$body" fontSize="$3">
        {description}
      </Text>
      <Button size="$4" onPress={() => action()} alignSelf="flex-start">
        Create a new Document
      </Button>
    </YStack>
  )
}
