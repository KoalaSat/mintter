import {zodResolver} from '@hookform/resolvers/zod'
import {Button, Form, Input, Label, Tooltip} from '@mintter/ui'
import {BookPlus, Plus} from '@tamagui/lucide-icons'
import {useEffect} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'
import {toast} from 'react-hot-toast'
import * as z from 'zod'
import {useCreateGroup} from '../models/groups'
import {useNavigate} from '../utils/useNavigate'
import {AppDialog, DialogTitle} from './dialog'
import {FormInput} from './form-input'

const newGroupSchema = z.object({
  title: z.string().min(1, {message: 'Group title is required'}),
  description: z.string().optional(),
})
type NewGroupFields = z.infer<typeof newGroupSchema>

function AddGroupForm({
  onClose,
  isOpen,
}: {
  onClose: () => void
  isOpen: boolean
}) {
  const {mutateAsync} = useCreateGroup()
  const navigate = useNavigate()
  const {
    control,
    handleSubmit,
    setFocus,
    formState: {errors},
  } = useForm<NewGroupFields>({
    resolver: zodResolver(newGroupSchema),
  })

  useEffect(() => {
    isOpen && setFocus('title')
  }, [isOpen, setFocus])

  const onSubmit: SubmitHandler<NewGroupFields> = (data) => {
    onClose()
    toast.promise(
      mutateAsync(data).then((groupId) => {
        navigate({
          key: 'group',
          groupId,
        })
      }),
      {
        loading: 'Creating...',
        success: 'Group Created!',
        error: 'Failed to Create Group',
      },
    )
  }
  console.log(errors)

  return (
    <>
      <DialogTitle>Create Group</DialogTitle>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Label htmlFor="title">Title</Label>
        <FormInput placeholder={'Group Name'} control={control} name="title" />
        <Label htmlFor="description">Description</Label>
        <FormInput
          multiline
          minHeight={60}
          placeholder={'About this group...'}
          control={control}
          name="description"
        />
        <Form.Trigger asChild>
          <Button>Create Group</Button>
        </Form.Trigger>
      </Form>
    </>
  )
}

function NewGroupButton(props: React.ComponentProps<typeof Button>) {
  return <Button size="$2" iconAfter={Plus} {...props} />
}
export function CreateGroupButton() {
  return (
    <Tooltip content="Create Group">
      <AppDialog
        TriggerComponent={NewGroupButton}
        ContentComponent={AddGroupForm}
      />
    </Tooltip>
  )
}
