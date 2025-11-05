export default class ApiHelpers {
  constructor(knex, tableName) {
    this.knex = knex;
    this.tableName = tableName;
  }

  async insert(values, tableName, returnField, amqpChannel, msg) {
    //console.log(values)
    await this.knex(tableName)
      .insert(values)
      .returning(returnField)
      .then((suc) => {
        amqpChannel.ack(msg);
      })
      .catch((err) => {
        /** DB-d nemej chadaagui tohioldold rabbitruu msg-g butsaana */
        console.log(err);
        amqpChannel.nack(msg);
      });
  }

  async findOne(value, tableName = this.tableName) {
    return await this.knex(tableName).where({ code: value, status: 'A' });
  }
}
