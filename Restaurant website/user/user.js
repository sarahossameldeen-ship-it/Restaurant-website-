let userData = {};

async function fetchUserData() {
  try {
    const formData = new FormData();
    formData.append('action', 'getuser');

    const res = await fetch('../api.php', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();

    if (data.status === 'success') {
      userData = {
        firstName: data.user.first_name,
        lastName: data.user.last_name,
        username: data.user.username,
        email: data.user.email,
        phone1: data.user.phone1,
        phone2: data.user.phone2 || '',
        address: data.user.address || ''
      };
      loadProfileData();
    } else {
      showMessage(data.message || 'Could not load profile.', 'error');
    }
  } catch (e) {
    showMessage('Server error. Please try again later.', 'error');
  }
}

const profileSection = document.getElementById('profileSection');
const profileEditForm = document.getElementById('profileEditForm');
const addressEditForm = document.getElementById('addressEditForm');
const profileDisplay = document.getElementById('profileDisplay');
const inputNewAddress = document.getElementById('inputNewAddress');


let messageBox = document.getElementById('messageBox');

if (!messageBox) {
    messageBox = document.createElement('div');
    messageBox.id = 'messageBox';
    messageBox.classList.add('hidden');
    document.body.appendChild(messageBox);
}



function loadProfileData() {
    const fullName = `${userData.firstName} ${userData.lastName}`;
    document.getElementById('userNameHeader').textContent = fullName;

    document.getElementById('displayFirstName').textContent = userData.firstName;
    document.getElementById('displayLastName').textContent = userData.lastName;
    document.getElementById('displayUsername').textContent = userData.username;
    document.getElementById('displayPassword').textContent = '••••••••••••';
    document.getElementById('displayEmail').textContent = userData.email;
    document.getElementById('displayPhone1').textContent = userData.phone1;
    document.getElementById('displayPhone2').textContent = userData.phone2;
    document.getElementById('displayAddress').textContent = userData.address;

    document.getElementById('inputFirstName').value = userData.firstName;
    document.getElementById('inputLastName').value = userData.lastName;
    document.getElementById('inputUsername').value = userData.username;
    document.getElementById('inputEmail').value = userData.email;
    document.getElementById('inputPhone1').value = userData.phone1;
    document.getElementById('inputPhone2').value = userData.phone2;
    document.getElementById('inputPassword').value = '';
    inputNewAddress.value = userData.address;
}


function toggleEditMode(isEditing) {
    toggleAddressEdit(false);

    if (isEditing) {
        profileDisplay.classList.add('hidden');
        profileEditForm.classList.remove('hidden');
        document.getElementById('editButton').classList.add('hidden');
    } else {
        profileDisplay.classList.remove('hidden');
        profileEditForm.classList.add('hidden');
        document.getElementById('editButton').classList.remove('hidden');
    }
}

function toggleAddressEdit(isEditing) {
    if (isEditing) {
        profileDisplay.classList.add('hidden');
        addressEditForm.classList.remove('hidden');
        profileEditForm.classList.add('hidden');
        document.getElementById('editButton').classList.add('hidden');
        inputNewAddress.value = userData.address;
        inputNewAddress.focus();
    } else {
        profileDisplay.classList.remove('hidden');
        addressEditForm.classList.add('hidden');
        profileEditForm.classList.add('hidden');
        document.getElementById('editButton').classList.remove('hidden');
    }
}

function showMessage(message, type = 'success') {
    messageBox.textContent = message;
    messageBox.classList.remove('hidden', 'msg-success', 'msg-error');
    messageBox.classList.add(type === 'success' ? 'msg-success' : 'msg-error');

    setTimeout(() => {
        messageBox.classList.add('hidden');
    }, 3000);
}


function handleSave(event) {
    event.preventDefault();

    const newFirstName = document.getElementById('inputFirstName').value.trim();
    const newLastName = document.getElementById('inputLastName').value.trim();
    const newUsername = document.getElementById('inputUsername').value.trim();
    const newPassword = document.getElementById('inputPassword').value;
    const newEmail = document.getElementById('inputEmail').value.trim();
    const newPhone1 = document.getElementById('inputPhone1').value.trim();
    const newPhone2 = document.getElementById('inputPhone2').value.trim();

    if (!newFirstName || !newLastName || !newUsername || !newEmail || !newPhone1) {
        showMessage("Please fill in all required fields.", 'error');
        return;
    }

    userData.firstName = newFirstName;
    userData.lastName = newLastName;
    userData.username = newUsername;
    userData.email = newEmail;
    userData.phone1 = newPhone1;
    userData.phone2 = newPhone2;

    if (newPassword) {
        userData.password = newPassword;
    }

    loadProfileData();
    toggleEditMode(false);
    showMessage("Profile updated successfully!");
}


async function handleAddressSave(event) {
    event.preventDefault();

    const updatedAddress = inputNewAddress.value.trim();

    if (!updatedAddress) {
        showMessage("Address cannot be empty.", 'error');
        return;
    }

    const formData = new FormData();
    formData.append('action',  'update_user');
    formData.append('firstname', userData.firstName);
    formData.append('lastname',  userData.lastName);
    formData.append('email',     userData.email);
    formData.append('phone1',    userData.phone1);
    formData.append('phone2',    userData.phone2);
    formData.append('address',   updatedAddress);
    formData.append('password',  '');

    try {
        const res  = await fetch('../api.php', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();

        if (data.status === 'success') {
            userData.address = updatedAddress;
            loadProfileData();
            toggleAddressEdit(false);
            showMessage("Address updated successfully!", 'success');
        } else {
            showMessage(data.message || 'Update failed.', 'error');
        }
    } catch (e) {
        showMessage('Server error. Please try again later.', 'error');
    }
}


function showSection() {
    profileSection.classList.remove('hidden');
}


document.addEventListener('DOMContentLoaded', () => {
  fetchUserData(); 
  showSection();
  profileEditForm.addEventListener('submit', handleSave);
  addressEditForm.addEventListener('submit', handleAddressSave);
});

$(function () {

    $('#profileSection').hide().fadeIn(700);

    $('#profileEditForm input, #addressEditForm input, #addressEditForm textarea')
        .on('focus', function () {
            $(this).css('outline', '2px solid #007BFF');
        })
        .on('blur', function () {
            $(this).css('outline', 'none');
        });
        
    $('#messageBox').on('DOMSubtreeModified', function () {
        if (!$(this).hasClass('hidden')) {
            $(this).stop(true, true).hide().fadeIn(300);
        }
    });

});