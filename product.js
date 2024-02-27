const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/shopApp')
    .then(() => {
        console.log('コネクションOK!');
    })
    .catch((err) => {
        console.log('コネクションエラー');
        console.log(err);
    })

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 10
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'priceは0より大きい値にしてください'] 
    },
    onSale: {
        type: Boolean,
        default: false
    },
    categories: [String],
    qty: {
        online: {
            type: Number,
            default: 0
        },
        inStore: {
            type: Number,
            default: 0
        }
    },
    size: {
        type: String,
        enum: ['S', 'M', 'L']
    }
})

productSchema.methods.greet = function() {
    console.log('ヤッホー');
    console.log(`-${this.name}からの呼び出し`);
}
productSchema.methods.addCategory = function (newCat) {
    this.categories.push(newCat);
    return this.save();
}

productSchema.methods.toggleOnSale = function () {
    this.onSale = !this.onSale;
    return this.save();
}

productSchema.statics.fireSale = function () {
    return this.updateMany({}, { onSale: true, price: 0 });
}

const Product = mongoose.model('Product', productSchema);

const findProduct = async () => {
    const foundProduct = await Product.findOne({ name: 'ヘルメット'});
    console.log(foundProduct);
    await foundProduct.toggleOnSale();
    console.log(foundProduct);
    await foundProduct.addCategory('アウトドア');
    console.log(foundProduct);
}

// findProduct();

Product.fireSale().then( msg => console.log(msg));

// const bike = new Product({
//     name: 'ジャージ',
//     price: 2980,
//     categories: ['サイクリング'],
//     size: 'XS'
// });

// bike.save()
//     .then(data => {
//         console.log('成功');
//         console.log(data);
//     })
//     .catch(err => {
//         console.log('エラー');
//         console.log(err);
//     })

Product.findOneAndUpdate({ name: '空気入れ' }, { price: 1980 }, { new: true ,runValidators: true})
    .then(data => {
        console.log('成功');
        console.log(data);
    })
    .catch(err => {
        console.log('エラー');
        console.log(err);
    })