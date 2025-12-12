import mongoose, {Schema} from 'mongoose';

const sweetSchema = new Schema({   
    name: {     
        type: String,     
        required: true,   
    },  
    flavor: {   
        type: String,     
        required: true,   
    },  
    price: {
        type: Number,   
        required: true, 
        min: 0, 
    },  
    category: {    
        type: String,     
        enum: ['candy', 'chocolate', 'pastry', 'other'], 
        default: 'other', 
    },
    inStock: {          
        type: Boolean,     
        default: true,   
    }, 
    sweetImage: {
        type: String,
        default: null,
    },
}, {   
    timestamps: true,
}); 

export const Sweet = mongoose.model("Sweet",sweetSchema)