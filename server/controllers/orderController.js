import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const placeOrderCOD = async(req,res) =>{
    try{
        const {userId,items,address} = req.body;
        if(!address || items.length === 0 ) {
            return res.json({success: false,message:"Invalid Data"})
        }
        let amount = await items.reduce(async(ActiveXObject,item) => {
            const product = await Product.findById(item.product);
            return (await acc) + product.OfferPrice * item.quantity;
        },0)
        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType:"COD",
        });
        return res.json({success:true,message:"Order Placed successfully"})
    }catch(error) {
        return res.json({success:false,message:error.message});
    }
}

export const getUserOrders = async (req,res) => {
    try {
        const { userId } = req.body;
        const orders = await Order.find({
            userId,
            $or:[{paymentType:"COD"},{isPaid:true}]
        }).populate("item.product address").sort({createdAt: -1});
        res.json({success:true,orders})
    }catch(error) {
        res.json({success: false, message:error.message }); 
    }
}


export const getAllOrders = async (req,res) => {
    try {
        const orders = await Order.find({
            $or:[{paymentType:"COD"},{isPaid:true}]
        }).populate("item.product address").sort({createdAt: -1});
        res.json({success:true,orders})
    }catch(error) {
        res.json({success: false, message:error.message }); 
    }
}