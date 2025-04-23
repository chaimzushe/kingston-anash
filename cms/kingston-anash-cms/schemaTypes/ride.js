export default {
  name: 'ride',
  title: 'Ride Share',
  type: 'document',
  fields: [
    {
      name: 'driverName',
      title: 'Driver Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'origin',
      title: 'Origin',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'destination',
      title: 'Destination',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'departureDate',
      title: 'Departure Date',
      type: 'date',
      validation: Rule => Rule.required()
    },
    {
      name: 'departureTime',
      title: 'Departure Time',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'isRoundTrip',
      title: 'Round Trip',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'returnDate',
      title: 'Return Date',
      type: 'date',
      hidden: ({document}) => !document?.isRoundTrip
    },
    {
      name: 'returnTime',
      title: 'Return Time',
      type: 'string',
      hidden: ({document}) => !document?.isRoundTrip
    },
    {
      name: 'availableSeats',
      title: 'Available Seats',
      type: 'number',
      validation: Rule => Rule.required().min(1).max(10)
    },
    {
      name: 'pricePerSeat',
      title: 'Price Per Seat',
      type: 'number',
      validation: Rule => Rule.required().min(0)
    },
    {
      name: 'vehicleType',
      title: 'Vehicle Type',
      type: 'string',
      options: {
        list: [
          {title: 'Sedan', value: 'Sedan'},
          {title: 'SUV', value: 'SUV'},
          {title: 'Minivan', value: 'Minivan'},
          {title: 'Van', value: 'Van'},
          {title: 'Truck', value: 'Truck'},
          {title: 'Other', value: 'Other'}
        ]
      }
    },
    {
      name: 'notes',
      title: 'Additional Notes',
      type: 'text'
    },
    {
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string'
    },
    {
      name: 'contactPhone',
      title: 'Contact Phone',
      type: 'string'
    },
    {
      name: 'userId',
      title: 'User ID',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'userEmail',
      title: 'User Email',
      type: 'string'
    },
    {
      name: 'postedDate',
      title: 'Posted Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    }
  ],
  preview: {
    select: {
      title: 'origin',
      subtitle: 'destination',
      date: 'departureDate'
    },
    prepare({title, subtitle, date}) {
      return {
        title: `${title} → ${subtitle}`,
        subtitle: date ? new Date(date).toLocaleDateString() : 'No date'
      }
    }
  }
}
