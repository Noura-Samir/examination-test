const getData = id => document.getElementById(id);
const setErrors = (id, message) => getData(id + 'Error').textContent = message;
const clearErrors = () =>
  ['userName', 'email', 'password', 'confirmPassword'].forEach(id => setErrors(id, ''));
const signUp=getData("signUp");

const addLiveValidation = () => {
userName.addEventListener('input', () => setErrors('userName', ''));
email.addEventListener('input', () => setErrors('email', ''));
password.addEventListener('input', () => setErrors('password', ''));
confirmPassword.addEventListener('input', () => setErrors('confirmPassword', ''));
};
  addLiveValidation();

  
const isValidEmail = email =>
  /^[A-Za-z0-9._%+-]+@(gmail|yahoo)\.com$/.test(email);

const isStrongPassword = pass =>
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(pass);

const isValidUserName = userName =>
  /^[A-Za-z\d_]{4,}$/.test(userName);

signUp.addEventListener('submit', e => {
  e.preventDefault();
  clearErrors();
  
const userName = getData('userName').value.trim();
const email = getData('email').value.trim();
const password = getData('password').value;
const confirmPassword = getData('confirmPassword').value;

  
  let isValid = true;

  if (!userName) {
    setErrors('userName', 'Username is required!');
    isValid = false;
  } else if (!isValidUserName(userName)) {
    setErrors('userName', 'Username must be at least 4 characters, letters/numbers/_ only.');
    isValid = false;
  }

  if (!email) {
    setErrors('email', 'Email is required!');
    isValid = false;
  } else if (!isValidEmail(email)) {
    setErrors('email', 'Must be a valid Gmail or Yahoo address.');
    isValid = false;
  }

  if (!password) {
    setErrors('password', 'Password is required!');
    isValid = false;
  } else if (!isStrongPassword(password)) {
    setErrors('password', 'Must be 8+ chars, include capital, number, symbol.');
    isValid = false;
  }

  if (!confirmPassword) {
    setErrors('confirmPassword', 'Confirm your password!');
    isValid = false;
  } else if (password !== confirmPassword) {
    setErrors('confirmPassword', 'Passwords do not match.');
    isValid = false;
  }
  

  if (isValid) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userNameExists = users.some(user => user.userName === userName );
    if (userNameExists) {
      setErrors('userName', 'Username already exists!');
      return;
    }
    const emailExists = users.some(user => user.email===email);

    if (emailExists) {
      setErrors('email', 'Email already exists!');
      return;
    }

  users.push({ userName, email, password });
  localStorage.setItem('users', JSON.stringify(users));
  signUp.reset();
      window.location.href = '../index.html';
  }
});