import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

const jwt_secret_key = process.env.JWT_SECRET_KEY;

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			match: /^.+@.+\..+$/,
		},
		phone: {
			type: String,
			required: false,
		},
		gender: {
			type: String,
			enum: ["Male", "Female", "Others"],
			required: true,
			default: "Male",
		},
		password: {
			type: String,
			required: true,
			minlength: 8,
			maxlength: 20,
		},
		profile_picture: {
			type: String,
			required: false,
		},
	},
	{ timestamps: true }
);

UserSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
		this.password = await bcrypt.hash(this.password, 10);
	}
	next();
});

UserSchema.methods.isPasswordCorrect = async function (new_password) {
	return await bcrypt.compare(new_password, this.password);
};

UserSchema.methods.generateAccessToken = async function () {
	const access_token = await jsonwebtoken.sign(
		{
			id: this._id,
			name: this.name,
			email: this.email,
			phone: this.phone,
			gender: this.gender,
			profile_picture: this.profile_picture,
		},
		jwt_secret_key,
		{ expiresIn: "1d" }
	);
	return access_token;
};

UserSchema.statics.verifyAccessToken = async function (access_token) {
	return jsonwebtoken.verify(access_token, jwt_secret_key);
};

const User = mongoose.model("User", UserSchema);

export default User;
