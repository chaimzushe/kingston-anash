export default {
  name: 'pushSubscription',
  title: 'Push Subscriptions',
  type: 'document',
  fields: [
    {
      name: 'endpoint',
      title: 'Endpoint',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'keys',
      title: 'Keys',
      type: 'object',
      fields: [
        {
          name: 'p256dh',
          title: 'P256DH Key',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'auth',
          title: 'Auth Key',
          type: 'string',
          validation: Rule => Rule.required()
        }
      ]
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
      ]
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
    }
  ],
  preview: {
    select: {
      title: 'endpoint',
      subtitle: 'status'
    },
    prepare({ title, subtitle }) {
      return {
        title: title ? `Subscription: ${title.substring(0, 30)}...` : 'Push Subscription',
        subtitle
      };
    }
  }
}
