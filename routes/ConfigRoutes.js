const toysR = require('./toys.js');
const usersR = require('./users.js');
const Routes = (app)=>{
 app.use('/toys',toysR );
 app.use('/users', usersR);
};
module.exports = Routes;