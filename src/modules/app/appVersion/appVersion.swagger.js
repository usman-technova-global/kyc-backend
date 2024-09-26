const swagger = {
  iosAppVersion: {
    schema: {
      description: 'this will fetch ios app version',
      tags: ['app|Version'],
      summary: 'ios app version',
    },
  },

  androidAppVersion: {
    schema: {
      description: 'this will fetch android app version',
      tags: ['app|Version'],
      summary: 'android app version',
    },
  },
};

module.exports = swagger;
