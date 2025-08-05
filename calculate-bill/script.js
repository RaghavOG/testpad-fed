// Data (could be fetched from API or JSON file)
const items = [
  {
    id: "item1",
    itemName: "Butter Roti",
    rate: 20,
    taxes: [{ name: "Service Charge", rate: 10, isInPercent: "Y" }],
    category: { categoryId: "C2" }
  },
  {
    id: "item2",
    itemName: "Paneer Butter Masala",
    rate: 150,
    taxes: [
      { name: "GST", rate: 5, isInPercent: "Y" },
      { name: "Service Charge", rate: 10, isInPercent: "Y" }
    ],
    category: { categoryId: "C1" }
  }
];

const categories = [
  {
    id: "C1",
    categoryName: "Platters",
    superCategory: { superCategoryName: "South Indian", id: "SC1" }
  },
  {
    id: "C2",
    categoryName: "Breads",
    superCategory: { superCategoryName: "North Indian", id: "SC2" }
  }
];

const bill = {
  id: "B1",
  billNumber: 1,
  opentime: "06 Nov 2020 14:19",
  customerName: "CodeQuotient",
  billItems: [
    { id: "item2", quantity: 3, discount: { rate: 10, isInPercent: "Y" } },
    { id: "item1", quantity: 4, discount: { rate: 5, isInPercent: "Y" } }
  ]
};

// Task 1 – basic JSON
function getBillWithItemNames(bill, items) {
  return {
    id: bill.id,
    billNumber: bill.billNumber,
    opentime: bill.opentime,
    customerName: bill.customerName,
    billItems: bill.billItems.map(bi => {
      const item = items.find(i => i.id === bi.id);
      return { id: bi.id, name: item.itemName, quantity: bi.quantity };
    })
  };
}

// Task 2 – detailed computation
function getFinalBillWithAmount(bill, items, categories) {
  const billItems = bill.billItems.map(bi => {
    const item = items.find(i => i.id === bi.id);
    const category = categories.find(c => c.id === item.category.categoryId);
    const base = item.rate * bi.quantity;

    const discountValue = bi.discount.isInPercent === "Y"
      ? (base * bi.discount.rate) / 100
      : bi.discount.rate;

    const discounted = base - discountValue;

    const taxValue = item.taxes.reduce((sum, t) => {
      const tv = t.isInPercent === "Y"
        ? (discounted * t.rate) / 100
        : t.rate;
      return sum + tv;
    }, 0);

    const amount = parseFloat((discounted + taxValue).toFixed(2));

    return {
      id: bi.id,
      name: item.itemName,
      quantity: bi.quantity,
      discount: bi.discount,
      taxes: item.taxes,
      amount,
      categoryName: category.categoryName,
      superCategoryName: category.superCategory.superCategoryName
    };
  });

  const total = parseFloat(
    billItems.reduce((s, bi) => s + bi.amount, 0).toFixed(2)
  );

  return {
    id: bill.id,
    billNumber: bill.billNumber,
    opentime: bill.opentime,
    customerName: bill.customerName,
    billItems,
    "Total Amount": total
  };
}

// UI Rendering
function renderTask1(data) {
  return `
    <p><strong>Customer:</strong> ${data.customerName}</p>
    <p><strong>Bill #${data.billNumber}</strong> | ${data.opentime}</p>
    <table>
      <thead><tr><th>Item</th><th>Qty</th></tr></thead>
      <tbody>
        ${data.billItems.map(i => `<tr><td>${i.name}</td><td>${i.quantity}</td></tr>`).join('')}
      </tbody>
    </table>
  `;
}

function renderTask2(data) {
  return `
    <p><strong>Customer:</strong> ${data.customerName}</p>
    <p><strong>Bill #${data.billNumber}</strong> | ${data.opentime}</p>
    <table>
      <thead><tr>
        <th>Item</th><th>Qty</th><th>Discount</th>
        <th>Taxes</th><th>Category</th><th>Super Category</th><th>Amount (₹)</th>
      </tr></thead>
      <tbody>
        ${data.billItems.map(i => `
          <tr>
            <td>${i.name}</td>
            <td>${i.quantity}</td>
            <td>${i.discount.rate}${i.discount.isInPercent === "Y" ? "%" : ""}</td>
            <td>${i.taxes.map(t => `${t.name}: ${t.rate}${t.isInPercent === "Y" ? "%" : ""}`).join('<br>')}</td>
            <td><span class="category-label">${i.categoryName}</span></td>
            <td><span class="super-label">${i.superCategoryName}</span></td>
            <td>₹${i.amount}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <p class="total">Total Amount: ₹${data["Total Amount"]}</p>
  `;
}

function renderBill() {
  const sel = document.getElementById("taskSelect").value;
  const output = document.getElementById("billOutput");
  if (sel === "1") {
    const d = getBillWithItemNames(bill, items);
    output.innerHTML = renderTask1(d);
  } else {
    const d = getFinalBillWithAmount(bill, items, categories);
    output.innerHTML = renderTask2(d);
  }
}

document.getElementById("generateBtn").addEventListener("click", renderBill);
