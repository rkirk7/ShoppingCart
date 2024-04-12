// Ex 3 - write out all items with their stock number
// provide a button and use onClick={moveToCart} to move 1 item into the Shopping Cart
// use React.useState to keep track of items in the Cart.
// use React.useState to keep track of Stock items
// list out the Cart items in another column
function NavBar({ stockitems }) {
  const [cart, setCart] = React.useState([]);
  const [stock, setStock] = React.useState(stockitems);
  const { Button } = ReactBootstrap;
  // event apple:2
  const moveToCart = e => {
    let [name, num] = e.target.innerHTML.split(":"); // innerHTML should be format name:3
    // use newStock = stock.map to find "name" and decrease number in stock by 1
    // only if instock is >=  do we move item to Cart and update stock
    let newStock = stock.map((item, index) => {
      if (item.name == name && item.instock > 0) { 
        item.instock--;
        item.incart++;

        let existingItem = cart.filter(cartitem => cartitem.name===item.name)
        if (existingItem.length > 0) {
          existingItem[0].incart++
        setCart([...cart]);
        } else {
          setCart([...cart, { name: item.name, incart: item.incart }]);
        }
      }
      return item;
    });
    setStock(newStock);

    }
  ;
  const updatedList = stock.map((item, index) => {
    return (
      <Button onClick={moveToCart} key={index}>
        {item.name}:{item.instock}
      </Button>
    );
  });

  const updatedShoppingCart = cart.map((item, index) => {
    return (
      <Button onClick={moveToCart} key={index}>
        {item.name}:{item.incart}
      </Button>
    );
  });
  // note that React needs to have a single Parent
  return (
    <>
      <ul style={{ listStyleType: "none" }}>{updatedList}</ul>
      <h1>Shopping Cart</h1>
      <ul style={{ listStyleType: "none" }}>{updatedShoppingCart}</ul>
    </>
  );
}

const menuItems = [
  { name: "apple", instock: 2, incart: 0 },
  { name: "pineapple", instock: 3, incart: 0 },
  { name: "pear", instock: 0, incart: 0 },
  { name: "peach", instock: 3, incart: 0 },
  { name: "orange", instock: 1, incart: 0 }
];
ReactDOM.render(
  <NavBar stockitems={menuItems} />,
  document.getElementById("root")
);
