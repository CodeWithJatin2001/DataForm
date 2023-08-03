function authenticateUser() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const apiUrl ="https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp";
    const loginData = {
        login_id: username,
        password: password
    };

    // Make the authentication API call
    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "mode":'cros'

        },
        body: JSON.stringify(loginData)
    })
    .then(response =>{
        console.log(response.json());
        response.json()})
    .then(data => {
        const token = data.token;
        localStorage.setItem("token", token);
        document.getElementById("loginForm").style.display = "none";
        document.getElementById("customerSection").style.display = "block";
        getCustomerList();
    })
    .catch(error => {
        alert("Authentication failed. Please check your username and password.");
    });
}

function getCustomerList() {
    const token = localStorage.getItem("token");

    // Make the get_customer_list API call
    fetch("https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=get_customer_list", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        displayCustomerList(data);
    })
    .catch(error => {
        alert("Failed to get customer list. Please try again later.");
    });
}

function displayCustomerList(customers) {
    const customerTableBody = document.getElementById("customerData");
    customerTableBody.innerHTML = ""; // Clear existing data

    customers.forEach(customer => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${customer.first_name}</td>
            <td>${customer.last_name}</td>
            <td>${customer.street}</td>
            <td>${customer.address}</td>
            <td>${customer.city}</td>
            <td>${customer.state}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td><button type="button" onclick="deleteCustomer('${customer.uuid}')">Delete</button></td>
            <td><button type="button" onclick="editCustomer('${customer.uuid}')">Edit</button></td>
        `;
        customerTableBody.appendChild(row);
    });
}

function createCustomer() {
    const token = localStorage.getItem("token");

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const street = document.getElementById("street").value;
    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const state = document.getElementById("state").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    const customerData = {
        first_name: firstName,
        last_name: lastName,
        street: street,
        address: address,
        city: city,
        state: state,
        email: email,
        phone: phone
    };

    // Make the create customer API call
    fetch("https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=create", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(customerData)
    })
    .then(response => {
        if (response.status === 201) {
            alert("Customer created successfully.");
            document.getElementById("createCustomerForm").reset();
            getCustomerList();
        } else if (response.status === 400) {
            alert("First Name or Last Name is missing.");
        } else {
            alert("Failed to create customer. Please try again later.");
        }
    })
    .catch(error => {
        alert("Failed to create customer. Please try again later.");
    });
}

function deleteCustomer(uuid) {
    const token = localStorage.getItem("token");

    // Make the delete customer API call
    fetch(`https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=delete&uuid=${uuid}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.status === 200) {
            alert("Customer deleted successfully.");
            getCustomerList();
        } else if (response.status === 500) {
            alert("Error: Customer not deleted.");
        } else if (response.status === 400) {
            alert("UUID not found.");
        } else {
            alert("Failed to delete customer. Please try again later.");
        }
    })
    .catch(error => {
        alert("Failed to delete customer. Please try again later.");
    });
}

// You can implement the editCustomer() function similarly to update a customer.
// I am leaving this part as an exercise for you.
// ... (previous code)

function editCustomer(uuid) {
    const token = localStorage.getItem("token");

    // Get customer data from the form
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const street = document.getElementById("street").value;
    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const state = document.getElementById("state").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    const customerData = {
        first_name: firstName,
        last_name: lastName,
        street: street,
        address: address,
        city: city,
        state: state,
        email: email,
        phone: phone
    };

    // Make the update customer API call
    fetch(`https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=update&uuid=${uuid}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(customerData)
    })
    .then(response => {
        if (response.status === 200) {
            alert("Customer updated successfully.");
            document.getElementById("createCustomerForm").reset();
            getCustomerList();
        } else if (response.status === 500) {
            alert("Error: Customer not updated.");
        } else if (response.status === 400) {
            alert("UUID not found.");
        } else {
            alert("Failed to update customer. Please try again later.");
        }
    })
    .catch(error => {
        alert("Failed to update customer. Please try again later.");
    });
}

// ... (remaining code)
 