const { CompanyCouponForSomeProducts } = require('../../../models/dbModels');


// his controller has no routes and it should be used only in TX
const DecreaseRemainingCompanyCouponForSomeProducts = async (args, _context) => {
    const { id } = args;

    try {

        const existingCompanyCouponForSomeProducts = await CompanyCouponForSomeProducts.findById(id).populate({ path: "productsIds", select: 'sellerId' });

        if (!existingCompanyCouponForSomeProducts) return {
            message: "CompanyCouponForSomeProducts doesn't exist",
            status: 400
        }

        let updatedOrDeleted = 'Deleted'

        if (existingCompanyCouponForSomeProducts.remainingCount === 1)
            await CompanyCouponForSomeProducts.findByIdAndDelete(id)

        else {
            existingCompanyCouponForSomeProducts.remainingCount = existingCompanyCouponForSomeProducts.remainingCount - 1
            existingCompanyCouponForSomeProducts.save()
            updatedOrDeleted = 'Updated'
        }

        return {
            message: `CompanyCouponForSomeProducts Has Been ${updatedOrDeleted} Successfully!`,
            status: 200
        }

    } catch (error) {
        return {
            message: error,
            status: 500
        }
    }
}



module.exports = {
    DecreaseRemainingCompanyCouponForSomeProducts
}