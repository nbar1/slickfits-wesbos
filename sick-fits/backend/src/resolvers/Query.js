const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
	items: forwardTo('db'),
	item: forwardTo('db'),
	itemsConnection: forwardTo('db'),
	me: (parent, args, ctx, info) => {
		// check for current user id
		if (!ctx.request.userId) {
			return null;
		}

		return ctx.db.query.user(
			{
				where: { id: ctx.request.userId },
			},
			info
		);
	},
	users: async (parent, args, ctx, info) => {
		// check if logged in
		if (!ctx.request.userId) throw new Error('You must be logged in');

		// check if user has perms to query all users
		hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);

		// if valid, query all users
		return ctx.db.query.users({}, info);
	},
};

module.exports = Query;
