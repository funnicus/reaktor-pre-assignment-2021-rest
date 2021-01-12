import React from 'react'

import './Product.css'

const Product = ({ product }) => {

    return (
        <div key={product.id} className="Product">
            <h2>{product.name}</h2>
            <h3>By {product.manufacturer}</h3>
            <br />
            <p>Colors:</p>
            <ul>
                {product.color.map(c => <li key={c}>{c}</li>)}
            </ul>
            <p>Availability: {product.awailability}</p>
        </div>
    )
}

export default Product