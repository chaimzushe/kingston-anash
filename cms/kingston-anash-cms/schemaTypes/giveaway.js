export default {
  name: 'giveaway',
  title: 'Giveaway',
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
      validation: Rule => Rule.required()
    },
    {
      name: 'condition',
      title: 'Condition',
      type: 'string',
      options: {
        list: [
          {title: 'New', value: 'New'},
          {title: 'Like New', value: 'Like New'},
          {title: 'Good', value: 'Good'},
          {title: 'Fair', value: 'Fair'},
          {title: 'Poor', value: 'Poor'},
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'contactName',
      title: 'Contact Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
    },
    {
      name: 'contactPhone',
      title: 'Contact Phone',
      type: 'string',
    },
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      validation: Rule => Rule.max(3)
    },
    {
      name: 'postedDate',
      title: 'Posted Date',
      type: 'datetime',
      validation: Rule => Rule.required()
    },
    {
      name: 'isAvailable',
      title: 'Is Available',
      type: 'boolean',
      initialValue: true
    },
    {
      name: 'price',
      title: 'Price (in dollars)',
      type: 'number',
      initialValue: 0
    },
    {
      name: 'isFree',
      title: 'Is Free',
      type: 'boolean',
      initialValue: true
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}]
    },
    {
      name: 'userId',
      title: 'User ID',
      type: 'string',
      description: 'ID of the user who posted this giveaway',
      validation: Rule => Rule.required()
    },
    {
      name: 'userEmail',
      title: 'User Email',
      type: 'string',
      description: 'Email of the user who posted this giveaway',
      validation: Rule => Rule.required()
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'images.0'
    }
  }
}
