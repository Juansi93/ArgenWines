const pool = require('../db');

const getProducts = async () => {
    try {
        const query = "select * from products where type = 'red'";
        const rows = await pool.query(query);
        return rows;

    } catch (error) {
        console.log(error)
    }
};

const getWhiteWine = async () => {
  try {
      const query = "select * from products where type = 'white'";
      const rows = await pool.query(query);
      return rows;

  } catch (error) {
      console.log(error)
  }
};

const getRoseWine = async () => {
  try {
      const query = "select * from products where type = 'rose'";
      const rows = await pool.query(query);
      return rows;

  } catch (error) {
      console.log(error)
  }
};

const addProduct = async (data) => {
    try {
        const query = 'insert into products set ?';
        const row = await pool.query(query, [data]);
        return row;
        
    } catch (error) {
        console.log(error);
    }
}

const deleteProduct = async (id) => {
    const query = "delete from products where id = ?";
    const row = await pool.query(query, [id]);
    return row;
  };

const getProduct = async (id) => {
    try {
      const query = "select * from products where id =?";
      const row = await pool.query(query, [id]);
      return row;
    } catch (error) {
      console.log(error);
    }
};

async function modifyProduct(data, id) {
    try {
      const query = "update products set ? where id = ?";
      const row = await pool.query(query, [data, id])
      return row;
    } catch (error) {
      console.log(error)
    }
  }

module.exports = { getProducts, addProduct, getProduct, deleteProduct, modifyProduct, getWhiteWine, getRoseWine }