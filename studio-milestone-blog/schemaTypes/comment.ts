import { Rule } from 'sanity';

export default {
  name: 'clientComment',
  type: 'document',
  title: 'Client Comment',
  fields: [
    {
      name: 'commentText',
      type: 'string',
      title: 'Comment Text',
      description: 'The text of the client comment.',
      validation: (Rule: Rule) => Rule.required().min(5).max(500),
    },
    {
      name: 'clientName',
      type: 'string',
      title: 'Client Name',
      description: 'Name of the client who submitted the comment.',
      validation: (Rule: Rule) => Rule.required().min(2).max(100),
    },
    {
      name: 'email',
      type: 'email',
      title: 'Client Email',
      description: 'Email address of the client.',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'approved',
      type: 'boolean',
      title: 'Approval Status',
      description: 'Mark if the comment is approved or not.',
      initialValue: false,
    },
    {
      name: 'submissionDate',
      type: 'datetime',
      title: 'Submission Date',
      description: 'The date and time the comment was submitted.',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'additionalNotes',
      type: 'text',
      title: 'Additional Notes',
      description: 'Any additional notes or remarks about the comment.',
    },
  ],
  preview: {
    select: {
      title: 'clientName',
      subtitle: 'commentText',
      media: 'approved',
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title,
        subtitle: subtitle ? `${subtitle.substring(0, 50)}...` : '',
        media,
      };
    },
  },
};
