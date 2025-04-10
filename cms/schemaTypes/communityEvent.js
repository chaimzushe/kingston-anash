export default {
  name: 'communityEvent',
  title: 'Community Events',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Optional description of the event'
    },
    {
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: Rule => Rule.required()
    },
    {
      name: 'startTime',
      title: 'Start Time',
      type: 'string',
      description: 'Format: HH:MM (24-hour)',
      validation: Rule => Rule.required().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'Please use 24-hour format (HH:MM)'
      })
    },
    {
      name: 'endTime',
      title: 'End Time',
      type: 'string',
      description: 'Format: HH:MM (24-hour)',
      validation: Rule => Rule.required().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'Please use 24-hour format (HH:MM)'
      })
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'gender',
      title: 'Gender',
      type: 'string',
      options: {
        list: [
          { title: 'Men', value: 'men' },
          { title: 'Women', value: 'women' },
          { title: 'Both', value: 'both' }
        ],
        layout: 'radio'
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'creator',
      title: 'Creator',
      type: 'object',
      fields: [
        {
          name: 'id',
          title: 'Creator ID',
          type: 'string'
        },
        {
          name: 'name',
          title: 'Creator Name',
          type: 'string'
        },
        {
          name: 'email',
          title: 'Creator Email',
          type: 'string'
        }
      ]
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      readOnly: true
    }
  ],
  initialValue: {
    gender: 'both',
    createdAt: (new Date()).toISOString()
  },
  preview: {
    select: {
      title: 'title',
      subtitle: 'date',
      location: 'location'
    },
    prepare({ title, subtitle, location }) {
      return {
        title,
        subtitle: `${new Date(subtitle).toLocaleDateString()} at ${location}`
      }
    }
  }
}
