const router = require('express').Router();
const auth = require('../middlewares/Auth.js');
const {ToysModel, ToyValidation} = require('../models/ToysModel.js')
const {UserModel} = require('../models/UserModel.js');
router.get('/', async(req, res)=>{
    let perPage = Math.min(req.query.perPage, 15) || 10;
    let page = req.query.page || 1;
    let dbProperty = req.query.orderBy || "_id";
    let reverse = req.query.reverse == "yes" ? -1 : 1 || 1;
    try {
        let database = await ToysModel
        .find({})
        .limit(perPage)//10 objects for a request
        .skip((page - 1) * perPage)// expand the reach to more objects than the head objects.
        .sort({[dbProperty]: reverse});// 
        return res.status(201).json(database);
        
    } catch (error) {
        return res.sendStatus(500);
        
    }

    
  
    

});
router.get('/search', async(req, res)=>{
    let search = req.query.s;
    let perPage = Math.min(req.query.perPage,15) || 10;
    let page = req.query.page || 1;
    try {
        let database = await ToysModel.find({
            $or: [{ name: search }, { info: search }]
        })
        .limit(perPage)
        .skip((page - 1) * perPage);
        return res.status(201).json(database);
        
    } catch (error) {
        return res.sendStatus(500);
        
    }
    
    
    

    
});
router.get('/category/:toycatname',async(req, res)=>{
   let toycatname = req.params.toycatname; 
   let perPage = Math.min(req.query.perPage,15) || 10;
   let page = req.query.page || 1;
   try {
    let database = await ToysModel.find({category: toycatname})
    .limit(perPage)// 10 objects limit
    .skip((page - 1) * perPage);// skip to next 10 objects formula
    return res.status(201).json(database);
    
} catch (error) {
    return res.sendStatus(500);
    
}
});

router.get('/prices', async (req, res) => {
    let min = req.query.min || 10;
    let max = req.query.max || 40;
    let perPage = Math.min(req.query.perPage,15) || 10;
    let page = req.query.page || 1;
    try {
        let toysInRange = await ToysModel.find({
            price: { $gte: min, $lte: max }
          })
          .limit(perPage)
          .skip((page -1) * perPage);
          return res.status(201).json(toysInRange)
          
          
    } catch (error) {
        return res.sendStatus(500);
        
    }
    
});
router.get('/single/:id', async (req, res) => {
    let paramId = req.params.id;
    try {
        let toy = await ToysModel.findOne({_id: paramId});
        return res.status(201).json(toy);
    } catch (error) {
        return res.status(500).send(error);
    }
    
    
});
router.get('/count', async (req, res) => {
    try {
        let databaseCollectionCount = await ToysModel.countDocuments();
        return res.status(201).json({count: databaseCollectionCount});
    } catch (error) {
        return res.sendStatus(500);
    }
    
})
router.post('/',auth, async (req, res) => {
    let toy = req.body;
    toy.user_id = req.tokenData._id;
    const { error } = ToyValidation(toy);
    if(error){
        return res.json({err: error.details[0].message});
    }
    try {
        let database = new ToysModel(toy);
        await database.save();
        toy.user_id = "*****";
        return res.status(201).json(toy);
        
    } catch (error) {
        return res.sendStatus(500);
    }
});  
router.put('/:id',auth, async (req, res) => {
    let toyID = req.params.id;
    let toy = req.body;
    const {error} = ToyValidation(toy);
    if(error){
        return res.json({err: error.details[0].message});
    }
    if (toy.user_id != req.tokenData._id || req.tokenData._role != 'admin') {
        return res.status(401).json({toy:"", err:"not allowed to change someone else toys"});

        
    }
    try {
        const result = await ToysModel.updateOne({_id: toyID},{$set: toy});
        if (result.modifiedCount === 0) {
            return res.status(401).json({toy:"Toy not found or no changes made", err:""});

        }
        return res.status(201).json({toy:toy, err:""});
    } catch (error) {
        return res.sendStatus(500);
        
    }


    

   
    
});
router.delete('/:id', auth, async (req, res) => {
    const delID = req.params.id;
    let filter = { _id: delID };
    // Allow admin to delete any toy
    if (req.tokenData._role !== 'admin') {
    filter.user_id = req.tokenData._id; // Restrict to owner if not admin
    }
    try {
        const toy = await ToysModel.findOneAndDelete(filter);

        if (!toy) {
            return res.status(401).json({ err: "Toy not found or not allowed to delete" });
        }

        return res.status(204).json({ msg: "Toy deleted successfully" });
        
    } catch (error) {
        return res.status(500).json({ err: 'Something went wrong' });
    }
});

module.exports = router;