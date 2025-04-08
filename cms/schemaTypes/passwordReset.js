export default {
  name: 'passwordReset',
  title: 'Password Reset Tokens',
  type: 'document',
  fields: [
    {
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'token',
      title: 'Reset Token',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'expiresAt',
      title: 'Expires At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'used',
      title: 'Used',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'usedAt',
      title: 'Used At',
      type: 'datetime',
    },
  ],
  preview: {
    select: {
      title: 'user.email',
      subtitle: 'createdAt',
      used: 'used',
    },
    prepare({ title, subtitle, used }) {
      return {
        title: title || 'No user',
        subtitle: `${new Date(subtitle).toLocaleString()} - ${used ? 'Used' : 'Active'}`,
      };
    },
  },
}
