/**
 * Group.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    testInstance() {
        return {
            name: 'Group Name',
            contacts: [{
                name: 'Contact 1'
            }, {
                name: 'Contact 2'
            }]
        }
    },

    attributes: {
        name: {
            type: 'string',
            defaultsTo: 'Group Name'
        },
        contacts: {
            collection: 'Contact',
            via: 'group'
        }

    }
};
