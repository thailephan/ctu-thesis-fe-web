import React, {useContext, useReducer} from "react";

// function reducer(state: any, action: any) {
//   switch (action.type) {
//     case 'increment':
//       return {count: state.count + 1};
//     case 'decrement':
//       return {count: state.count - 1};
//     default:
//       throw new Error();
//   }
// }

function reducerCart(state: any, action: any) {
    switch (action.type) {
        case 'add-to-cart':
            return {items: [...state.items, action.newItem], total: state.total + 1};
        case 'remove-to-cart': {
            if (state.items.length <= 0) {
                return {items: [], total: 0};
            }
            return {items: state.items.filter((i: any) => i.id !== action.id), total: state.total - 1};
        }
        default:
            throw new Error();
    }
}

const templateItem = {
    id: 1,
    name: "Socks",
    inCartAt: "0",
    attribute: [{
        id: 1,
        code: "001001",
        name: "Length",
        value: "Long",
    }, {
        id: 2,
        code: "001002",
        name: "Material",
        value: "Nylon",
    },],
};

const init = {
    items: [{
        id: 1,
        name: "Socks",
        inCartAt: "0",
        attribute: [{
            id: 1,
            code: "001001",
            name: "Length",
            value: "Long",
        },{
            id: 2,
            code: "001002",
            name: "Material",
            value: "Nylon",
        },],
    }],
    total: 1,
};

function Cart(props) {
    const [state, dispatch] = useReducer(reducerCart, init);

    const _addToCart = () => {
        const newItem = {
            id: 1,
            name: "Socks",
            inCartAt: "0",
            attribute: [{
                id: 1,
                code: "001001",
                name: "Length",
                value: "Long",
            }, {
                id: 2,
                code: "001002",
                name: "Material",
                value: "Nylon",
            },],
        };
    }

    return (
        <div>
            {state.total}
            <div>
                {state.items.map((i: any) => (<div key={i.id}>
                    {i.name} {i.id}
                </div>))}
            </div>
            <button onClick={() => dispatch({type: "add-to-cart", newItem: {...templateItem, id: state.total + 1}})}>Increase</button>
            <button onClick={() => dispatch({type: "decrement"})}>Decrease</button>
            <button onClick={_addToCart}>Add product to cart</button>
        </div>
    );
}

export default Cart;