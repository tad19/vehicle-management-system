const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');


router.post('/', async(req, res) => {
    try{
        const newVehicle = new Vehicle(req.body);
        const savedVehicle = await newVehicle.save();
        res.status(201).json(savedVehicle);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.get('/:id', async(req, res) => {
    try{
        const vehicleList = await Vehicle.find();
        res.status(200).json(vehicleList);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.get('/:id', async(req, res) => {
    try{
        const vehicle = await Vehicle.findByID(req.params.id);
        if(!equipment){
            return res.status(404).json({error: 'Vehicle not found.'});
        }
        res.status(200).json(vehicle);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.put('/:id', async(req, res) => {
    try{
        const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body,{
            new: true, runValidators: true
        });
        if(!updatedVehicle){
            return res.status(404).json({error: 'Vehicle not found.'});
        }
        res.status(200).json(updatedVehicle);
    }
    catch(err){
        res.status(400).json({error: err.message});
    }
});

router.delete('/:id', async(req, res) => {
    try{
        const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if(!deletedVehicle){
            return res.status(400).json({error: 'Vehicle not found.'});
        }
        res.status(200).json({message: 'Vehicle deleted successfully'});
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

module.exports = router;