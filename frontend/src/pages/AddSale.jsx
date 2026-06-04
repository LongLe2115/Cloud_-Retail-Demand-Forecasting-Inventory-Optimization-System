import { useState } from "react";

function AddSale() {
  const [form, setForm] = useState({
    sales_date: "",
    store_id: "",
    product: "",
    sales: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8000/api/sales",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            sales_date: form.sales_date,
            store_id: Number(form.store_id),
            product: form.product,
            sales: Number(form.sales)
          })
        }
      );

      const data = await response.json();

  if (response.ok) {

    if (data.status === "duplicate") {

      setMessage(
        "⚠️ Record already exists"
      );

    } else {

      setMessage(
        `✅ ${data.message}`
      );

      setForm({
        sales_date: "",
        store_id: "",
        product: "",
        sales: ""
      });

    }

  } else {

    setMessage(
      `❌ ${data.detail}`
    );

  }

    } catch (err) {
      setMessage(
        "❌ Cannot connect to backend"
      );
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add New Sale</h2>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Date</label>
          <br />
          <input
            type="date"
            name="sales_date"
            value={form.sales_date}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Store ID</label>
          <br />
          <input
            type="number"
            name="store_id"
            value={form.store_id}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Product</label>
          <br />
          <input
            type="text"
            name="product"
            value={form.product}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Sales</label>
          <br />
          <input
            type="number"
            name="sales"
            value={form.sales}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <button type="submit">
          Add Sale
        </button>
      </form>

      <br />

      <p>{message}</p>
    </div>
  );
}

export default AddSale;