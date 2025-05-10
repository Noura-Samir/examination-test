const getLoginData =id => document.getElementById(id);
const setLoginError = (id, message) => getLoginData(id + 'Error').textContent = message;
const clearLoginErrors = () => {
    setLoginError('loginUsername', '');
    setLoginError('loginPassword', '');
    
  };
  document.getElementById('loginForm').addEventListener('submit', e => {
    e.preventDefault();
    clearLoginErrors();

    const loginUsername = getLoginData('name').value.trim();
    const loginPassword = getLoginData('password').value;

  let isValid = true;

  if (!loginUsername) {
    setLoginError('loginUsername', 'Username is required!');
    isValid = false;
  }

  if (!loginPassword) {
    setLoginError('loginPassword', 'Password is required!');
    isValid = false;
  }

  

  if (!isValid) return;

  const users = JSON.parse(localStorage.getItem('users')) || [];

  const userFound = users.find(
    user => user.userName === loginUsername && user.password === loginPassword
  )


  if (userFound) {
    clearLoginErrors();
    window.location.href = 'html/start.html'; 
  } else {
    const usernameExists = users.some(user => user.userName === loginUsername);
    const passwordMatches = users.some(user => user.password === loginPassword);
    
    let hasError=false;
    if (!usernameExists) {
      setLoginError('loginUsername', 'Username not found!');
      hasError=true;
    } 
    if (!passwordMatches) {
      setLoginError('loginPassword', 'Incorrect password!');
      hasError=true;
    } 
    if(!hasError) {
      setLoginError('loginUsername', 'Username or password or email is incorrect!');
    }
  }
});