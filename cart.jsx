// simulate getting products from DataBase
const products = [
  { name: "Apples", country: "Italy", cost: 3, instock: 10, cartstock: 0 },
  { name: "Oranges", country: "Spain", cost: 4, instock: 3, cartstock: 0 },
  { name: "Beans", country: "USA", cost: 2, instock: 5, cartstock: 0 },
  { name: "Cabbage", country: "USA", cost: 1, instock: 8, cartstock: 0 },
];
//=========Cart=============
const Cart = (props) => {
  const { Card, Accordion, Button } = ReactBootstrap;
  let data = props.location.data ? props.location.data : products;

  return <Accordion defaultActiveKey="0">{list}</Accordion>;
};

const useDataApi = (initialUrl, initialData) => {
  const { useState, useEffect, useReducer } = React;
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });
  useEffect(() => {
    console.log("useEffect Called");
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });
      try {
        const result = await axios(url);
        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" });
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, []);

  return [state, setUrl];
};
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

const Products = (props) => {
  const [items, setItems] = React.useState(products);
  const [cart, setCart] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const {
    Card,
    Accordion,
    Button,
    Container,
    Row,
    Col,
    Image,
    Input,
  } = ReactBootstrap;
  //  Fetch Data
  const { Fragment, useState, useEffect, useReducer } = React;
  const [query, setQuery] = useState("http://localhost:1337/api/products");
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    "http://localhost:1337/api/products",
    {
      data: [],
    }
  );

  // Fetch Data
  const addToCart = (name) => {
    let item = items.filter((item) => item.name == name);
    if (item.length > 0) {
    if (item[0].instock === 0) return;
    item[0].instock -= 1;
    }
    setCart([...cart, ...item]);

  };
  const deleteCartItem = (index) => {
    let theItem = cart.filter((item, i) => index == i);
    theItem[0].instock += 1;
    let newCart = cart.filter((item, i) => index != i);
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
// ========================================
ReactDOM.render(<Products />, document.getElementById("root"));
