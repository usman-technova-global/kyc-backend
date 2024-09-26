const swagger = {
  newPhraseSchema: {
    schema: {
      description: 'this will send email to user',
      tags: ['Email'],
      summary: 'send email to user',
      params: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            format: 'uuid',
            description: 'user ID',
          },
        },
        required: ['userId'],
        additionalProperties: false,
      },
    },
  },
};

module.exports = swagger;
