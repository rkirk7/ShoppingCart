import './App.css';
import { Products } from './Components/Products';
import { useDataApi } from './Components/UseDataApi';
import React from 'react';
import {
  Accordion,
  Button,
  Container,
  Row,
  Col,
  Image,
} from 'react-bootstrap';

function App() {
  const [items, setItems] = React.useState(Products);
  const [cart, setCart] = React.useState([]);
 
  //  Fetch Data
  const { useState } = React;
  const [query, setQuery] = useState("http://localhost:1337/api/products");
  const [{ data }, doFetch] = useDataApi(
    "http://localhost:1337/api/products",
    {
      data: [],
    }
  );

  // Fetch Data
  const addToCart = (name) => {
    let item = items.filter((item) => item.name === name);
    if (item.length > 0) {
    if (item[0].instock === 0) return;
    item[0].instock -= 1;
    }
    setCart([...cart, ...item]);

  };
  const deleteCartItem = (index) => {
    let theItem = cart.filter((item, i) => index === i);
    theItem[0].instock += 1;
    let newCart = cart.filter((item, i) => index !== i);
    setCart(newCart);
  };

  let list = items.map((item, index) => {
    let n = index + 1049;
    let url = "https://picsum.photos/id/" + n + "/50/50";

    return (
      <li key={index}>
        <Image src={url} width={70} roundedCircle></Image>
        <Button variant="primary" size="large">
          {item.name}: ${item.cost}, stock: {item.instock}
        </Button>
        <button onClick={() => addToCart(item.name)}>Add to Cart</button>
      </li>
    );
  });

  cart.forEach((cartItem) => {
    let thisCartItem = cart.filter((theCart) => theCart.name === cartItem.name);
    let count = thisCartItem.length;
    let thisItem = items.filter((item) => item.name === cartItem.name); 
    if (thisItem.length > 0) {
    thisItem[0].cartstock = count
    };
  })
  let cartList = cart.map((item, index) => {
    return (
      <Accordion.Item key={1+index}>
      <Accordion.Header>
        {item.name}
      </Accordion.Header>
      <Accordion.Body onClick={() => deleteCartItem(index)}>
        $ {item.cost} from {item.country}
      </Accordion.Body>
    </Accordion.Item>
    );
  });

  let finalList = () => {
    let total = checkOut();
    let checkoutCart = [];
    cart.forEach((cartItem) => {
      let match = false;
      if (checkoutCart.length === 0) {
        checkoutCart.push(cartItem);
      } else {
      checkoutCart.forEach((checkoutItem) => {
        if (checkoutItem.name === cartItem.name) {
          match = true;
        }
      });
      if (!match) checkoutCart.push(cartItem);
    }
    });
    let final = checkoutCart.map((item, index) => {
      return (
        <div key={index} index={index}>
          {item.name}, in cart: {item.cartstock}
        </div>
      );
    });
    return { final, total };
  };

  const checkOut = () => {
    let costs = cart.map((item) => item.cost);
    const reducer = (accum, current) => accum + current;
    let newTotal = costs.reduce(reducer, 0);
    return newTotal;
  };

  const restockProducts = (url) => {
    doFetch(url);
    let newList = [];
    data.data.forEach((newItem) => {
      let match = false;
      let { attributes: {name, country, cost, instock} } = newItem;
      items.forEach((item) => {
        if (name === item.name) {
          item.instock += instock;
          match = true;
        } 
      });
      if (!match) {
        newList.push({ name, country, cost, instock });
      }
    });
    setItems([...items, ...newList]);
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Product List</h1>
          <ul style={{ listStyleType: "none" }}>{list}</ul>
        </Col>
        <Col>
          <h1>Cart Contents</h1>
          <Accordion defaultActiveKey="0">{cartList}</Accordion>
        </Col>
        <Col>
          <h1>CheckOut </h1>
          <Button onClick={checkOut}>CheckOut $ {finalList().total}</Button>
          <div> {finalList().total > 0 && finalList().final} </div>
        </Col>
      </Row>
      <Row>
        <form
          onSubmit={(event) => {
            restockProducts(`http://localhost:1337/api/products`);
            console.log(`Restock called on ${query}`);
            event.preventDefault();
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit">ReStock Products</button>
        </form>
      </Row>
    </Container>
  );
};

export default App;
