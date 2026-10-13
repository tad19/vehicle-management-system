const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Vehicle name is required'],
        trim: true
    },
    type:{
        type: String,
        required: [true, 'Vehicle type is required'],
        enum: ['Vehicle', 'Heavy Machinery', 'Generator', 'Tool', 'Other']
    },
    serialNumber:{ 
        type: String, 
        required: [true, 'Serial number or VIN is required'], 
        unique: true, 
        trim: true 
    },
    status:{ 
        type: String, 
        default: 'Available',
        enum: ['Available', 'In Use', 'Maintenance', 'Decommissioned']
    },
    mileageOrHours:{ 
        type: Number, 
        default: 0 
    },
    location:{ 
        type: String, 
        trim: true 
    },
    imageUrl:{ 
        type: String 
    },
    notes:{ 
        type: String 
    }
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Equipment', equipmentSchema);
