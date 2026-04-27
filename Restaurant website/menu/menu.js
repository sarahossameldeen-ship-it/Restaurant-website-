const dishItems = document.querySelectorAll('.items');

dishItems.forEach(item => {
  item.addEventListener('mouseenter', () => {
    item.style.backgroundColor = '#750b0b82';
    item.style.cursor = 'pointer';
  });

  item.addEventListener('mouseleave', () => {
    item.style.backgroundColor = 'transparent';
  });
});

const btnOrder = document.getElementById('btnOrder');

if (btnOrder) {
  btnOrder.addEventListener('click', function () {
    const params = new URLSearchParams();
    params.append('action', 'placeorder');
    params.append('order_type', document.getElementById('order_type').value);
    params.append('customer_name', document.getElementById('customer_name').value);
    params.append('del_address', document.getElementById('del_address').value);

    fetch('api.php', {
      method: 'POST',
      body: params
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        console.log(data);
      });
  });
}

window.addEventListener('load', () => {
  alert("Welcome to Sol y Sazon! Enjoy our delicious menu 🍲🍕");
});

