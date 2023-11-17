// SummonOption.stories.ts
import type { Meta, StoryObj } from '@storybook/react'
import SummonOption from './SummonOption'

const meta: Meta<typeof SummonOption> = {
  title: 'COMPONENTS/Summon Option',
  component: SummonOption,
  tags: ['autodocs'],
  argTypes: {},
}

export default meta

type Story = StoryObj<typeof SummonOption>

export const Primary: Story = {
  args: {},
}
