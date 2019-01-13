module.exports = {


  friendlyName: 'View welcome page',


  description: 'Display the dashboard "Welcome" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/dashboard/welcome',
      description: 'Display the welcome page for authenticated users.'
    },

  },


  default: async function (req, res) {
    console.log("default ...");
  },

  main: async function (req, res) {
    console.log("main ...");
  }

};
