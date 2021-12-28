const mongoose = require("mongoose");

module.exports = {
	// When user is known
	aggregateConvo: userId => [
		// From last seen
		{
			$lookup: {
				from: "lastseens",
				localField: "_id",
				foreignField: "conversationId",
				as: "lastseen",
			},
		},
		{
			$unwind: "$lastseen",
		},
		{
			$match: {
				"lastseen.userId": mongoose.Types.ObjectId(userId),
			},
		},
		// Get receiver details
		{
			$unwind: "$members",
		},
		{
			$match: {
				members: {
					$nin: [userId],
				},
			},
		},
		{
			$addFields: { memberId: { $toObjectId: "$members" } },
		},
		{
			$lookup: {
				from: "users",
				localField: "memberId",
				foreignField: "_id",
				as: "member",
			},
		},
		{
			$unwind: "$member",
		},
		// Get latestmsg
		{
			$lookup: {
				from: "messages",
				localField: "_id",
				foreignField: "conversationId",
				as: "latestMsg",
				pipeline: [{ $sort: { createdAt: -1 } }, { $limit: 1 }],
			},
		},
		{
			$unwind: {
				path: "$latestMsg",
				preserveNullAndEmptyArrays: true,
			},
		},
		// Get sender
		{
			$lookup: {
				from: "users",
				localField: "latestMsg.sender",
				foreignField: "_id",
				as: "latestMsg.senderDetails",
			},
		},
		{
			$unwind: {
				path: "$latestMsg.senderDetails",
				preserveNullAndEmptyArrays: true,
			},
		},
		// Group values
		{
			$group: {
				_id: "$_id",
				members: {
					$push: "$member",
				},
				newMsg: { $first: "$newMsg" },
				lastSeen: { $first: "$lastseen.lastSeen" },
				isGroup: { $first: "$isGroup" },
				groupName: { $first: "$groupName" },
				latestMsg: { $first: "$latestMsg" },
				updatedAt: { $first: "$updatedAt" },
				onGoingCall: { $first: "$onGoingCall" },
				groupImg: { $first: "$groupImg" },
			},
		},
		// project values
		// {
		// 	$project: {
		// 		_id: "$_id",
		// 		newMsg: "$newMsg",
		// 		lastSeen: "$lastseen.lastSeen",
		// 		receiver: {
		// 			username: "$receiver.username",
		// 			profilePic: "$receiver.profilePic",
		// 		},
		// 		groupName: "$groupName",
		// 		isGroup: "$isGroup",
		// 		receiverId: "$receiver._id",
		// 		latestMsg: {
		// 			text: "$latestMsg.text",
		// 			img: "$latestMsg.img",
		// 			sender: "$latestMsg.sender",
		// 			autoMsg: "$latestMsg.autoMsg",
		// 		},
		// 	},
		// },
	],
	// When user is not known
	aggregateGroup: convoId => [
		{
			$match: {
				_id: mongoose.Types.ObjectId(convoId),
			},
		},
		// Get member details
		{
			$unwind: "$members",
		},
		{
			$addFields: { memberId: { $toObjectId: "$members" } },
		},
		{
			$lookup: {
				from: "users",
				localField: "memberId",
				foreignField: "_id",
				as: "member",
			},
		},
		{
			$unwind: "$member",
		},
		// Get cur member last seens
		{
			$lookup: {
				from: "lastseens",
				let: { member: "$memberId" },
				localField: "_id",
				foreignField: "conversationId",
				as: "lastseen",
				pipeline: [
					{ $match: { $expr: { $eq: ["$$member", "$userId"] } } },
				],
			},
		},
		{
			$unwind: "$lastseen",
		},
		// Get latestmsg
		{
			$lookup: {
				from: "messages",
				localField: "_id",
				foreignField: "conversationId",
				as: "latestMsg",
				pipeline: [{ $sort: { createdAt: -1 } }, { $limit: 1 }],
			},
		},
		{
			$unwind: {
				path: "$latestMsg",
				preserveNullAndEmptyArrays: true,
			},
		},
		// group
		{
			$group: {
				_id: "$_id",
				members: {
					$push: "$member",
				},
				newMsg: { $first: "$newMsg" },
				lastSeen: { $push: "$lastseen" },
				isGroup: { $first: "$isGroup" },
				groupName: { $first: "$groupName" },
				latestMsg: { $first: "$latestMsg" },
				updatedAt: { $first: "$updatedAt" },
				onGoingCall: { $first: "$onGoingCall" },
				groupImg: { $first: "$groupImg" },
			},
		},
	],
};
