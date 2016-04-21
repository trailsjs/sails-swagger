/**
 * Contact.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    testInstance() {
        return {
        	name: 'Contact Name',
        	group: [
                 {
                 	name: 'Group Name'
                 }
        	]
        }
    },

    attributes: {
        name: {
            type: 'string',
            defaultsTo: 'Contact Name'
        },
        group: {
            model: 'Group'
        }

    }
};
