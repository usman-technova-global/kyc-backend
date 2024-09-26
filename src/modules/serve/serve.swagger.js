const swagger = {
  serveSuccess: {
    schema: {
      description: 'this will fetch payment success html page',
      tags: ['serve'],
      summary: 'fetch payment success',
    },
  },

  serveFailure: {
    schema: {
      description: 'this will fetch payment cancel html page',
      tags: ['serve'],
      summary: 'fetch payment cancel',
    },
  },
};

module.exports = swagger;
