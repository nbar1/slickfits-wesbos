const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { transport, makeANiceEmail } = require('../mail');

const Mutations = {
	async createItem(parent, args, ctx, info) {
		// todo check if logged in
		const item = await ctx.db.mutation.createItem(
			{
				data: {
					...args,
				},
			},
			info
		);

		return item;
	},

	updateItem(parent, args, ctx, info) {
		// take a copy of the updates
		const updates = { ...args };
		// remove ID because we don't want it to change
		delete updates.id;

		return ctx.db.mutation.updateItem(
			{
				data: updates,
				where: {
					id: args.id,
				},
			},
			info
		);
	},

	async deleteItem(parent, args, ctx, info) {
		const where = { id: args.id };
		// 1. find the item
		const item = await ctx.db.query.item({ where }, `{ id title}`);
		// 2. Check if they own that item, or have the permissions
		// TODO
		// 3. Delete it!
		return ctx.db.mutation.deleteItem({ where }, info);
	},

	async signup(parent, args, ctx, info) {
		args.email = args.email.toLowerCase();

		// hash password
		const password = await bcrypt.hash(args.password, 10);

		// create user in db
		const user = await ctx.db.mutation.createUser(
			{
				data: {
					...args,
					password,
					permissions: { set: ['USER'] },
				},
			},
			info
		);

		// create the JWT token
		const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
		ctx.response.cookie('token', token, {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
		});

		return user;
	},

	async signin(parent, { email, password }, ctx, info) {
		// check if user with email
		const user = await ctx.db.query.user({ where: { email } });
		if (!user) {
			throw new Error(`No such user found for email ${email}`);
		}

		// check if pw corect
		const valid = await bcrypt.compare(password, user.password);
		if (!valid) {
			throw new Error('Invalid Password');
		}

		// generate the jwt token
		const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

		// set the cookie with the token
		ctx.response.cookie('token', token, {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
		});

		// return the user
		return user;
	},

	signout(parent, args, ctx, info) {
		ctx.response.clearCookie('token');

		return { message: 'Goodbye' };
	},

	async requestReset(parent, args, ctx, info) {
		// check if real user
		const user = await ctx.db.query.user({ where: { email: args.email } });

		if (!user) {
			throw new Error(`No such user found for email ${args.email}`);
		}

		// set reset token and expiry
		const resetToken = (await promisify(randomBytes)(20)).toString('hex');
		const resetTokenExpiry = Date.now() + 3600000; // 1 hour

		const res = await ctx.db.mutation.updateUser({
			where: { email: args.email },
			data: { resetToken, resetTokenExpiry },
		});

		// email user reset token
		const mailRes = await transport.sendMail({
			from: 'password@syniba.com',
			to: user.email,
			subject: 'Your Password Reset Token',
			html: makeANiceEmail(
				`Your password reset token is here: \n\n<a href="${
					process.env.FRONTEND_URL
				}/reset?resetToken=${resetToken}">Click here to reset</a>`
			),
		});

		// return the message
		return { message: 'thanks' };
	},

	async resetPassword(parent, args, ctx, info) {
		// check if passwords match
		if (args.password !== args.confirmPassword) {
			throw new Error("Your passwords don't match");
		}

		// check if legit token
		// check if expired
		const [user] = await ctx.db.query.users({
			where: {
				resetToken: args.resetToken,
				resetTokenExpiry_gte: Date.now() - 36000000,
			},
		});

		if (!user) {
			throw new Error('This token is either invalid or expired');
		}

		// hash new password
		const password = await bcrypt.hash(args.password, 10);

		// save new password to user and remove reset token
		const updatedUser = await ctx.db.mutation.updateUser({
			where: { email: user.email },
			data: {
				password,
				resetToken: null,
				resetTokenExpiry: null,
			},
		});

		// generate JWT
		const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);

		// set JWT cookie
		ctx.response.cookie('token', token, {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 365,
		});

		// return new user
		return updatedUser;
	},
};

module.exports = Mutations;
