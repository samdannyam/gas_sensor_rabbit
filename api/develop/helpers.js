let amqp = require("amqplib/callback_api");

var amqpUrl =
	process.env.AMP_PROTOCOL +
	"://" +
	process.env.AMP_USER +
	":" +
	process.env.AMP_PASSWORD +
	"@" +
	process.env.AMP_HOST;
let options = {
	durable: true,
	exclusive: false,
	autoDelete: false,
	arguments: null,
	clientId: "dambiiSendClientID",
};

export default class DevelopApiHelpers {
	constructor() {
		this.createCh = this.createCh.bind(this);
		this.sendData = this.sendData.bind(this);
	}

	sendData(req, res, amqpChannel, amqpConn) {
		let msg = req.body.data;
		let queue = req.body.queue_name;
		amqpChannel.assertQueue(queue, options);
		for (let i = 0; i < req.body.loop; i++) {
			amqpChannel.sendToQueue(queue, Buffer.from(msg + " - " + i));
			// console.log("Sent data => " + msg + " - " + i + " == " + queue);
		}
		return res
			.status(404)
			.json({ code: 101, status: "success send data = " + msg });
	}

	createCh(req, res, amqpConn) {
		amqpConn.createChannel(function (err, channel) {
			if (err)
				return res
					.status(404)
					.json({
						code: 102,
						status: "AMQP error create channel => " + err.toString(),
					});
			const helpers = new DevelopApiHelpers();
			helpers.sendData(req, res, channel, amqpConn);
		});
	}

	async start(req, res) {
		amqp.connect(amqpUrl, function (err, conn) {
			if (err)
				return res
					.status(404)
					.json({
						code: 102,
						status: "AMQP error connection => " + err.toString(),
					});
			const helpers = new DevelopApiHelpers();
			helpers.createCh(req, res, conn);
		});
	}
}
