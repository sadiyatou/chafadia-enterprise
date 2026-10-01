function Receipt({ order }) {
  return (
    <div className="card">
      <h2 className="logo-text">CHAFADIA ENTERPRISE</h2>
      <p>Official Receipt</p>

      <hr style={{ margin: "15px 0" }} />

      <p>
        <strong>Receipt No:</strong> {order.receiptNo}
      </p>
      <p>
        <strong>Customer:</strong> {order.customer?.name}
      </p>
      <p>
        <strong>Date:</strong> {order.date}
      </p>

      <h3 style={{ marginTop: "15px" }}>Items</h3>

      {order.items.map((item, index) => (
        <p key={index}>
          {item.name} - {item.price} FCFA
        </p>
      ))}

      <h2 style={{ marginTop: "15px" }}>Total: {order.total} FCFA</h2>
      <p>
        <strong>Payment:</strong> {order.paymentStatus}
      </p>
    </div>
  );
}

export default Receipt;