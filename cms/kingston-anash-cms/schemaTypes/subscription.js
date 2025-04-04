export default {
  name: 'subscription',
  title: 'Subscriptions',
  type: 'document',
  fields: [
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => Rule.required().email()
    },
    {
      name: 'categories',
      title: 'Subscribed Categories',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'category' }]
        }
      ],
      validation: Rule => Rule.required()
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        timeStep: 15,
        calendarTodayLabel: 'Today'
      },
      initialValue: () => new Date().toISOString()
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Unsubscribed', value: 'unsubscribed' }
        ]
      },
      initialValue: 'active'
    },
    {
      name: 'confirmationToken',
      title: 'Confirmation Token',
      type: 'string',
      hidden: true
    }
  ],
  preview: {
    select: {
      title: 'email',
      subtitle: 'status'
    }
  }
}
